import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowDown,Menu,X,Plus,Minus,MapPin,Mail,Download,Waves,Compass,Code2,Flag,Utensils,Trophy,Sparkles,Clock3,Users,Ticket,CalendarDays,ExternalLink} from 'lucide-react';
import {event,eventState,applicationState,tiers,sponsors,faqs,schedule} from './event';
import OceanHero from './OceanHero';
import {useSiteMotion} from './site-motion';
import {useSmoothScroll} from './smooth-scroll';
import {useScrollbarSurface} from './scrollbar-surface';
import {useCompactMotion} from './motion-policy';

type Page='home'|'register'|'sponsor'|'contact';
const preview=import.meta.env.VITE_SPONSOR_PREVIEW==='true';
const currentPage:Page=location.pathname.startsWith('/register')?'register':location.pathname.startsWith('/sponsor')?'sponsor':location.pathname.startsWith('/contact')?'contact':'home';

function useNow(){
  const [now,setNow]=useState(Date.now);
  useEffect(()=>{
    const sync=()=>setNow(Date.now());
    const tick=setInterval(sync,1000);
    document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);window.addEventListener('focus',sync);
    return()=>{clearInterval(tick);document.removeEventListener('visibilitychange',sync);window.removeEventListener('pageshow',sync);window.removeEventListener('focus',sync);};
  },[]);
  return now;
}
function useReducedMotion(){
  const [value,setValue]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setValue(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  return value;
}


function Words({text}:{text:string}){return <>{text.split(/(\s+)/).map((word,i)=>word.trim()?<span className="reveal-word" data-word={i/2} key={i}>{word}</span>:word)}</>;}

function Brand(){return <a className="brand" href="/" translate="no" aria-label="RIHS Hackathon home"><img src="/rihs-logo-transparent.png" alt="RIHS Hackathon" width="196" height="46"/></a>;}
function Header({page,reduced}:{page:Page;reduced:boolean}){
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),pointerOpen=useRef(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open&&dialog.current?.open)dialog.current.close();
    document.dispatchEvent(new CustomEvent('rihs:menu-lock',{detail:open}));
    if(!open)return;
    const animation=pointerOpen.current&&!reduced?dialog.current?.animate([{transform:'translateX(18px)',opacity:.7},{transform:'translateX(0)',opacity:1}],{duration:240,easing:'cubic-bezier(.32,.72,0,1)'}):null;
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    return()=>{animation?.cancel();document.documentElement.style.overflow=previous;document.dispatchEvent(new CustomEvent('rihs:menu-lock',{detail:false}));};
  },[open,reduced]);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  const links=[['RIHS Hackathon','/'],['About','/#about'],['Register to Participate','/register/'],['Sponsor','/sponsor/'],['Theme','/#theme'],['Schedule','/#schedule'],['FAQ','/#faq'],['Contact','/contact/']];
  return <header className={'site-header '+(page==='home'?'on-ocean':'on-page')}>
    <div className="nav-inner"><Brand/>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,url])=><a href={url} key={url} className={url==='/register/'?'nav-register':url==='/sponsor/'?'nav-sponsor':''} aria-current={url===location.pathname?'page':undefined}>{label}</a>)}</nav>
      <div className="nav-actions">
        <button ref={trigger} className="menu-trigger" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={e=>{pointerOpen.current=e.detail>0;setOpen(true);}}><span>Menu</span><Menu aria-hidden="true" size={27} strokeWidth={1.5}/></button>
      </div>
    </div>
    <dialog ref={dialog} className="menu-dialog" data-lenis-prevent aria-label="Site navigation" onCancel={close} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="menu-top"><span>RIHS Hackathon 2027</span><button className="icon-button" autoFocus aria-label="Close menu" onClick={close}><X aria-hidden="true"/></button></div>
      <nav aria-label="Menu navigation">{links.map(([label,url])=><a key={label} href={url} className={url==='/register/'?'nav-register':url==='/sponsor/'?'nav-sponsor':''} onClick={close}>{label}<ArrowUpRight aria-hidden="true" size={22}/></a>)}</nav>
      <div className="menu-contact"><p>{event.shortDate} · {event.school}</p><a href={'mailto:'+event.email}>{event.email}</a></div>
    </dialog>
  </header>;
}

function Countdown(){
  const now=useNow(),state=eventState(now),total=Math.floor(state.remaining/1000);
  const values=[Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];
  return <div className="countdown-panel" aria-live="off">
    {state.status==='upcoming'?<><p>The hackathon begins in</p><div className="countdown" role="group" aria-label="Time until the hackathon">{values.map((value,i)=><div key={i}><span>{String(value).padStart(2,'0')}</span><small>{['Days','Hours','Minutes','Seconds'][i]}</small></div>)}</div></>:<p className="event-message">{state.status==='underway'?'The hackathon is underway.':'The hackathon has concluded. Thank you for being part of it.'}</p>}
  </div>;
}

function Facts(){
  const facts=[{icon:Ticket,value:'Free',label:'To participate'},{icon:Clock3,value:'6 hours',label:'9am–3pm event'},{icon:Users,value:String(event.capacity)+' spots',label:'Event capacity'},{icon:CalendarDays,value:'January 9',label:'Saturday, 2027'}];
  return <div className="facts">{facts.map(({icon:Icon,value,label})=><div key={value}><Icon aria-hidden="true" size={20} strokeWidth={1.5}/><strong>{value}</strong><span>{label}</span></div>)}</div>;
}
function About(){return <section id="about" className="section about"><div className="section-heading"><h2><Words text="Build, learn,"/><br/><em><Words text="and show your work."/></em></h2><div><p>Spend a day turning an idea into something you can share. Build with others, learn in workshops, and get support from mentors.</p><p>Organized by the {event.organizer}. Everyone is welcome—you don’t need to attend RIHS, and you don’t need coding experience.</p></div></div><Facts/><p className="fact-note">Check-in begins at {event.checkIn}. Building runs {event.buildWindow} Pacific; submissions close at {event.submissionTime}.</p></section>;}
function Challenge(){return <section id="theme" className="section challenge"><div className="challenge-heading"><span className="section-label">The challenge</span><h2><Words text="It starts with water."/><br/><em><Words text="Where it goes is up to you."/></em></h2><p>The specific prompt is revealed at the opening ceremony. Presentations, websites, apps, games—choose the format that fits your idea.</p></div><ol className="challenge-steps"><li><span>01</span><h3>Meet the prompt.</h3><p>A water-related challenge, unveiled at 9am.</p></li><li><span>02</span><h3>Make it yours.</h3><p>Build a finished project and submit by {event.submissionTime}.</p></li><li><span>03</span><h3>Show what you made.</h3><p>Present your project for judging by industry mentors.</p></li></ol></section>;}
function Schedule(){const icons=[Compass,Flag,Code2,Flag,Utensils,Sparkles,Trophy,Waves];return <section id="schedule" className="section schedule"><div className="schedule-heading"><span className="section-label">The run of the day</span><h2><Words text="Your day"/><br/><Words text="at RIHS."/></h2><p>{event.dateLabel}<br/>All times Pacific.</p><div className="schedule-stamp" aria-hidden="true"><Clock3 aria-hidden="true"/><span>ONE DAY.<br/>MAKE IT COUNT.</span></div></div><div className="schedule-list"><span className="schedule-progress" aria-hidden="true"/>{schedule.map((item,i)=>{const Icon=icons[i];return <article key={item.time} className={i===2?'build-session':i===3?'submission-session':''}><span className="timeline-node" aria-hidden="true"><Icon aria-hidden="true" size={18}/></span><time>{item.time}</time><div><span className="schedule-type">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>})}</div></section>;}

function SponsorDisplay({compact=false,mobile=false}:{compact?:boolean;mobile?:boolean}){
  const marquee=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const root=marquee.current;
    if(!root)return;
    const observer=new IntersectionObserver(([entry])=>{root.dataset.running=String(entry.isIntersecting&&!document.hidden);});
    const visibility=()=>{const rect=root.getBoundingClientRect();root.dataset.running=String(!document.hidden&&rect.bottom>0&&rect.top<innerHeight);};
    observer.observe(root);document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
  },[]);
  const visible=sponsors.filter(s=>s.confirmationStatus==='confirmed'||preview).sort((a,b)=>a.displayOrder-b.displayOrder);
  const logo=(s:typeof sponsors[number])=>s.name==='Markivia Digital'?<span className="markivia-wordmark" role="img" aria-label="Markivia Digital"><span>MARKIVIA</span><small>DIGITAL</small></span>:<img src={s.logo} alt={s.name} width="76" height="77" loading="lazy"/>;
  return <section id="our-sponsors" className={'section our-sponsors '+(compact?'compact':'')} aria-label="Our sponsors"><h2 className="sr-only">Our sponsors</h2>{visible.length>0&&<div ref={marquee} className="sponsor-marquee" style={{'--sponsor-count':visible.length,'--sponsor-copies':mobile?4:8} as React.CSSProperties}><div className="sponsor-track">{Array.from({length:mobile?4:8},(_,copy)=><div className="sponsor-logos" key={copy} aria-hidden={copy>0?true:undefined}>{visible.map(s=><figure className="sponsor-panel" key={s.name}>{copy===0?<a href={s.website} target="_blank" rel="noopener noreferrer" aria-label={s.name+' website'}>{logo(s)}</a>:<div className="sponsor-copy">{logo(s)}</div>}</figure>)}</div>)}</div></div>}<a className="text-link" href="/sponsor/#apply">Apply to be a Sponsor <ArrowUpRight aria-hidden="true" size={18}/></a></section>;
}

function FAQ(){const [open,setOpen]=useState<number|null>(null);const pointer=useRef(false);useEffect(()=>{
  if(open!==null)document.dispatchEvent(new Event('rihs:layout'));
  if(open===null||!pointer.current||document.documentElement.dataset.motion==='reduced'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const animation=document.getElementById('answer-'+open)?.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'});
  return()=>animation?.cancel();
},[open]);return <section id="faq" className="section faq"><div><span className="section-label">The need-to-knows</span><h2><Words text="Good questions."/><br/><Words text="Clear answers."/></h2><p>Still have a question?<br/><a href="/contact/">Get in touch <ArrowUpRight aria-hidden="true" size={14}/></a></p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className="faq-item" key={q}><h3><button aria-expanded={open===i} aria-controls={'answer-'+i} id={'question-'+i} onClick={e=>{pointer.current=e.detail>0;setOpen(open===i?null:i);if(open===i)document.dispatchEvent(new Event('rihs:layout'));}}><span className="faq-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span className="faq-question">{q}</span>{open===i?<Minus aria-hidden="true" size={17}/>:<Plus aria-hidden="true" size={17}/>}</button></h3><div id={'answer-'+i} role="region" aria-labelledby={'question-'+i} hidden={open!==i}><p>{a}{i===9&&<> <a href="/register/">Register here <ArrowUpRight aria-hidden="true" size={14}/></a></>}</p></div></div>)}</div></section>;}
function Venue(){return <section id="venue" className="section venue"><div className="venue-copy"><p className="section-label">January 9. Your next big idea.</p><h2><Words text="Make something"/><br/><Words text="that makes waves."/></h2><p className="venue-address"><MapPin aria-hidden="true" size={18}/><span>{event.school} · {event.venueRoom}<br/>{event.address}</span></p><div className="venue-actions"><a className="button" href="/register/">Save your spot <ArrowUpRight aria-hidden="true" size={22}/></a><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight aria-hidden="true" size={18}/></a></div><p className="venue-deadline">Free to join · 100 spots · Apply by {event.deadlineLabel}</p></div></section>;}

function FormArea({kind}:{kind:'participant'|'sponsor'}){
  const now=useNow(),state=applicationState(kind,now),form=event[kind];
  const participant=kind==='participant',label=participant?'Participant registration':'Sponsorship application';
  return <section id="apply" className="application-section section" aria-labelledby="form-heading"><div className="application-intro"><span className="section-label">{participant?'YOUR NEXT STEP':'JOIN THE MISSION'}</span><h2 id="form-heading">{participant?<>Ready when<br/>you are.</>:<>Let’s make<br/>it happen.</>}</h2><p>Application deadline<br/><strong>{event.deadlineLabel}</strong></p><p>{event.shortDate} · {event.timeLabel}</p></div><div className="application-action"><span className="form-step"><ExternalLink aria-hidden="true" size={17}/> GOOGLE FORMS</span>{state==='closed'?<><h3>Applications have closed.</h3><p>The application deadline was {event.deadlineLabel}. Contact our advisor for questions.</p><a className="button" href="/contact/">Contact the team <ArrowUpRight aria-hidden="true" size={18}/></a></>:<><h3>{label}</h3><p>{participant?'Complete the participant form to apply for your place. Everyone is welcome, including beginners and students from other schools.':'Tell us about your organization and how you’d like to support the event. Explore the tiers above or propose a custom partnership.'}</p><div className="application-actions"><a className="button" href={form.url||'/contact/'} target={form.url?'_blank':undefined} rel={form.url?'noopener noreferrer':undefined}>{participant?'Open registration form':'Open sponsorship form'} <ArrowUpRight aria-hidden="true" size={21}/></a><a className="form-contact" href="/contact/">Questions? Contact the team <ArrowUpRight aria-hidden="true" size={17}/></a></div><p className="form-note">The form opens in a new tab. If you need help accessing it, <a href="/contact/">get in touch</a>.</p></>}{state==='deadline-day'&&<p className="deadline-day" role="status">Applications are due today. Contact our advisor for the exact cutoff time.</p>}</div></section>;
}

function PageHero({kind}:{kind:'register'|'sponsor'}){const register=kind==='register';return <section className={'page-intro section '+(register?'registration-intro':'sponsor-intro')}><div className="page-intro-content"><a className="back-link" href="/"><ArrowDown aria-hidden="true" size={14}/> RIHS Hackathon 2027</a><p className="section-label">{register?'YOUR NEXT BUILD STARTS HERE':'BACK THE NEXT GENERATION'}</p><h1>{register?<>Bring your idea.<br/><span>Make your mark.</span></>:<>Big ideas.<br/><span>Real impact.</span></>}</h1><p>{register?'One day. A water-inspired challenge. A hundred people ready to make something. Beginners, solo builders, and teams—all welcome.':'Help 100 students turn their ideas into something real. Support a day of building, learning, and discovery at River Islands High School.'}</p><div className="page-intro-actions"><a className="button" href={register?event.participant.url||'#apply':event.sponsor.url||'#apply'} target="_blank" rel="noopener noreferrer">{register?'Register to Participate':'Apply to be a Sponsor'} <ArrowUpRight aria-hidden="true" size={19}/></a>{!register&&<a className="text-link" href="/downloads/rihs-sponsorship-guide.pdf" download>Sponsorship guide <Download aria-hidden="true" size={18}/></a>}</div><p className="page-deadline">Apply by {event.deadlineLabel}</p></div><div className="page-hero-visual" aria-hidden="true"><Waves aria-hidden="true" className="visual-waves"/><span className="visual-number">{register?'09':'100'}</span><span className="visual-caption">{register?'JANUARY 2027':'STUDENTS. REAL POSSIBILITIES.'}</span><div className="visual-bottom"><span>{register?'9AM—3PM / PACIFIC':'FIVE WAYS TO MAKE A DIFFERENCE'}</span><ArrowUpRight aria-hidden="true"/></div></div></section>;}
function RegisterPage(){return <><PageHero kind="register"/><div className="section registration-details"><Facts/><div className="registration-notes"><div><h2>Bring the essentials.</h2><p>Laptop, charger, any hardware you want to use, a water bottle, and a photo ID for check-in.</p></div><div><h2>Find your way.</h2><p>{event.school} · {event.venueRoom}<br/>{event.address}<br/>Check-in {event.checkIn} · Event {event.timeLabel}</p><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight aria-hidden="true" size={16}/></a></div></div></div><FormArea kind="participant"/></>;}
function SponsorPage({mobile}:{mobile:boolean}){return <><PageHero kind="sponsor"/><section className="section sponsor-tiers"><div className="tiers-heading"><h2>Find your level<br/>of support.</h2><p>Each tier builds on the one before it. Explore the benefits and conditions below.</p></div>{tiers.map((tier,i)=><details className="tier" key={tier.name} open={i===2}><summary><span className="tier-number">0{i+1}</span><span className="tier-name">{tier.name}{tier.tag&&<small>{tier.tag}</small>}</span><span className="tier-price">{tier.price}</span><span className="tier-action">View benefits <Plus aria-hidden="true" size={19} className="tier-plus"/></span></summary><div className="tier-benefits">{tier.inherits&&<p>Everything in {tier.inherits}, plus:</p>}<ul>{tier.benefits.map(b=><li key={b}>{b}</li>)}</ul></div></details>)}<div className="in-kind"><div className="in-kind-heading"><span className="section-label">BEYOND A SPONSORSHIP TIER</span><h3>There’s more than<br/>one way to help.</h3><p>Bring what you do best. We welcome custom and in-kind partnerships.</p><a className="text-link" href="/contact/">Discuss a partnership <ArrowUpRight aria-hidden="true" size={18}/></a></div><div><ul className="in-kind-options"><li><Utensils aria-hidden="true"/><span>Food & refreshments</span></li><li><Trophy aria-hidden="true"/><span>Prizes & gift cards</span></li><li><Code2 aria-hidden="true"/><span>Equipment, software & cloud credits</span></li><li><Ticket aria-hidden="true"/><span>T-shirts, printing & event materials</span></li><li><Users aria-hidden="true"/><span>Workshops & career presentations</span></li><li><Sparkles aria-hidden="true"/><span>Technical resources & other services</span></li></ul><p className="in-kind-conditions">School approval, production deadlines, and approval of promotional materials, displays, talks, and activities apply as specified in each tier.</p></div></div></section><SponsorDisplay mobile={mobile}/><FormArea kind="sponsor"/></>;}

function ContactPage(){const [copied,setCopied]=useState('');const copy=async()=>{try{await navigator.clipboard.writeText(event.email);setCopied('Email copied.');}catch{setCopied('Select the email address above to copy it.');}};return <><section className="section contact-intro"><div className="contact-headline"><span className="section-label">CONTACT THE TEAM</span><h1>A question?<br/><span>We’re all ears.</span></h1><p>Whether you’re building, sponsoring, or figuring out your first hackathon, we’ll help you find your next step.</p><div className="contact-event"><CalendarDays aria-hidden="true" size={19}/><span>{event.shortDate} · {event.school}</span></div></div><div className="contact-direct"><Mail aria-hidden="true" size={30} strokeWidth={1.3}/><span className="contact-direct-label">YOUR CONTACT AT RIHS</span><h2>Let’s talk.</h2><p>Reach our faculty advisor for event questions and registration or sponsorship support.</p><a className="contact-email" href={'mailto:'+event.email}>{event.email}<ArrowUpRight aria-hidden="true"/></a><div className="contact-email-actions"><a className="button" href={'mailto:'+event.email}>Write an email <ArrowUpRight aria-hidden="true" size={18}/></a><button className="copy-email" onClick={copy}>Copy address</button></div><p className="copy-status" role="status">{copied}</p></div></section><section className="section contact-options"><div><span>01 / PARTICIPATE</span><h2>Come build with us.</h2><p>Free participation. Beginner friendly. One day to make something worth sharing.</p><a className="text-link" href={event.participant.url||'/register/'} target="_blank" rel="noopener noreferrer">Open registration form <ArrowUpRight aria-hidden="true" size={18}/></a></div><div><span>02 / PARTNER</span><h2>Support the event.</h2><p>Choose a sponsorship tier or tell us about another way you’d like to contribute.</p><a className="text-link" href={event.sponsor.url||'/sponsor/'} target="_blank" rel="noopener noreferrer">Open sponsorship form <ArrowUpRight aria-hidden="true" size={18}/></a></div><div><span>03 / FIND US</span><h2>See you at RIHS.</h2><p>{event.school} · {event.venueRoom}<br/>{event.address}</p><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight aria-hidden="true" size={18}/></a></div></section></>;}

function Footer(){
  return <footer id="footer" className="site-footer"><div className="footer-main"><div className="footer-identity"><Brand/><p>© {new Date().getFullYear()} {event.organizer}.<br/>{event.school}<br/>{event.address}</p></div><div className="footer-column"><h2>Explore</h2><a href="/#about">About</a><a href="/#theme">Theme</a><a href="/#schedule">Schedule</a><a href="/#faq">FAQ</a></div><div className="footer-column"><h2>Get involved</h2><a href="/register/">Register to Participate</a><a href="/sponsor/">Sponsor Us</a><a href="/downloads/rihs-sponsorship-guide.pdf" download>Sponsorship guide</a></div><div className="footer-column"><h2>Contact</h2><a href="/contact/">Get in touch</a><a href={'mailto:'+event.email}>{event.email}</a><a href={event.directions} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight aria-hidden="true" size={13}/></a></div></div><div className="footer-bottom"><span>{event.shortDate} · {event.timeLabel}</span><span>Participant & sponsor deadline: {event.deadlineLabel}</span></div></footer>;
}

export default function App(){
  const reduced=useReducedMotion();
  const mobile=useCompactMotion();
  useSiteMotion(reduced,mobile);
  useSmoothScroll(reduced,mobile);
  useScrollbarSurface();
  useEffect(()=>{document.documentElement.dataset.motion=reduced?'reduced':'full';},[reduced]);
  useEffect(()=>{try{localStorage.removeItem('rihs.motion');}catch{/* Legacy manual pause no longer applies. */}},[]);
  return <><div className={'site-shell page-'+currentPage}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header page={currentPage} reduced={reduced}/>
    <main id="main" tabIndex={-1}>{currentPage==='home'?<><OceanHero reduced={reduced} mobile={mobile} arrival={<><About/><Challenge/></>}><Countdown/></OceanHero><Schedule/><SponsorDisplay compact mobile={mobile}/><FAQ/><Venue/></>:currentPage==='register'?<RegisterPage/>:currentPage==='sponsor'?<SponsorPage mobile={mobile}/>:<ContactPage/>}</main>
    <Footer/>
  </div></>;
}
