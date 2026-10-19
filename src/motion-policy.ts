import {useEffect,useState} from 'react';

// Compact layouts and touch-first devices use native scrolling and lighter media.
export const compactMotionQuery='(max-width: 800px), (hover: none) and (pointer: coarse)';
export function useCompactMotion(){
  const [compact,setCompact]=useState(()=>matchMedia(compactMotionQuery).matches);
  useEffect(()=>{
    const media=matchMedia(compactMotionQuery);
    const change=()=>setCompact(media.matches);
    media.addEventListener('change',change);
    return()=>media.removeEventListener('change',change);
  },[]);
  return compact;
}
