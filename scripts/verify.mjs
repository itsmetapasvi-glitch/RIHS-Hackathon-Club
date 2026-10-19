import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import ts from 'typescript';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('src/event.ts',root),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {event,eventState,applicationState,tiers,sponsors,schedule,faqs}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
assert.equal(event.start,'2027-01-09T09:00:00-08:00');assert.equal(event.end,'2027-01-09T15:00:00-08:00');
const start=Date.parse(event.start),end=Date.parse(event.end);
for(const [time,status] of [[start-1,'upcoming'],[start,'underway'],[end-1,'underway'],[end,'completed'],[end+86400000,'completed']]){
 const state=eventState(time);assert.equal(state.status,status);assert(state.remaining>=0);if(time>=start)assert.equal(state.remaining,0);
}
// Jump across a simulated background pause: derive fresh time instead of decrementing stale digits.
assert.equal(eventState(start-3600000).remaining,3600000);assert.equal(eventState(start-60000).remaining,60000);
for(const kind of ['participant','sponsor']){
 assert.equal(applicationState(kind,Date.parse('2026-12-05T23:59:59-08:00')),'open');
 assert.equal(applicationState(kind,Date.parse('2026-12-06T00:00:00-08:00')),'deadline-day');
 assert.equal(applicationState(kind,Date.parse('2026-12-06T23:59:59-08:00')),'deadline-day');
 assert.equal(applicationState(kind,Date.parse('2026-12-07T00:01:00-08:00')),'closed');
}
event.participantCutoff='2026-12-06T17:00:00-08:00';
assert.equal(applicationState('participant',Date.parse('2026-12-06T17:00:00-08:00')),'closed');
assert.equal(applicationState('sponsor',Date.parse('2026-12-06T17:00:00-08:00')),'deadline-day');
event.participantCutoff=null;
assert.equal(event.sponsorCutoff,null);assert.equal(event.participant.url,'https://forms.gle/Tdr3m6frKN5pmfBTA');assert.equal(event.sponsor.url,'https://forms.gle/FLytMPMBTxQf9oVL7');
assert.equal(event.capacity,100);assert.equal(event.submissionTime,'12:15 PM');
assert.deepEqual(schedule.map(e=>e.time),['8:30 AM','9:00 AM','9:15 AM','12:15 PM','12:20 PM','12:30 PM','2:30 PM','3:00 PM']);
assert.deepEqual(tiers.map(t=>t.price),['$250','$500','$750','$1,000','$1,500+']);
assert.deepEqual(tiers.map(t=>t.benefits.length),[5,5,6,7,7]);
assert(tiers[1].benefits.some(s=>s.includes('production deadlines')));assert(tiers[4].benefits.some(s=>s.includes('school approval')));
assert(sponsors.every(s=>s.confirmationStatus==='confirmed'));assert.equal(sponsors.length,2);assert.equal(sponsors[0].tier,undefined);
const files=await readdir(new URL('public/',root),{recursive:true});
assert(!files.some(f=>/budget|prospect|volunteer|\.docx|\.xlsx|flyer/i.test(f)));
const app=await readFile(new URL('src/App.tsx',root),'utf8');
assert(!/\/edit|Dublin|SAP Office|TBD|Nine hours/.test(app+source));
const checks=[];
for(const folder of ['dist','dist-preview']){
 for(const [route,prefix] of [['',''],['register/','Register | '],['sponsor/','Sponsor Us | '],['contact/','Contact | ']]){
  const html=await readFile(new URL(`${folder}/${route}index.html`,root),'utf8');
  const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(html.includes(`<title>${prefix}${event.name}</title>`));
  for(const field of ['description','og:title','og:description','og:type','twitter:card','twitter:title','twitter:description'])assert(new RegExp(`(?:name|property)="${field}"`).test(html));
  assert.equal(json.name,event.name);assert.equal(json.startDate,event.start);assert.equal(json.endDate,event.end);
  assert.equal(json.location.name,event.school+' '+event.venueRoom);assert.equal(json.organizer.email,event.email);assert.deepEqual(json.location.address,{'@type':'PostalAddress',...event.postalAddress});assert.equal(json.isAccessibleForFree,true);
  assert(html.includes('<noscript>'));assert(html.includes(event.deadlineLabel));assert(html.includes(event.submissionTime));assert(!/Dublin|Harbor|TBD|\/edit/.test(html));
  checks.push(`${folder}/${route||'home'}: metadata and no-JS facts passed`);
 }
 assert(!(await readdir(new URL(`${folder}/media/`,root))).includes('ocean-depth.webp'));
 const guide=await stat(new URL(`${folder}/downloads/rihs-sponsorship-guide.pdf`,root));assert(guide.size>1000);
 const media=await stat(new URL(`${folder}/media/ocean.mp4`,root));assert(media.size>1000000);
 const surface=await stat(new URL(`${folder}/media/hero-surface.mp4`,root));assert(surface.size>1000000);
 const poster=await stat(new URL(`${folder}/media/hero-surface-poster.webp`,root));assert(poster.size>1000);
 for(const font of ['CrimsonText-Regular.woff2','CrimsonText-Italic.woff2','Inter-Regular.woff2','Inter-Medium.woff2','Inter-Semibold.woff2'])assert((await stat(new URL(`${folder}/fonts/${font}`,root))).size>10000);
 for(const license of ['CrimsonText-OFL.txt','Inter-OFL.txt'])assert(/SIL OPEN FONT LICENSE/i.test(await readFile(new URL(`${folder}/fonts/${license}`,root),'utf8')));
}
const report={checkedAt:new Date().toISOString(),dateBoundaryTests:'passed',independentDeadlineTests:'passed',backgroundTimeRecovery:'passed',capacity:100,submissionTime:event.submissionTime,schedule:'passed',sponsorshipBenefits:'passed',pageChecks:checks,deadlineCutoffs:null,participantResponderUrl:event.participant.url,formAccess:{signedInBrowser:'Both new short URLs resolve to responder forms; You need access observed in the available signed-in session',anonymousHttp:'Previously observed: 401 Unauthorized',signedOutBrowser:'not verified'},publicFiles:files,faqCount:faqs.length};
await writeFile(new URL('verification.json',root),JSON.stringify(report,null,2));
if(process.argv.includes('--export'))await writeFile(new URL('../../../work/rihs-public-data.json',import.meta.url),JSON.stringify({event,tiers},null,2));
console.log('Passed: event boundaries, background time recovery, independent deadlines, schedule, all tier benefits, eight page metadata variants, public files and media.');
