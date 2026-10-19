import {event} from './event';

const chapters=[
  {label:'The challenge',title:<>A world of water.<br/>Your point of view.</>,description:'A water-related prompt. Revealed at the opening ceremony.',start:.18,end:.45},
  {label:'Your idea, your format',title:<>Code it. Make it.<br/>Tell its story.</>,description:'Websites, apps, games, or presentations. Choose the format that fits.',start:.45,end:.72},
  {label:'Make your time count',title:<>Build. Submit.<br/>Show your work.</>,description:`Three hours to build. Submissions due at ${event.submissionTime} Pacific.`,start:.72,end:1},
];

/** Only text is updated here. No video seeking, handoff, or scene geometry. */
export function updateOceanStory(root:HTMLElement,progress:number){
  root.style.opacity='1';
  const nodes=root.querySelectorAll<HTMLElement>('.dive-chapter');
  nodes.forEach((node,index)=>{
    const chapter=chapters[index];
    const enter=Math.max(0,Math.min(1,(progress-chapter.start)/.025));
    const exit=Math.max(0,Math.min(1,(progress-(chapter.end-.025))/.025));
    node.style.opacity=String(enter*(1-exit));
    node.style.transform=`translate3d(0,${(1-enter)*18-exit*10}px,0)`;
  });
}

export default function OceanStory(){return <div className="dive-note ocean-story" aria-hidden="true">{chapters.map((chapter,index)=><div className="dive-chapter" key={chapter.label}><span className="dive-chapter-label"><span>0{index+1} / 03</span>{chapter.label}</span><p className="dive-title">{chapter.title}</p><p className="dive-description">{chapter.description}</p></div>)}</div>;}
