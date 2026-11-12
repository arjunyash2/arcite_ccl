import {admin} from '../../../lib/session';import {allApplications} from '../../../lib/storage';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:Request){if(!admin(req))return new Response('Organiser login required.',{status:401,headers:{'WWW-Authenticate':'Basic realm="ARCITE CCL Organiser", charset="UTF-8"','Cache-Control':'no-store'}});return Response.json({registrations:allApplications()},{headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
