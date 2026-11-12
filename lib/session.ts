import {createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
const cookieName='ccl_session';
function secret(){const s=process.env.SESSION_SECRET;if(!s||s.length<32)throw Error('Set SESSION_SECRET to a random secret of at least 32 characters.');return s}
function sign(v:string){return createHmac('sha256',secret()).update(v).digest('hex')}
function equal(a:string,b:string){const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function owner(req:Request){const v=req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!v)return null;const [id,expires,signature]=v.split('.');const payload=id+'.'+expires;if(!/^[a-f0-9-]{36}$/.test(id)||Number(expires)<Date.now()||!signature||!equal(sign(payload),signature))return null;return id}
export function newSession(){const id=randomUUID(),payload=id+'.'+(Date.now()+90*86400000);return {id,cookie:cookieName+'='+payload+'.'+sign(payload)+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=7776000'+(process.env.COOKIE_SECURE==='false'?'':'; Secure')}}
export function admin(req:Request){const expected=process.env.ADMIN_PASSWORD,username=process.env.ADMIN_USER||'admin';if(!expected||expected.length<16)return false;const value=req.headers.get('authorization');if(!value?.startsWith('Basic '))return false;try{const v=Buffer.from(value.slice(6),'base64').toString();return equal(v,username+':'+expected)}catch{return false}}
export function safeOrigin(req:Request){const origin=req.headers.get('origin');return !origin||origin===(process.env.PUBLIC_ORIGIN||new URL(req.url).origin)}
export function internalRequest(req:Request,id:string){const headers=new Headers(req.headers);headers.delete('oai-authenticated-user-id');headers.set('oai-authenticated-user-id',id);headers.delete('origin');return new Request(req,{headers})}
