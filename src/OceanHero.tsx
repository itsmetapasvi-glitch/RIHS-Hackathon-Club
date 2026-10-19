import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {event} from './event';
import OceanStory,{updateOceanStory} from './OceanStory';
import OceanArrival from './OceanArrival';
import {hasSceneEntry,isEntryPending} from './navigation';
import {createOceanFrames} from './ocean-frames';
gsap.registerPlugin(ScrollTrigger);

export default function OceanHero({reduced,mobile,children,arrival}:{reduced:boolean;mobile:boolean;children:React.ReactNode;arrival:React.ReactNode}) {
  const section=useRef<HTMLElement>(null);
  const video=useRef<HTMLVideoElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const surfaceVideo=useRef<HTMLVideoElement>(null);
  const [failed,setFailed]=useState(false);
  const [surfaceFailed,setSurfaceFailed]=useState(false);
  const [surfaceReady,setSurfaceReady]=useState(false);
  const [framesFailed,setFramesFailed]=useState(false);
  const useFrames=mobile&&!framesFailed;
  const [portrait,setPortrait]=useState(()=>matchMedia('(max-width: 800px) and (max-aspect-ratio: 3/4)').matches);
  useEffect(()=>{
    const query=matchMedia('(max-width: 800px) and (max-aspect-ratio: 3/4)');
    const change=()=>setPortrait(query.matches);
    query.addEventListener('change',change);return()=>query.removeEventListener('change',change);
  },[]);

  useLayoutEffect(()=>{
    if(reduced||failed||!section.current||(!video.current&&!canvas.current))return;
    const root=section.current,media=video.current,surface=surfaceVideo.current;
    const display=useFrames?canvas.current!:media!;
    const primary=root.querySelector<HTMLElement>('.hero-primary')!;
    const note=root.querySelector<HTMLElement>('.dive-note');
    let progress=0,awaitingEntry=hasSceneEntry&&isEntryPending(),mode:'surface'|'scroll'=awaitingEntry?'scroll':'surface';
    let blended:'surface'|'scroll'|null=null,raf=0,seekTimer=0,lastSeek=0,disposed=false,inView=true;
    let frames:ReturnType<typeof createOceanFrames>|undefined,frameReady=false;
    const context=gsap.context(()=>{},root);
    const duration=()=>Math.max(0,(media&&Number.isFinite(media.duration)?media.duration:10)-.001);
    const desiredTime=()=>mobile?Math.min(duration(),Math.round(duration()*progress*24)/24):duration()*progress;
    const cancelSeek=()=>{cancelAnimationFrame(raf);clearTimeout(seekTimer);raf=0;seekTimer=0;};
    const playSurface=()=>{
      if(surface&&!disposed&&!document.hidden&&inView&&mode==='surface')surface.play().catch(()=>{/* Poster remains when autoplay is unavailable. */});
    };
    const blend=()=>{
      if(mode==='scroll'&&(useFrames?!frameReady:!media||media.readyState<2||media.seeking))return;
      if(blended===mode)return;
      blended=mode;
      const scrolling=mode==='scroll';
      if(!scrolling)playSurface();
      context.add(()=>{
        gsap.to(display,{opacity:scrolling?1:0,duration:.18,ease:'none',overwrite:true});
        if(surface)gsap.to(surface,{opacity:scrolling?0:surface.readyState>=2?1:0,duration:.18,ease:'none',overwrite:true,onComplete:()=>{if(mode==='scroll')surface.pause();}});
      });
    };
    const seekLatest=()=>{
      raf=0;
      if(disposed||document.hidden||!inView||mode!=='scroll')return;
      if(frames){frames.setProgress(progress);return;}
      if(!media||media.readyState<1||media.seeking)return;
      const desired=desiredTime();
      const elapsed=performance.now()-lastSeek;
      if(mobile&&elapsed<1000/24){seekTimer=window.setTimeout(()=>{seekTimer=0;queueSeek();},1000/24-elapsed);return;}
      if(Math.abs(media.currentTime-desired)>1/48){lastSeek=performance.now();media.currentTime=desired;root.dataset.videoSeeking='true';}
      else {root.dataset.videoSeeking='false';root.dataset.oceanComplete=String(progress>=.999);blend();}
    };
    const queueSeek=()=>{
      if(disposed||!inView||document.hidden||mode!=='scroll')return;
      if(frames){frames.setProgress(progress);return;}
      if(!raf&&!seekTimer)raf=requestAnimationFrame(seekLatest);
    };
    const seeked=()=>{
      root.dataset.videoSeeking='false';
      if(media&&Math.abs(media.currentTime-desiredTime())>1/48)queueSeek();else blend();
    };
    const update=(p:number)=>{
      if(awaitingEntry&&p===0)return;
      awaitingEntry=false;
      root.style.setProperty('--content-shade',String(gsap.utils.clamp(0,.7,(p-.9)/.1*.7)));
      const next=p>.001?'scroll':'surface';
      if(next!==mode){
        mode=next;root.dataset.videoMode=mode;
        frames?.setActive(mode==='scroll'&&inView&&!document.hidden);
        if(mode==='surface'){cancelSeek();blend();}
        else {surface?.pause();if(media)media.preload='auto';queueSeek();}
      }
      if(!mobile){
        primary.style.opacity=String(1-gsap.utils.clamp(0,1,p/.18));
        primary.style.transform=`translateY(${-Math.round(Math.min(p/.18,1)*28)}px)`;
        primary.inert=p>.18;primary.setAttribute('aria-hidden',String(primary.inert));
      }
      if(note)updateOceanStory(note,p);
    };
    const scrollLoaded=()=>{media?.pause();queueSeek();};
    const surfaceLoaded=()=>{setSurfaceReady(true);if(mode==='surface'){blended=null;blend();playSurface();}};
    root.dataset.videoMode=mode;root.dataset.oceanComplete='false';
    root.dataset.oceanRenderer=useFrames?'frames':'video';
    if(useFrames){
      try{
        frames=createOceanFrames(canvas.current!,portrait,()=>{
          frameReady=Math.abs(Number(canvas.current?.dataset.frame)-Number(canvas.current?.dataset.requestedFrame||0))<=2;
          blend();
        },()=>{if(!disposed)setFramesFailed(true);});
        frames.setActive(mode==='scroll');
      }catch{setFramesFailed(true);}
    }
    context.add(()=>{
      ScrollTrigger.create({trigger:root,start:'top top',endTrigger:root.querySelector('.ocean-arrival'),end:mobile?'top 65%':'top top',onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)});
      const seekProgress=(p:number)=>{progress=p;root.dataset.oceanProgress=p.toFixed(4);queueSeek();};
      ScrollTrigger.create({trigger:root,start:'top top',end:'bottom top',onUpdate:self=>seekProgress(self.progress),onRefresh:self=>seekProgress(self.progress)});
    });
    const synchronize=()=>{const rect=root.getBoundingClientRect();inView=rect.bottom>0&&rect.top<innerHeight;cancelSeek();seekLatest();};
    const visibility=()=>{frames?.setActive(!document.hidden&&inView&&mode==='scroll');if(document.hidden){cancelSeek();surface?.pause();}else {playSurface();queueSeek();}};
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;frames?.setActive(inView&&!document.hidden&&mode==='scroll');if(!inView){cancelSeek();surface?.pause();}else {playSurface();queueSeek();}});
    observer.observe(root);
    media?.addEventListener('loadedmetadata',scrollLoaded);media?.addEventListener('loadeddata',scrollLoaded);media?.addEventListener('seeked',seeked);
    surface?.addEventListener('loadeddata',surfaceLoaded);document.addEventListener('visibilitychange',visibility);document.addEventListener('rihs:sync-scene',synchronize);
    if(media&&media.readyState>=1)scrollLoaded();
    if(surface&&surface.readyState>=2)surfaceLoaded();
    if(mode==='surface')blend();
    return()=>{
      disposed=true;cancelSeek();frames?.destroy();observer.disconnect();context.revert();media?.pause();surface?.pause();
      media?.removeEventListener('loadedmetadata',scrollLoaded);media?.removeEventListener('loadeddata',scrollLoaded);media?.removeEventListener('seeked',seeked);surface?.removeEventListener('loadeddata',surfaceLoaded);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('rihs:sync-scene',synchronize);
      primary.inert=false;primary.removeAttribute('aria-hidden');primary.removeAttribute('style');note?.removeAttribute('style');note?.querySelectorAll('.dive-chapter').forEach(el=>el.removeAttribute('style'));display.removeAttribute('style');surface?.removeAttribute('style');delete root.dataset.videoMode;delete root.dataset.oceanComplete;delete root.dataset.oceanProgress;delete root.dataset.videoSeeking;delete root.dataset.oceanRenderer;root.style.removeProperty('--content-shade');
    };
  },[reduced,mobile,failed,surfaceFailed,portrait,framesFailed,useFrames]);

  const hero=(<div className="hero-primary">
        <div className="hero-copy">
          <p className="hero-date">{event.shortDate} · 9am–3pm Pacific</p>
          <h1 id="hero-title">RIHS Hackathon<br/><span>2027</span></h1>
          <p className="hero-description">A day of building, learning, and making ideas real.<br className="desktop-break"/> {event.school}, Lathrop.</p>
          <div className="hero-actions"><a className="button hero-button" href="/register/">Register to Participate <ArrowUpRight aria-hidden="true" size={17}/></a><a className="hero-sponsor" href="/sponsor/">Sponsor Us <ArrowUpRight aria-hidden="true" size={17}/></a></div>
          <p className="hero-deadline">Participant & sponsor deadline: {event.deadlineLabel}</p>
        </div>
        {children}
      </div>);

  return <section ref={section} id="top" className={'ocean-journey '+(mobile?'compact-journey ':'')+(reduced||failed?'static-journey':'')} aria-labelledby="hero-title">
    <div className="ocean-stage">
      <img className="ocean-poster" src="/media/hero-surface-poster.webp" alt="" fetchPriority="high" width="1280" height="720"/>
      {!reduced&&!failed&&<>{useFrames?<canvas ref={canvas} className="ocean-video scroll-ocean ocean-frames" aria-hidden="true"/>:<video ref={video} className="ocean-video scroll-ocean" src={mobile?(portrait?'/media/ocean-portrait.mp4':'/media/ocean-mobile-wide.mp4'):'/media/ocean.mp4'} poster="/media/ocean-poster.webp" playsInline muted preload={hasSceneEntry?'auto':'metadata'} aria-hidden="true" onError={()=>setFailed(true)}/>}
      {!surfaceFailed&&<video ref={surfaceVideo} className={'ocean-video hero-surface '+(surfaceReady?'ready':'')} src={mobile?(portrait?'/media/hero-surface-portrait.mp4':'/media/hero-surface-mobile-wide.mp4'):'/media/hero-surface.mp4'} poster="/media/hero-surface-poster.webp" playsInline muted loop preload={hasSceneEntry?'none':'auto'} aria-hidden="true" onError={()=>setSurfaceFailed(true)}/>}</>}
      <div className="ocean-shade"/><div className="ocean-content-shade" aria-hidden="true"/>
      {!mobile&&hero}
      {!mobile&&<OceanStory/>}
      <div className="hero-transition"/>
    </div>
    {mobile?<div className="phone-ocean-foreground">{hero}{!reduced&&!failed&&<OceanStory flow/>}</div>:!reduced&&!failed&&<div className="ocean-scroll-track" aria-hidden="true"/>}
    <OceanArrival reduced={reduced||failed} mobile={mobile}>{arrival}</OceanArrival>
    <div className="ocean-end-blend" aria-hidden="true"/>
  </section>;
}
