import test from 'node:test';
import assert from 'node:assert/strict';
import {reserve,enqueue,finish,leaveQueue,jain} from '../src/booking.js';
const r={id:'lab',name:'Physics Laboratory'};
const fresh=()=>({resources:[r],bookings:[],waitlists:{},audit:[]});
test('booking, FIFO allocation and audit history survive release and cancellation',()=>{
 let d=reserve(fresh(),r,' Sanjana  M ');
 assert.equal(d.bookings[0].borrower,'Sanjana M');
 const before=JSON.stringify(d);
 assert.throws(()=>reserve(d,r,'Other'),/occupied/);
 assert.equal(JSON.stringify(d),before);
 d=enqueue(d,r,'Roshan');d=enqueue(d,r,'Diya');
 assert.throws(()=>enqueue(d,r,' ROSHAN '),/already on/);
 assert.throws(()=>enqueue(d,r,'sanjana m'),/already have/);
 d=finish(d,r);assert.equal(d.bookings.find(b=>b.status==='active').borrower,'Roshan');
 assert.equal(d.waitlists.lab[0].name,'Diya');assert.equal(d.audit[0].action,'AUTO_ALLOCATED');
 d=finish(d,r,true);assert.equal(d.bookings.find(b=>b.borrower==='Roshan').status,'cancelled');
 assert.equal(d.bookings.find(b=>b.status==='active').borrower,'Diya');
 d=finish(d,r);assert.equal(d.bookings.filter(b=>b.status==='active').length,0);
 assert.equal(d.audit.filter(e=>e.action==='AUTO_ALLOCATED').length,2);
 assert.equal(d.audit.filter(e=>e.action==='CANCELLED').length,1);
});
test('queue withdrawal preserves order and records event',()=>{
 let d=enqueue(enqueue(reserve(fresh(),r,'A'),r,'B'),r,'C');
 d=leaveQueue(d,r,' b ');assert.deepEqual(d.waitlists.lab.map(e=>e.name),['C']);
 assert.equal(d.audit[0].action,'LEFT_QUEUE');assert.throws(()=>leaveQueue(d,r,'D'));
});
test('empty names and joining an available resource are rejected',()=>{
 assert.throws(()=>reserve(fresh(),r,'  '));assert.throws(()=>enqueue(fresh(),r,'A'),/available/);
});
test('Jain index includes unallocated participants and empty convention',()=>{
 assert.equal(jain([]),1);assert.equal(jain([0,0]),1);assert.equal(jain([2,2]),1);assert.equal(jain([1,0]),0.5);
});
