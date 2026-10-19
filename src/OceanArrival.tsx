import {useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** One scroll-owned entrance over the continuously scrubbed video; no asynchronous catch-up. */
export default function OceanArrival({reduced,mobile,children}:{reduced:boolean;mobile:boolean;children:React.ReactNode}){
  const element=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const root=element.current;
    if(!root||reduced||mobile)return;
    const media=gsap.matchMedia();
    media.add({motion:'(prefers-reduced-motion: no-preference)'},match=>{
      if(!match.conditions?.motion)return;
      root.classList.add('arrival-enhanced');
      const context=gsap.context(()=>{
        const surface=root.querySelector('.arrival-surface');
        const scene=gsap.timeline({paused:true}).fromTo(surface,
          {y:()=>window.innerHeight},
          {y:0,duration:1,ease:'none',force3D:false,snap:{y:1},immediateRender:true});
        const render=(progress:number)=>{
          // Explicit boundaries also cover anchor jumps, reverse scroll, and layout refreshes.
          progress=progress>.999?1:progress<.001?0:progress;
          scene.progress(progress);
          root.classList.toggle('arrival-settled',progress>=1);
          root.dataset.arrivalProgress=progress.toFixed(4);
        };
        ScrollTrigger.create({trigger:root,start:'top top',
          end:()=>'+='+Math.max(1,root.offsetHeight-root.querySelector<HTMLElement>('.arrival-stage')!.offsetHeight),
          onUpdate:self=>render(self.progress),
          onRefresh:self=>{scene.invalidate();render(self.progress);}});
      },root);
      return()=>{context.revert();root.classList.remove('arrival-enhanced','arrival-settled');delete root.dataset.arrivalProgress;};
    });
    return()=>media.revert();
  },[reduced,mobile]);
  return <div ref={element} className={'ocean-arrival'+(reduced?' arrival-static':mobile?' arrival-flow':'')}>
    <div className="arrival-stage"><div className="arrival-surface">{children}</div></div>
  </div>;
}
