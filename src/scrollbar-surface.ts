import {useEffect} from 'react';

/** Match the native scrollbar gutter to the section at the viewport's centre. */
export function useScrollbarSurface(){
  useEffect(()=>{
    const html=document.documentElement;
    let observer:IntersectionObserver;
    const apply=(node:Element)=>{
      let colour=node.closest('.ocean-journey')?'rgb(8, 52, 68)':getComputedStyle(node).backgroundColor;
      if(colour==='transparent'||colour==='rgba(0, 0, 0, 0)')colour='rgb(244, 242, 233)';
      const rgb=colour.match(/[\d.]+/g)?.slice(0,3).map(Number)||[244,242,233];
      const dark=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722<140;
      html.style.setProperty('--scrollbar-track',colour);
      html.style.setProperty('--scrollbar-thumb',dark?'#9cc3c866':'#28546155');
    };
    const observe=()=>{
      observer?.disconnect();
      const inset=Math.max(0,Math.floor(innerHeight/2-2));
      observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)apply(entry.target);},{rootMargin:`-${inset}px 0px -${inset}px 0px`,threshold:0});
      document.querySelectorAll('.section,.ocean-journey,.site-footer').forEach(node=>observer.observe(node));
    };
    let width=innerWidth;
    const resize=()=>{if(width!==innerWidth){width=innerWidth;observe();}};
    observe();window.addEventListener('resize',resize);
    return()=>{observer.disconnect();window.removeEventListener('resize',resize);html.style.removeProperty('--scrollbar-track');html.style.removeProperty('--scrollbar-thumb');};
  },[]);
}
