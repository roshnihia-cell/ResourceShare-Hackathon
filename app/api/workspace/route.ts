import { env } from 'cloudflare:workers';
import { seed, demoPeople, transition, view, verifyAudit } from '../../../domain/engine.js';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Content-Type':'application/json','X-Content-Type-Options':'nosniff'};
const json=(body:any,status=200,cookie?:string)=>new Response(JSON.stringify(body),{status,headers:{...headers,...(cookie?{'Set-Cookie':cookie}:{})}});
const cookie=(req:Request,key:string)=>req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(key+'='))?.slice(key.length+1);
const secureFlag=(req:Request)=>new URL(req.url).protocol==='http:'&&['terminal.local','localhost','127.0.0.1'].includes(new URL(req.url).hostname)?'':'Secure; ';
const sessionCookie=(token:string,req:Request)=>`rs_demo=${token}; HttpOnly; ${secureFlag(req)}SameSite=Strict; Path=/; Max-Age=86400`;
async function context(req:Request,live=false){
 const token=!live&&cookie(req,'rs_demo');
 if(token&&/^[a-f0-9-]{36}$/.test(token))return {key:'demo:'+token,demo:true,person:demoPeople.find(p=>p.id===cookie(req,'rs_person'))||demoPeople[0]};
 const id=req.headers.get('oai-authenticated-user-id');
 if(!id)return null;
 const email=req.headers.get('oai-authenticated-user-email')||'';
 // This allowlist is a server-only environment value. Never accept a role in a request body.
 const admins=String((env as any).RESOURCE_ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 const isAdmin=admins.includes(email.toLowerCase());
 return {key:'campus:one',demo:false,person:{id,name:email.split('@')[0]||'Campus member',email,role:isAdmin?'admin':'student',verified:isAdmin,training:[],institution:'Campus One'}};
}
async function load(c:any){
 if(!(env as any).DB)throw new Error('Database binding is unavailable');
 const db=(env as any).DB.withSession('first-primary');
 await db.prepare('INSERT OR IGNORE INTO workspaces (id, revision, data, updated_at) VALUES (?,0,?,?)').bind(c.key,JSON.stringify(seed(c.demo)),new Date().toISOString()).run();
 const row=await db.prepare('SELECT revision, data FROM workspaces WHERE id=?').bind(c.key).first();
 const state=JSON.parse(row.data);const existing=state.profiles.find((p:any)=>p.id===c.person.id);
 if(existing)c.person={...existing,role:c.demo?c.person.role:c.person.role==='admin'?'admin':existing.role==='owner'?'owner':'student'};
 return {db,row,state};
}
async function response(c:any,row:any,state:any,extra={}){return {revision:row.revision,user:c.person,demo:c.demo,people:c.demo?demoPeople:undefined,data:view(state,c.person),auditVerified:c.person.role==='admin'?await verifyAudit(state.audit):undefined,...extra}}
export async function GET(req:Request){try{const c=await context(req);if(!c)return json({signedOut:true});const {row,state}=await load(c);return json(await response(c,row,state))}catch(e:any){console.error('workspace read failed',e.message);return json({error:'Workspace could not be loaded. Please retry.'},503)}}
export async function POST(req:Request){
 try{
  if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Same-origin request required'},403);
  if(!req.headers.get('content-type')?.includes('application/json'))return json({error:'JSON required'},415);
  const raw=await req.text();if(raw.length>16000)return json({error:'Request too large'},413);const body=JSON.parse(raw);
  if(body.action==='start_demo'){
   const token=crypto.randomUUID(),c={key:'demo:'+token,demo:true,person:demoPeople[0]};const {row,state}=await load(c);return json(await response(c,row,state),200,sessionCookie(token,req));
  }
  if(body.action==='leave_demo')return json({reload:true},200,'rs_demo=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  const c=await context(req);if(!c)return json({error:'Sign in or start an isolated demo'},401);
  if(body.action==='switch_demo'){
   if(!c.demo)return json({error:'Role switching is only available in an isolated demo'},403);
   const person=demoPeople.find(p=>p.id===body.payload?.id);if(!person)return json({error:'Unknown demo identity'},400);c.person=person;const {row,state}=await load(c);return json(await response(c,row,state),200,`rs_person=${person.id}; HttpOnly; ${secureFlag(req)}SameSite=Strict; Path=/; Max-Age=86400`);
  }
  const {db,row,state}=await load(c);
  if(body.revision!==row.revision)return json({error:'The workspace changed. Refresh and try again.'},409);
  if(!state.profiles.some((p:any)=>p.id===c.person.id))state.profiles.push(c.person);
  const next=await transition(state,c.person,body.action,body.payload||{});
  const result=await db.prepare('UPDATE workspaces SET data=?, revision=revision+1, updated_at=? WHERE id=? AND revision=?').bind(JSON.stringify(next),new Date().toISOString(),c.key,row.revision).run();
  if(result.meta.changes!==1)return json({error:'Another request changed availability. Refresh and retry.'},409);
  const profile=next.profiles.find((p:any)=>p.id===c.person.id);if(profile)c.person=profile;
  return json(await response(c,{revision:row.revision+1},next));
 }catch(e:any){return json({error:e.message||'Operation failed'},400)}
}
