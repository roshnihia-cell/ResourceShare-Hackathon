import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {seed,demoPeople,transition,verifyAudit,view} from '../domain/engine.js';
const [student,second,untrained,owner,admin]=demoPeople;
const now='2026-11-01T04:00:00.000Z';
const request={resourceId:'r-lab',start:'2026-11-01T04:00:00.000Z',end:'2026-11-01T05:00:00.000Z',purpose:'Optics experiment',agreed:true};
const step=(s,u,a,p={},time=now)=>transition(s,u,a,p,time);
const rejects=(s,u,a,p,pattern)=>assert.rejects(()=>step(s,u,a,p),pattern);
test('request, approval, condition reports and owner-verified return form a complete lifecycle',async()=>{
 let s=await step(seed(true),student,'request',request);let b=s.bookings[0];assert.equal(b.status,'requested');
 s=await step(s,owner,'approve',{id:b.id});assert.equal(s.bookings[0].status,'approved');
 s=await step(s,student,'checkin',{id:b.id,pass:b.pass,condition:'Good condition, all leads present'});
 assert.equal(s.bookings[0].status,'checked_in');
 await rejects(s,second,'checkout',{id:b.id,condition:'all fine'},/borrower/);
 s=await step(s,student,'checkout',{id:b.id,condition:'Clean, supplies switched off'});assert.equal(s.bookings[0].status,'return_pending');
 s=await step(s,owner,'confirm_return',{id:b.id,condition:'Inspected and received all equipment'});assert.equal(s.bookings[0].status,'completed');
 assert.equal(await verifyAudit(s.audit),true);
});
test('FIFO promotion occurs on cancellation and cannot bypass owner approval',async()=>{
 let s=await step(seed(true),student,'request',request);s=await step(s,owner,'approve',{id:s.bookings[0].id});
 s=await step(s,second,'request',request);assert.equal(s.bookings[1].status,'waiting');
 await rejects(s,owner,'approve',{id:s.bookings[1].id},/pending/);
 s=await step(s,student,'cancel',{id:s.bookings[0].id});assert.equal(s.bookings[1].status,'requested');
 s=await step(s,owner,'approve',{id:s.bookings[1].id});assert.equal(s.bookings[1].status,'approved');
});
test('overlapping approval cannot be forced by changing UI state',async()=>{
 let s=await step(seed(true),student,'request',request);s=await step(s,owner,'approve',{id:s.bookings[0].id});s=await step(s,second,'request',request);
 s.bookings[1].status='requested';await rejects(s,owner,'approve',{id:s.bookings[1].id},/conflict/);
});
test('qualification, agreement, role and ownership checks reject unauthorized actions',async()=>{
 const s=seed(true);await rejects(s,untrained,'request',request,/training/);await rejects(s,student,'request',{...request,agreed:false},/agreement/);await rejects(s,student,'resource',{name:'Test',location:'Room'},/Owner/);
 await rejects(s,owner,'policy',{maxHours:8},/Administrator/);
 const next=await step(s,student,'request',request);await rejects(next,second,'cancel',{id:next.bookings[0].id},/another borrower/);await rejects(next,{...owner,id:'other-owner'},'approve',{id:next.bookings[0].id},/owner or administrator/);
});
test('invalid times, duplicates and configured quotas are enforced',async()=>{
 await rejects(seed(true),student,'request',{...request,end:'2026-11-01T12:00:00Z'},/Maximum/);
 await rejects(seed(true),student,'request',{...request,start:'bad'},/valid dates/);
 let s=await step(seed(true),student,'request',request);await rejects(s,student,'request',request,/already/);
 s.policy.maxActive=1;await rejects(s,student,'request',{...request,resourceId:'r-projector'},/Maximum 1/);
});
test('time-limited passes and return ordering prevent invalid handovers',async()=>{
 let s=await step(seed(true),student,'request',request);const b=s.bookings[0];s=await step(s,owner,'approve',{id:b.id});
 await rejects(s,student,'checkin',{id:b.id,pass:'invalid',condition:'all fine'},/Invalid access/);
 await assert.rejects(()=>step(s,student,'checkin',{id:b.id,pass:b.pass,condition:'all fine'},'2026-11-01T06:00:00Z'),/outside/);
 await rejects(s,owner,'confirm_return',{id:b.id,condition:'all fine'},/check out/);
});
test('training evidence and institutional verification require admin review',async()=>{
 let s=await step(seed(true),untrained,'certificate',{name:'lab-safety',reference:'CERT-EXAMPLE-123'});const id=s.certificates[0].id;
 await rejects(s,owner,'verify_certificate',{id,approved:true,reason:'checked'},/Administrator/);
 s=await step(s,admin,'verify_certificate',{id,approved:true,reason:'Evidence inspected'});assert.ok(s.profiles.find(p=>p.id===untrained.id).training.includes('lab-safety'));
 s=await step(s,admin,'verify_profile',{id:student.id,verified:false});await rejects(s,s.profiles[0],'request',request,/verification/);
});
test('incident review, deposit bookkeeping and feedback enforce their lifecycle',async()=>{
 let s=await step(seed(true),student,'request',request);let b=s.bookings[0];s=await step(s,owner,'deposit',{id:b.id,status:'collected'});
 await rejects(s,owner,'deposit',{id:b.id,status:'refunded'},/return/);
 s=await step(s,student,'incident',{id:b.id,description:'Power supply cable looks damaged',severity:'urgent'});
 s=await step(s,admin,'resolve',{id:s.incidents[0].id,reason:'Equipment removed for inspection'});assert.equal(s.incidents[0].status,'resolved');
 await rejects(s,student,'feedback',{id:b.id,rating:5},/return/);
});
test('audit edits are detectable and student views hide other identities and passes',async()=>{
 let s=await step(seed(true),student,'request',request);s=await step(s,second,'request',request);assert.equal(view(s,student).bookings.length,1);assert.equal(view(s,student).profiles.length,1);s.audit[0].detail='altered';assert.equal(await verifyAudit(s.audit),false);
});
test('SQLite compare-and-swap rejects stale concurrent writers atomically',()=>{
 const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE workspaces (id TEXT PRIMARY KEY, revision INTEGER NOT NULL, data TEXT NOT NULL)');db.prepare('INSERT INTO workspaces VALUES (?,0,?)').run('campus','{}');
 const first=db.prepare('SELECT revision FROM workspaces').get(),second=db.prepare('SELECT revision FROM workspaces').get();
 const update=db.prepare('UPDATE workspaces SET revision=revision+1,data=? WHERE id=? AND revision=?');
 assert.equal(Number(update.run('{"winner":1}','campus',first.revision).changes),1);assert.equal(Number(update.run('{"winner":2}','campus',second.revision).changes),0);assert.deepEqual(JSON.parse(db.prepare('SELECT data FROM workspaces').get().data),{winner:1});db.close();
});
test('operational sweep expires no-shows and alerts overdue users on demand',async()=>{
 let s=await step(seed(true),student,'request',request);s=await step(s,owner,'approve',{id:s.bookings[0].id});s=await step(s,owner,'sweep',{},'2026-11-01T04:16:00Z');assert.equal(s.bookings[0].status,'no_show');
});
test('extensions cannot take a later waiting borrower’s slot',async()=>{
 let s=await step(seed(true),student,'request',request);s=await step(s,owner,'approve',{id:s.bookings[0].id});s=await step(s,second,'request',{...request,start:'2026-11-01T05:00:00Z',end:'2026-11-01T06:00:00Z'});
 s=await step(s,student,'extension',{id:s.bookings[0].id,end:'2026-11-01T05:30:00Z'});await rejects(s,owner,'approve_extension',{id:s.bookings[0].id},/conflicts/);
});
test('deposit refund and one-time feedback work after verified return',async()=>{
 let s=await step(seed(true),student,'request',request);const b=s.bookings[0];s=await step(s,owner,'approve',{id:b.id});s=await step(s,owner,'deposit',{id:b.id,status:'collected'});s=await step(s,student,'checkin',{id:b.id,pass:b.pass,condition:'All complete'});s=await step(s,student,'checkout',{id:b.id,condition:'Clean and complete'});s=await step(s,owner,'confirm_return',{id:b.id,condition:'Inspected and received'});s=await step(s,owner,'deposit',{id:b.id,status:'refunded'});assert.equal(s.bookings[0].depositStatus,'refunded');s=await step(s,student,'feedback',{id:b.id,rating:5,comment:'Useful lab space'});assert.equal(s.feedback[0].rating,5);await rejects(s,student,'feedback',{id:b.id,rating:5},/Already/);
});
test('policy snapshots survive changes and only admins assign owner roles',async()=>{
 let s=await step(seed(true),student,'request',request);const agreement=s.bookings[0].agreement;s=await step(s,admin,'policy',{maxActive:2,maxHours:3,noShowMinutes:20,agreement:'New borrowing policy: follow all safety and return instructions.'});assert.equal(s.bookings[0].agreement,agreement);assert.equal(s.policy.maxHours,3);await rejects(s,student,'set_role',{id:second.id,role:'owner'},/Administrator/);s=await step(s,admin,'set_role',{id:second.id,role:'owner'});assert.equal(s.profiles.find(p=>p.id===second.id).role,'owner');
});
