import {useEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Section-specific choreography. Ocean playback/geometry is owned by OceanHero. */
export function useSiteMotion(reduced:boolean){
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>('.site-shell');
    if(!root||reduced)return;
    const media=gsap.matchMedia();
    media.add({wide:'(min-width: 801px)',compact:'(max-width: 800px)',motion:'(prefers-reduced-motion: no-preference)'},conditions=>{
      if(!conditions.conditions?.motion)return;
      const compact=!!conditions.conditions.compact;
      const scope=gsap.context(()=>{
        const q=(selector:string)=>Array.from(root.querySelectorAll<HTMLElement>(selector));
        const entrance=(selector:string,vars:gsap.TweenVars,trigger?:Element)=>{
          const targets=q(selector);
          if(!targets.length)return;
          const anchor=trigger||targets[0];
          if(anchor.getBoundingClientRect().bottom<0)return;
          targets.forEach(el=>el.classList.add('motion-enter'));
          return gsap.from(targets,{duration:.78,ease:'power3.out',...vars,scrollTrigger:{trigger:anchor,start:'top 91%',once:true,invalidateOnRefresh:true}});
        };
        if(window.scrollY<80){
          const hero=q('.hero-date,.hero-copy h1,.hero-description,.hero-actions,.hero-deadline,.countdown-panel');
          hero.forEach(el=>el.classList.add('motion-enter'));
          if(hero.length)gsap.timeline({defaults:{ease:'power3.out'}})
            .from(hero,{y:compact?15:25,opacity:0,duration:.95,stagger:.085},.03);
        }
        for(const section of q('.challenge,.schedule,.faq,.venue,.page-intro,.contact-intro,.application-section')){
          const words=section.querySelectorAll('.reveal-word');
          if(words.length)entrance('#'+section.id+' .reveal-word',{y:compact?18:32,rotation:compact?0:1.3,opacity:0,stagger:.045,duration:.85},section.querySelector('h2')||section);
        }
        entrance('.registration-details .facts>div',{y:24,opacity:0,stagger:.075});
        entrance('.challenge-visual',{clipPath:'inset(0 100% 0 0)',duration:1.05,ease:'power3.inOut'});
        entrance('.challenge-steps li',{y:compact?20:42,opacity:0,stagger:.13},root.querySelector('.challenge-steps')||undefined);
        for(const row of q('.schedule-list article')){
          if(row.getBoundingClientRect().bottom<0)continue;
          const children=row.querySelectorAll('time,h3,p');
          gsap.from(children,{x:compact?0:20,y:compact?12:0,opacity:0,duration:.65,stagger:.07,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 93%',once:true}});
        }
        const rail=root.querySelector('.schedule-progress');
        if(rail)gsap.fromTo(rail,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:root.querySelector('.schedule-list'),start:'top 68%',end:'bottom 70%',scrub:.25,invalidateOnRefresh:true}});
        entrance('.sponsor-marquee',{y:22,opacity:0,duration:.8});
        entrance('.faq-item',{x:compact?0:18,y:compact?12:0,opacity:0,stagger:.045,duration:.62},root.querySelector('.faq-list')||undefined);
        entrance('.page-intro h1,.page-intro-content>p,.page-intro-actions',{y:22,opacity:0,stagger:.08,duration:.8},root.querySelector('.page-intro')||undefined);
        entrance('.page-hero-visual',{y:25,opacity:0,rotation:compact?0:1.2,duration:1},root.querySelector('.page-intro')||undefined);
        entrance('.contact-headline h1,.contact-headline>p,.contact-event',{y:22,opacity:0,stagger:.11},root.querySelector('.contact-headline')||undefined);
        entrance('.contact-direct,.application-action',{y:24,opacity:0,duration:.85});
        const image=root.querySelector('.challenge-visual img');
        if(image&&!compact)gsap.fromTo(image,{scale:1.08,yPercent:-3},{scale:1,yPercent:3,ease:'none',scrollTrigger:{trigger:root.querySelector('.challenge-visual'),start:'top bottom',end:'bottom top',scrub:.5}});
      },root);
      const focus=(event:FocusEvent)=>{
        let target=event.target as HTMLElement|null;
        while(target&&target!==root){
          if(target.classList.contains('motion-enter'))gsap.getTweensOf(target).forEach(t=>{t.progress(1);t.kill();});
          target=target.parentElement;
        }
      };
      root.addEventListener('focusin',focus);
      const refresh=()=>ScrollTrigger.refresh();
      let alive=true;
      document.fonts.ready.then(()=>{if(alive)refresh();});
      root.addEventListener('load',refresh,true);
      return()=>{alive=false;root.removeEventListener('focusin',focus);root.removeEventListener('load',refresh,true);scope.revert();root.querySelectorAll('.motion-enter').forEach(el=>el.classList.remove('motion-enter'));};
    });
    return()=>media.revert();
  },[reduced]);
}
