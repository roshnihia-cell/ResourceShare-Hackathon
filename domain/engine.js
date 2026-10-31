// Pure domain transitions. Every mutation is authorized again on the server.
export const uuid=()=>crypto.randomUUID();
export const roles=['student','owner','admin'];
export const demoPeople=[
 {id:'student-1',name:'Asha Raman',email:'asha@example.edu',role:'student',verified:true,training:['lab-safety'],institution:'Campus One'},
 {id:'student-2',name:'Kavin Kumar',email:'kavin@example.edu',role:'student',verified:true,training:['lab-safety'],institution:'Campus One'},
 {id:'student-3',name:'Maya Devi',email:'maya@example.edu',role:'student',verified:true,training:[],institution:'Campus One'},
 {id:'owner-1',name:'Dr. Meera',email:'owner@example.edu',role:'owner',verified:true,training:[],institution:'Campus One'},
 {id:'admin-1',name:'Campus Admin',email:'admin@example.edu',role:'admin',verified:true,training:[],institution:'Campus One'},
];
export function seed(demo=false){return {version:2,demo,resources:[
 {id:'r-lab',name:'Physics Laboratory',category:'Laboratory',location:'Science Block · Floor 2',description:'A shared space for optics, electronics and the next big discovery.',training:'lab-safety',deposit:500,x:28,y:28,safety:'Wear closed shoes. Switch off supplies before changing circuits. A supervisor must be present.'},
 {id:'r-projector',name:'HD Projector',category:'Equipment',location:'Media Room · Main Block',description:'Bring your ideas into focus. Full HD projection for presentations.',training:'',deposit:300,x:62,y:42,safety:'Allow the lamp to cool before packing. Use the supplied power adapter.'},
 {id:'r-hall',name:'Seminar Hall',category:'Space',location:'Main Building · Floor 1',description:'Space for collaboration, workshops and conversations that matter.',training:'',deposit:0,x:50,y:62,safety:'Keep fire exits clear. Maximum 40 participants. Leave furniture as found.'},
 {id:'r-micro',name:'Research Microscope',category:'Equipment',location:'Biology Laboratory',description:'Precision optics for a closer look at your research.',training:'lab-safety',deposit:1000,x:22,y:70,safety:'Carry with two hands. Clean lenses with lens tissue only.'},
 {id:'r-camera',name:'Mirrorless Camera Kit',category:'Equipment',location:'Creative Studio',description:'A camera, two lenses and a world of stories waiting to be told.',training:'',deposit:1500,x:78,y:25,safety:'Use the neck strap. Check the lens cap, battery and memory card on return.'},
 {id:'r-computer',name:'Computing Workstation',category:'Computer',location:'Innovation Hub',description:'A focused workstation for coding, modelling and data analysis.',training:'',deposit:0,x:76,y:73,safety:'Save your files externally. Sign out of personal accounts before leaving.'},
 ].map(r=>({...r,ownerId:'owner-1',institution:'Campus One',maintenance:false})),bookings:[],audit:[],incidents:[],certificates:[],feedback:[],notifications:[],profiles:demo?structuredClone(demoPeople):[],policy:{maxActive:3,maxHours:4,noShowMinutes:15,agreement:'I will follow the safety instructions, care for shared equipment, report damage and return it on time.'}}}
const requireThat=(condition,message)=>{if(!condition)throw new Error(message)};
const txt=(s,max=500)=>String(s??'').trim().slice(0,max);
const live=b=>['requested','approved','checked_in','return_pending','waiting'].includes(b.status);
export const overlaps=(a,b)=>new Date(a.start)<new Date(b.end)&&new Date(b.start)<new Date(a.end);
export const allocated=b=>['approved','checked_in','return_pending'].includes(b.status);
export const jain=v=>{const s=v.reduce((a,b)=>a+b,0),q=v.reduce((a,b)=>a+b*b,0);return q?s*s/(v.length*q):1};
export function eligibility(s,r,u){return !u.verified?'Institutional verification is required':r.maintenance?'Resource is under maintenance':r.training&&!u.training?.includes(r.training)?`Verified ${r.training} training is required`:null}
export async function hash(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function verifyAudit(events){let prev='GENESIS';for(const e of events){const {hash:stored,...rest}=e;if(rest.previousHash!==prev||await hash(JSON.stringify(rest))!==stored)return false;prev=stored}return true}
export async function transition(input,u,action,p={},now=new Date().toISOString()){
 const s=structuredClone(input);const at=new Date(now).getTime();
 requireThat(u&&roles.includes(u.role),'Sign in to continue');
 const resource=id=>{const r=s.resources.find(r=>r.id===id);requireThat(r,'Resource not found');return r};
 const booking=id=>{const b=s.bookings.find(b=>b.id===id);requireThat(b,'Booking not found');return b};
 const owns=r=>u.role==='admin'||u.role==='owner'&&r.ownerId===u.id;
 const manage=b=>requireThat(owns(resource(b.resourceId)),'Only the resource owner or administrator may do this');
 const borrower=b=>requireThat(b.userId===u.id,'Only the borrower may do this');
 const notify=(userId,message)=>s.notifications.push({id:uuid(),userId,message,at:now});
 let detail='',reference='';
 function promote(rid){
  const candidates=s.bookings.filter(b=>b.resourceId===rid&&b.status==='waiting').sort((a,b)=>a.sequence-b.sequence);
  for(const b of candidates){const person=s.profiles.find(x=>x.id===b.userId);if(new Date(b.end).getTime()<=at){b.status='expired';continue}
   if(person&&!eligibility(s,resource(rid),person)&&!s.bookings.some(a=>a.id!==b.id&&a.resourceId===rid&&['requested',...['approved','checked_in','return_pending']].includes(a.status)&&overlaps(a,b))){b.status='requested';notify(b.userId,'Your FIFO request is ready for owner review.');notify(resource(rid).ownerId,'A waiting request is ready for approval.');}
  }
 }
 if(action==='profile'){
  const profile={...u,name:txt(p.name,80)||u.name,institution:txt(p.institution,100)||u.institution};
  s.profiles=s.profiles.filter(x=>x.id!==u.id).concat(profile);detail='Profile updated';
 }else if(action==='resource'){
  requireThat(['owner','admin'].includes(u.role),'Owner or administrator role required');
  requireThat(txt(p.name)&&txt(p.location),'Name and location are required');
  requireThat(['Equipment','Laboratory','Space','Computer','Other'].includes(p.category),'Invalid category');
  const deposit=Number(p.deposit||0);requireThat(Number.isFinite(deposit)&&deposit>=0&&deposit<=100000,'Invalid deposit');
  const r={id:uuid(),name:txt(p.name,100),description:txt(p.description),category:p.category,location:txt(p.location,100),ownerId:u.id,institution:u.institution,training:txt(p.training,80),deposit,safety:txt(p.safety,2000)||'Ask the owner for safety instructions before use.',maintenance:false,x:50,y:50};
  s.resources.push(r);detail=`Listed ${r.name}`;reference=r.id;
 }else if(action==='maintenance'){
  const r=resource(p.id);requireThat(owns(r),'Owner permission required');requireThat(!s.bookings.some(b=>b.resourceId===r.id&&allocated(b)),'Resolve active allocations before maintenance');r.maintenance=!r.maintenance;detail=`${r.name}: maintenance ${r.maintenance?'started':'completed'}`;if(!r.maintenance)promote(r.id);
 }else if(action==='request'){
  requireThat(u.role==='student','Use a student account to request a resource');const r=resource(p.resourceId);
  const issue=eligibility(s,r,u);requireThat(!issue,issue);
  const start=new Date(p.start),end=new Date(p.end);requireThat(Number.isFinite(+start)&&Number.isFinite(+end),'Choose valid dates and times');
  requireThat(+start>=at-60000&&+end>+start,'Booking must start now or in the future and end after it starts');
  requireThat((+end-+start)/3600000<=s.policy.maxHours,`Maximum ${s.policy.maxHours} hours per booking`);
  requireThat(s.bookings.filter(b=>b.userId===u.id&&live(b)).length<s.policy.maxActive,`Maximum ${s.policy.maxActive} open requests per person`);
  requireThat(!s.bookings.some(b=>b.userId===u.id&&b.resourceId===r.id&&live(b)&&overlaps(b,p)),'You already requested this time');
  requireThat(p.agreed===true,'Accept the borrowing agreement');
  const conflict=s.bookings.some(b=>b.resourceId===r.id&&live(b)&&overlaps(b,p));
  const b={id:uuid(),resourceId:r.id,resourceName:r.name,userId:u.id,borrower:u.name,start:start.toISOString(),end:end.toISOString(),status:conflict?'waiting':'requested',sequence:s.bookings.length+1,purpose:txt(p.purpose,500),team:txt(p.team,200),createdAt:now,agreement:s.policy.agreement,agreementAt:now,deposit:r.deposit,depositStatus:r.deposit?'not collected':'not required',pass:uuid()};
  requireThat(b.purpose.length>=4,'Describe your project or purpose');s.bookings.push(b);notify(u.id,conflict?'You joined the FIFO waiting list.':'Your booking request was sent to the owner.');notify(r.ownerId,`${u.name} requested ${r.name}`);detail=`${b.status}: ${r.name}`;reference=b.id;
 }else if(['approve','reject','cancel','checkin','checkout','confirm_return','extension','approve_extension','deposit'].includes(action)){
  const b=booking(p.id),r=resource(b.resourceId);reference=b.id;
  if(action==='approve'){
   manage(b);requireThat(b.status==='requested','Only pending requests can be approved');requireThat(+new Date(b.end)>at,'This booking has expired');
   const person=s.profiles.find(x=>x.id===b.userId);requireThat(person,'Borrower profile not found');const issue=eligibility(s,r,person);requireThat(!issue,issue);
   requireThat(!s.bookings.some(a=>a.id!==b.id&&a.resourceId===r.id&&allocated(a)&&overlaps(a,b)),'Scheduling conflict: resource already allocated');
   requireThat(!s.bookings.some(a=>a.id!==b.id&&a.resourceId===r.id&&['waiting','requested'].includes(a.status)&&a.sequence<b.sequence&&overlaps(a,b)),'An earlier FIFO request must be resolved first');b.status='approved';b.approvedAt=now;notify(b.userId,'Booking approved. Your access pass is ready.');
  }else if(action==='reject'){
   manage(b);requireThat(['requested','waiting'].includes(b.status),'Cannot reject this booking');requireThat(txt(p.reason).length>=4,'Give a rejection reason');b.status='rejected';b.reason=txt(p.reason);notify(b.userId,`Booking rejected: ${b.reason}`);promote(r.id);
  }else if(action==='cancel'){
   requireThat(b.userId===u.id||owns(r),'You cannot cancel another borrower’s booking');requireThat(['requested','approved','waiting'].includes(b.status),'Checked-in items must be returned');b.status='cancelled';b.closedAt=now;promote(r.id);notify(b.userId,'Booking cancelled.');
  }else if(action==='checkin'){
   borrower(b);requireThat(b.status==='approved','An approved booking is required');requireThat(at>=+new Date(b.start)&&at<=+new Date(b.end),'Access pass is outside its valid time');requireThat(p.pass===b.pass,'Invalid access pass');requireThat(txt(p.condition).length>=4,'Record the before-use condition');requireThat(!r.maintenance,'Resource is under maintenance');b.beforeCondition=txt(p.condition,2000);b.checkedInAt=now;b.status='checked_in';b.borrowerHandoverAt=now;notify(r.ownerId,'Borrower checked in; verify the handover when confirming return.');
  }else if(action==='checkout'){
   borrower(b);requireThat(b.status==='checked_in','Check in before returning');requireThat(txt(p.condition).length>=4,'Record the after-use condition');b.afterCondition=txt(p.condition,2000);b.checkedOutAt=now;b.status='return_pending';notify(r.ownerId,'Return ready for condition verification.');
  }else if(action==='confirm_return'){
   manage(b);requireThat(b.status==='return_pending','Borrower must check out first');requireThat(txt(p.condition).length>=4,'Record your return verification');b.ownerCondition=txt(p.condition,2000);b.returnedAt=now;b.status='completed';notify(b.userId,'Return verified. Thank you for sharing responsibly.');promote(r.id);
  }else if(action==='extension'){
   borrower(b);requireThat(['approved','checked_in'].includes(b.status),'Only allocated bookings may be extended');const end=+new Date(p.end);requireThat(Number.isFinite(end)&&end>+new Date(b.end)&&(end-+new Date(b.start))/3600000<=s.policy.maxHours,'Extension must fit the maximum booking duration');b.extension=new Date(end).toISOString();notify(r.ownerId,'Extension request awaiting review.');
  }else if(action==='approve_extension'){
   manage(b);requireThat(b.extension&&['approved','checked_in'].includes(b.status),'No extension to approve');const proposed={...b,end:b.extension};requireThat(!s.bookings.some(a=>a.id!==b.id&&a.resourceId===r.id&&live(a)&&overlaps(a,proposed)),'Extension conflicts with another request');b.end=b.extension;delete b.extension;notify(b.userId,'Extension approved.');
  }else if(action==='deposit'){
   manage(b);requireThat(b.deposit>0,'No deposit is required');requireThat(['collected','refunded'].includes(p.status),'Invalid deposit status');requireThat(p.status!=='refunded'||b.status==='completed'&&b.depositStatus==='collected','Verify return and collection before refund');b.depositStatus=p.status;
  }
  detail=`${action}: ${r.name}`;
 }else if(action==='incident'){
  const b=booking(p.id);requireThat(b.userId===u.id||owns(resource(b.resourceId)),'Booking access required');requireThat(txt(p.description).length>=8,'Describe the incident');
  const i={id:uuid(),bookingId:b.id,resourceId:b.resourceId,userId:u.id,description:txt(p.description,3000),severity:['low','medium','urgent'].includes(p.severity)?p.severity:'medium',status:'open',createdAt:now};s.incidents.push(i);notify(resource(b.resourceId).ownerId,`${i.severity} incident reported.`);for(const a of s.profiles.filter(x=>x.role==='admin'))notify(a.id,`Incident requires review: ${b.resourceName}`);detail='Incident reported and routed for in-app review';reference=i.id;
 }else if(action==='resolve'){
  requireThat(u.role==='admin','Administrator role required');const i=s.incidents.find(i=>i.id===p.id);requireThat(i,'Incident not found');requireThat(txt(p.reason).length>=4,'A resolution note is required');i.status='resolved';i.resolution=txt(p.reason,2000);i.resolvedBy=u.id;notify(i.userId,'Your incident has been reviewed.');detail='Incident resolved';reference=i.id;
 }else if(action==='certificate'){
  requireThat(u.role==='student','Student role required');requireThat(txt(p.name).length>=3&&txt(p.reference).length>=5,'Provide the training name and evidence reference');s.certificates.push({id:uuid(),userId:u.id,name:txt(p.name,80),reference:txt(p.reference,300),status:'pending',at:now});detail='Training evidence submitted for human review';
 }else if(action==='verify_certificate'){
  requireThat(u.role==='admin','Administrator role required');const c=s.certificates.find(c=>c.id===p.id);requireThat(c&&c.status==='pending','Pending certificate not found');c.status=p.approved?'verified':'rejected';c.reviewedBy=u.id;requireThat(txt(p.reason).length>=4,'A verification note is required');c.reviewNote=txt(p.reason);if(p.approved){const person=s.profiles.find(x=>x.id===c.userId);requireThat(person,'Profile not found');person.training=[...new Set([...person.training,c.name])]}notify(c.userId,`Training evidence ${c.status}`);detail=`Training evidence ${c.status}`;
 }else if(action==='set_role'){
  requireThat(u.role==='admin','Administrator role required');const person=s.profiles.find(x=>x.id===p.id);requireThat(person&&person.role!=='admin','Non-admin profile required');requireThat(['student','owner'].includes(p.role),'Only student and owner roles may be assigned');person.role=p.role;detail='Campus role updated by administrator';reference=person.id;
 }else if(action==='verify_profile'){
  requireThat(u.role==='admin','Administrator role required');const person=s.profiles.find(x=>x.id===p.id);requireThat(person&&person.role==='student','Student profile not found');person.verified=p.verified===true;detail='Institutional identity reviewed';reference=person.id;
 }else if(action==='feedback'){
  const b=booking(p.id);borrower(b);requireThat(b.status==='completed','Complete your return before rating');requireThat(!s.feedback.some(f=>f.bookingId===b.id),'Already rated');const rating=Number(p.rating);requireThat(Number.isInteger(rating)&&rating>=1&&rating<=5,'Rating must be 1 to 5');s.feedback.push({id:uuid(),bookingId:b.id,resourceId:b.resourceId,rating,comment:txt(p.comment),at:now});detail='Resource feedback submitted';
 }else if(action==='policy'){
  requireThat(u.role==='admin','Administrator role required');for(const [k,min,max] of [['maxActive',1,10],['maxHours',1,24],['noShowMinutes',5,120]]){const n=Number(p[k]);requireThat(Number.isInteger(n)&&n>=min&&n<=max,`Invalid ${k}`);s.policy[k]=n}requireThat(txt(p.agreement).length>=20,'Provide the borrowing agreement');s.policy.agreement=txt(p.agreement,2000);detail='Institutional borrowing policy updated';
 }else if(action==='sweep'){
  requireThat(['admin','owner'].includes(u.role),'Owner or administrator required');let n=0;
  for(const b of s.bookings){if(!owns(resource(b.resourceId)))continue;if(b.status==='approved'&&at>+new Date(b.start)+s.policy.noShowMinutes*60000){b.status='no_show';notify(b.userId,'Booking released after the no-show grace period.');n++;promote(b.resourceId)}else if(b.status==='checked_in'&&at>+new Date(b.end)&&!b.overdueNotified){b.overdueNotified=true;notify(b.userId,'Your resource is overdue. Please return it and contact the owner.');n++}}
  detail=`Operational sweep processed ${n} booking(s). Triggered on request, not a scheduled job.`;
 }else throw new Error('Unknown operation');
 requireThat(s.audit.length<10000,'Workspace event limit reached; contact administrator');
 const event={id:uuid(),at:now,actor:u.id,actorName:u.name,action,detail,reference,previousHash:s.audit.at(-1)?.hash||'GENESIS'};s.audit.push({...event,hash:await hash(JSON.stringify(event))});return s;
}
export function view(s,u){
 const manager=u.role!=='student';const own=b=>b.userId===u.id;
 return {...s,bookings:s.bookings.filter(b=>manager?(u.role==='admin'||s.resources.some(r=>r.id===b.resourceId&&r.ownerId===u.id)):own(b)),incidents:s.incidents.filter(i=>u.role==='admin'||i.userId===u.id||u.role==='owner'&&s.resources.some(r=>r.id===i.resourceId&&r.ownerId===u.id)),profiles:manager?s.profiles:[u],certificates:s.certificates.filter(c=>u.role==='admin'||c.userId===u.id),notifications:s.notifications.filter(n=>n.userId===u.id),audit:s.audit.filter(a=>manager||a.actor===u.id),availability:s.bookings.filter(allocated).map(b=>({resourceId:b.resourceId,start:b.start,end:b.end,status:b.status})),queues:s.resources.map(r=>({resourceId:r.id,count:s.bookings.filter(b=>b.resourceId===r.id&&b.status==='waiting').length,position:s.bookings.filter(b=>b.resourceId===r.id&&b.status==='waiting').sort((a,b)=>a.sequence-b.sequence).findIndex(b=>b.userId===u.id)+1})),metrics:{requests:s.bookings.length,allocations:s.bookings.filter(b=>b.approvedAt).length,completed:s.bookings.filter(b=>b.status==='completed').length,distribution:s.profiles.filter(p=>p.role==='student').map(p=>({name:u.role==='student'&&p.id!==u.id?'Participant '+(s.profiles.indexOf(p)+1):p.name,count:s.bookings.filter(b=>b.userId===p.id&&b.approvedAt).length}))},auditHead:s.audit.at(-1)?.hash||'GENESIS'};
}
