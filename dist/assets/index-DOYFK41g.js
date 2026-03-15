import{r as a,a as Ve,R as Ge}from"./react-wGySg1uH.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function s(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=s(r);fetch(r.href,i)}})();var ze={exports:{}},ce={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Je=a,Ke=Symbol.for("react.element"),Xe=Symbol.for("react.fragment"),qe=Object.prototype.hasOwnProperty,Ze=Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Qe={key:!0,ref:!0,__self:!0,__source:!0};function Ae(t,n,s){var o,r={},i=null,l=null;s!==void 0&&(i=""+s),n.key!==void 0&&(i=""+n.key),n.ref!==void 0&&(l=n.ref);for(o in n)qe.call(n,o)&&!Qe.hasOwnProperty(o)&&(r[o]=n[o]);if(t&&t.defaultProps)for(o in n=t.defaultProps,n)r[o]===void 0&&(r[o]=n[o]);return{$$typeof:Ke,type:t,key:i,ref:l,props:r,_owner:Ze.current}}ce.Fragment=Xe;ce.jsx=Ae;ce.jsxs=Ae;ze.exports=ce;var e=ze.exports,ue={},me=Ve;ue.createRoot=me.createRoot,ue.hydrateRoot=me.hydrateRoot;const $={border:"#002233",cyan:"#00E5FF",gold:"#FFD700",green:"#00FF88",amber:"#FFAA00",red:"#FF2244",label:"#004455",track:"#001122",dimBlue:"#003344"},se="https://kjle-api.onrender.com/kjle/v1",Me=28849;let ye=!1;function oe(){if(ye||typeof document>"u")return;ye=!0;const t=document.createElement("style");t.textContent=`
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-bar {
      from { width: 0 !important; }
    }
    @keyframes kjle-vbar {
      from { height: 0 !important; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(3px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes kjle-count {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
  `,document.head.appendChild(t)}function P(t,n=1200){const[s,o]=a.useState(0),r=a.useRef(0);return a.useEffect(()=>{const i=r.current;if(r.current=t??0,!t)return;let l,g=null;const c=x=>{g||(g=x);const y=Math.min((x-g)/n,1),C=1-Math.pow(1-y,3);o(Math.round(i+(t-i)*C)),y<1&&(l=requestAnimationFrame(c))};return l=requestAnimationFrame(c),()=>cancelAnimationFrame(l)},[t,n]),s}function de(t){const[n,s]=a.useState({data:null,loading:!0,error:!1});return a.useEffect(()=>{let o=!1;return s({data:null,loading:!0,error:!1}),fetch(t).then(r=>{if(!r.ok)throw new Error(`${r.status}`);return r.json()}).then(r=>{o||s({data:r,loading:!1,error:!1})}).catch(()=>{o||s({data:null,loading:!1,error:!0})}),()=>{o=!0}},[t]),n}function M({w:t="100%",h:n=8,r:s=2}){return e.jsx("div",{style:{width:t,height:n,borderRadius:s,background:`linear-gradient(90deg, ${$.track} 25%, #002233 50%, ${$.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite",flexShrink:0}})}function he({label:t="ERR"}){return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:$.red,letterSpacing:"0.14em"},children:["— ",t," —"]})})}function Le({pct:t,color:n,delay:s="0s"}){return e.jsx("div",{style:{width:"100%",height:2,background:$.track,borderRadius:1,overflow:"hidden"},children:e.jsx("div",{style:{width:`${Math.min(Math.max(t,0),100)}%`,height:"100%",background:n,boxShadow:`0 0 5px ${n}66`,borderRadius:1,animation:`kjle-bar 0.9s cubic-bezier(0.22,1,0.36,1) ${s} both`}})})}function U({children:t,color:n,size:s=10,style:o={}}){return e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:s,color:n,lineHeight:1,letterSpacing:"0.03em",...o},children:t})}function D({children:t,color:n=$.label,size:s=8,spacing:o="0.18em",weight:r=700,style:i={}}){return e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:r,fontSize:s,color:n,letterSpacing:o,textTransform:"uppercase",lineHeight:1,...i},children:t})}function et(){oe();const{data:t,loading:n,error:s}=de(`${se}/segments/summary`),o=(t==null?void 0:t.counts)??{},r=(t==null?void 0:t.percentages)??{},i=o.total_segmented??0,l=o.hot??0,g=o.warm??0,c=o.cold??0,x=P(i,1400),y=P(l,1100),C=P(g,1200),d=P(c,1300),u=[{key:"HOT",val:y,pct:r.hot_pct??0,color:$.green,delay:"0s"},{key:"WARM",val:C,pct:r.warm_pct??0,color:$.amber,delay:"0.08s"},{key:"COLD",val:d,pct:r.cold_pct??0,color:$.dimBlue,delay:"0.16s"}];return s?e.jsx(he,{label:"SEGMENT ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:7},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0},children:[n?e.jsx(M,{w:110,h:38,r:2}):e.jsx(U,{color:$.cyan,size:36,style:{animation:"kjle-count 0.5s ease both",letterSpacing:"0.02em"},children:x.toLocaleString()}),e.jsx(D,{color:$.label,size:8,spacing:"0.2em",children:"Records Ingested"})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:6,flex:1,justifyContent:"center"},children:u.map(({key:p,val:F,pct:f,color:m,delay:w})=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3},children:[e.jsx(D,{color:m,size:8,spacing:"0.14em",children:p}),e.jsx("div",{style:{display:"flex",alignItems:"center",gap:5},children:n?e.jsx(M,{w:60,h:9}):e.jsxs(e.Fragment,{children:[e.jsx(U,{color:m,size:10,children:F.toLocaleString()}),e.jsxs(D,{color:$.label,size:7,spacing:"0.08em",style:{fontFamily:"'Rajdhani',sans-serif"},children:[typeof f=="number"?f.toFixed(1):"0.0","%"]})]})})]}),n?e.jsx(M,{h:2}):e.jsx(Le,{pct:f,color:m,delay:w})]},p))})]})}function tt(){oe();const{data:t,loading:n,error:s}=de(`${se}/pain/distribution`),o={"0-20":10,"21-40":30,"41-60":50,"61-80":70,"81-100":90},r=(t==null?void 0:t.distribution)??[];let i=0,l=0;r.forEach(({range:h,count:b})=>{const v=o[h]??50;l+=v*(b??0),i+=b??0});const g=i>0?Math.round(l/i):0,c=h=>{var b;return((b=r.find(v=>v.range===h))==null?void 0:b.count)??0},x=c("81-100"),y=c("61-80"),C=c("41-60"),d=g>=70?$.green:g>=40?$.amber:$.red,u=34,p=48,F=48,f=6,m=2*Math.PI*u,w=m*(g/100),k=m-w;return s?e.jsx(he,{label:"PAIN ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",alignItems:"center",gap:6},children:[e.jsx("div",{style:{position:"relative",width:96,height:96,flexShrink:0},children:n?e.jsx("div",{style:{width:96,height:96,borderRadius:"50%",background:$.track,opacity:.35}}):e.jsxs("svg",{width:"96",height:"96",viewBox:"0 0 96 96",children:[e.jsx("circle",{cx:p,cy:F,r:u,fill:"none",stroke:$.track,strokeWidth:f}),e.jsx("circle",{cx:p,cy:F,r:u,fill:"none",stroke:d,strokeWidth:f,strokeLinecap:"round",strokeDasharray:`${w} ${k}`,transform:`rotate(-90 ${p} ${F})`,style:{filter:`drop-shadow(0 0 5px ${d}99)`,transition:"stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1), stroke 0.4s"}}),e.jsx("text",{x:p,y:F-1,textAnchor:"middle",dominantBaseline:"middle",fill:d,fontFamily:"'Share Tech Mono',monospace",fontSize:"22",children:g}),e.jsx("text",{x:p,y:F+14,textAnchor:"middle",dominantBaseline:"middle",fill:$.label,fontFamily:"'Rajdhani',sans-serif",fontSize:"7",fontWeight:"700",letterSpacing:"3",children:"AVG / 100"})]})}),e.jsx("div",{style:{display:"flex",gap:4,width:"100%",marginTop:"auto"},children:[{key:"CRITICAL",val:x,color:$.red},{key:"HIGH 60+",val:y,color:$.amber},{key:"ACTIVE",val:C,color:$.cyan}].map(({key:h,val:b,color:v})=>e.jsxs("div",{style:{flex:1,background:`${v}0e`,border:`1px solid ${v}28`,borderRadius:2,padding:"4px 3px 3px",display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[n?e.jsx(M,{w:"80%",h:10}):e.jsx(U,{color:v,size:10,children:b.toLocaleString()}),e.jsx(D,{color:v,size:7,spacing:"0.08em",style:{opacity:.65},children:h})]},h))})]})}function nt(){var f,m,w;oe();const[t,n]=a.useState(null),[s,o]=a.useState(null),[r,i]=a.useState(!0),[l,g]=a.useState(!1);a.useEffect(()=>{let k=!1;return i(!0),g(!1),Promise.all([fetch(`${se}/push/demoenginez/status`).then(h=>h.ok?h.json():Promise.reject()),fetch(`${se}/push/voicedrop/status`).then(h=>h.ok?h.json():Promise.reject())]).then(([h,b])=>{k||(n(h),o(b),i(!1))}).catch(()=>{k||(g(!0),i(!1))}),()=>{k=!0}},[]);const c=((f=t==null?void 0:t.eligible_for_push)==null?void 0:f.total)??0,x=((m=s==null?void 0:s.eligible_for_push)==null?void 0:m.total)??0,C=((w=t==null?void 0:t.eligible_for_push)==null?void 0:w.hot)??0,d=P(c),u=P(x),p=P(C),F=[{id:"DE",label:"DemoEnginez",count:d,total:c,color:$.cyan,delay:"0s"},{id:"VD",label:"VoiceDrop",count:u,total:x,color:$.green,delay:"0.1s"}];return l?e.jsx(he,{label:"FIT ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:8,justifyContent:"center"},children:[F.map(({id:k,label:h,count:b,total:v,color:S,delay:R})=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:5},children:[e.jsx("div",{style:{width:22,height:22,borderRadius:2,flexShrink:0,background:`${S}14`,border:`1px solid ${S}3a`,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(D,{color:S,size:8,spacing:"0.03em",weight:700,children:k})}),e.jsxs("div",{style:{flex:1,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(D,{color:"rgba(255,255,255,0.38)",size:10,spacing:"0.05em",weight:600,children:h}),r?e.jsx(M,{w:52,h:10}):e.jsx(U,{color:S,size:11,children:b.toLocaleString()})]})]}),r?e.jsx(M,{h:2}):e.jsx(Le,{pct:v/Me*100,color:S,delay:R})]},k)),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:6,marginTop:"auto",borderTop:`1px solid ${$.border}`},children:[e.jsx(D,{color:$.label,size:8,spacing:"0.14em",children:"Fit Overlap"}),r?e.jsx(M,{w:60,h:10}):e.jsx(U,{color:$.gold,size:11,children:p.toLocaleString()})]})]})}const pe={phone:91,email:67,website:78};function st(){oe();const{data:t,loading:n}=de(`${se}/pipeline/status`),s=(t==null?void 0:t.total_leads)??Me,o=(t==null?void 0:t.phone_coverage_pct)??pe.phone,r=(t==null?void 0:t.email_coverage_pct)??pe.email,i=(t==null?void 0:t.website_coverage_pct)??pe.website,l=Math.round(s*Math.min(o,r,i)/100),g=s-Math.round(s*Math.max(o,r,i)/100),c=P(Math.round(o)),x=P(Math.round(r)),y=P(Math.round(i)),C=[{key:"PHONE",pct:o,anim:c,color:$.green,delay:"0s"},{key:"EMAIL",pct:r,anim:x,color:$.gold,delay:"0.08s"},{key:"WEBSITE",pct:i,anim:y,color:$.cyan,delay:"0.16s"}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:5},children:[e.jsx("div",{style:{display:"flex",gap:5,flex:1,alignItems:"flex-end"},children:C.map(({key:d,pct:u,anim:p,color:F,delay:f})=>e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3},children:[e.jsx("div",{style:{flex:1,width:"100%",minHeight:38,background:$.track,borderRadius:2,overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end"},children:n?e.jsx("div",{style:{width:"100%",height:"50%",background:`linear-gradient(90deg, ${$.track} 25%, #002233 50%, ${$.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite"}}):e.jsx("div",{style:{width:"100%",height:`${u}%`,background:`linear-gradient(to top, ${F}, ${F}55)`,boxShadow:`0 0 8px ${F}44`,borderRadius:"1px 1px 0 0",animation:`kjle-vbar 1s cubic-bezier(0.22,1,0.36,1) ${f} both`}})}),n?e.jsx(M,{w:"70%",h:14}):e.jsxs(U,{color:F,size:13,style:{animation:"kjle-count 0.5s ease both"},children:[p,"%"]}),e.jsx(D,{color:$.label,size:7,spacing:"0.1em",children:d})]},d))}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",paddingTop:5,borderTop:`1px solid ${$.border}`,flexShrink:0},children:[{key:"VALID",val:l.toLocaleString(),color:$.green},{key:"ERRORS",val:Math.max(g,0).toLocaleString(),color:$.amber},{key:"TOTAL",val:s.toLocaleString(),color:$.label}].map(({key:d,val:u,color:p})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:2},children:[n?e.jsx(M,{w:36,h:9}):e.jsx(U,{color:p,size:8,children:u}),e.jsx(D,{color:$.label,size:7,spacing:"0.1em",children:d})]},d))})]})}function rt(t){return t>=70?$.green:t>=40?$.amber:$.red}function ot(t="",n=12){return t.length>n?t.slice(0,n-1)+"…":t}function it(){oe();const{data:t,loading:n,error:s}=de(`${se}/pain/by-niche`),r=[...(t==null?void 0:t.niches)??[]].sort((i,l)=>(l.avg_pain??0)-(i.avg_pain??0)).slice(0,5);return s?e.jsx(he,{label:"NICHE ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:0},children:[e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:5,justifyContent:"center"},children:n?Array.from({length:5}).map((i,l)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,opacity:1-l*.15},children:[e.jsx(M,{w:10,h:9}),e.jsx(M,{w:62,h:8}),e.jsx(M,{h:2}),e.jsx(M,{w:18,h:9})]},l)):r.map((i,l)=>{const g=Math.round(i.avg_pain??0),c=rt(g),x=ot(i.niche_slug??i.niche??"—",12);return e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,animation:`kjle-fadein 0.4s ease ${l*.06}s both`},children:[e.jsx(U,{color:$.gold,size:8,style:{width:10,textAlign:"right",flexShrink:0},children:l+1}),e.jsx(D,{color:"rgba(255,255,255,0.42)",size:9,spacing:"0.04em",weight:600,style:{width:68,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"inline-block"},children:x}),e.jsx("div",{style:{flex:1,height:2,background:$.track,borderRadius:1,overflow:"hidden"},children:e.jsx("div",{style:{width:`${g}%`,height:"100%",background:c,boxShadow:`0 0 4px ${c}55`,borderRadius:1,animation:`kjle-bar 0.8s cubic-bezier(0.22,1,0.36,1) ${l*.07}s both`}})}),e.jsx(U,{color:c,size:10,style:{width:20,textAlign:"right",flexShrink:0},children:g})]},i.niche_slug??l)})}),e.jsx("div",{style:{display:"flex",justifyContent:"center",paddingTop:5,marginTop:2,borderTop:`1px solid ${$.border}`,flexShrink:0},children:e.jsx(D,{color:$.label,size:7,spacing:"0.2em",children:"Top 5 Pain"})})]})}const E={panel:"#000D1A",border:"#002233",cyan:"#00E5FF",gold:"#FFD700",green:"#00FF88",amber:"#FFAA00",red:"#FF2244",label:"#004455",track:"#001122",dim:"#002233",card:"#000810"},ge="https://kjle-api.onrender.com/kjle/v1";let be=!1;function Ne(){if(be||typeof document>"u")return;be=!0;const t=document.createElement("style");t.textContent=`
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-bar { from { width: 0 !important; } }
    @keyframes kjle-fadein {
      from { opacity:0; transform:translateY(4px); }
      to   { opacity:1; transform:translateY(0);   }
    }
    @keyframes radar-sweep {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dot-ping {
      0%   { transform: scale(1);   opacity: 0.85; }
      100% { transform: scale(2.6); opacity: 0;    }
    }

    /* Custom scrollbar */
    .kjle-scroll::-webkit-scrollbar       { width: 2px; }
    .kjle-scroll::-webkit-scrollbar-track { background: ${E.dim}; }
    .kjle-scroll::-webkit-scrollbar-thumb { background: ${E.label}; border-radius: 1px; }

    /* Niche card hover */
    .niche-card { transition: border-color 0.18s, box-shadow 0.18s; }
    .niche-card:hover {
      border-color: rgba(0,229,255,0.13) !important;
      box-shadow: 0 0 8px rgba(0,229,255,0.07);
    }
  `,document.head.appendChild(t)}function xe(t){const[n,s]=a.useState({data:null,loading:!0,error:!1});return a.useEffect(()=>{let o=!1;return s({data:null,loading:!0,error:!1}),fetch(t).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(r=>{o||s({data:r,loading:!1,error:!1})}).catch(()=>{o||s({data:null,loading:!1,error:!0})}),()=>{o=!0}},[t]),n}function le({w:t="100%",h:n=8,r:s=2}){return e.jsx("div",{style:{width:t,height:n,borderRadius:s,flexShrink:0,background:`linear-gradient(90deg, ${E.track} 25%, #002233 50%, ${E.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite"}})}function De({label:t="ERR"}){return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:E.red,letterSpacing:"0.14em"},children:["— ",t," —"]})})}function ee({children:t,color:n,size:s=10,style:o={}}){return e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:s,color:n,lineHeight:1,letterSpacing:"0.03em",...o},children:t})}function Z({children:t,color:n=E.label,size:s=8,spacing:o="0.18em",weight:r=700,style:i={}}){return e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:r,fontSize:s,color:n,letterSpacing:o,textTransform:"uppercase",lineHeight:1,...i},children:t})}function lt(t="",n=14){return t.length>n?t.slice(0,n-1)+"…":t}function at(){Ne();const{data:t,loading:n,error:s}=xe(`${ge}/segments/by-niche`),o=[...(t==null?void 0:t.niches)??[]].sort((r,i)=>(i.total??0)-(r.total??0));return s?e.jsx(De,{label:"NICHE ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:0},children:[e.jsx("div",{className:"kjle-scroll",style:{flex:1,overflowY:"auto",overflowX:"hidden",display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,alignContent:"start",paddingRight:2},children:n?Array.from({length:8}).map((r,i)=>e.jsxs("div",{style:{background:E.card,border:`1px solid ${E.border}`,borderRadius:2,padding:5,display:"flex",flexDirection:"column",gap:4},children:[e.jsx(le,{h:9}),e.jsx(le,{h:1,r:0}),e.jsx(le,{h:7,w:"60%"})]},i)):o.map((r,i)=>{const l=r.total??0,g=r.hot??0,c=r.warm??0;r.cold??l-g-c;const x=l>0?g/l*100:0,y=l>0?c/l*100:0,C=lt(r.niche??r.niche_slug??"—",14);return e.jsxs("div",{className:"niche-card",style:{background:E.card,border:`1px solid ${E.border}`,borderRadius:2,padding:5,display:"flex",flexDirection:"column",gap:4,animation:`kjle-fadein 0.35s ease ${Math.min(i,12)*.03}s both`},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",gap:3},children:[e.jsx(Z,{color:"rgba(255,255,255,0.45)",size:9,spacing:"0.04em",weight:600,style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1},children:C}),e.jsx(ee,{color:E.cyan,size:9,style:{flexShrink:0},children:l.toLocaleString()})]}),e.jsxs("div",{style:{width:"100%",height:1,display:"flex",borderRadius:0,overflow:"hidden"},children:[e.jsx("div",{style:{width:`${x}%`,background:E.green,flexShrink:0}}),e.jsx("div",{style:{width:`${y}%`,background:E.amber,flexShrink:0}}),e.jsx("div",{style:{flex:1,background:E.dim}})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsxs(ee,{color:E.green,size:7,children:[g.toLocaleString()," HOT"]}),e.jsxs(ee,{color:E.amber,size:7,children:[c.toLocaleString()," WARM"]})]})]},r.niche??i)})}),e.jsx("div",{style:{flexShrink:0,borderTop:`1px solid ${E.border}`,paddingTop:5,marginTop:4,display:"flex",justifyContent:"center"},children:n?e.jsx(le,{w:100,h:8}):e.jsxs(Z,{color:E.label,size:8,spacing:"0.18em",children:[o.length," Niches Tracked"]})})]})}function ct(t,n,s,o){const r=2*Math.PI/n,i=t*r+(t%2===0?.3:-.3),l=.25+Math.min(s,100)/100*.6,g=o*l,c=g*Math.cos(i-Math.PI/2),x=g*Math.sin(i-Math.PI/2);return{x:c,y:x}}function dt(t){return!t||t<=0?3:Math.min(Math.max(Math.round(Math.log(t)*1.2),3),9)}function ht(t,n){if(!n)return E.cyan;const s=t/n;return s>.15?E.green:s>=.05?E.amber:E.cyan}function pt(){var F;Ne();const t=xe(`${ge}/segments/summary`),n=xe(`${ge}/pain/by-niche`),[s,o]=a.useState(new Set),r=a.useRef(s);r.current=s;const[i,l]=a.useState(null),g=t.loading||n.loading,c=t.error&&n.error,y=[...((F=n.data)==null?void 0:F.niches)??[]].sort((f,m)=>(m.total??m.count??0)-(f.total??f.count??0)).slice(0,8);if(a.useEffect(()=>{if(!y.length)return;const f=y.map((m,w)=>{const k=setInterval(()=>{o(b=>{const v=new Set(b);return v.add(w),v}),setTimeout(()=>{o(b=>{const v=new Set(b);return v.delete(w),v})},1200)},3e3+w*600),h=setTimeout(()=>{o(b=>{const v=new Set(b);return v.add(w),v}),setTimeout(()=>{o(b=>{const v=new Set(b);return v.delete(w),v})},1200)},w*600);return()=>{clearInterval(k),clearTimeout(h)}});return()=>f.forEach(m=>m())},[y.length]),c)return e.jsx(De,{label:"RADAR ERR"});const C=220,d=C/2,u=C/2,p=C*.42;return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",alignItems:"center",justifyContent:"space-between",position:"relative"},children:[e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",width:"100%",position:"relative",background:"radial-gradient(circle, #001a2a 0%, #000D1A 100%)",overflow:"hidden"},children:[e.jsxs("svg",{width:C,height:C,viewBox:`0 0 ${C} ${C}`,style:{overflow:"visible"},children:[[.3,.6,.9].map((f,m)=>e.jsx("circle",{cx:d,cy:u,r:p*f,fill:"none",stroke:E.border,strokeWidth:.5,opacity:.7+m*.1},m)),[[d,u-p*.92,d,u+p*.92],[d-p*.92,u,d+p*.92,u]].map(([f,m,w,k],h)=>e.jsx("line",{x1:f,y1:m,x2:w,y2:k,stroke:"#001a2a",strokeWidth:1},h)),e.jsxs("g",{style:{transformOrigin:`${d}px ${u}px`,animation:"radar-sweep 4s linear infinite"},children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sweepGrad",cx:"0%",cy:"50%",r:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:E.cyan,stopOpacity:"0.55"}),e.jsx("stop",{offset:"100%",stopColor:E.cyan,stopOpacity:"0"})]}),e.jsx("clipPath",{id:"wedgeClip",children:e.jsx("path",{d:`M${d},${u} L${d},${u-p*.92} A${p*.92},${p*.92} 0 0,1 ${d+p*.92*Math.sin(.38)},${u-p*.92*Math.cos(.38)} Z`})})]}),e.jsx("circle",{cx:d,cy:u,r:p*.92,fill:"url(#sweepGrad)",clipPath:"url(#wedgeClip)",opacity:.6}),e.jsx("line",{x1:d,y1:u,x2:d,y2:u-p*.92,stroke:E.cyan,strokeWidth:1,opacity:.65})]}),e.jsx("line",{x1:d-6,y1:u,x2:d+6,y2:u,stroke:E.border,strokeWidth:1}),e.jsx("line",{x1:d,y1:u-6,x2:d,y2:u+6,stroke:E.border,strokeWidth:1}),!g&&y.map((f,m)=>{const w=f.avg_pain??50,k=f.total??f.count??0,h=f.hot??0,{x:b,y:v}=ct(m,y.length,w,p),S=dt(k),R=ht(h,k),L=s.has(m),I=d+b,A=u+v;return e.jsxs("g",{children:[L&&e.jsx("circle",{cx:I,cy:A,r:S,fill:"none",stroke:R,strokeWidth:1,style:{animation:"dot-ping 1.2s ease-out both"},opacity:.8}),e.jsx("circle",{cx:I,cy:A,r:S/2,fill:R,style:{filter:`drop-shadow(0 0 ${S}px ${R}99)`,cursor:"pointer"},onMouseEnter:H=>l({svgX:I,svgY:A,niche:f,color:R}),onMouseLeave:()=>l(null)})]},f.niche_slug??f.niche??m)}),g&&[[d+40,u-55],[d-50,u+20],[d+55,u+30],[d-20,u-45]].map(([f,m],w)=>e.jsx("circle",{cx:f,cy:m,r:4,fill:E.border,opacity:.4+w*.1},w))]}),i&&e.jsxs("div",{style:{position:"absolute",left:`calc(50% + ${i.svgX-C/2}px + 10px)`,top:`calc(50% + ${i.svgY-C/2}px - 24px)`,background:E.panel,border:`1px solid ${E.cyan}33`,borderRadius:2,padding:"5px 8px",pointerEvents:"none",zIndex:50,display:"flex",flexDirection:"column",gap:2,minWidth:100},children:[e.jsx(Z,{color:i.color,size:9,spacing:"0.06em",weight:700,style:{textTransform:"none",letterSpacing:"0.06em"},children:i.niche.niche_slug??i.niche.niche}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx(ee,{color:E.cyan,size:8,children:(i.niche.total??i.niche.count??0).toLocaleString()}),e.jsx(Z,{color:E.label,size:7,spacing:"0.08em",children:"leads"})]}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx(ee,{color:i.color,size:8,children:Math.round(i.niche.avg_pain??0)}),e.jsx(Z,{color:E.label,size:7,spacing:"0.08em",children:"avg pain"})]})]})]}),e.jsxs("div",{style:{flexShrink:0,paddingTop:5,display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderTop:`1px solid ${E.border}`,width:"100%"},children:[e.jsx(Z,{color:E.cyan,size:9,spacing:"0.22em",weight:700,children:"Lead Radar"}),e.jsx(ee,{color:E.gold,size:7,children:"GEO-PAIN MATRIX"})]})]})}const j={border:"#002233",cyan:"#00E5FF",gold:"#FFD700",green:"#00FF88",amber:"#FFAA00",red:"#FF2244",label:"#004455",track:"#001122"},te="https://kjle-api.onrender.com/kjle/v1",ft=28849;let je=!1;function Oe(){if(je||typeof document>"u")return;je=!0;const t=document.createElement("style");t.textContent=`
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-bar { from { width: 0 !important; } }
    @keyframes kjle-pulse {
      0%, 100% { opacity: 1;   box-shadow: 0 0 4px currentColor; }
      50%       { opacity: 0.3; box-shadow: none; }
    }
    @keyframes kjle-scan {
      0%   { opacity: 0.3; }
      50%  { opacity: 1;   }
      100% { opacity: 0.3; }
    }
  `,document.head.appendChild(t)}function O({w:t="100%",h:n=8,r:s=2}){return e.jsx("div",{style:{width:t,height:n,borderRadius:s,flexShrink:0,background:`linear-gradient(90deg, ${j.track} 25%, #002233 50%, ${j.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite"}})}function ut({label:t="ERR"}){return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:j.red,letterSpacing:"0.14em"},children:["— ",t," —"]})})}function V({children:t,color:n,size:s=10,style:o={}}){return e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:s,color:n,lineHeight:1,letterSpacing:"0.03em",...o},children:t})}function B({children:t,color:n=j.label,size:s=8,spacing:o="0.18em",weight:r=700,style:i={}}){return e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:r,fontSize:s,color:n,letterSpacing:o,textTransform:"uppercase",lineHeight:1,...i},children:t})}function X(t,n=1100){const[s,o]=a.useState(0),r=a.useRef(0);return a.useEffect(()=>{const i=r.current;if(r.current=t??0,!t)return;let l,g=null;const c=x=>{g||(g=x);const y=Math.min((x-g)/n,1),C=1-Math.pow(1-y,3);o(Math.round(i+(t-i)*C)),y<1&&(l=requestAnimationFrame(c))};return l=requestAnimationFrame(c),()=>cancelAnimationFrame(l)},[t,n]),s}async function ne(t){const n=await fetch(t);if(!n.ok)throw new Error(n.status);return n.json()}function Se({pct:t,color:n,delay:s="0s",height:o=2}){return e.jsx("div",{style:{width:"100%",height:o,background:j.track,borderRadius:1,overflow:"hidden",flexShrink:0},children:e.jsx("div",{style:{width:`${Math.min(Math.max(t??0,0),100)}%`,height:"100%",background:n,boxShadow:`0 0 5px ${n}55`,borderRadius:1,animation:`kjle-bar 0.9s cubic-bezier(0.22,1,0.36,1) ${s} both`}})})}function Pe({label:t,color:n}){return e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:n,background:`${n}14`,border:`1px solid ${n}33`,borderRadius:2,padding:"2px 5px 1px",lineHeight:1.4,flexShrink:0},children:t})}function gt({color:t,pulse:n=!1,size:s=4}){return e.jsx("span",{style:{display:"inline-block",width:s,height:s,borderRadius:"50%",background:t,boxShadow:`0 0 4px ${t}`,flexShrink:0,color:t,animation:n?"kjle-pulse 2s ease-in-out infinite":"none"}})}function xt(){var w,k,h,b,v,S,R,L,I,A,H;Oe();const[t,n]=a.useState(null),[s,o]=a.useState(null),[r,i]=a.useState(null),[l,g]=a.useState(!0),[c,x]=a.useState(!1);a.useEffect(()=>{let T=!1;return g(!0),x(!1),Promise.all([ne(`${te}/push/demoenginez/status`),ne(`${te}/push/voicedrop/status`),ne(`${te}/segments/summary`)]).then(([Y,ie,Ye])=>{T||(n(Y),o(ie),i(Ye),g(!1))}).catch(()=>{T||(x(!0),g(!1))}),()=>{T=!0}},[]);const y=((w=r==null?void 0:r.counts)==null?void 0:w.total_segmented)??ft,C=X(((k=t==null?void 0:t.eligible_for_push)==null?void 0:k.hot)??0),d=X(((h=t==null?void 0:t.eligible_for_push)==null?void 0:h.warm)??0),u=X(((b=t==null?void 0:t.eligible_for_push)==null?void 0:b.total)??0),p=X(((v=s==null?void 0:s.eligible_for_push)==null?void 0:v.hot)??0),F=X(((S=s==null?void 0:s.eligible_for_push)==null?void 0:S.warm)??0),f=X(((R=s==null?void 0:s.eligible_for_push)==null?void 0:R.total)??0);if(c)return e.jsx(ut,{label:"PIPELINE ERR"});const m=[{id:"DE",name:"DemoEnginez",color:j.cyan,status:l?"—":"READY",hot:C,hotRaw:((L=t==null?void 0:t.eligible_for_push)==null?void 0:L.hot)??0,warm:d,warmRaw:((I=t==null?void 0:t.eligible_for_push)==null?void 0:I.warm)??0,total:u,opacity:1},{id:"VD",name:"VoiceDrop OS",color:j.green,status:l?"—":"READY",hot:p,hotRaw:((A=s==null?void 0:s.eligible_for_push)==null?void 0:A.hot)??0,warm:F,warmRaw:((H=s==null?void 0:s.eligible_for_push)==null?void 0:H.warm)??0,total:f,opacity:1},{id:"SR",name:"SchemaRanker",color:j.gold,status:"SOON",hot:0,hotRaw:0,warm:0,warmRaw:0,total:0,opacity:.45}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:0},children:[e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-evenly"},children:m.map((T,Y)=>e.jsxs("div",{style:{opacity:T.opacity},children:[Y>0&&e.jsx("div",{style:{height:1,background:j.border,margin:"6px 0"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6},children:[e.jsx("div",{style:{width:22,height:22,borderRadius:2,flexShrink:0,background:`${T.color}14`,border:`1px solid ${T.color}3a`,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(B,{color:T.color,size:8,spacing:"0.03em",weight:700,children:T.id})}),e.jsx(B,{color:"rgba(255,255,255,0.5)",size:10,spacing:"0.05em",weight:600,style:{flex:1,fontFamily:"'Rajdhani',sans-serif"},children:T.name}),e.jsx(Pe,{label:T.status,color:T.status==="READY"?j.green:T.status==="SOON"?j.gold:j.amber})]}),e.jsxs("div",{style:{display:"flex",gap:6},children:[e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(B,{color:j.green,size:7,spacing:"0.1em",children:"HOT"}),l?e.jsx(O,{w:30,h:7}):e.jsx(V,{color:j.green,size:8,children:T.hot.toLocaleString()})]}),l?e.jsx(O,{h:2}):e.jsx(Se,{pct:T.hotRaw/y*100,color:j.green,delay:`${Y*.1}s`})]}),e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:3},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(B,{color:j.amber,size:7,spacing:"0.1em",children:"WARM"}),l?e.jsx(O,{w:30,h:7}):e.jsx(V,{color:j.amber,size:8,children:T.warm.toLocaleString()})]}),l?e.jsx(O,{h:2}):e.jsx(Se,{pct:T.warmRaw/y*100,color:j.amber,delay:`${Y*.1+.08}s`})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:4,marginTop:5},children:[e.jsx(B,{color:j.label,size:7,spacing:"0.1em",children:"Total Eligible"}),l?e.jsx(O,{w:50,h:9}):e.jsxs(e.Fragment,{children:[e.jsx(V,{color:T.color,size:11,children:T.total.toLocaleString()}),e.jsxs(V,{color:j.label,size:8,children:["/ ",y.toLocaleString()]})]})]})]},T.id))}),e.jsxs("div",{style:{flexShrink:0,paddingTop:8,borderTop:`1px solid ${j.border}`,display:"flex",flexDirection:"column",gap:4},children:[e.jsx("button",{onClick:()=>console.log("PUSH ALL HOT triggered"),style:{width:"100%",background:`${j.green}11`,border:`1px solid ${j.green}33`,borderRadius:2,padding:"6px 0 5px",cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:j.green,transition:"background 0.15s, border-color 0.15s"},onMouseEnter:T=>{T.currentTarget.style.background=`${j.green}1e`,T.currentTarget.style.borderColor=`${j.green}55`},onMouseLeave:T=>{T.currentTarget.style.background=`${j.green}11`,T.currentTarget.style.borderColor=`${j.green}33`},children:"▶ Push All Hot"}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(B,{color:j.label,size:7,spacing:"0.14em",children:"Last Push: —"})})]})]})}function mt(){var w,k;Oe();const[t,n]=a.useState(null),[s,o]=a.useState(null),[r,i]=a.useState(null),[l,g]=a.useState(!0),[c,x]=a.useState(!1),[y,C]=a.useState(null),d=async(h=!1)=>{h&&g(!0);let b=null,v=null,S=null,R=!1;try{b=await ne(`${te}/health`),R=(b==null?void 0:b.status)==="ok"}catch{R=!1}try{v=await ne(`${te}/scheduler/status`)}catch{}try{S=await ne(`${te}/costs`)}catch{}n(b),o(v),i(S),C(R),h&&g(!1)};a.useEffect(()=>{d(!0)},[]),a.useEffect(()=>{const h=setInterval(()=>d(!1),6e4);return()=>clearInterval(h)},[]);const u=async()=>{x(!0),await d(!1),setTimeout(()=>x(!1),1500)},p=(((w=s==null?void 0:s.jobs)==null?void 0:w.length)??0)>0,F=((s==null?void 0:s.jobs)??[]).slice(0,4),f=((k=r==null?void 0:r.summary)==null?void 0:k.total_cost_usd)??null,m=[{label:"API Server",status:y===null?"—":y?"ONLINE":"OFFLINE",color:y===null?j.label:y?j.green:j.red,pulse:y===!0},{label:"Database",status:y===null?"—":y?"CONNECTED":"OFFLINE",color:y===null?j.label:y?j.green:j.red,pulse:y===!0},{label:"Scheduler",status:p?"RUNNING":"IDLE",color:p?j.green:j.amber,pulse:p}];return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:8},children:[e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:5,flexShrink:0},children:m.map(({label:h,status:b,color:v,pulse:S})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7},children:[l?e.jsx(O,{w:4,h:4,r:2}):e.jsx(gt,{color:v,pulse:S,size:4}),e.jsx(B,{color:"rgba(255,255,255,0.35)",size:9,spacing:"0.06em",weight:600,style:{flex:1,fontFamily:"'Rajdhani',sans-serif"},children:h}),l?e.jsx(O,{w:50,h:14}):e.jsx(Pe,{label:b,color:v})]},h))}),e.jsx("div",{style:{height:1,background:j.border,flexShrink:0}}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:4,overflow:"hidden"},children:l?Array.from({length:3}).map((h,b)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",gap:8,opacity:1-b*.2},children:[e.jsx(O,{w:"55%",h:8}),e.jsx(O,{w:"30%",h:8})]},b)):F.length===0?e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flex:1},children:e.jsx(B,{color:j.label,size:8,spacing:"0.14em",children:"No jobs registered"})}):F.map((h,b)=>{const v=(h.job_name??h.id??"—").slice(0,18),S=h.next_run??"—",R=h.last_status??"—",L=R==="success"?j.green:R==="partial"?j.amber:j.label;let I="—";if(S&&S!=="—")try{const A=new Date(S),H=String(A.getUTCHours()).padStart(2,"0"),T=String(A.getUTCMinutes()).padStart(2,"0");I=`${H}:${T}Z`}catch{I=S.slice(11,16)+"Z"}return e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6},children:[e.jsx(V,{color:j.label,size:8,style:{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:v}),e.jsx(V,{color:L,size:7,style:{flexShrink:0},children:R.slice(0,7).toUpperCase()}),e.jsx(V,{color:j.cyan,size:8,style:{flexShrink:0,minWidth:38,textAlign:"right"},children:I})]},h.job_name??b)})}),e.jsxs("div",{style:{flexShrink:0,display:"flex",flexDirection:"column",gap:4,paddingTop:4,borderTop:`1px solid ${j.border}`},children:[e.jsx("button",{onClick:u,disabled:c,style:{width:"100%",background:c?`${j.amber}11`:`${j.cyan}11`,border:`1px solid ${c?j.amber:j.cyan}33`,borderRadius:2,padding:"6px 0 5px",cursor:c?"default":"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:c?j.amber:j.cyan,transition:"all 0.2s",animation:c?"kjle-scan 0.8s ease-in-out infinite":"none"},onMouseEnter:h=>{c||(h.currentTarget.style.background=`${j.cyan}1e`,h.currentTarget.style.borderColor=`${j.cyan}55`)},onMouseLeave:h=>{c||(h.currentTarget.style.background=`${j.cyan}11`,h.currentTarget.style.borderColor=`${j.cyan}33`)},children:c?"◈ Scanning...":"◈ Run Diagnostics"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(B,{color:j.label,size:7,spacing:"0.14em",children:"MTD Cost"}),l?e.jsx(O,{w:50,h:9}):e.jsx(V,{color:j.green,size:10,children:f!==null?`$${f.toFixed(3)}`:"—"})]})]})]})}const z={panel:"#000D1A",border:"#002233",cyan:"#00E5FF",green:"#00FF88",amber:"#FFAA00",red:"#FF2244",label:"#004455",track:"#001122",card:"#000810"},yt="https://kjle-api.onrender.com/kjle/v1";let ke=!1;function bt(){if(ke||typeof document>"u")return;ke=!0;const t=document.createElement("style");t.textContent=`
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes kjle-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes kjle-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }

    /* Scrollbars */
    .kjle-scroll::-webkit-scrollbar       { width: 2px; }
    .kjle-scroll::-webkit-scrollbar-track { background: #002233; }
    .kjle-scroll::-webkit-scrollbar-thumb { background: #004455; border-radius: 1px; }

    /* Log row hover */
    .log-row:hover { background: #001a2a !important; }

    /* Segment card hover */
    .seg-card { transition: border-color 0.18s, box-shadow 0.18s; }
    .seg-card:hover {
      border-color: rgba(0,229,255,0.13) !important;
      box-shadow: 0 0 8px rgba(0,229,255,0.06);
    }

    /* Action button hover */
    .seg-btn-de:hover { background: rgba(0,229,255,0.12) !important; border-color: rgba(0,229,255,0.45) !important; }
    .seg-btn-vd:hover { background: rgba(0,255,136,0.12) !important; border-color: rgba(0,255,136,0.45) !important; }

    /* Filter pill hover */
    .filter-pill:hover { border-color: rgba(0,229,255,0.35) !important; }
  `,document.head.appendChild(t)}function fe({w:t="100%",h:n=8,r:s=2}){return e.jsx("div",{style:{width:t,height:n,borderRadius:s,flexShrink:0,background:`linear-gradient(90deg, ${z.track} 25%, #002233 50%, ${z.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite"}})}function jt({label:t="ERR"}){return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:z.red,letterSpacing:"0.14em"},children:["— ",t," —"]})})}function re({children:t,color:n,size:s=10,style:o={}}){return e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:s,color:n,lineHeight:1,letterSpacing:"0.03em",...o},children:t})}function St(t="",n=20){return t.length>n?t.slice(0,n-1)+"…":t}function we(t){if(!t)return"—";try{const n=new Date(t),s=String(n.getUTCHours()).padStart(2,"0"),o=String(n.getUTCMinutes()).padStart(2,"0"),r=String(n.getUTCSeconds()).padStart(2,"0");return`${s}:${o}:${r}Z`}catch{return t.slice(11,19)+"Z"}}function kt(t){if(!t)return z.label;const n=t.toLowerCase();return n==="success"?z.green:n==="partial"?z.amber:n==="error"?z.red:n==="running"?z.cyan:z.label}const ve=["classify_segments","enrich_stage1","cost_digest","stale_cleanup"];function wt(){bt();const[t,n]=a.useState([]),[s,o]=a.useState(!0),[r,i]=a.useState(!1),[l,g]=a.useState("ALL"),[c,x]=a.useState(0),[y,C]=a.useState(!1),[d,u]=a.useState(new Set),p=a.useRef(null),F=a.useRef(!1),f=a.useRef(0),m=a.useCallback(async(S=!1)=>{S&&o(!0);try{const R=await fetch(`${yt}/scheduler/log?limit=40`);if(!R.ok)throw new Error(R.status);const L=await R.json(),I=L.logs??L??[];if(n(I),i(!1),I.length>f.current){const A=new Set(I.slice(0,I.length-f.current).map((H,T)=>H.ran_at??T));u(A),setTimeout(()=>u(new Set),800)}f.current=I.length}catch{i(!0)}finally{S&&o(!1)}},[]);a.useEffect(()=>{m(!0)},[]),a.useEffect(()=>{const S=setInterval(()=>m(!1),3e4);return()=>clearInterval(S)},[m]),a.useEffect(()=>{const S=setInterval(()=>x(R=>(R+1)%ve.length),8e3);return()=>clearInterval(S)},[]),a.useEffect(()=>{!F.current&&p.current&&(p.current.scrollTop=p.current.scrollHeight)},[t]);const w=()=>{const S=p.current;if(!S)return;const R=S.scrollHeight-S.scrollTop-S.clientHeight<20;F.current=!R,C(!R)},k=()=>{F.current=!1,C(!1),p.current&&(p.current.scrollTop=p.current.scrollHeight)},h=t.filter(S=>l==="HOT"?(S.hot??0)>0:l==="ERRORS"?(S.status??"").toLowerCase()==="error":!0),b={_fake:!0,ran_at:new Date().toISOString(),job_name:ve[c],status:"running",leads_processed:null,hot:null},v=s?[]:[b,...h];return r&&t.length===0?e.jsx(jt,{label:"LOG ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",background:z.card,gap:0},children:[e.jsx("div",{style:{display:"flex",gap:4,padding:"0 0 6px",flexShrink:0,borderBottom:`1px solid ${z.border}`,marginBottom:4},children:["ALL","HOT","ERRORS"].map(S=>{const R=l===S;return e.jsx("button",{className:"filter-pill",onClick:()=>g(S),style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,letterSpacing:"0.12em",color:R?z.cyan:z.label,background:R?`${z.cyan}12`:"transparent",border:`1px solid ${R?z.cyan+"44":z.border}`,borderRadius:2,padding:"3px 7px 2px",cursor:"pointer",transition:"all 0.15s"},children:S},S)})}),e.jsxs("div",{style:{position:"relative",flex:1,overflow:"hidden"},children:[e.jsx("div",{ref:p,className:"kjle-scroll",onScroll:w,style:{height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",gap:1},children:s?Array.from({length:5}).map((S,R)=>e.jsxs("div",{style:{display:"flex",gap:8,padding:"4px 2px",opacity:1-R*.15},children:[e.jsx(fe,{w:52,h:8}),e.jsx(fe,{w:"50%",h:8}),e.jsx(fe,{w:"20%",h:8})]},R)):v.length===0?e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:4},children:[e.jsx(re,{color:z.label,size:9,style:{letterSpacing:"0.1em"},children:"> AWAITING LOG ENTRIES"}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:z.label,animation:"kjle-blink 1s step-end infinite"},children:"█"})]}):v.map((S,R)=>{const L=d.has(S.ran_at),I=S._fake,A=kt(S.status),H=St(S.job_name??"—",20),T=we(S.ran_at),Y=S.leads_processed??0,ie=S.hot??0;return e.jsxs("div",{className:"log-row",style:{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",borderRadius:1,background:"transparent",animation:L||I?"kjle-fadein 0.3s ease both":"none",opacity:I?.55:1},children:[e.jsx(re,{color:z.label,size:8,style:{width:52,flexShrink:0},children:T}),e.jsx("div",{style:{flex:1,overflow:"hidden"},children:e.jsx(re,{color:I?z.cyan:A,size:8,style:{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",animation:I?"kjle-pulse 1.8s ease-in-out infinite":"none"},children:H})}),e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:7,letterSpacing:"0.1em",textTransform:"uppercase",color:A,background:`${A}14`,border:`1px solid ${A}2a`,borderRadius:2,padding:"1px 4px",flexShrink:0},children:I?"RUN":(S.status??"—").slice(0,7).toUpperCase()}),!I&&Y>0&&e.jsx(re,{color:"rgba(255,255,255,0.5)",size:8,style:{flexShrink:0},children:Y.toLocaleString()}),!I&&ie>0&&e.jsxs(re,{color:z.green,size:8,style:{flexShrink:0},children:[ie,"▲"]})]},S.ran_at??R)})}),y&&e.jsx("button",{onClick:k,style:{position:"absolute",bottom:4,right:6,background:`${z.panel}ee`,border:`1px solid ${z.cyan}33`,borderRadius:2,padding:"3px 6px 2px",cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:z.cyan,letterSpacing:"0.1em"},children:"↓ RESUME"})]})]})}const _={border:"#002233",cyan:"#00E5FF",gold:"#FFD700",green:"#00FF88",amber:"#FFAA00",red:"#FF2244",label:"#004455",track:"#001122"},vt="https://kjle-api.onrender.com/kjle/v1",Fe=10,$e=[_.cyan,_.gold,_.amber,_.green,_.red];let Ce=!1;function Ft(){if(Ce||typeof document>"u")return;Ce=!0;const t=document.createElement("style");t.textContent=`
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-bar {
      from { width: 0 !important; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(3px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
  `,document.head.appendChild(t)}function W({w:t="100%",h:n=8,r:s=2}){return e.jsx("div",{style:{width:t,height:n,borderRadius:s,flexShrink:0,background:`linear-gradient(90deg, ${_.track} 25%, #002233 50%, ${_.track} 75%)`,backgroundSize:"300% 100%",animation:"kjle-shimmer 1.6s ease-in-out infinite"}})}function $t({label:t="ERR"}){return e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:_.red,letterSpacing:"0.14em"},children:["— ",t," —"]})})}function q({children:t,color:n,size:s=10,style:o={}}){return e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:s,color:n,lineHeight:1,letterSpacing:"0.03em",...o},children:t})}function G({children:t,color:n=_.label,size:s=8,spacing:o="0.18em",weight:r=700,style:i={}}){return e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:r,fontSize:s,color:n,letterSpacing:o,textTransform:"uppercase",lineHeight:1,...i},children:t})}function Re({pct:t,color:n,height:s=2,delay:o="0s"}){return e.jsx("div",{style:{width:"100%",height:s,background:_.track,borderRadius:1,overflow:"hidden",flexShrink:0},children:e.jsx("div",{style:{width:`${Math.min(Math.max(t??0,0),100)}%`,height:"100%",background:n,boxShadow:`0 0 5px ${n}55`,borderRadius:1,animation:`kjle-bar 0.9s cubic-bezier(0.22,1,0.36,1) ${o} both`}})})}function Ct(t,n=1400,s=3){const[o,r]=a.useState("0."+"0".repeat(s)),i=a.useRef(0);return a.useEffect(()=>{const l=i.current,g=t??0;if(i.current=g,g===0){r("0."+"0".repeat(s));return}let c,x=null;const y=C=>{x||(x=C);const d=Math.min((C-x)/n,1),u=1-Math.pow(1-d,3);r((l+(g-l)*u).toFixed(s)),d<1&&(c=requestAnimationFrame(y))};return c=requestAnimationFrame(y),()=>cancelAnimationFrame(c)},[t,n,s]),o}function Rt(t){return t>80?_.red:t>50?_.amber:_.green}function Et(t=""){return t.charAt(0).toUpperCase()+t.slice(1)}function Tt(){Ft();const[t,n]=a.useState(null),[s,o]=a.useState(!0),[r,i]=a.useState(!1),l=a.useRef(null),g=async(k=!1)=>{k&&o(!0);try{const h=await fetch(`${vt}/costs`);if(!h.ok)throw new Error(h.status);const b=await h.json();l.current=b,n(b),i(!1)}catch{l.current?n(l.current):i(!0)}finally{k&&o(!1)}};a.useEffect(()=>{g(!0)},[]),a.useEffect(()=>{const k=setInterval(()=>g(!1),3e5);return()=>clearInterval(k)},[]);const c=(t==null?void 0:t.summary)??{},x=((t==null?void 0:t.by_service)??[]).slice(0,5),y=c.total_cost_usd??0,C=c.total_calls??0,d=c.avg_cost_per_call??0,u=Math.min(y/Fe*100,100),p=Rt(u),F=new Date().getUTCDate(),f=F>0?y/F*30:0,m=Math.max(...x.map(k=>k.total_cost_usd??0),1e-6),w=Ct(s?0:y,1400,3);return r?e.jsx($t,{label:"COST ERR"}):e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",gap:8},children:[e.jsxs("div",{style:{flexShrink:0},children:[e.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6},children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:2},children:[s?e.jsx(W,{w:110,h:28,r:2}):e.jsxs(q,{color:_.green,size:28,style:{letterSpacing:"0.02em",animation:"kjle-fadein 0.5s ease both"},children:["$",w]}),e.jsx(G,{color:_.label,size:8,spacing:"0.2em",children:"MTD Spend"})]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end",paddingTop:2},children:s?e.jsxs(e.Fragment,{children:[e.jsx(W,{w:60,h:9}),e.jsx(W,{w:60,h:9})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[e.jsx(q,{color:_.cyan,size:9,children:C.toLocaleString()}),e.jsx(G,{color:_.label,size:7,spacing:"0.1em",children:"Calls"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[e.jsxs(q,{color:_.label,size:9,children:["$",d.toFixed(4)]}),e.jsx(G,{color:_.label,size:7,spacing:"0.1em",children:"Avg"})]})]})})]}),e.jsxs("div",{style:{marginTop:8},children:[s?e.jsx(W,{h:3,r:1}):e.jsx(Re,{pct:u,color:p,height:3}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:3},children:e.jsxs(G,{color:_.label,size:7,spacing:"0.08em",children:["$",y.toFixed(2)," / $",Fe.toFixed(2)," Budget"]})})]})]}),e.jsx("div",{style:{height:1,background:_.border,flexShrink:0}}),e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:0,overflow:"hidden"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexShrink:0},children:[e.jsx(G,{color:_.label,size:8,spacing:"0.18em",children:"By Service"}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:_.cyan,letterSpacing:"0.06em"},children:"MTD"})]}),e.jsx("div",{style:{flex:1,display:"flex",flexDirection:"column",gap:6,justifyContent:"center"},children:s?Array.from({length:3}).map((k,h)=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:3,opacity:1-h*.2},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between"},children:[e.jsx(W,{w:"40%",h:9}),e.jsx(W,{w:36,h:9})]}),e.jsx(W,{h:2}),e.jsx(W,{w:"25%",h:7})]},h)):x.length===0?e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flex:1},children:e.jsx(G,{color:_.label,size:8,spacing:"0.14em",children:"No service data"})}):x.map((k,h)=>{const b=$e[h%$e.length],v=k.total_cost_usd/m*100,S=k.total_cost_usd??0,R=k.calls??0;return e.jsxs("div",{style:{animation:`kjle-fadein 0.4s ease ${h*.07}s both`},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3},children:[e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:9,color:"rgba(255,255,255,0.5)",letterSpacing:"0.05em"},children:Et(k.service??"—")}),e.jsxs(q,{color:_.green,size:10,children:["$",S.toFixed(3)]})]}),e.jsx(Re,{pct:v,color:b,delay:`${h*.07}s`}),e.jsx("div",{style:{marginTop:2},children:e.jsxs(q,{color:_.label,size:7,children:[R.toLocaleString()," calls"]})})]},k.service??h)})})]}),e.jsx("div",{style:{flexShrink:0,borderTop:`1px solid ${_.border}`,paddingTop:6,display:"flex",justifyContent:"space-between",alignItems:"center"},children:[{key:"TODAY",val:(t==null?void 0:t.today_cost_usd)!=null?`$${t.today_cost_usd.toFixed(3)}`:"—",color:_.cyan},{key:"7D",val:(t==null?void 0:t.seven_day_cost_usd)!=null?`$${t.seven_day_cost_usd.toFixed(3)}`:"—",color:_.gold},{key:"PROJ",val:!s&&f>0?`$${f.toFixed(2)}`:"—",color:_.amber}].map(({key:k,val:h,color:b},v)=>e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderRight:v<2?`1px solid ${_.border}`:"none"},children:[s?e.jsx(W,{w:"70%",h:10}):e.jsx(q,{color:b,size:10,children:h}),e.jsx(G,{color:_.label,size:7,spacing:"0.12em",children:k})]},k))})]})}const K={panel:"#000D1A",border:"#002233",cyan:"#00E5FF",amber:"#FFAA00",red:"#FF2244",label:"#004455"},ae="https://kjle-api.onrender.com/kjle/v1",_t=12e4,It=6e5,zt=3e5,At=8,He="kjle_alerts_v1",Q={critical:{color:K.red,icon:"⚠",label:"CRITICAL"},warn:{color:K.amber,icon:"▲",label:"WARN"},info:{color:K.cyan,icon:"◈",label:"INFO"}};let Ee=!1;function We(){if(Ee||typeof document>"u")return;Ee=!0;const t=document.createElement("style");t.textContent=`
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0);     }
    }
    @keyframes toast-out {
      from { opacity: 1; transform: translateX(0);     }
      to   { opacity: 0; transform: translateX(-24px); }
    }
    .toast-enter { animation: toast-in  0.3s ease-out both; }
    .toast-exit  { animation: toast-out 0.25s ease-in  both; }

    .alert-ack-btn {
      background: none; border: none; cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase;
      padding: 0; transition: opacity 0.15s;
    }
    .alert-ack-btn:hover { opacity: 0.7; }

    .strip-ack-btn {
      background: none; border: none; cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(255,255,255,0.45); padding: 0 6px;
      transition: color 0.15s;
    }
    .strip-ack-btn:hover { color: rgba(255,255,255,0.8); }
  `,document.head.appendChild(t)}function Mt(){try{const t=sessionStorage.getItem(He);return t?JSON.parse(t):{alerts:[],cooldowns:{},lastFired:{}}}catch{return{alerts:[],cooldowns:{},lastFired:{}}}}function Te(t){try{sessionStorage.setItem(He,JSON.stringify(t))}catch{}}function Be(t){if(!t)return"—";const n=new Date(t),s=String(n.getUTCHours()).padStart(2,"0"),o=String(n.getUTCMinutes()).padStart(2,"0");return`${s}:${o}Z`}function J(t,n,s){return{id:t,severity:n,message:s,timestamp:Date.now(),acknowledged:!1}}function Lt(){const t=Mt(),[n,s]=a.useState(t.alerts??[]),o=a.useRef(t.cooldowns??{}),r=a.useRef(null);a.useEffect(()=>{Te({alerts:n,cooldowns:o.current})},[n]);const i=a.useCallback((d,u)=>{const p=o.current[d];if(!p)return!1;const F=Date.now()-p;return u==="critical"?F<zt:F<It},[]),l=a.useCallback(d=>{d.length&&s(u=>{let p=[...u];for(const F of d)if(!i(F.id,F.severity))for(o.current[F.id]=Date.now(),p=p.filter(f=>f.id!==F.id),p.push(F);p.length>At;){const f=p.findIndex(m=>m.severity!=="critical");if(f===-1)break;p.splice(f,1)}return p})},[i]),g=a.useCallback(async()=>{var p,F,f;const d=[];try{const m=await fetch(`${ae}/costs`);if(m.ok){const w=await m.json(),k=((p=w==null?void 0:w.summary)==null?void 0:p.total_cost_usd)??0;k>8?d.push(J("cost_critical","critical",`CRITICAL: MTD spend $${k.toFixed(2)} — budget cap imminent`)):k>5&&d.push(J("cost_warning","warn",`MTD spend at $${k.toFixed(2)} — approaching budget cap`))}}catch{}let u=!1;try{const m=await fetch(`${ae}/health`);u=m.ok&&((F=await m.json())==null?void 0:F.status)==="ok"}catch{}u||d.push(J("api_down","critical","API SERVER OFFLINE — dashboard data may be stale"));try{const m=await fetch(`${ae}/scheduler/status`);if(m.ok){const w=await m.json(),k=(w==null?void 0:w.jobs)??[];if(k.length===0)d.push(J("scheduler_idle","warn","Scheduler appears idle — check automation"));else{const h=k.find(v=>(v.job_name??v.id??"").includes("enrich_stage1"));h!=null&&h.last_ran&&Date.now()-new Date(h.last_ran).getTime()>864e5&&d.push(J("enrichment_stalled","warn","Enrichment stalled — stage1 not run in 24h")),k.every(v=>v.last_ran?Date.now()-new Date(v.last_ran).getTime()>468e5:!0)&&d.push(J("scheduler_idle","warn","Scheduler appears idle — check automation"))}}}catch{}try{const m=await fetch(`${ae}/segments/summary`);if(m.ok){const w=await m.json(),k=((f=w==null?void 0:w.counts)==null?void 0:f.hot)??0;r.current!==null&&k-r.current>500&&d.push(J("hot_surge","info",`Hot lead surge: +${(k-r.current).toLocaleString()} new HOT leads detected`)),r.current=k}}catch{}d.length&&l(d)},[l]);a.useEffect(()=>{g();const d=setInterval(g,_t);return()=>clearInterval(d)},[g]),a.useEffect(()=>{const d=n.filter(p=>p.severity==="info"&&!p.acknowledged);if(!d.length)return;const u=d.map(p=>setTimeout(()=>c(p.id),8e3));return()=>u.forEach(clearTimeout)},[n]);const c=a.useCallback(d=>{s(u=>u.map(p=>p.id===d?{...p,acknowledged:!0}:p))},[]),x=a.useCallback(()=>{s(d=>d.map(u=>({...u,acknowledged:!0})))},[]),y=a.useCallback(()=>{s([]),o.current={},Te({alerts:[],cooldowns:{}})},[]),C=a.useCallback(d=>{s(u=>u.filter(p=>p.id!==d))},[]);return{alerts:n,acknowledge:c,acknowledgeAll:x,clearAll:y,dismiss:C}}function Nt({alerts:t,acknowledge:n,dismiss:s}){We();const[o,r]=a.useState(new Set),i=c=>{r(x=>new Set([...x,c])),setTimeout(()=>{r(x=>{const y=new Set(x);return y.delete(c),y}),s(c)},280)},l=c=>{n(c),i(c)},g=t.filter(c=>!c.acknowledged).slice(-6);return g.length?e.jsx("div",{style:{position:"fixed",bottom:48,left:16,zIndex:500,display:"flex",flexDirection:"column",gap:6,pointerEvents:"none"},children:g.map(c=>{const x=Q[c.severity]??Q.info,y=o.has(c.id);return e.jsxs("div",{className:y?"toast-exit":"toast-enter",style:{width:280,background:K.panel,borderLeft:`3px solid ${x.color}`,borderRadius:"0 3px 3px 0",boxShadow:`0 0 16px ${x.color}22, 0 2px 12px rgba(0,0,0,0.6)`,padding:"8px 10px",display:"flex",flexDirection:"column",gap:5,pointerEvents:"all"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx("span",{style:{fontSize:9,color:x.color,flexShrink:0},children:x.icon}),e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:9,color:x.color,letterSpacing:"0.16em",textTransform:"uppercase",flex:1},children:x.label}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:K.label,letterSpacing:"0.05em",flexShrink:0},children:Be(c.timestamp)})]}),e.jsx("div",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.7)",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",letterSpacing:"0.02em"},children:c.message}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("button",{className:"alert-ack-btn",style:{color:x.color},onClick:()=>l(c.id),children:"Acknowledge"}),e.jsx("button",{className:"alert-ack-btn",style:{color:"rgba(255,255,255,0.3)",fontSize:10,lineHeight:1},onClick:()=>i(c.id),children:"✕"})]})]},c.id)})}):null}function Dt({alerts:t,acknowledgeAll:n,onHeightChange:s}){var F;We();const[o,r]=a.useState(!1),i=a.useRef(null),l=t.filter(f=>!f.acknowledged);if(a.useEffect(()=>{var m;if(!s)return;if(!l.length){s(0);return}const f=((m=i.current)==null?void 0:m.getBoundingClientRect().height)??(o?l.length*22+28:28);s(f)},[l.length,o,s]),!l.length)return null;const g=l.some(f=>f.severity==="critical"),c=l.some(f=>f.severity==="warn"),x=g?"critical":c?"warn":"info",y=Q[x].color,C=Q[x].icon,d={critical:"linear-gradient(90deg, #FF224411 0%, #010810 80%)",warn:"linear-gradient(90deg, #FFAA0011 0%, #010810 80%)",info:"linear-gradient(90deg, #00E5FF11 0%, #010810 80%)"}[x],u=((F=l[0])==null?void 0:F.message)??"",p=u.length>60?u.slice(0,59)+"…":u;return e.jsxs("div",{ref:i,style:{background:d,borderBottom:`1px solid ${y}33`,overflow:"hidden",transition:"max-height 0.3s ease",maxHeight:o?`${l.length*26+36}px`:"28px",flexShrink:0},children:[e.jsxs("div",{style:{height:28,display:"flex",alignItems:"center",padding:"0 10px",gap:7,cursor:"pointer"},onClick:f=>{f.target.tagName!=="BUTTON"&&r(m=>!m)},children:[e.jsx("span",{style:{fontSize:9,color:y,flexShrink:0},children:C}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:y,flexShrink:0},children:l.length}),e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:9,color:"rgba(255,255,255,0.55)",letterSpacing:"0.04em",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:p}),e.jsx("button",{className:"strip-ack-btn",onClick:f=>{f.stopPropagation(),n(),r(!1)},children:"Ack All"}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(255,255,255,0.3)",cursor:"pointer",flexShrink:0,userSelect:"none"},children:o?"▲":"▼"})]}),o&&l.map((f,m)=>{const w=Q[f.severity]??Q.info;return e.jsxs("div",{style:{height:24,display:"flex",alignItems:"center",padding:"0 10px 0 28px",gap:7,borderTop:m===0?`1px solid ${K.border}`:"none"},children:[e.jsx("span",{style:{fontSize:8,color:w.color,flexShrink:0},children:w.icon}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:"rgba(255,255,255,0.5)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",letterSpacing:"0.02em"},children:f.message}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:8,color:K.label,flexShrink:0},children:Be(f.timestamp)})]},f.id)})]})}function _e(t,n=1500){const[s,o]=a.useState(0);return a.useEffect(()=>{if(!t)return;let r=null;const i=g=>{r||(r=g);const c=Math.min((g-r)/n,1),x=1-Math.pow(1-c,3);o(Math.floor(t*x)),c<1&&requestAnimationFrame(i)},l=requestAnimationFrame(i);return()=>cancelAnimationFrame(l)},[t,n]),s}function Ot(){const[t,n]=a.useState("");return a.useEffect(()=>{const s=()=>{const r=new Date,i=String(r.getUTCHours()).padStart(2,"0"),l=String(r.getUTCMinutes()).padStart(2,"0"),g=String(r.getUTCSeconds()).padStart(2,"0");n(`${i}:${l}:${g}Z`)};s();const o=setInterval(s,1e3);return()=>clearInterval(o)},[]),t}const Pt=`
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #010810; overflow: hidden; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px currentColor; }
  50%       { opacity: 0.3; box-shadow: none; }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.kjle-root {
  font-family: 'Rajdhani', sans-serif;
  background: #010810;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  color: #e0f4ff;
  display: flex;
  flex-direction: column;
}

.kjle-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, #002233 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.scanlines {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.06) 2px,
    rgba(0,0,0,0.06) 4px
  );
  pointer-events: none;
  z-index: 10;
}

.panel {
  background: #000D1A;
  border: 1px solid #002233;
  box-shadow: inset 0 1px 0 rgba(0,229,255,0.13);
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  animation: fade-up 0.5s ease both;
  display: flex;
  flex-direction: column;
}
.panel:hover {
  border-color: rgba(0,229,255,0.27);
  box-shadow: inset 0 1px 0 rgba(0,229,255,0.13), 0 0 12px rgba(0,229,255,0.08);
}
.panel::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 6px; height: 6px;
  border-top: 1px solid #00E5FF;
  border-left: 1px solid #00E5FF;
  z-index: 5;
}
.panel::after {
  content: '';
  position: absolute;
  bottom: -1px; right: -1px;
  width: 6px; height: 6px;
  border-bottom: 1px solid #00E5FF;
  border-right: 1px solid #00E5FF;
  z-index: 5;
}
.panel.gold-corners::before,  .panel.gold-corners::after  { border-color: #FFD700; }
.panel.green-corners::before, .panel.green-corners::after { border-color: #00FF88; }
.panel.amber-corners::before, .panel.amber-corners::after { border-color: #FFAA00; }
.panel.red-corners::before,   .panel.red-corners::after   { border-color: #FF2244; }

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 5px;
  border-bottom: 1px solid #002233;
  flex-shrink: 0;
}
.panel-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #004455;
}
.panel-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  color: #00E5FF;
  letter-spacing: 0.06em;
}
.panel-badge.gold  { color: #FFD700; }
.panel-badge.green { color: #00FF88; }
.panel-badge.amber { color: #FFAA00; }

.panel-body {
  flex: 1;
  padding: 8px 10px;
  overflow: hidden;
}

.topbar {
  height: 56px;
  background: #000810;
  border-bottom: 1px solid rgba(255,215,0,0.2);
  display: flex;
  flex-direction: column;
  animation: slide-down 0.4s ease both;
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}
.topbar-inner {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.gold-rule {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(255,215,0,0.08) 10%,
    rgba(255,215,0,0.65) 50%,
    rgba(255,215,0,0.08) 90%, transparent 100%);
  flex-shrink: 0;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 18px;
  border-right: 1px solid #002233;
}
.chip:first-child { border-left: 1px solid #002233; }
.chip-val {
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
}
.chip-lbl {
  font-family: 'Rajdhani', sans-serif;
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #004455;
  margin-top: 2px;
}

.sdot {
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
}
.sdot.pulse { animation: pulse-dot 2s ease-in-out infinite; }

.bbar {
  height: 32px;
  background: #000810;
  border-top: 1px solid rgba(255,215,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.panel-d1  { animation-delay: 0.05s; }
.panel-d2  { animation-delay: 0.10s; }
.panel-d3  { animation-delay: 0.15s; }
.panel-d4  { animation-delay: 0.20s; }
.panel-d5  { animation-delay: 0.25s; }
.panel-d6  { animation-delay: 0.30s; }
.panel-d7  { animation-delay: 0.35s; }
.panel-d8  { animation-delay: 0.40s; }
.panel-d9  { animation-delay: 0.45s; }
.panel-d10 { animation-delay: 0.50s; }
.panel-d11 { animation-delay: 0.55s; }
`;function N({label:t,badge:n,badgeClass:s="",cornerClass:o="",delayClass:r="",style:i={},children:l}){return e.jsxs("div",{className:`panel ${o} ${r}`,style:i,children:[e.jsxs("div",{className:"panel-header",children:[e.jsx("span",{className:"panel-label",children:t}),n&&e.jsx("span",{className:`panel-badge ${s}`,children:n})]}),e.jsx("div",{className:"panel-body",children:l})]})}function Ie({color:t,pulse:n=!1,size:s=5}){return e.jsx("span",{className:`sdot${n?" pulse":""}`,style:{width:s,height:s,background:t,boxShadow:`0 0 4px ${t}`,color:t}})}function Ht({totalLeads:t=28849,nichesActive:n=27,mtdCost:s=.2,systemStatus:o="NOMINAL",dbStatus:r="CONNECTED",enrichmentStatus:i="IDLE"}){const l=a.useRef(!1),g=Ot(),c=_e(t,1500),x=_e(n,1100),[y,C]=a.useState(""),[d,u]=a.useState(0),{alerts:p,acknowledge:F,acknowledgeAll:f,dismiss:m}=Lt(),w=o==="NOMINAL"?"#00FF88":o==="DEGRADED"?"#FFAA00":"#FF2244",k=i==="RUNNING"?"#00E5FF":i==="ERROR"?"#FF2244":"#FFAA00";return a.useEffect(()=>{const h=()=>C(new Date().toUTCString().slice(0,16));h();const b=setInterval(h,6e4);return()=>clearInterval(b)},[]),a.useEffect(()=>{if(l.current)return;l.current=!0;const h=document.createElement("style");h.textContent=Pt,document.head.appendChild(h);const b=document.createElement("link");b.rel="preload",b.as="style",b.href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap",document.head.appendChild(b)},[]),e.jsxs("div",{className:"kjle-root",children:[e.jsx("div",{className:"scanlines"}),e.jsxs("div",{className:"topbar",children:[e.jsxs("div",{className:"topbar-inner",children:[e.jsxs("div",{style:{minWidth:260},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7},children:[e.jsx("span",{style:{fontSize:15,lineHeight:1},children:"👑"}),e.jsx("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:"#FFD700",letterSpacing:"0.1em",lineHeight:1},children:"KJLE-1"}),e.jsx("span",{style:{width:1,height:14,background:"#002233",margin:"0 3px"}}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:"#004455",letterSpacing:"0.08em",lineHeight:1},children:"EMPIRE · MK-19"})]}),e.jsx("div",{style:{fontFamily:"'Rajdhani',sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:"#00E5FF",textTransform:"uppercase",marginTop:3,paddingLeft:22},children:"King James Lead Empire — Command Deck"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsxs("div",{className:"chip",children:[e.jsx("span",{className:"chip-val",style:{color:"#00E5FF"},children:c.toLocaleString()}),e.jsx("span",{className:"chip-lbl",children:"Total Leads"})]}),e.jsxs("div",{className:"chip",children:[e.jsx("span",{className:"chip-val",style:{color:"#FFD700"},children:x}),e.jsx("span",{className:"chip-lbl",children:"Niches Active"})]}),e.jsxs("div",{className:"chip",children:[e.jsxs("span",{className:"chip-val",style:{color:"#00FF88"},children:["$",s.toFixed(2)]}),e.jsx("span",{className:"chip-lbl",children:"MTD Cost"})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,minWidth:200},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx(Ie,{color:w,pulse:!0}),e.jsxs("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,letterSpacing:"0.16em",color:w},children:["SYS ",o]})]}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:14,color:"rgba(0,229,255,0.7)",letterSpacing:"0.06em",lineHeight:1},children:g}),e.jsxs("span",{style:{fontFamily:"'Rajdhani',sans-serif",fontSize:7,letterSpacing:"0.14em",color:"#004455",marginTop:1},children:[y," UTC"]})]})]}),e.jsx("div",{className:"gold-rule"})]}),e.jsx(Dt,{alerts:p,acknowledgeAll:f,onHeightChange:u}),e.jsxs("div",{style:{position:"relative",zIndex:2,flex:1,overflow:"hidden",display:"grid",gridTemplateRows:"140px 1fr 1fr",gap:8,padding:8},children:[e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8},children:[e.jsx(N,{label:"Lead Inventory",badge:"ALL SEGMENTS",delayClass:"panel-d1",style:{height:"100%"},children:e.jsx(et,{})}),e.jsx(N,{label:"Avg Pain Score",badge:"Σ ALL",badgeClass:"gold",cornerClass:"gold-corners",delayClass:"panel-d2",style:{height:"100%"},children:e.jsx(tt,{})}),e.jsx(N,{label:"Product Fit",badge:"DE + VD",badgeClass:"green",cornerClass:"green-corners",delayClass:"panel-d3",style:{height:"100%"},children:e.jsx(nt,{})}),e.jsx(N,{label:"Data Quality",badge:"COVERAGE",badgeClass:"amber",cornerClass:"amber-corners",delayClass:"panel-d4",style:{height:"100%"},children:e.jsx(st,{})}),e.jsx(N,{label:"Niche Reading",badge:"TOP 5",delayClass:"panel-d5",style:{height:"100%"},children:e.jsx(it,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"30fr 40fr 30fr",gap:8},children:[e.jsx(N,{label:"Niche Inventory",badge:"ALL NICHES",badgeClass:"gold",cornerClass:"gold-corners",delayClass:"panel-d6",style:{height:"100%"},children:e.jsx(at,{})}),e.jsx(N,{label:"Lead Radar",badge:"GEO-PAIN MATRIX",delayClass:"panel-d7",style:{height:"100%"},children:e.jsx(pt,{})}),e.jsx(N,{label:"Product Pipeline",badge:"FUNNEL",badgeClass:"green",cornerClass:"green-corners",delayClass:"panel-d8",style:{height:"100%"},children:e.jsx(xt,{})})]}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"35fr 30fr 35fr",gap:8},children:[e.jsx(N,{label:"System Log",badge:"30S POLL",badgeClass:"amber",cornerClass:"amber-corners",delayClass:"panel-d9",style:{height:"100%"},children:e.jsx(wt,{})}),e.jsx(N,{label:"Health & Diagnostics",badge:"AUTO · 60S",delayClass:"panel-d10",style:{height:"100%"},children:e.jsx(mt,{})}),e.jsx(N,{label:"Cost Intelligence",badge:"5M REFRESH",badgeClass:"green",cornerClass:"green-corners",delayClass:"panel-d11",style:{height:"100%"},children:e.jsx(Tt,{})})]})]}),e.jsxs("div",{className:"bbar",children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:18},children:[{label:`DB ${r}`,color:"#00FF88"},{label:"INGEST ENGINE NOMINAL",color:"#00FF88"},{label:`ENRICHMENT ${i}`,color:k}].map(({label:h,color:b})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx(Ie,{color:b,size:4}),e.jsx("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:b,letterSpacing:"0.08em"},children:h})]},h))}),e.jsxs("span",{style:{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#004455",letterSpacing:"0.08em"},children:["KJLE v1.0  ·  ",t.toLocaleString()," LEADS LIVE  ·  BUILD 001-025 COMPLETE"]})]}),e.jsx(Nt,{alerts:p,acknowledge:F,dismiss:m})]})}const Ue=document.createElement("style");Ue.textContent=`
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background: #010810;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;document.head.appendChild(Ue);ue.createRoot(document.getElementById("root")).render(e.jsx(Ge.StrictMode,{children:e.jsx(Ht,{})}));
