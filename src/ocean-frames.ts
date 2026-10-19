type Frame=ImageBitmap|HTMLImageElement;
const count=240,cacheLimit=12,concurrency=3;

/** Random-access ocean frames: no MP4 seeks, no full-sequence decoded-image allocation. */
export function createOceanFrames(canvas:HTMLCanvasElement,portrait:boolean,onReady:()=>void,onError:()=>void){
  canvas.width=portrait?540:960;canvas.height=portrait?720:540;
  const context=canvas.getContext('2d',{alpha:false,desynchronized:true});
  if(!context)throw new Error('Canvas unavailable');
  const cache=new Map<number,Frame>(),pending=new Map<number,HTMLImageElement>(),failed=new Set<number>();
  let target=0,shown=-1,direction=1,active=false,disposed=false,paint=0,ready=false;
  const wantedIndices=()=>[target,...[1,2,3,4,5,6].map(n=>target+n*direction),target-direction,target-2*direction];
  const release=(frame:Frame)=>{if('close' in frame)frame.close();else frame.removeAttribute('src');};
  const stats=()=>{canvas.dataset.decodedFrames=String(cache.size);canvas.dataset.pendingFrames=String(pending.size);};
  const draw=()=>{
    cancelAnimationFrame(paint);paint=0;if(disposed||!cache.size)return;
    let nearest=-1,distance=Infinity;
    for(const index of cache.keys())if(Math.abs(index-target)<distance){nearest=index;distance=Math.abs(index-target);}
    if(nearest===shown||nearest<0||(shown>=0&&distance>=Math.abs(shown-target)))return;
    context.drawImage(cache.get(nearest)!,0,0,canvas.width,canvas.height);
    shown=nearest;canvas.dataset.frame=String(shown);
    if(!ready){ready=true;canvas.dataset.ready='true';}
    onReady();
  };
  const queueDraw=()=>{if(!paint&&!disposed)paint=requestAnimationFrame(draw);};
  const trim=()=>{
    while(cache.size>cacheLimit){
      const wanted=new Set(wantedIndices());
      const candidates=[...cache.keys()].filter(index=>index!==shown).sort((a,b)=>Number(wanted.has(a))-Number(wanted.has(b))||Math.abs(b-target)-Math.abs(a-target));
      const index=candidates[0];release(cache.get(index)!);cache.delete(index);
    }
    stats();
  };
  const load=(index:number)=>{
    const image=new Image();image.decoding='async';pending.set(index,image);stats();
    const valid=()=>!disposed&&pending.get(index)===image;
    const error=()=>{
      if(!valid())return;
      pending.delete(index);failed.add(index);stats();
      if(index===target||index===0)onError();else pump();
    };
    image.onerror=error;
    image.onload=async()=>{
      let frame:Frame=image;
      try{
        await image.decode();
        if(!valid())return;
        if(typeof createImageBitmap==='function'){
          try{frame=await createImageBitmap(image);}catch{/* Decoded image is the compatible fallback. */}
        }
        if(!valid()){release(frame);return;}
        image.onload=null;image.onerror=null;
        if(frame!==image)image.removeAttribute('src');
        pending.delete(index);cache.set(index,frame);trim();queueDraw();pump();
      }catch{error();}
    };
    image.src=`/media/ocean-frames/${portrait?'portrait':'landscape'}/${String(index).padStart(3,'0')}.webp`;
  };
  const pump=()=>{
    if(disposed||!active)return;
    if(failed.has(target)){onError();return;}
    // Drop obsolete prefetches after a fling; the requested frame always gets priority.
    for(const [index,image] of pending)if(Math.abs(index-target)>10){image.onload=null;image.onerror=null;image.removeAttribute('src');pending.delete(index);}
    const wanted=wantedIndices();
    for(const index of wanted){
      if(pending.size>=concurrency)break;
      if(index>=0&&index<count&&!cache.has(index)&&!pending.has(index)&&!failed.has(index))load(index);
    }
    stats();
  };
  load(0); // One warm frame while the separate hero video loops.
  return {
    setProgress(progress:number){
      const next=Math.round(Math.max(0,Math.min(1,progress))*(count-1));
      if(next!==target){direction=next>target?1:-1;target=next;canvas.dataset.requestedFrame=String(target);}
      // ScrollTrigger already runs at the render boundary. Cached frames must not wait another RAF.
      if(active){draw();pump();}
    },
    setActive(value:boolean){active=value;if(active){queueDraw();pump();}},
    destroy(){
      disposed=true;cancelAnimationFrame(paint);
      for(const image of pending.values()){image.onload=null;image.onerror=null;image.removeAttribute('src');}
      pending.clear();for(const frame of cache.values())release(frame);cache.clear();
      delete canvas.dataset.ready;delete canvas.dataset.frame;delete canvas.dataset.requestedFrame;delete canvas.dataset.decodedFrames;delete canvas.dataset.pendingFrames;
    },
  };
}
