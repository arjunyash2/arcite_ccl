import {env} from '../../../../lib/storage';import {owner,admin} from '../../../../lib/session';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){
 const account=owner(req),isAdmin=admin(req);if(!account&&!isAdmin)return new Response('Private receipt. Use the submitting browser or organiser login.',{status:401,headers:{'WWW-Authenticate':'Basic realm="ARCITE CCL Organiser", charset="UTF-8"','Cache-Control':'no-store'}});
 const id=new URL(req.url).searchParams.get('id');if(!id||!env.DB||!env.BUCKET)return new Response('Not found.',{status:404});
 const row=isAdmin?await env.DB.prepare('SELECT data FROM registrations WHERE id = ?').bind(id).first<{data:string}>():await env.DB.prepare('SELECT data FROM registrations WHERE id = ? AND owner_id = ?').bind(id,account).first<{data:string}>();if(!row)return new Response('Not found.',{status:404});
 const payment=JSON.parse(row.data).payment;if(!payment?.screenshotKey)return new Response('No screenshot on this application.',{status:404});const file=await env.BUCKET.get(payment.screenshotKey);if(!file)return new Response('Not found.',{status:404});
 return new Response(file.body,{headers:{'Content-Type':payment.contentType,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Content-Disposition':'inline; filename="payment-proof.'+(payment.contentType==='image/png'?'png':payment.contentType==='image/webp'?'webp':'jpg')+'"'}});
}
