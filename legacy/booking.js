export const normalize = value => value.trim().replace(/\s+/g, ' ');
const same = (a,b) => normalize(a).toLowerCase() === normalize(b).toLowerCase();
const id = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
const event = (action,detail,actor) => ({id:id(),at:new Date().toISOString(),action,detail,actor});
const active = (data,rid) => data.bookings.find(b=>b.resourceId===rid && b.status==='active');
export function reserve(data, resource, person) {
 const borrower=normalize(person);
 if(!borrower) throw new Error('Enter your name at the top before booking.');
 if(!data.resources.some(r=>r.id===resource.id)) throw new Error('Resource no longer exists.');
 if(active(data,resource.id)) throw new Error('This resource is occupied. Join its waiting list.');
 if((data.waitlists[resource.id]||[]).length) throw new Error('A waiting list exists. Release the current booking to allocate fairly.');
 const booking={id:id(),resourceId:resource.id,resourceName:resource.name,borrower,status:'active',createdAt:new Date().toISOString(),source:'direct'};
 return {...data,bookings:[...data.bookings,booking],audit:[event('BOOKED',`${borrower} booked ${resource.name}`,borrower),...data.audit]};
}
export function enqueue(data,resource,person) {
 const name=normalize(person), current=active(data,resource.id), list=data.waitlists[resource.id]||[];
 if(!name) throw new Error('Enter your name at the top first.');
 if(!current) throw new Error('This resource is available. Book it directly.');
 if(same(current.borrower,name)) throw new Error('You already have this resource booked.');
 if(list.some(e=>same(e.name,name))) throw new Error('You are already on this waiting list.');
 return {...data,waitlists:{...data.waitlists,[resource.id]:[...list,{id:id(),name,joinedAt:new Date().toISOString()}]},audit:[event('QUEUED',`${name} joined ${resource.name} waiting list`,name),...data.audit]};
}
export function finish(data,resource,cancel=false) {
 const current=active(data,resource.id); if(!current) throw new Error('This booking is no longer active.');
 const list=data.waitlists[resource.id]||[], next=list[0], now=new Date().toISOString();
 return {...data,bookings:[...data.bookings.map(b=>b.id===current.id?{...b,status:cancel?'cancelled':'completed',releasedAt:now}:b),...(next?[{id:id(),resourceId:resource.id,resourceName:resource.name,borrower:next.name,status:'active',createdAt:now,source:'waitlist'}]:[])],waitlists:{...data.waitlists,[resource.id]:list.slice(next?1:0)},audit:[...(next?[event('AUTO_ALLOCATED',`${resource.name} allocated to ${next.name} (FIFO queue)`,'System')]:[]),event(cancel?'CANCELLED':'RELEASED',`${resource.name} ${cancel?'cancelled':'released'} by ${current.borrower}`,current.borrower),...data.audit]};
}
export function leaveQueue(data,resource,person) {
 const list=data.waitlists[resource.id]||[];
 if(!list.some(e=>same(e.name,person))) throw new Error('Your name is not on this waiting list.');
 return {...data,waitlists:{...data.waitlists,[resource.id]:list.filter(e=>!same(e.name,person))},audit:[event('LEFT_QUEUE',`${normalize(person)} left ${resource.name} waiting list`,normalize(person)),...data.audit]};
}
export function jain(values){if(!values.length)return 1;const sum=values.reduce((a,b)=>a+b,0),sq=values.reduce((a,b)=>a+b*b,0);return sq?sum*sum/(values.length*sq):1}
