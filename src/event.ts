export const event = {
  name: 'RIHS Hackathon 2027', school: 'River Islands High School', organizer: 'RIHS Hackathon Club',
  start: '2027-01-09T09:00:00-08:00', end: '2027-01-09T15:00:00-08:00', zone: 'America/Los_Angeles',
  dateLabel: 'Saturday, January 9, 2027', timeLabel: '9:00 AM–3:00 PM Pacific',
  shortDate: 'January 9, 2027', capacity: 100, checkIn: '8:30 AM',
  venueRoom: 'Cafeteria', buildWindow: '9:15 AM–12:15 PM', submissionTime: '12:15 PM',
  deadlineDate: '2026-12-06', deadlineLabel: 'December 6, 2026',
  participantCutoff: null as string|null, sponsorCutoff: null as string|null,
  address: '16601 Riptide Wy, Lathrop, CA 95330', email: 'kwone@bantasd.org',
  postalAddress: {streetAddress:'16601 Riptide Wy',addressLocality:'Lathrop',addressRegion:'CA',postalCode:'95330',addressCountry:'US'},
  directions: 'https://www.google.com/maps/dir/?api=1&destination=River+Islands+High+School+16601+Riptide+Wy+Lathrop+CA+95330',
  participant: { url: 'https://forms.gle/Tdr3m6frKN5pmfBTA' as string|null, verified: false },
  sponsor: { url: 'https://forms.gle/FLytMPMBTxQf9oVL7', verified: false },
};

export function eventState(now: number) {
  const start=Date.parse(event.start), end=Date.parse(event.end);
  return { status: now>=end?'completed':now>=start?'underway':'upcoming', remaining: Math.max(0,start-now) };
}
export function applicationState(kind:'participant'|'sponsor',now:number) {
  const cutoff=kind==='participant'?event.participantCutoff:event.sponsorCutoff;
  if(cutoff) return now>=Date.parse(cutoff)?'closed':'open';
  const date=new Intl.DateTimeFormat('en-CA',{timeZone:event.zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
  return date>event.deadlineDate?'closed':date===event.deadlineDate?'deadline-day':'open';
}

export type Sponsor={name:string;logo:string;website:string;tier?:string;displayOrder:number;confirmationStatus:'unconfirmed'|'confirmed'};
export const sponsors:Sponsor[]=[{name:'Chick-fil-A',logo:'/chick-fil-a.svg',website:'https://www.chick-fil-a.com/',displayOrder:1,confirmationStatus:'confirmed'},{name:'Markivia Digital',logo:'/markivia-wordmark.png',website:'https://www.markiviadigital.com/',displayOrder:2,confirmationStatus:'confirmed'}];

export const tiers=[
 {name:'Community Supporter',price:'$250',benefits:['Business logo in the website’s Community Supporters section.','Collective social media thank-you post.','Business name in event sponsor recognition.','Digital certificate of appreciation.','Recognition in the post-event community impact recap.']},
 {name:'Silver Sponsor',price:'$500',inherits:'Community Supporter',benefits:['Event T-shirt logo, subject to production deadlines.','Logo on event sponsor signage.','Dedicated pre-event social media sponsor mention.','Recognition during the opening or closing ceremony.','Opportunity to provide approved promotional materials for participant welcome bags.']},
 {name:'Gold Sponsor',price:'$750',inherits:'Silver',tag:'Popular choice',benefits:['Larger logo placement on signage and promotional materials.','Dedicated sponsor spotlight on social media.','Opportunity for an approved informational table or promotional display.','Opportunity for a short, approved business or industry introduction.','Gold Sponsor recognition in the post-event recap.','Option to contribute branded prizes, merchandise, or other participant materials.']},
 {name:'Platinum Sponsor',price:'$1,000',inherits:'Gold',benefits:['Premium logo placement on event T-shirts, signage, and the website.','Individual sponsor feature on club social media.','Priority placement for an approved promotional booth or display.','Opportunity for an approved career discussion, industry Q&A, or technology demonstration.','Prominent recognition during opening and closing remarks.','Featured acknowledgment in the post-event impact report.','First opportunity to discuss sponsorship of a future hackathon.']},
 {name:'Presenting Sponsor',price:'$1,500+',inherits:'Platinum',tag:'Highest tier',benefits:['Presenting Sponsor naming, subject to school approval.','Top-tier logo placement across approved event materials.','Exclusive presenting recognition in designated promotional content.','Opportunity to collaborate on an approved challenge, prize category, or student activity.','Opportunity for approved opening remarks or a career-focused discussion by a company representative.','Post-event report feature including the contribution’s impact.','First consideration for the presenting position at the next event.']},
];
export const faqs=[
 ['Who can attend?','Everyone is welcome. You do not need to attend River Islands High School. Register using the participant form before the deadline.'],
 ['Do I need coding experience?','No. The hackathon is beginner friendly, with workshops and mentor support to help you get started.'],
 ['What should I bring?','A laptop, charger, any hardware you want to use, a water bottle, and a photo ID for check-in.'],
 ['Can I participate solo?','Yes. You can participate solo.'],
 ['Where is the venue?',`The ${event.venueRoom.toLowerCase()} at ${event.school}, ${event.address}.`],
 ['How long is the event?',`Check-in begins at ${event.checkIn}. The event runs ${event.timeLabel} on ${event.shortDate}. Building runs ${event.buildWindow}, with submissions due at ${event.submissionTime}.`],
 ['How are projects judged?','Industry mentors evaluate technical execution, creativity, polish, and presentation. Specific prize categories will be announced closer to the event.'],
 ['Is food provided?','Yes. Meals, snacks, and drinks are provided. Dietary restrictions are accommodated; please share your needs through registration or contact our advisor.'],
 ['How much does it cost?',`Participation is free. The event has ${event.capacity} spots.`],
 ['How do I sign up?',`Visit the registration page and complete the participant Google Form. Participant and sponsorship applications both have a ${event.deadlineLabel} deadline.`],
];

export const schedule=[
 {time:'8:30 AM',title:'Check-in',description:'Arrive, sign in, and collect your badge and swag bag.',type:'Welcome'},
 {time:'9:00 AM',title:'Opening ceremony',description:'Sponsor introductions, judging criteria, and the water-related challenge reveal.',type:'Kickoff'},
 {time:'9:15 AM',title:'Hacking begins',description:'Three hours to build, experiment, and prepare your submission.',type:'Build'},
 {time:'12:15 PM',title:'Submissions due',description:'Final commits and project submission. Get ready to show what you made.',type:'Deadline'},
 {time:'12:20 PM',title:'Food is served',description:'Take a break and enjoy a meal.',type:'Food'},
 {time:'12:30 PM',title:'Judging',description:'Show your project to industry mentors.',type:'Demo'},
 {time:'2:30 PM',title:'Awards ceremony',description:'Winners announced and prizes presented.',type:'Celebrate'},
 {time:'3:00 PM',title:'Event ends',description:'Wrap up the day at River Islands High School.',type:'Close'},
];
