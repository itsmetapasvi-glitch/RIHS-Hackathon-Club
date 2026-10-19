import {useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {event} from './event';
import OceanStory,{updateOceanStory} from './OceanStory';
import OceanArrival from './OceanArrival';
gsap.registerPlugin(ScrollTrigger);

export default function OceanHero({reduced,children,arrival}:{reduced:boolean;children:React.ReactNode;arrival:React.ReactNode}) {
  const section=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const surfaceVideo=useRef<HTMLVideoElement>(null);
  const [failed,setFailed]=useState(false);
  const [surfaceFailed,setSurfaceFailed]=useState(false);
  const [surfaceReady,setSurfaceReady]=useState(false);

  useEffect(()=>{
    if(reduced||failed||!section.current||!video.current)return;
    const root=section.current,media=video.current,surface=surfaceVideo.current;
    const primary=root.querySelector<HTMLElement>('.hero-primary')!;
    const note=root.querySelector<HTMLElement>('.dive-note')!;
    const exit=root.querySelector<HTMLElement>('.hero-transition')!;
    let progress=0,mode:'surface'|'scroll'='surface';
    let raf=0,disposed=false,inView=true,complete=false;
    const context=gsap.context(()=>{},root);
    const duration=()=>Math.max(0,(Number.isFinite(media.duration)?media.duration:10)-.001);
    const publishCompletion=(value:boolean)=>{
      if(value===complete)return;
      complete=value;root.dataset.oceanComplete=String(value);
      root.dispatchEvent(new CustomEvent('rihs:ocean-ready',{detail:value}));
    };
    const playSurface=()=>{
      if(surface&&!disposed&&!document.hidden&&inView&&mode==='surface')surface.play().catch(()=>{/* Keep the supplied hero poster if autoplay is blocked. */});
    };
    const blend=()=>{
      if(mode==='scroll'&&media.readyState<2)return;
      const scrolling=mode==='scroll';
      if(!scrolling)playSurface();
      context.add(()=>{
        gsap.to(media,{opacity:scrolling?1:0,duration:.22,ease:'none',overwrite:true});
        if(surface)gsap.to(surface,{opacity:scrolling?0:surface.readyState>=2?1:0,duration:.22,ease:'none',overwrite:true,onComplete:()=>{if(mode==='scroll')surface.pause();}});
      });
    };
    const update=(p:number)=>{
      progress=p;
      if(p<.999)publishCompletion(false);
      const next=p>.001?'scroll':'surface';
      if(next!==mode){
        mode=next;root.dataset.videoMode=mode;
        media.pause();
        if(mode==='surface'&&media.readyState>=1)media.currentTime=0;
        blend();
      }
      primary.style.opacity=String(1-gsap.utils.clamp(0,1,p/.18));
      primary.style.transform=`translateY(${-Math.min(p/.18,1)*28}px)`;
      primary.inert=p>.18;
      primary.setAttribute('aria-hidden',String(primary.inert));
      updateOceanStory(note,p);
      exit.style.opacity=String(gsap.utils.clamp(0,1,(p-.84)/.16));
    };
    const scrollLoaded=()=>{media.pause();blend();};
    const surfaceLoaded=()=>{
      setSurfaceReady(true);
      blend();
      playSurface();
    };
    root.dataset.videoMode='surface';root.dataset.oceanComplete='false';
    context.add(()=>{ScrollTrigger.create({trigger:root,start:'top top',endTrigger:root.querySelector('.ocean-arrival'),end:'top top',onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)});});
    const render=()=>{
      raf=requestAnimationFrame(render);
      if(document.hidden||!inView||mode!=='scroll'||media.readyState<2)return;
      const desired=Math.min(duration(),duration()*progress);
      // Lenis already smooths input. Seek to the latest position without a second lagging clock.
      if(!media.seeking&&Math.abs(media.currentTime-desired)>1/48)media.currentTime=desired;
      if(progress>=.999&&!media.seeking&&media.currentTime>=duration()-1/24)publishCompletion(true);
    };
    const visibility=()=>{if(document.hidden){surface?.pause();media.pause();}else playSurface();};
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView){surface?.pause();media.pause();}else playSurface();});
    observer.observe(root);
    media.addEventListener('loadeddata',scrollLoaded);
    surface?.addEventListener('loadeddata',surfaceLoaded);
    document.addEventListener('visibilitychange',visibility);
    if(media.readyState>=2)scrollLoaded();
    if(surface&&surface.readyState>=2)surfaceLoaded();
    raf=requestAnimationFrame(render);
    const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
    return()=>{
      disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(refresh);observer.disconnect();context.revert();media.pause();surface?.pause();
      media.removeEventListener('loadeddata',scrollLoaded);surface?.removeEventListener('loadeddata',surfaceLoaded);document.removeEventListener('visibilitychange',visibility);
      primary.inert=false;primary.removeAttribute('aria-hidden');primary.removeAttribute('style');note.removeAttribute('style');note.querySelectorAll('.dive-chapter').forEach(el=>el.removeAttribute('style'));exit.removeAttribute('style');media.removeAttribute('style');surface?.removeAttribute('style');delete root.dataset.videoMode;delete root.dataset.oceanComplete;
    };
  },[reduced,failed,surfaceFailed]);

  return <section ref={section} id="top" className={'ocean-journey '+(reduced||failed?'static-journey':'')} aria-labelledby="hero-title">
    <div className="ocean-stage">
      <img className="ocean-poster" src="/media/hero-surface-poster.webp" alt="" fetchPriority="high" width="1280" height="720"/>
      {!reduced&&!failed&&<><video ref={video} className="ocean-video scroll-ocean" src="/media/ocean.mp4" poster="/media/ocean-poster.webp" playsInline muted preload="auto" aria-hidden="true" onError={()=>setFailed(true)}/>{!surfaceFailed&&<video ref={surfaceVideo} className={'ocean-video hero-surface '+(surfaceReady?'ready':'')} src="/media/hero-surface.mp4" poster="/media/hero-surface-poster.webp" playsInline muted loop preload="auto" aria-hidden="true" onError={()=>setSurfaceFailed(true)}/>}</>}
      <div className="ocean-shade"/>
      <div className="hero-primary">
        <div className="hero-copy">
          <p className="hero-date">{event.shortDate} · 9am–3pm Pacific</p>
          <h1 id="hero-title">RIHS Hackathon<br/><span>2027.</span></h1>
          <p className="hero-description">A day of building, learning, and making ideas real.<br className="desktop-break"/> {event.school}, Lathrop.</p>
          <div className="hero-actions"><a className="button hero-button" href="/register/">Register to Participate <ArrowUpRight aria-hidden="true" size={17}/></a><a className="hero-sponsor" href="/sponsor/">Sponsor Us <ArrowUpRight aria-hidden="true" size={17}/></a></div>
          <p className="hero-deadline">Participant & sponsor deadline: {event.deadlineLabel}</p>
        </div>
        {children}
      </div>
      <OceanStory/>
      <div className="hero-transition"/>
      {!reduced&&!failed&&<div className="scroll-cue" aria-hidden="true"><span>Scroll to explore</span><ArrowDown aria-hidden="true" size={16}/></div>}
    </div>
    {!reduced&&!failed&&<div className="ocean-scroll-track" aria-hidden="true"/>}
    <OceanArrival reduced={reduced||failed}>{arrival}</OceanArrival>
  </section>;
}
