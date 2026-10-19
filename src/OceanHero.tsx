import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {event} from './event';
import OceanStory,{updateOceanStory} from './OceanStory';
import OceanArrival from './OceanArrival';
import {hasSceneEntry} from './navigation';
gsap.registerPlugin(ScrollTrigger);

export default function OceanHero({reduced,children,arrival}:{reduced:boolean;children:React.ReactNode;arrival:React.ReactNode}) {
  const section=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const surfaceVideo=useRef<HTMLVideoElement>(null);
  const [failed,setFailed]=useState(false);
  const [surfaceFailed,setSurfaceFailed]=useState(false);
  const [surfaceReady,setSurfaceReady]=useState(false);
  const [portrait,setPortrait]=useState(()=>matchMedia('(max-width: 800px) and (max-aspect-ratio: 3/4)').matches);
  useEffect(()=>{
    const query=matchMedia('(max-width: 800px) and (max-aspect-ratio: 3/4)');
    const change=()=>setPortrait(query.matches);
    query.addEventListener('change',change);return()=>query.removeEventListener('change',change);
  },[]);

  useLayoutEffect(()=>{
    if(reduced||failed||!section.current||!video.current)return;
    const root=section.current,media=video.current,surface=surfaceVideo.current;
    const primary=root.querySelector<HTMLElement>('.hero-primary')!;
    const note=root.querySelector<HTMLElement>('.dive-note')!;
    let progress=0,mode:'surface'|'scroll'=hasSceneEntry?'scroll':'surface';
    let blended:'surface'|'scroll'|null=null,raf=0,disposed=false,inView=true,awaitingEntry=hasSceneEntry;
    const context=gsap.context(()=>{},root);
    const duration=()=>Math.max(0,(Number.isFinite(media.duration)?media.duration:10)-.001);
    const playSurface=()=>{
      if(surface&&!disposed&&!document.hidden&&inView&&mode==='surface')surface.play().catch(()=>{/* Poster remains when autoplay is unavailable. */});
    };
    const blend=()=>{
      if(mode==='scroll'&&(media.readyState<2||media.seeking))return;
      if(blended===mode)return;
      blended=mode;
      const scrolling=mode==='scroll';
      if(!scrolling)playSurface();
      context.add(()=>{
        gsap.to(media,{opacity:scrolling?1:0,duration:.18,ease:'none',overwrite:true});
        if(surface)gsap.to(surface,{opacity:scrolling?0:surface.readyState>=2?1:0,duration:.18,ease:'none',overwrite:true,onComplete:()=>{if(mode==='scroll')surface.pause();}});
      });
    };
    const seekLatest=()=>{
      raf=0;
      if(disposed||document.hidden||!inView||mode!=='scroll'||media.readyState<1||media.seeking)return;
      const desired=duration()*progress;
      if(Math.abs(media.currentTime-desired)>1/48){media.currentTime=desired;root.dataset.videoSeeking='true';}
      else {root.dataset.videoSeeking='false';root.dataset.oceanComplete=String(progress>=.999);blend();}
    };
    const queueSeek=()=>{if(!raf&&!disposed&&inView&&!document.hidden&&mode==='scroll')raf=requestAnimationFrame(seekLatest);};
    const seeked=()=>{
      root.dataset.videoSeeking='false';
      if(Math.abs(media.currentTime-duration()*progress)>1/48)queueSeek();else blend();
    };
    const update=(p:number)=>{
      if(awaitingEntry&&p===0)return;
      awaitingEntry=false;
      root.style.setProperty('--content-shade',String(gsap.utils.clamp(0,.7,(p-.9)/.1*.7)));
      const next=p>.001?'scroll':'surface';
      if(next!==mode){
        mode=next;root.dataset.videoMode=mode;
        if(mode==='surface'){cancelAnimationFrame(raf);raf=0;blend();}
        else {surface?.pause();media.preload='auto';queueSeek();}
      }
      primary.style.opacity=String(1-gsap.utils.clamp(0,1,p/.18));
      primary.style.transform=`translateY(${-Math.round(Math.min(p/.18,1)*28)}px)`;
      primary.inert=p>.18;primary.setAttribute('aria-hidden',String(primary.inert));
      updateOceanStory(note,p);
    };
    const scrollLoaded=()=>{media.pause();queueSeek();};
    const surfaceLoaded=()=>{setSurfaceReady(true);if(mode==='surface'){blended=null;blend();playSurface();}};
    root.dataset.videoMode=mode;root.dataset.oceanComplete='false';
    context.add(()=>{
      ScrollTrigger.create({trigger:root,start:'top top',endTrigger:root.querySelector('.ocean-arrival'),end:'top top',onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)});
      const seekProgress=(p:number)=>{progress=p;root.dataset.oceanProgress=p.toFixed(4);queueSeek();};
      ScrollTrigger.create({trigger:root,start:'top top',end:'bottom top',onUpdate:self=>seekProgress(self.progress),onRefresh:self=>seekProgress(self.progress)});
    });
    const synchronize=()=>{const rect=root.getBoundingClientRect();inView=rect.bottom>0&&rect.top<innerHeight;cancelAnimationFrame(raf);seekLatest();};
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;surface?.pause();}else {playSurface();queueSeek();}};
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView){cancelAnimationFrame(raf);raf=0;surface?.pause();}else {playSurface();queueSeek();}});
    observer.observe(root);
    media.addEventListener('loadedmetadata',scrollLoaded);media.addEventListener('loadeddata',scrollLoaded);media.addEventListener('seeked',seeked);
    surface?.addEventListener('loadeddata',surfaceLoaded);document.addEventListener('visibilitychange',visibility);document.addEventListener('rihs:sync-scene',synchronize);
    if(media.readyState>=1)scrollLoaded();
    if(surface&&surface.readyState>=2)surfaceLoaded();
    if(mode==='surface')blend();
    return()=>{
      disposed=true;cancelAnimationFrame(raf);observer.disconnect();context.revert();media.pause();surface?.pause();
      media.removeEventListener('loadedmetadata',scrollLoaded);media.removeEventListener('loadeddata',scrollLoaded);media.removeEventListener('seeked',seeked);surface?.removeEventListener('loadeddata',surfaceLoaded);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('rihs:sync-scene',synchronize);
      primary.inert=false;primary.removeAttribute('aria-hidden');primary.removeAttribute('style');note.removeAttribute('style');note.querySelectorAll('.dive-chapter').forEach(el=>el.removeAttribute('style'));media.removeAttribute('style');surface?.removeAttribute('style');delete root.dataset.videoMode;delete root.dataset.oceanComplete;delete root.dataset.oceanProgress;delete root.dataset.videoSeeking;root.style.removeProperty('--content-shade');
    };
  },[reduced,failed,surfaceFailed,portrait]);

  return <section ref={section} id="top" className={'ocean-journey '+(reduced||failed?'static-journey':'')} aria-labelledby="hero-title">
    <div className="ocean-stage">
      <img className="ocean-poster" src="/media/hero-surface-poster.webp" alt="" fetchPriority="high" width="1280" height="720"/>
      {!reduced&&!failed&&<><video ref={video} className="ocean-video scroll-ocean" src={portrait?'/media/ocean-portrait.mp4':'/media/ocean.mp4'} poster="/media/ocean-poster.webp" playsInline muted preload={hasSceneEntry?'auto':'metadata'} aria-hidden="true" onError={()=>setFailed(true)}/>{!surfaceFailed&&<video ref={surfaceVideo} className={'ocean-video hero-surface '+(surfaceReady?'ready':'')} src={portrait?'/media/hero-surface-portrait.mp4':'/media/hero-surface.mp4'} poster="/media/hero-surface-poster.webp" playsInline muted loop preload={hasSceneEntry?'none':'auto'} aria-hidden="true" onError={()=>setSurfaceFailed(true)}/>}</>}
      <div className="ocean-shade"/><div className="ocean-content-shade" aria-hidden="true"/>
      <div className="hero-primary">
        <div className="hero-copy">
          <p className="hero-date">{event.shortDate} · 9am–3pm Pacific</p>
          <h1 id="hero-title">RIHS Hackathon<br/><span>2027</span></h1>
          <p className="hero-description">A day of building, learning, and making ideas real.<br className="desktop-break"/> {event.school}, Lathrop.</p>
          <div className="hero-actions"><a className="button hero-button" href="/register/">Register to Participate <ArrowUpRight aria-hidden="true" size={17}/></a><a className="hero-sponsor" href="/sponsor/">Sponsor Us <ArrowUpRight aria-hidden="true" size={17}/></a></div>
          <p className="hero-deadline">Participant & sponsor deadline: {event.deadlineLabel}</p>
        </div>
        {children}
      </div>
      <OceanStory/>
      <div className="hero-transition"/>
    </div>
    {!reduced&&!failed&&<div className="ocean-scroll-track" aria-hidden="true"/>}
    <OceanArrival reduced={reduced||failed}>{arrival}</OceanArrival>
    <div className="ocean-end-blend" aria-hidden="true"/>
  </section>;
}
