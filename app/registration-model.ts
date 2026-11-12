import {z} from 'zod';
export const phone=(s:string)=>s.replace(/[\s().-]/g,'').replace(/^00/,'+').replace(/^(\d{10})$/,'+91$1');
const mobile=z.string().transform(phone).refine(s=>/^\+[1-9]\d{7,14}$/.test(s),'Use a valid mobile number with country code.');
const required=z.string().trim().min(2,'This field is required.').max(160);const email=z.string().trim().email('Enter a valid email.').max(254);
export function eligibleDate(joined:string,asOf=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(joined))return false;const d=new Date(joined+'T00:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==joined)return false;
 const y=d.getUTCFullYear(),m=d.getUTCMonth()+6,day=d.getUTCDate(),last=new Date(Date.UTC(y,m+1,0)).getUTCDate();return new Date(Date.UTC(y,m,Math.min(day,last))).toISOString().slice(0,10)<=asOf;
}
export const playerSchema=z.object({name:required,mobile,whatsapp:mobile,email:z.union([email,z.literal('')]),designation:required,joined:z.string().refine(s=>eligibleDate(s),'At least six continuous months of service is required.'),employeeId:required,role:z.enum(['Player','Captain','Vice-captain','Wicketkeeper','Captain + wicketkeeper','Vice-captain + wicketkeeper']),idStatus:z.enum(['Original company photo ID','Digital-only company ID — approval required','Lost company ID — alternative required','Company does not issue photo IDs — alternative required']),adult:z.literal(true)});
export const registrationSchema=z.object({requestId:z.string().uuid(),company:z.object({legalName:required,teamName:required,sector:required,address:z.string().trim().min(10).max(500),website:z.string().trim().max(200),coordinator:required,email,phone:mobile,hrName:required,hrRole:required,hrEmail:email,hrPhone:mobile}),players:z.array(playerSchema).length(15),declarations:z.object({authorised:z.literal(true),employment:z.literal(true),consent:z.literal(true),locked:z.literal(true),terms:z.literal(true)})}).superRefine((v,c)=>{
 if(v.players.filter(p=>p.role.startsWith('Captain')).length!==1||v.players.filter(p=>p.role.startsWith('Vice-captain')).length!==1||!v.players.some(p=>p.role.toLowerCase().includes('wicketkeeper')))c.addIssue({code:'custom',message:'Nominate exactly one captain, one different vice-captain and at least one wicketkeeper.',path:['players']});
 if(new Set(v.players.map(p=>p.mobile)).size!==15)c.addIssue({code:'custom',message:'Every player needs their own distinct mobile number.',path:['players']});
 if(new Set(v.players.map(p=>p.employeeId.toLowerCase().replace(/\s/g,''))).size!==15)c.addIssue({code:'custom',message:'Employee ID references must be unique within the squad.',path:['players']});
});
