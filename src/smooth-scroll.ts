import {useLayoutEffect,useRef} from 'react';
import Lenis from 'lenis';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {entryTarget,restoreEntryHash,sectionTop,settleOceanFrame} from './navigation';
import 'lenis/dist/lenis.css';

export function useSmoothScroll(reduced:boolean,mobile:boolean){
  const entryPlaced=useRef(false);
  useLayoutEffect(()=>{
    const html=document.documentElement;
    const lenis=reduced||mobile?null:new Lenis({autoRaf:false,anchors:false,syncTouch:false,lerp:.16});
    html.dataset.scrollOwner=lenis?'lenis':'native';
    const tick=(seconds:number)=>lenis?.raf(seconds*1000);
    const update=()=>ScrollTrigger.update();
    if(lenis){lenis.on('scroll',update);gsap.ticker.add(tick);}
    const lock=(e:Event)=>{if((e as CustomEvent<boolean>).detail)lenis?.stop();else lenis?.start();};
    document.addEventListener('rihs:menu-lock',lock);
    let alive=true,frame=0,interacted=false,cancelNative=()=>{};
    let transition:ViewTransition|undefined;
    const position=(target:HTMLElement)=>Math.max(0,sectionTop(target)-(target.closest('.arrival-enhanced')?0:28));
    const scroll=(y:number,immediate=true,onComplete?:()=>void)=>{
      cancelNative();
      if(lenis)lenis.scrollTo(y,{immediate,force:true,duration:.65,easing:t=>1-Math.pow(1-t,4),onComplete});
      else if(immediate){window.scrollTo({top:y,behavior:'auto'});onComplete?.();}
      else {
        let timeout=0;
        const finish=()=>{clearTimeout(timeout);window.removeEventListener('scrollend',finish);cancelNative=()=>{};onComplete?.();};
        cancelNative=()=>{clearTimeout(timeout);window.removeEventListener('scrollend',finish);};
        window.addEventListener('scrollend',finish,{once:true});
        timeout=window.setTimeout(finish,800);
        window.scrollTo({top:y,behavior:'smooth'});
      }
      ScrollTrigger.update();
    };
    const findTarget=()=>{try{return document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return null;}};
    const focusTarget=(target:HTMLElement)=>{
      const hadIndex=target.hasAttribute('tabindex');
      if(!hadIndex)target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
      if(!hadIndex)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
    };
    const refresh=()=>{lenis?.resize();ScrollTrigger.refresh();};
    // Child layout effects create ocean scenes first. Position once before first paint.
    refresh();
    const initial=entryPlaced.current?null:entryTarget();
    entryPlaced.current=true;
    if(initial)scroll(position(initial));
    restoreEntryHash();
    const initialHash=location.hash;
    const interaction=()=>{interacted=true;cancelNative();};
    window.addEventListener('wheel',interaction,{passive:true});window.addEventListener('touchstart',interaction,{passive:true});window.addEventListener('keydown',interaction);
    document.fonts.ready.then(()=>{
      if(!alive)return;
      refresh();
      if(initial&&!interacted&&location.hash===initialHash)scroll(position(initial));
    });
    const click=(e:MouseEvent)=>{
      if(e.defaultPrevented||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
      const link=(e.target as Element).closest<HTMLAnchorElement>('a[href]');
      if(!link||link.target||link.hasAttribute('download'))return;
      const url=new URL(link.href,location.href);
      if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
      let target:HTMLElement|null=null;
      try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}
      if(!target)return;
      interacted=true;e.preventDefault();history.pushState(null,'',url.hash);
      const destination=position(target);
      const commit=()=>{scroll(position(target!));document.dispatchEvent(new CustomEvent('rihs:section-navigation',{detail:target}));focusTarget(target!);};
      const longJump=Math.abs(destination-window.scrollY)>window.innerHeight*1.5;
      transition?.skipTransition();
      if(!reduced&&!mobile&&e.detail>0&&longJump&&document.startViewTransition){
        transition=document.startViewTransition(async()=>{commit();await settleOceanFrame();});
        transition.ready.catch(()=>{/* A newer navigation can skip this transition. */});
        transition.finished.catch(()=>{/* Navigation interruption is expected. */});
      }else scroll(destination,reduced||e.detail===0||longJump,()=>{document.dispatchEvent(new CustomEvent('rihs:section-navigation',{detail:target}));focusTarget(target!);});
    };
    const layout=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(refresh);};
    const restore=()=>{const target=findTarget();if(target){refresh();scroll(position(target));}};
    const pageshow=(event:PageTransitionEvent)=>{if(event.persisted)layout();};
    document.addEventListener('click',click);document.addEventListener('toggle',layout,true);document.addEventListener('rihs:layout',layout);
    window.addEventListener('hashchange',restore);window.addEventListener('pageshow',pageshow);
    return()=>{alive=false;cancelNative();transition?.skipTransition();cancelAnimationFrame(frame);window.removeEventListener('wheel',interaction);window.removeEventListener('touchstart',interaction);window.removeEventListener('keydown',interaction);document.removeEventListener('click',click);document.removeEventListener('toggle',layout,true);document.removeEventListener('rihs:layout',layout);document.removeEventListener('rihs:menu-lock',lock);window.removeEventListener('hashchange',restore);window.removeEventListener('pageshow',pageshow);if(lenis){gsap.ticker.remove(tick);lenis.off('scroll',update);lenis.destroy();}delete html.dataset.scrollOwner;};
  },[reduced,mobile]);
}
