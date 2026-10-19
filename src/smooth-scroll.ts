import {useEffect} from 'react';
import Lenis from 'lenis';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

export function useSmoothScroll(reduced:boolean){
  useEffect(()=>{
    const html=document.documentElement;
    const lenis=reduced?null:new Lenis({autoRaf:false,anchors:false,syncTouch:false,lerp:.12});
    html.dataset.scrollOwner=lenis?'lenis':'native';
    const tick=(seconds:number)=>lenis?.raf(seconds*1000);
    const update=()=>ScrollTrigger.update();
    if(lenis){lenis.on('scroll',update);gsap.ticker.add(tick);}
    const lock=(e:Event)=>{if((e as CustomEvent<boolean>).detail)lenis?.stop();else lenis?.start();};
    document.addEventListener('rihs:menu-lock',lock);
    const anchorPosition=(target:HTMLElement):HTMLElement|number=>{
      const arrival=target.closest<HTMLElement>('.arrival-enhanced');
      return arrival?arrival.getBoundingClientRect().top+window.scrollY+arrival.offsetHeight-arrival.querySelector<HTMLElement>('.arrival-stage')!.offsetHeight+28:target;
    };
    const findTarget=()=>{try{return document.getElementById(decodeURIComponent(location.hash.slice(1)));}catch{return null;}};
    let alive=true,frame=0;
    const restore=()=>{
      if(!alive||!location.hash)return;
      const target=findTarget();
      if(target)frame=requestAnimationFrame(()=>{if(lenis)lenis.scrollTo(anchorPosition(target),{immediate:true,offset:-28});else target.scrollIntoView({behavior:'instant'});});
    };
    const initialHash=location.hash;
    let interacted=false;
    const interaction=()=>{interacted=true;};
    window.addEventListener('wheel',interaction,{passive:true});window.addEventListener('touchstart',interaction,{passive:true});window.addEventListener('keydown',interaction);
    restore();document.fonts.ready.then(()=>{if(!interacted&&location.hash===initialHash)restore();});
    const click=(e:MouseEvent)=>{
      if(!lenis||e.defaultPrevented||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
      const link=(e.target as Element).closest<HTMLAnchorElement>('a[href]');
      if(!link||link.target||link.hasAttribute('download'))return;
      const url=new URL(link.href,location.href);
      if(url.origin!==location.origin||url.pathname!==location.pathname||!url.hash)return;
      let target:HTMLElement|null=null;
      try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{return;}
      if(!target)return;
      interacted=true;e.preventDefault();history.pushState(null,'',url.hash);
      const focusTarget=()=>{const hadIndex=target!.hasAttribute('tabindex');if(!hadIndex)target!.setAttribute('tabindex','-1');target!.focus({preventScroll:true});if(!hadIndex)target!.addEventListener('blur',()=>target!.removeAttribute('tabindex'),{once:true});};
      lenis.scrollTo(anchorPosition(target),{offset:-28,duration:e.detail===0?0:.8,immediate:e.detail===0,onComplete:focusTarget});
    };
    const layout=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{lenis?.resize();ScrollTrigger.refresh();});};
    document.addEventListener('click',click);
    document.addEventListener('toggle',layout,true);
    document.addEventListener('rihs:layout',layout);
    window.addEventListener('hashchange',restore);
    return()=>{alive=false;window.removeEventListener('wheel',interaction);window.removeEventListener('touchstart',interaction);window.removeEventListener('keydown',interaction);cancelAnimationFrame(frame);document.removeEventListener('click',click);document.removeEventListener('toggle',layout,true);document.removeEventListener('rihs:layout',layout);document.removeEventListener('rihs:menu-lock',lock);window.removeEventListener('hashchange',restore);if(lenis){gsap.ticker.remove(tick);lenis.off('scroll',update);lenis.destroy();}delete html.dataset.scrollOwner;};
  },[reduced]);
}
