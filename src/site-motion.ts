import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {entryTarget,sectionTop} from './navigation';

gsap.registerPlugin(ScrollTrigger);

/** Section-specific choreography. Ocean playback/geometry is owned by OceanHero. */
export function useSiteMotion(reduced:boolean){
  useLayoutEffect(()=>{
    const root=document.querySelector<HTMLElement>('.site-shell');
    if(!root||reduced)return;
    const played=new WeakSet<HTMLElement>();
    const media=gsap.matchMedia();
    media.add({wide:'(min-width: 801px)',compact:'(max-width: 800px)',motion:'(prefers-reduced-motion: no-preference)'},conditions=>{
      if(!conditions.conditions?.motion)return;
      const compact=!!conditions.conditions.compact;
      const scope=gsap.context(()=>{
        const q=(selector:string)=>Array.from(root.querySelectorAll<HTMLElement>(selector));
        const entry=entryTarget();
        const entryY=entry?sectionTop(entry):null;
        const entrance=(selector:string,vars:gsap.TweenVars,trigger?:Element)=>{
          const targets=q(selector);
          if(!targets.length)return;
          const anchor=trigger||targets[0];
          const start=()=>sectionTop(anchor as HTMLElement)-window.innerHeight*.91;
          if(targets.every(el=>played.has(el))||((entryY!==null||window.scrollY>80)&&start()<=Math.max(entryY||0,window.scrollY))||anchor.getBoundingClientRect().bottom<0)return;
          targets.forEach(el=>el.classList.add('motion-enter'));
          return gsap.from(targets,{duration:.78,ease:'power3.out',force3D:false,onStart:()=>targets.forEach(el=>played.add(el)),...vars,scrollTrigger:{trigger:anchor,start,once:true}});
        };
        if(!entry&&window.scrollY<80){
          const hero=q('.hero-date,.hero-copy h1,.hero-description,.hero-actions,.hero-deadline,.countdown-panel');
          hero.forEach(el=>el.classList.add('motion-enter'));
          if(hero.length&&!hero.every(el=>played.has(el)))gsap.timeline({defaults:{ease:'power3.out'}})
            .from(hero,{y:compact?15:25,opacity:0,duration:.95,stagger:.085,force3D:false,onStart:()=>hero.forEach(el=>played.add(el))},.03);
        }
        for(const section of q('.challenge,.schedule,.faq,.venue,.page-intro,.contact-intro,.application-section')){
          const words=section.querySelectorAll('.reveal-word');
          if(words.length)entrance('#'+section.id+' .reveal-word',{y:compact?18:32,opacity:0,stagger:.045,duration:.85},section.querySelector('h2')||section);
        }
        entrance('.registration-details .facts>div',{y:24,opacity:0,stagger:.075});
        entrance('.challenge-steps li',{y:compact?20:42,opacity:0,stagger:.13},root.querySelector('.challenge-steps')||undefined);
        for(const row of q('.schedule-list article')){
          if(played.has(row)||row.getBoundingClientRect().bottom<0||(entryY!==null&&sectionTop(row)-innerHeight*.93<=entryY))continue;
          const children=row.querySelectorAll<HTMLElement>('time,h3,p');
          children.forEach(el=>el.classList.add('motion-enter'));
          gsap.from(children,{x:compact?0:20,y:compact?12:0,opacity:0,duration:.65,stagger:.07,ease:'power3.out',force3D:false,onStart:()=>played.add(row),scrollTrigger:{trigger:row,start:'top 93%',once:true}});
        }
        const rail=root.querySelector('.schedule-progress');
        if(rail)gsap.fromTo(rail,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:root.querySelector('.schedule-list'),start:'top 68%',end:'bottom 70%',scrub:.25,invalidateOnRefresh:true}});
        entrance('.sponsor-marquee',{y:22,opacity:0,duration:.8});
        entrance('.faq-item',{x:compact?0:18,y:compact?12:0,opacity:0,stagger:.045,duration:.62},root.querySelector('.faq-list')||undefined);
        entrance('.page-intro h1,.page-intro-content>p,.page-intro-actions',{y:22,opacity:0,stagger:.08,duration:.8},root.querySelector('.page-intro')||undefined);
        entrance('.page-hero-visual',{y:25,opacity:0,duration:1,force3D:false},root.querySelector('.page-intro')||undefined);
        entrance('.contact-headline h1,.contact-headline>p,.contact-event',{y:22,opacity:0,stagger:.11},root.querySelector('.contact-headline')||undefined);
        entrance('.contact-direct,.application-action',{y:24,opacity:0,duration:.85});
      },root);
      const focus=(event:FocusEvent)=>{
        let target=event.target as HTMLElement|null;
        while(target&&target!==root){
          if(target.classList.contains('motion-enter'))gsap.getTweensOf(target).forEach(t=>{t.progress(1);t.kill();});
          target=target.parentElement;
        }
      };
      const navigation=(event:Event)=>{
        const section=(event as CustomEvent<HTMLElement>).detail;
        root.querySelectorAll<HTMLElement>('.motion-enter').forEach(el=>{
          if(!section.contains(el))return;
          played.add(el);
          gsap.getTweensOf(el).forEach(t=>{t.progress(1);t.scrollTrigger?.kill();t.kill();});
        });
      };
      root.addEventListener('focusin',focus);document.addEventListener('rihs:section-navigation',navigation);
      return()=>{root.removeEventListener('focusin',focus);document.removeEventListener('rihs:section-navigation',navigation);scope.revert();root.querySelectorAll('.motion-enter').forEach(el=>el.classList.remove('motion-enter'));};
    });
    return()=>media.revert();
  },[reduced]);
}
