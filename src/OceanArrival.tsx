import {useLayoutEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** One scroll-owned entrance over the actual final video frame; no asynchronous catch-up. */
export default function OceanArrival({reduced,children}:{reduced:boolean;children:React.ReactNode}){
  const element=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const root=element.current;
    if(!root||reduced)return;
    const media=gsap.matchMedia();
    media.add({motion:'(prefers-reduced-motion: no-preference)',compact:'(max-width: 800px)'},match=>{
      if(!match.conditions?.motion)return;
      const compact=!!match.conditions.compact;
      root.classList.add('arrival-enhanced');
      const context=gsap.context(()=>{
        const scene=gsap.timeline({paused:true}).fromTo(root.querySelector('.arrival-surface'),
          {y:()=>window.innerHeight,scale:compact?.97:.9,rotationX:compact?0:4,borderRadius:compact?'24px 24px 0 0':'36px 36px 0 0'},
          {y:0,scale:1,rotationX:0,borderRadius:'0px',duration:1,ease:'none',immediateRender:true});
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
  },[reduced]);
  return <div ref={element} className={'ocean-arrival'+(reduced?' arrival-static':'')}>
    <div className="arrival-stage"><div className="arrival-surface">{children}</div></div>
  </div>;
}
