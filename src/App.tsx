import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight,ArrowDown,Pause,Play,Menu,X,Plus,Minus,MapPin,Mail,Download,Waves,Compass,Code2,Flag,Utensils,Trophy,Sparkles,Clock3,Users,Ticket,CalendarDays,ExternalLink} from 'lucide-react';
import {event,eventState,applicationState,tiers,sponsors,faqs,schedule} from './event';
import OceanHero from './OceanHero';

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
function useTextReveals(reduced:boolean){
  useEffect(()=>{
    if(reduced||!('IntersectionObserver' in window))return;
    const elements=Array.from(document.querySelectorAll<HTMLElement>('.section h1,.section h2:not(:has(.reveal-word)),.reveal-word,.section h3,.section p,.section time,.section-label,.schedule-type,.section .text-link,.section .button,.facts strong,.facts span,.challenge-steps li>span,.site-footer p,.site-footer h2,.footer-column>a,.footer-bottom>span,.sponsor-logos figure'));
    const running:Animation[]=[];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target as HTMLElement;
      el.classList.remove('reveal-pending');
      const index=Number(el.dataset.revealOrder||0);
      running.push(el.animate([{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:el.classList.contains('reveal-word')?Math.min(Number(el.dataset.word)*55,330):(index%3)*55,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'}));
      observer.unobserve(el);
    }),{rootMargin:'0px 0px -35px 0px',threshold:0.08});
    elements.forEach((el,i)=>{el.dataset.revealOrder=String(i);if(el.getBoundingClientRect().top>innerHeight)el.classList.add('reveal-pending');observer.observe(el);});
    const focus=(e:FocusEvent)=>{const el=e.target as HTMLElement;el.classList.remove('reveal-pending');};
    document.addEventListener('focusin',focus);
    return()=>{observer.disconnect();running.forEach(a=>a.cancel());elements.forEach(el=>el.classList.remove('reveal-pending'));document.removeEventListener('focusin',focus);};
  },[reduced]);
}

function Intro({onEnd}:{onEnd:()=>void}){
  const [step,setStep]=useState(0);const skip=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    skip.current?.focus({preventScroll:true});
    const steps=setInterval(()=>setStep(s=>Math.min(s+1,3)),560);
    const finish=setTimeout(onEnd,2450);
    const previous=document.body.style.overflowY;document.body.style.overflowY='hidden';
    return()=>{clearInterval(steps);clearTimeout(finish);document.body.style.overflowY=previous;};
  },[onEnd]);
  return <div className="intro" role="dialog" aria-modal="true" aria-label="RIHS Hackathon introduction" onClick={onEnd} onKeyDown={e=>{if(e.key==='Escape')onEnd();}}>
    <div className="intro-water" aria-hidden="true"/><div className="intro-horizon" aria-hidden="true"><span/><span/><span/></div><div className="intro-coordinates" aria-hidden="true"><span>RIHS HACKATHON / LATHROP, CA</span><span>JAN 09 / 2027</span></div><div className="intro-caption" aria-hidden="true"><Waves size={24}/><span>INTO THE NEXT WAVE</span></div>
    {step<3?<span className="intro-word" key={step} aria-hidden="true">{['BUILD','SHIP','DEMO'][step]}</span>:<img className="intro-logo" src="/rihs-logo-transparent.png" alt={event.name}/>}
    <div className="intro-track" aria-hidden="true"><span/></div><span className="sr-only">Build. Ship. Demo.</span>
    <button ref={skip} className="intro-skip" onClick={onEnd}>Skip intro <ArrowRight size={18}/></button>
  </div>;
}

function Cursor({reduced}:{reduced:boolean}){
  const ring=useRef<HTMLDivElement>(null),dot=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(reduced||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    let x=-100,y=-100,rx=-100,ry=-100,hover=false,shown=false,frame=0,last=0;
    const move=(e:PointerEvent)=>{
      x=e.clientX;y=e.clientY;
      if(!shown){rx=x;ry=y;shown=true;}
      const target=e.target as HTMLElement;
      const native=!!target.closest('input,textarea,select,iframe,dialog,[contenteditable="true"]');
      hover=!!target.closest('a,button,summary');
      document.documentElement.classList.toggle('custom-cursor',!native);
      if(ring.current)ring.current.style.opacity=native?'0':'1';
      if(dot.current){dot.current.style.opacity=native?'0':'1';dot.current.style.transform=`translate3d(${x}px,${y}px,0)`;}
    };
    const leave=()=>{shown=false;document.documentElement.classList.remove('custom-cursor');if(ring.current)ring.current.style.opacity='0';if(dot.current)dot.current.style.opacity='0';};
    const render=(t:number)=>{frame=requestAnimationFrame(render);const dt=Math.min((t-last)/1000,.06);last=t;if(!shown)return;rx+=(x-rx)*(1-Math.exp(-dt*18));ry+=(y-ry)*(1-Math.exp(-dt*18));if(ring.current)ring.current.style.transform=`translate3d(${rx}px,${ry}px,0) scale(${hover?1.55:1})`;};
    document.addEventListener('pointermove',move);document.addEventListener('mouseleave',leave);window.addEventListener('blur',leave);frame=requestAnimationFrame(render);
    return()=>{cancelAnimationFrame(frame);document.removeEventListener('pointermove',move);document.removeEventListener('mouseleave',leave);window.removeEventListener('blur',leave);leave();};
  },[reduced]);
  return <><div className="cursor-ring" ref={ring} aria-hidden="true"/><div className="cursor-dot" ref={dot} aria-hidden="true"/></>;
}

function Brand(){return <a className="brand" href="/" aria-label="RIHS Hackathon home"><img src="/rihs-logo-transparent.png" alt="RIHS Hackathon" width="196" height="46"/></a>;}
function Header({page,reduced,locked,toggleMotion}:{page:Page;reduced:boolean;locked:boolean;toggleMotion:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false);
  useEffect(()=>{if(open&&!dialog.current?.open)dialog.current?.showModal();else if(!open&&dialog.current?.open)dialog.current.close();},[open]);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  const links=[['RIHS Hackathon','/'],['About','/#about'],['Register to Participate','/register/'],['Sponsor','/sponsor/'],['Theme','/#theme'],['Schedule','/#schedule'],['FAQ','/#faq'],['Contact','/contact/']];
  return <header className={'site-header '+(page==='home'?'on-ocean':'on-page')}>
    <div className="nav-inner"><Brand/>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,url])=><a href={url} key={url} className={url==='/register/'?'nav-register':url==='/sponsor/'?'nav-sponsor':''} aria-current={url===location.pathname?'page':undefined}>{label}</a>)}</nav>
      <div className="nav-actions">
        {page==='home'&&<button className="icon-button motion-toggle" disabled={locked} onClick={toggleMotion} aria-pressed={reduced} aria-label={locked?'Reduced motion follows your system preference':reduced?'Enable ocean animation':'Use reduced motion'}>{reduced?<Play size={17}/>:<Pause size={17}/>}</button>}
        <button ref={trigger} className="menu-trigger" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><span>Menu</span><Menu size={27} strokeWidth={1.5}/></button>
      </div>
    </div>
    <dialog ref={dialog} className="menu-dialog" aria-label="Site navigation" onCancel={close} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="menu-top"><span>RIHS Hackathon 2027</span><button className="icon-button" autoFocus aria-label="Close menu" onClick={close}><X/></button></div>
      <nav aria-label="Menu navigation">{links.map(([label,url])=><a key={label} href={url} className={url==='/register/'?'nav-register':url==='/sponsor/'?'nav-sponsor':''} onClick={close}>{label}<ArrowUpRight size={22}/></a>)}</nav>
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
  return <div className="facts">{facts.map(({icon:Icon,value,label})=><div key={value}><Icon size={20} strokeWidth={1.5}/><strong>{value}</strong><span>{label}</span></div>)}</div>;
}
function About(){return <section id="about" className="section about"><div className="section-heading"><h2><Words text="Build, learn,"/><br/><Words text="and show your work."/></h2><div><p>Spend a day turning an idea into something you can share. Build with others, learn in workshops, and get support from mentors.</p><p>Organized by the {event.organizer}. Everyone is welcome—you don’t need to attend RIHS, and you don’t need coding experience.</p></div></div><Facts/><p className="fact-note">Check-in begins at {event.checkIn}. Building runs {event.buildWindow} Pacific; submissions close at {event.submissionTime}.</p></section>;}
function Challenge(){return <section id="theme" className="section challenge"><div className="challenge-heading"><span className="section-label">The challenge</span><h2><Words text="It starts with water."/><br/><Words text="Where it goes is up to you."/></h2><p>The specific prompt is revealed at the opening ceremony. Presentations, websites, apps, games—choose the format that fits your idea.</p></div><ol className="challenge-steps"><li><span>01</span><h3>Meet the prompt.</h3><p>A water-related challenge, unveiled at 9am.</p></li><li><span>02</span><h3>Make it yours.</h3><p>Build a finished project and submit by {event.submissionTime}.</p></li><li><span>03</span><h3>Show what you made.</h3><p>Present your project for judging by industry mentors.</p></li></ol></section>;}
function Schedule(){const icons=[Compass,Flag,Code2,Flag,Utensils,Sparkles,Trophy,Waves];return <section id="schedule" className="section schedule"><div className="schedule-heading"><span className="section-label">The run of the day</span><h2><Words text="Your day"/><br/><Words text="at RIHS"/><span className="accent-dot">.</span></h2><p>{event.dateLabel}<br/>All times Pacific.</p><div className="schedule-stamp" aria-hidden="true"><Clock3/><span>ONE DAY.<br/>MAKE IT COUNT.</span></div></div><div className="schedule-list">{schedule.map((item,i)=>{const Icon=icons[i];return <article key={item.time} className={i===2?'build-session':i===3?'submission-session':''}><span className="timeline-node" aria-hidden="true"><Icon size={18}/></span><time>{item.time}</time><div><span className="schedule-type">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p></div></article>})}</div></section>;}

function SponsorDisplay({compact=false}:{compact?:boolean}){
  const visible=sponsors.filter(s=>s.confirmationStatus==='confirmed'||preview).sort((a,b)=>a.displayOrder-b.displayOrder);
  return <section id="our-sponsors" className={'section our-sponsors '+(compact?'compact':'')} aria-label="Our sponsors"><h2 className="sr-only">Our sponsors</h2><div className="sponsor-logos">{visible.map(s=><figure key={s.name}><a href={s.website} target="_blank" rel="noopener noreferrer" aria-label={s.name+' website'}>{s.name==='Markivia Digital'?<span className="markivia-wordmark" role="img" aria-label="Markivia Digital"><span>MARKIVIA</span><small>DIGITAL</small></span>:<img src={s.logo} alt={s.name} width="76" height="77" loading="lazy"/>}</a></figure>)}</div><a className="text-link" href="/sponsor/#apply">Apply to be a Sponsor <ArrowUpRight size={18}/></a></section>;
}

function FAQ(){const [open,setOpen]=useState<number|null>(null);return <section id="faq" className="section faq"><div><span className="section-label">The need-to-knows</span><h2><Words text="Good questions."/><br/><Words text="Clear answers"/><span className="accent-dot">.</span></h2><p>Still have a question?<br/><a href="/contact/">Get in touch <ArrowUpRight size={14}/></a></p></div><div className="faq-list">{faqs.map(([q,a],i)=><div className="faq-item" key={q}><h3><button aria-expanded={open===i} aria-controls={'answer-'+i} id={'question-'+i} onClick={()=>setOpen(open===i?null:i)}><span className="faq-number" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span className="faq-question">{q}</span>{open===i?<Minus size={17}/>:<Plus size={17}/>}</button></h3><div id={'answer-'+i} role="region" aria-labelledby={'question-'+i} hidden={open!==i}><p>{a}{i===9&&<> <a href="/register/">Register here <ArrowUpRight size={14}/></a></>}</p></div></div>)}</div></section>;}
function Venue(){return <section id="venue" className="section venue"><div className="venue-art" aria-hidden="true"><Waves/><span>RIHS<br/>2027</span><ArrowUpRight/></div><div className="venue-copy"><p className="section-label">January 9. Your next big idea.</p><h2><Words text="Make something"/><br/><Words text="that makes waves."/></h2><p className="venue-address"><MapPin size={18}/><span>{event.school} · {event.venueRoom}<br/>{event.address}</span></p><div className="venue-actions"><a className="button" href="/register/">Save your spot <ArrowUpRight size={22}/></a><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={18}/></a></div><p className="venue-deadline">Free to join · 100 spots · Apply by {event.deadlineLabel}</p></div></section>;}

function FormArea({kind}:{kind:'participant'|'sponsor'}){
  const now=useNow(),state=applicationState(kind,now),form=event[kind];
  const participant=kind==='participant',label=participant?'Participant registration':'Sponsorship application';
  return <section id="apply" className="application-section section" aria-labelledby="form-heading"><div className="application-intro"><span className="section-label">{participant?'YOUR NEXT STEP':'JOIN THE MISSION'}</span><h2 id="form-heading">{participant?<>Ready when<br/>you are.</>:<>Let’s make<br/>it happen.</>}</h2><p>Application deadline<br/><strong>{event.deadlineLabel}</strong></p><p>{event.shortDate} · {event.timeLabel}</p></div><div className="application-action"><span className="form-step"><ExternalLink size={17}/> GOOGLE FORMS</span>{state==='closed'?<><h3>Applications have closed.</h3><p>The application deadline was {event.deadlineLabel}. Contact our advisor for questions.</p><a className="button" href="/contact/">Contact the team <ArrowUpRight size={18}/></a></>:<><h3>{label}</h3><p>{participant?'Complete the participant form to apply for your place. Everyone is welcome, including beginners and students from other schools.':'Tell us about your organization and how you’d like to support the event. Explore the tiers above or propose a custom partnership.'}</p><div className="application-actions"><a className="button" href={form.url||'/contact/'} target={form.url?'_blank':undefined} rel={form.url?'noopener noreferrer':undefined}>{participant?'Open registration form':'Open sponsorship form'} <ArrowUpRight size={21}/></a><a className="form-contact" href="/contact/">Questions? Contact the team <ArrowUpRight size={17}/></a></div><p className="form-note">The form opens in a new tab. If you need help accessing it, <a href="/contact/">get in touch</a>.</p></>}{state==='deadline-day'&&<p className="deadline-day" role="status">Applications are due today. Contact our advisor for the exact cutoff time.</p>}</div></section>;
}

function PageHero({kind}:{kind:'register'|'sponsor'}){const register=kind==='register';return <section className={'page-intro section '+(register?'registration-intro':'sponsor-intro')}><div className="page-intro-content"><a className="back-link" href="/"><ArrowDown size={14}/> RIHS Hackathon 2027</a><p className="section-label">{register?'YOUR NEXT BUILD STARTS HERE':'BACK THE NEXT GENERATION'}</p><h1>{register?<>Bring your idea.<br/><span>Make your mark.</span></>:<>Big ideas.<br/><span>Real impact.</span></>}</h1><p>{register?'One day. A water-inspired challenge. A hundred people ready to make something. Beginners, solo builders, and teams—all welcome.':'Help 100 students turn their ideas into something real. Support a day of building, learning, and discovery at River Islands High School.'}</p><div className="page-intro-actions"><a className="button" href={register?event.participant.url||'#apply':event.sponsor.url||'#apply'} target="_blank" rel="noopener noreferrer">{register?'Register to Participate':'Apply to be a Sponsor'} <ArrowUpRight size={19}/></a>{!register&&<a className="text-link" href="/downloads/rihs-sponsorship-guide.pdf" download>Sponsorship guide <Download size={18}/></a>}</div><p className="page-deadline">Apply by {event.deadlineLabel}</p></div><div className="page-hero-visual" aria-hidden="true"><Waves className="visual-waves"/><span className="visual-number">{register?'09':'100'}</span><span className="visual-caption">{register?'JANUARY 2027':'STUDENTS. REAL POSSIBILITIES.'}</span><div className="visual-bottom"><span>{register?'9AM—3PM / PACIFIC':'FIVE WAYS TO MAKE A DIFFERENCE'}</span><ArrowUpRight/></div></div></section>;}
function RegisterPage(){return <><PageHero kind="register"/><div className="section registration-details"><Facts/><div className="registration-notes"><div><h2>Bring the essentials.</h2><p>Laptop, charger, any hardware you want to use, a water bottle, and a photo ID for check-in.</p></div><div><h2>Find your way.</h2><p>{event.school} · {event.venueRoom}<br/>{event.address}<br/>Check-in {event.checkIn} · Event {event.timeLabel}</p><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={16}/></a></div></div></div><FormArea kind="participant"/></>;}
function SponsorPage(){return <><PageHero kind="sponsor"/><section className="section sponsor-tiers"><div className="tiers-heading"><h2>Find your level<br/>of support.</h2><p>Each tier builds on the one before it. Explore the benefits and conditions below.</p></div>{tiers.map((tier,i)=><details className="tier" key={tier.name} open={i===2}><summary><span className="tier-number">0{i+1}</span><span className="tier-name">{tier.name}{tier.tag&&<small>{tier.tag}</small>}</span><span className="tier-price">{tier.price}</span><span className="tier-action">View benefits <Plus size={19} className="tier-plus"/></span></summary><div className="tier-benefits">{tier.inherits&&<p>Everything in {tier.inherits}, plus:</p>}<ul>{tier.benefits.map(b=><li key={b}>{b}</li>)}</ul></div></details>)}<div className="in-kind"><div className="in-kind-heading"><span className="section-label">BEYOND A SPONSORSHIP TIER</span><h3>There’s more than<br/>one way to help.</h3><p>Bring what you do best. We welcome custom and in-kind partnerships.</p><a className="text-link" href="/contact/">Discuss a partnership <ArrowUpRight size={18}/></a></div><div><ul className="in-kind-options"><li><Utensils/><span>Food & refreshments</span></li><li><Trophy/><span>Prizes & gift cards</span></li><li><Code2/><span>Equipment, software & cloud credits</span></li><li><Ticket/><span>T-shirts, printing & event materials</span></li><li><Users/><span>Workshops & career presentations</span></li><li><Sparkles/><span>Technical resources & other services</span></li></ul><p className="in-kind-conditions">School approval, production deadlines, and approval of promotional materials, displays, talks, and activities apply as specified in each tier.</p></div></div></section><SponsorDisplay/><FormArea kind="sponsor"/></>;}

function ContactPage(){const [copied,setCopied]=useState('');const copy=async()=>{try{await navigator.clipboard.writeText(event.email);setCopied('Email copied.');}catch{setCopied('Select the email address above to copy it.');}};return <><section className="section contact-intro"><div className="contact-headline"><span className="section-label">CONTACT THE TEAM</span><h1>A question?<br/><span>We’re all ears.</span></h1><p>Whether you’re building, sponsoring, or figuring out your first hackathon, we’ll help you find your next step.</p><div className="contact-event"><CalendarDays size={19}/><span>{event.shortDate} · {event.school}</span></div></div><div className="contact-direct"><Mail size={30} strokeWidth={1.3}/><span className="contact-direct-label">YOUR CONTACT AT RIHS</span><h2>Let’s talk.</h2><p>Reach our faculty advisor for event questions and registration or sponsorship support.</p><a className="contact-email" href={'mailto:'+event.email}>{event.email}<ArrowUpRight/></a><div className="contact-email-actions"><a className="button" href={'mailto:'+event.email}>Write an email <ArrowUpRight size={18}/></a><button className="copy-email" onClick={copy}>Copy address</button></div><p className="copy-status" role="status">{copied}</p></div></section><section className="section contact-options"><div><span>01 / PARTICIPATE</span><h2>Come build with us.</h2><p>Free participation. Beginner friendly. One day to make something worth sharing.</p><a className="text-link" href={event.participant.url||'/register/'} target="_blank" rel="noopener noreferrer">Open registration form <ArrowUpRight size={18}/></a></div><div><span>02 / PARTNER</span><h2>Support the event.</h2><p>Choose a sponsorship tier or tell us about another way you’d like to contribute.</p><a className="text-link" href={event.sponsor.url||'/sponsor/'} target="_blank" rel="noopener noreferrer">Open sponsorship form <ArrowUpRight size={18}/></a></div><div><span>03 / FIND US</span><h2>See you at RIHS.</h2><p>{event.school} · {event.venueRoom}<br/>{event.address}</p><a className="text-link" href={event.directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={18}/></a></div></section></>;}

function Footer(){
  return <footer id="footer" className="site-footer"><div className="footer-main"><div className="footer-identity"><Brand/><p>© {new Date().getFullYear()} {event.organizer}.<br/>{event.school}<br/>{event.address}</p></div><div className="footer-column"><h2>Explore</h2><a href="/#about">About</a><a href="/#theme">Theme</a><a href="/#schedule">Schedule</a><a href="/#faq">FAQ</a></div><div className="footer-column"><h2>Get involved</h2><a href="/register/">Register to Participate</a><a href="/sponsor/">Sponsor Us</a><a href="/downloads/rihs-sponsorship-guide.pdf" download>Sponsorship guide</a></div><div className="footer-column"><h2>Contact</h2><a href="/contact/">Get in touch</a><a href={'mailto:'+event.email}>{event.email}</a><a href={event.directions} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight size={13}/></a></div></div><div className="footer-bottom"><span>{event.shortDate} · {event.timeLabel}</span><span>Participant & sponsor deadline: {event.deadlineLabel}</span></div></footer>;
}

export default function App(){
  const system=useReducedMotion();
  const [user,setUser]=useState(()=>{try{return localStorage.getItem('rihs.motion')==='reduced';}catch{return false;}});
  const reduced=system||user;
  useTextReveals(reduced);
  const toggleMotion=()=>{const next=!user;setUser(next);try{localStorage.setItem('rihs.motion',next?'reduced':'full');}catch{}};
  const [intro,setIntro]=useState(()=>{try{return currentPage==='home'&&!sessionStorage.getItem('rihs:intro-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash;}catch{return false;}});
  const end=useRef(()=>{try{sessionStorage.setItem('rihs:intro-seen','1');}catch{}setIntro(false);});
  useEffect(()=>{document.documentElement.dataset.motion=reduced?'reduced':'full';if(reduced)setIntro(false);},[reduced]);
  useEffect(()=>{
    const syncPreferences=()=>{try{setUser(localStorage.getItem('rihs.motion')==='reduced');}catch{}};
    window.addEventListener('pageshow',syncPreferences);window.addEventListener('storage',syncPreferences);
    return()=>{window.removeEventListener('pageshow',syncPreferences);window.removeEventListener('storage',syncPreferences);};
  },[]);
  useEffect(()=>{
    if(!location.hash)return;
    let disposed=false,frame=0;
    const restoreAnchor=()=>{if(disposed)return;const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)frame=requestAnimationFrame(()=>target.scrollIntoView({behavior:'instant',block:'start'}));};
    restoreAnchor();document.fonts.ready.then(restoreAnchor);
    return()=>{disposed=true;cancelAnimationFrame(frame);};
  },[]);
  return <>{intro&&<Intro onEnd={end.current}/>}<div className={'site-shell page-'+currentPage} inert={intro||undefined}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Cursor reduced={reduced}/>
    <Header page={currentPage} reduced={reduced} locked={system} toggleMotion={toggleMotion}/>
    <main id="main" tabIndex={-1}>{currentPage==='home'?<><OceanHero reduced={reduced}><Countdown/></OceanHero><About/><Challenge/><Schedule/><SponsorDisplay compact/><FAQ/><Venue/></>:currentPage==='register'?<RegisterPage/>:currentPage==='sponsor'?<SponsorPage/>:<ContactPage/>}</main>
    <Footer/>
  </div></>;
}
