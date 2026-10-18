import http from 'node:http';
import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL(process.argv.includes('--preview')?'../dist-preview/':'../dist/',import.meta.url));
const port=Number(process.env.PORT||5175);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf','.pdf':'application/pdf','.json':'application/json','.mp4':'video/mp4','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url||'/','http://127.0.0.1');
    let filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    const relative=path.relative(root,filename);
    if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('Not found');
    let info=await stat(filename);
    if(info.isDirectory()){filename=path.join(filename,'index.html');info=await stat(filename);}
    if(!info.isFile())throw Error('Not found');
    const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match)throw Error('Invalid range');
      start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]));
      end=match[1]&&match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    res.writeHead(status,{...headers,'Content-Length':end-start+1});
    if(req.method==='HEAD')res.end();else createReadStream(filename,{start,end}).pipe(res);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`RIHS Hackathon preview: http://127.0.0.1:${port}/\nPress Ctrl+C to stop.`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
