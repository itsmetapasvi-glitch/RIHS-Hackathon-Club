/** Shared geometry for content inside the translated/sticky ocean arrival. */
export function sectionTop(target:HTMLElement):number{
  const arrival=target.closest<HTMLElement>('.arrival-enhanced');
  if(!arrival)return target.getBoundingClientRect().top+window.scrollY;
  const stage=arrival.querySelector<HTMLElement>('.arrival-stage')!;
  const surface=arrival.querySelector<HTMLElement>('.arrival-surface')!;
  const nested=target.getBoundingClientRect().top-surface.getBoundingClientRect().top;
  return arrival.getBoundingClientRect().top+window.scrollY+arrival.offsetHeight-stage.offsetHeight+nested;
}

const entryHash=location.hash;
let pendingEntry=entryHash;
export const hasSceneEntry=['about','theme','schedule','faq','venue','our-sponsors'].some(id=>entryHash==='#'+id);
export function entryTarget():HTMLElement|null{
  try{return document.getElementById(decodeURIComponent(entryHash.slice(1)));}catch{return null;}
}
export function prepareEntryNavigation(){
  // Prevent the browser and Lenis from separately jumping to a newly mounted fragment.
  if(pendingEntry)history.replaceState(history.state,'',location.pathname+location.search);
}
export function restoreEntryHash(){
  if(pendingEntry){history.replaceState(history.state,'',location.pathname+location.search+pendingEntry);pendingEntry='';}
}

/** Let a long-distance section switch capture the decoded destination, with a bounded wait. */
export function settleOceanFrame(timeout=280):Promise<void>{
  const root=document.querySelector<HTMLElement>('.ocean-journey');
  const video=root?.querySelector<HTMLVideoElement>('.scroll-ocean');
  if(!root||!video||root.getBoundingClientRect().bottom<=0)return Promise.resolve();
  return new Promise(resolve=>{
    let timer=0;
    const finish=()=>{clearTimeout(timer);video.removeEventListener('seeked',check);video.removeEventListener('error',finish);resolve();};
    const check=()=>{
      const expected=Math.max(0,(video.duration-.001))*Number(root.dataset.oceanProgress||0);
      if(video.readyState>=2&&!video.seeking&&Math.abs(video.currentTime-expected)<1/24)finish();
    };
    video.addEventListener('seeked',check);video.addEventListener('error',finish,{once:true});
    timer=window.setTimeout(finish,timeout);
    document.dispatchEvent(new Event('rihs:sync-scene'));check();
  });
}
