var B=(e,n,t)=>new Promise((i,c)=>{var r=l=>{try{a(t.next(l))}catch(s){c(s)}},o=l=>{try{a(t.throw(l))}catch(s){c(s)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(r,o);a((t=t.apply(e,n)).next())});import{p as Q,d as M,s as X,D as m,a as Z,S as F,b as I,c as tt}from"./styles-0784dbeb-D2jtkjHW.js";import{G as et}from"./graph-C7Ha1UbR.js";import{l as p,c as g,h as x,y as ot,i as st,j as w}from"./ChatView-CBvt1xeu.js";import{r as nt}from"./index-01f381cb-DBY9lC5y.js";import"./index-D9aYYFwz.js";import"./layout-7m7BxbcS.js";import"./index-R2t8B9YY.js";import"./status-DTGp2n9f.js";import"./VueLiveEditor-CvUxIN8u.js";import"./clone-gGpXC3na.js";import"./edges-066a5561-UdLHsJDn.js";import"./createText-ca0c5216-BPPtnnxD.js";import"./line-BdgWlaON.js";import"./array-BKyUJesY.js";import"./path-wcoxYG6a.js";import"//at.alicdn.com/t/c/font_4565805_mtkshfnyzag.js";const h="rect",C="rectWithTitle",it="start",ct="end",rt="divider",lt="roundedWithTitle",at="note",dt="noteGroup",u="statediagram",Et="state",St=`${u}-${Et}`,U="transition",pt="note",Tt="note-edge",_t=`${U} ${Tt}`,ut=`${u}-${pt}`,Dt="cluster",bt=`${u}-${Dt}`,ft="cluster-alt",At=`${u}-${ft}`,V="parent",Y="note",ht="state",N="----",yt=`${N}${Y}`,H=`${N}${V}`,W="fill:none",z="fill: #333",j="c",q="text",K="normal";let y={},S=0;const gt=function(e){const n=Object.keys(e);for(const t of n)e[t]},$t=function(e,n){return n.db.extract(n.db.getRootDocV2()),n.db.getClasses()};function xt(e){return e==null?"":e.classes?e.classes.join(" "):""}function R(e="",n=0,t="",i=N){const c=t!==null&&t.length>0?`${i}${t}`:"";return`${ht}-${e}${c}-${n}`}const A=(e,n,t,i,c,r)=>{const o=t.id,a=xt(i[o]);if(o!=="root"){let l=h;t.start===!0&&(l=it),t.start===!1&&(l=ct),t.type!==m&&(l=t.type),y[o]||(y[o]={id:o,shape:l,description:w.sanitizeText(o,g()),classes:`${a} ${St}`});const s=y[o];t.description&&(Array.isArray(s.description)?(s.shape=C,s.description.push(t.description)):s.description.length>0?(s.shape=C,s.description===o?s.description=[t.description]:s.description=[s.description,t.description]):(s.shape=h,s.description=t.description),s.description=w.sanitizeTextOrArray(s.description,g())),s.description.length===1&&s.shape===C&&(s.shape=h),!s.type&&t.doc&&(p.info("Setting cluster for ",o,G(t)),s.type="group",s.dir=G(t),s.shape=t.type===Z?rt:lt,s.classes=s.classes+" "+bt+" "+(r?At:""));const _={labelStyle:"",shape:s.shape,labelText:s.description,classes:s.classes,style:"",id:o,dir:s.dir,domId:R(o,S),type:s.type,padding:15};if(_.centerLabel=!0,t.note){const d={labelStyle:"",shape:at,labelText:t.note.text,classes:ut,style:"",id:o+yt+"-"+S,domId:R(o,S,Y),type:s.type,padding:15},E={labelStyle:"",shape:dt,labelText:t.note.text,classes:s.classes,style:"",id:o+H,domId:R(o,S,V),type:"group",padding:0};S++;const D=o+H;e.setNode(D,E),e.setNode(d.id,d),e.setNode(o,_),e.setParent(o,D),e.setParent(d.id,D);let T=o,b=d.id;t.note.position==="left of"&&(T=d.id,b=o),e.setEdge(T,b,{arrowhead:"none",arrowType:"",style:W,labelStyle:"",classes:_t,arrowheadStyle:z,labelpos:j,labelType:q,thickness:K})}else e.setNode(o,_)}n&&n.id!=="root"&&(p.trace("Setting node ",o," to be child of its parent ",n.id),e.setParent(o,n.id)),t.doc&&(p.trace("Adding nodes children "),Ct(e,t,t.doc,i,c,!r))},Ct=(e,n,t,i,c,r)=>{p.trace("items",t),t.forEach(o=>{switch(o.stmt){case I:A(e,n,o,i,c,r);break;case m:A(e,n,o,i,c,r);break;case F:{A(e,n,o.state1,i,c,r),A(e,n,o.state2,i,c,r);const a={id:"edge"+S,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:W,labelStyle:"",label:w.sanitizeText(o.description,g()),arrowheadStyle:z,labelpos:j,labelType:q,thickness:K,classes:U};e.setEdge(o.state1.id,o.state2.id,a,S),S++}break}})},G=(e,n=tt)=>{let t=n;if(e.doc)for(let i=0;i<e.doc.length;i++){const c=e.doc[i];c.stmt==="dir"&&(t=c.value)}return t},Rt=function(e,n,t,i){return B(this,null,function*(){p.info("Drawing state diagram (v2)",n),y={},i.db.getDirection();const{securityLevel:c,state:r}=g(),o=r.nodeSpacing||50,a=r.rankSpacing||50;p.info(i.db.getRootDocV2()),i.db.extract(i.db.getRootDocV2()),p.info(i.db.getRootDocV2());const l=i.db.getStates(),s=new et({multigraph:!0,compound:!0}).setGraph({rankdir:G(i.db.getRootDocV2()),nodesep:o,ranksep:a,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});A(s,void 0,i.db.getRootDocV2(),l,i.db,!0);let _;c==="sandbox"&&(_=x("#i"+n));const d=c==="sandbox"?x(_.nodes()[0].contentDocument.body):x("body"),E=d.select(`[id="${n}"]`),D=d.select("#"+n+" g");yield nt(D,s,["barb"],u,n);const T=8;ot.insertTitle(E,"statediagramTitleText",r.titleTopMargin,i.db.getDiagramTitle());const b=E.node().getBBox(),L=b.width+T*2,P=b.height+T*2;E.attr("class",u);const O=E.node().getBBox();st(E,P,L,r.useMaxWidth);const k=`${O.x-T} ${O.y-T} ${L} ${P}`;p.debug(`viewBox ${k}`),E.attr("viewBox",k);const J=document.querySelectorAll('[id="'+n+'"] .edgeLabel .label');for(const $ of J){const v=$.getBBox(),f=document.createElementNS("http://www.w3.org/2000/svg",h);f.setAttribute("rx",0),f.setAttribute("ry",0),f.setAttribute("width",v.width),f.setAttribute("height",v.height),$.insertBefore(f,$.firstChild)}})},wt={setConf:gt,getClasses:$t,draw:Rt},qt={parser:Q,db:M,renderer:wt,styles:X,init:e=>{e.state||(e.state={}),e.state.arrowMarkerAbsolute=e.arrowMarkerAbsolute,M.clear()}};export{qt as diagram};