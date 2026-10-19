import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source=await readFile(new URL('../src/ocean-frames.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
function setup(bitmaps=true,failAt=-1){
  const images=[],decoded=[],raf=new Map();let nextRaf=0,ready=0,errors=0,draws=[];
  class Image {
    onload=null;onerror=null;active=false;completed=false;
    constructor(){images.push(this);}
    set src(value){this.index=Number(value.match(/(\d+)\.webp$/)[1]);this.active=true;assert(images.filter(i=>i.active).length<=3,'too many concurrent frame loads');}
    removeAttribute(){this.active=false;}
    async decode(){}
  }
  const canvas={dataset:{},getContext:()=>({drawImage(frame){assert(!frame.closed);draws.push(frame.index);}})};
  const sandbox={exports:{},Image,requestAnimationFrame:callback=>{raf.set(++nextRaf,callback);return nextRaf;},cancelAnimationFrame:id=>raf.delete(id)};
  if(bitmaps)sandbox.createImageBitmap=async image=>{const bitmap={index:image.index,closed:false,close(){this.closed=true;}};decoded.push(bitmap);return bitmap;};
  vm.runInNewContext(compiled,sandbox);
  const player=sandbox.exports.createOceanFrames(canvas,true,()=>ready++,()=>errors++);
  const settle=async()=>{
    for(let rounds=0;rounds<100;rounds++){
      const pending=images.filter(i=>i.active&&!i.completed);
      for(const image of pending){
        image.completed=true;image.active=false;
        if(image.index===failAt)image.onerror?.();else await image.onload?.();
      }
      for(const [id,callback] of [...raf]){raf.delete(id);callback();}
      if(!images.some(i=>i.active&&!i.completed)&&!raf.size)return;
    }
    assert.fail('frame prefetch did not become idle');
  };
  return {canvas,player,settle,images,decoded,raf,get ready(){return ready;},get errors(){return errors;},get draws(){return draws;}};
}

for(const bitmaps of [true,false]){
  const h=setup(bitmaps);await h.settle();h.player.setActive(true);
  for(const p of [0,.06,.5,.2,1,0,.8,.4,.42,.44,.46,-1,2]){
    h.player.setProgress(p);await h.settle();
    assert.equal(Number(h.canvas.dataset.frame),Math.round(Math.max(0,Math.min(1,p))*239));
    assert(Number(h.canvas.dataset.decodedFrames)<=12,'decoded cache exceeded budget');
    assert.equal(h.canvas.dataset.pendingFrames,'0');
    assert(h.decoded.filter(b=>!b.closed).length<=12);
  }
  h.player.setProgress(.5);await h.settle();
  const warm=Number(h.canvas.dataset.frame)+1;
  h.player.setProgress(warm/239);
  assert.equal(Number(h.canvas.dataset.frame),warm,'cached frame must paint synchronously without another RAF');
  await h.settle();
  // A fling/reversal must prioritize the latest destination, not late stale requests.
  for(const p of [.3,.95,.1,.73,.02])h.player.setProgress(p);
  await h.settle();assert.equal(Number(h.canvas.dataset.frame),Math.round(.02*239));
  h.player.setActive(false);const requests=h.images.length;
  h.player.setProgress(.9);await h.settle();assert.equal(h.images.length,requests);
  h.player.setActive(true);await h.settle();assert.equal(Number(h.canvas.dataset.frame),Math.round(.9*239));
  h.player.setProgress(.22);h.player.destroy();await h.settle();
  assert.equal(h.raf.size,0);assert(h.images.every(i=>!i.active));assert(h.decoded.every(b=>b.closed));assert.equal(h.errors,0);assert(h.ready>0);
}
const failed=setup(true,120);failed.player.setActive(true);failed.player.setProgress(120/239);await failed.settle();assert(failed.errors>0);failed.player.destroy();
console.log('Passed: exact forward/reverse frames, fling recovery, bounded decode/concurrency, idle suspension, bitmap/image fallback, load failure and cleanup.');
