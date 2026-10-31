import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:4173';
let jar={},state;
async function call(action,payload={},expected=200,revision){const res=await fetch(base+'/api/workspace',{method:action?'POST':'GET',signal:AbortSignal.timeout(20000),headers:{...(action?{'Content-Type':'application/json',Origin:base}:{}),Cookie:Object.entries(jar).map(([k,v])=>k+'='+v).join('; ')},...(action?{body:JSON.stringify({action,payload,revision:revision??state?.revision})}:{})});for(const v of res.headers.getSetCookie()){const [k,val]=v.split(';')[0].split('=');jar[k]=val}const next=await res.json();assert.equal(res.status,expected,JSON.stringify(next));if(res.ok)state=next;return next}
await call('start_demo');assert.equal(state.demo,true);await call();assert.equal(state.user.id,'student-1');
let start=new Date(Date.now()-5000),end=new Date(Date.now()+3600000);await call('request',{resourceId:'r-lab',start:start.toISOString(),end:end.toISOString(),purpose:'HTTP integration test',agreed:true});let b=state.data.bookings[0];const stale=state.revision;
await call('resource',{name:'Unauthorized resource',location:'Room',category:'Equipment'},400);
await call('switch_demo',{id:'owner-1'});await call('approve',{id:b.id});assert.equal(state.data.bookings[0].status,'approved');
await call('approve',{id:b.id},409,stale);
await call('resource',{name:'Demonstration Oscilloscope',location:'Electronics Room',category:'Equipment',safety:'Follow owner instructions',deposit:200});assert.ok(state.data.resources.some(r=>r.name==='Demonstration Oscilloscope'));
await call('switch_demo',{id:'student-2'});await call('request',{resourceId:'r-lab',start:new Date().toISOString(),end:end.toISOString(),purpose:'Second borrower FIFO request',agreed:true});assert.equal(state.data.bookings[0].status,'waiting');
await call('cancel',{id:b.id},400);
await call('switch_demo',{id:'student-1'});await call('checkin',{id:b.id,pass:b.pass,condition:'Working, all accessories present'});assert.equal(state.data.bookings[0].status,'checked_in');
await call('checkout',{id:b.id,condition:'Returned clean and complete'});assert.equal(state.data.bookings[0].status,'return_pending');
await call('switch_demo',{id:'owner-1'});await call('confirm_return',{id:b.id,condition:'Inspected and received'});assert.equal(state.data.bookings.find(x=>x.id===b.id).status,'completed');assert.equal(state.data.bookings.find(x=>x.userId==='student-2').status,'requested');
await call('switch_demo',{id:'admin-1'});assert.equal(state.auditVerified,true);
await call('leave_demo');state=undefined;await call();assert.equal(state.signedOut,true);
console.log('HTTP API integration passed: persistence, owner listing, authorization, conflict revision, FIFO promotion, check-in, check-out, verified return, audit verification and demo exit.');
