import {useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {event} from './event';
gsap.registerPlugin(ScrollTrigger);

export default function OceanHero({reduced,children}:{reduced:boolean;children:React.ReactNode}) {
  const section=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const [failed,setFailed]=useState(false);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    if(reduced||failed||!section.current||!video.current)return;
    const media=video.current;
    const primary=section.current.querySelector<HTMLElement>('.hero-primary')!;
    const note=section.current.querySelector<HTMLElement>('.dive-note')!;
    const exit=section.current.querySelector<HTMLElement>('.hero-transition')!;
    let progress=0,mode:'idle'|'scroll'='idle',entryTime=0,desired=0,smoothed=0;
    let raf=0,last=0,looping=false,disposed=false,inView=true;
    const duration=()=>Math.max(0,(Number.isFinite(media.duration)?media.duration:10)-.045);
    const play=()=>{if(!disposed&&!document.hidden&&inView)media.play().catch(()=>{/* The poster remains available when autoplay is blocked. */});};
    const idle=()=>{
      if(mode!=='idle'||looping||media.currentTime<1.55)return;
      looping=true;
      media.pause();
      gsap.to(media,{opacity:0,duration:.18,ease:'none',onComplete:()=>{
        if(disposed||mode!=='idle')return;
        media.currentTime=0;
        play();
        gsap.to(media,{opacity:1,duration:.18,ease:'none',onComplete:()=>{looping=false;}});
      }});
    };
    const loaded=()=>{setReady(true);if(mode==='idle'){media.playbackRate=.65;play();}else{smoothed=entryTime+(duration()-entryTime)*progress;media.currentTime=smoothed;}};
    const update=(p:number)=>{
      progress=p;
      if(p>.001&&mode==='idle'){
        entryTime=Math.min(media.currentTime,1.55);
        mode='scroll';looping=false;media.pause();
        smoothed=media.currentTime;
        gsap.killTweensOf(media);media.style.opacity='1';
      }
      primary.style.opacity=String(1-gsap.utils.clamp(0,1,p/.26));
      primary.style.transform=`translateY(${-Math.min(p/.26,1)*28}px)`;
      primary.inert=p>.25;
      primary.setAttribute('aria-hidden',String(primary.inert));
      const noteAlpha=gsap.utils.clamp(0,1,(p-.5)/.14)*(1-gsap.utils.clamp(0,1,(p-.83)/.12));
      note.style.opacity=String(noteAlpha);
      exit.style.opacity=String(gsap.utils.clamp(0,1,(p-.84)/.16));
    };
    const trigger=ScrollTrigger.create({trigger:section.current,start:'top top',end:'bottom bottom',onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)});
    const render=(t:number)=>{
      raf=requestAnimationFrame(render);
      const dt=Math.min((t-last)/1000,.06);last=t;
      if(document.hidden||!inView||mode!=='scroll'||media.readyState<2)return;
      desired=Math.min(duration(),entryTime+(duration()-entryTime)*progress);
      smoothed+= (desired-smoothed)*(1-Math.exp(-dt*13));
      if(!media.seeking&&Math.abs(media.currentTime-smoothed)>1/48)media.currentTime=Math.max(0,Math.min(duration(),smoothed));
      if(progress<=.001&&Math.abs(smoothed-entryTime)<.055){mode='idle';media.playbackRate=.65;play();}
    };
    const visibility=()=>{last=performance.now();if(document.hidden)media.pause();else if(mode==='idle')play();};
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)media.pause();else if(mode==='idle')play();});
    observer.observe(section.current);
    media.addEventListener('loadeddata',loaded);
    media.addEventListener('timeupdate',idle);
    document.addEventListener('visibilitychange',visibility);
    if(media.readyState>=2)loaded();
    raf=requestAnimationFrame(render);
    const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
    return()=>{
      disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(refresh);observer.disconnect();trigger.kill();gsap.killTweensOf(media);media.pause();
      media.removeEventListener('loadeddata',loaded);media.removeEventListener('timeupdate',idle);document.removeEventListener('visibilitychange',visibility);
      primary.inert=false;primary.removeAttribute('aria-hidden');primary.removeAttribute('style');note.removeAttribute('style');exit.removeAttribute('style');
    };
  },[reduced,failed]);

  return <section ref={section} id="top" className={'ocean-journey '+(reduced||failed?'static-journey':'')} aria-labelledby="hero-title">
    <div className="ocean-stage">
      <img className="ocean-poster" src="/media/ocean-poster.webp" alt="" fetchPriority="high" width="1280" height="720"/>
      {!reduced&&!failed&&<video ref={video} className={'ocean-video '+(ready?'ready':'')} src="/media/ocean.mp4" poster="/media/ocean-poster.webp" playsInline muted preload="auto" aria-hidden="true" onError={()=>setFailed(true)}/>}
      <div className="ocean-shade"/>
      <div className="hero-primary">
        <div className="hero-copy">
          <p className="hero-date">{event.shortDate} · 9am–3pm Pacific</p>
          <h1 id="hero-title">RIHS Hackathon<br/><span>2027.</span></h1>
          <p className="hero-description">A day of building, learning, and making ideas real.<br className="desktop-break"/> {event.school}, Lathrop.</p>
          <div className="hero-actions"><a className="button hero-button" href="/register/">Register to Participate <ArrowUpRight size={17}/></a><a className="hero-sponsor" href="/sponsor/">Sponsor Us <ArrowUpRight size={17}/></a></div>
          <p className="hero-deadline">Participant & sponsor deadline: {event.deadlineLabel}</p>
        </div>
        {children}
      </div>
      <div className="dive-note" aria-hidden="true"><span>A world of water.</span><p>A challenge worth<br/>diving into.</p></div>
      <div className="hero-transition"/>
      {!reduced&&!failed&&<div className="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><ArrowDown size={16}/></div>}
    </div>
  </section>;
}
