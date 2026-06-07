import{j as t,r as y,L as f}from"./index-DenkW4AC.js";import{M as S}from"./Moonicon-BBquuLe-.js";const j={dev:"#22c55e",business:"#3b82f6",design:"#a855f7",meeting:"#f59e0b",milestone:"#ef4444"},E={dev:"DEV",business:"BUSINESS",design:"DESIGN",meeting:"MEETING",milestone:"MILESTONE"},g=[{side:"left",type:"milestone",timestamp:"DAY 001 · 09:14",title:"Project Genesis",meta:"First commit. The repo is born.",appearAt:1.2},{side:"right",type:"design",timestamp:"DAY 008 · 14:22",title:"Design System v0",meta:"Locked colors, type, spacing tokens.",appearAt:2.6},{side:"left",type:"dev",timestamp:"DAY 021 · 02:47",title:"Auth shipped",meta:"feat(auth): jwt + refresh rotation",appearAt:4},{side:"right",type:"business",timestamp:"DAY 042 · 11:00",title:"Seed round closed",meta:"$1.2M from three lead funds.",appearAt:5.4},{side:"left",type:"meeting",timestamp:"DAY 067 · 16:30",title:"Architecture review",meta:"Moved to event-sourced timeline.",appearAt:6.8},{side:"right",type:"milestone",timestamp:"DAY 094 · 00:00",title:"Public Launch",meta:"v1.0. The story begins.",appearAt:8.2}],b=11,w=.3,k=9.2,F=9.8,T={dark:{surface:"#111111",border:"#1f1f1f",text:"#ffffff",textMid:"#b3b3b3",textDim:"#888888",spineMid:"rgba(255,255,255,0.35)",spineEdge:"rgba(255,255,255,0.05)",cardShadow:"0 16px 50px rgba(0,0,0,0.55)",nodeCenter:"#0a0a0a",connectorTail:"rgba(255,255,255,0.10)"},light:{surface:"#f3f1ea",border:"#e2dfd2",text:"#2c2b28",textMid:"#4a4842",textDim:"#7a776e",spineMid:"rgba(44,43,40,0.45)",spineEdge:"rgba(44,43,40,0.06)",cardShadow:"0 14px 42px rgba(40,38,33,0.12)",nodeCenter:"#faf9f5",connectorTail:"rgba(44,43,40,0.10)"}},A=600,u=92,$=48,v=260,m=56;function N({theme:o}){const e=T[o],r="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",l=$*2+(g.length-1)*u,a=i=>i/b*100,h=a(w),c=a(k),x=a(F);return t.jsxs("div",{style:{position:"absolute",inset:0,overflow:"hidden",fontFamily:"Inter, ui-sans-serif, system-ui, sans-serif",color:e.text},children:[t.jsx("style",{children:D({loop:b,spineStartPct:h,spineEndPct:c,fadeStartPct:x,entries:g.map(i=>a(i.appearAt))})}),t.jsxs("div",{className:"ht-stage",style:{position:"absolute",left:"50%",top:"50%",width:A,height:l,transform:"translate(-50%, -50%) scale(var(--ht-scale, 1))",transformOrigin:"center center"},children:[t.jsx("div",{style:{position:"absolute",left:"calc(50% - 1px)",top:0,width:2,height:"100%",background:`linear-gradient(180deg, ${e.spineEdge} 0%, ${e.spineMid} 50%, ${e.spineEdge} 100%)`,opacity:.3}}),t.jsx("div",{className:"ht-spine ht-loop",style:{position:"absolute",left:"calc(50% - 1px)",top:0,width:2,height:"100%",background:`linear-gradient(180deg, ${e.spineEdge} 0%, ${e.spineMid} 50%, ${e.spineEdge} 100%)`,transformOrigin:"top center"}}),t.jsx("div",{className:"ht-head ht-loop",style:{position:"absolute",left:"calc(50% - 5px)",top:-5,width:10,height:10,borderRadius:999,background:e.text,boxShadow:`0 0 18px ${e.text}aa, 0 0 44px ${e.text}55`,"--ht-travel":`${l}px`}}),g.map((i,n)=>{const d=$+n*u,s=i.side==="left",p=j[i.type];return t.jsxs("div",{style:{position:"absolute",left:0,right:0,top:d,height:0},children:[t.jsx("span",{className:`ht-dot ht-loop ht-anim-${n}`,style:{position:"absolute",left:"calc(50% - 6px)",top:-6,width:12,height:12,borderRadius:999,background:e.nodeCenter,border:`2px solid ${p}`,boxShadow:`0 0 14px ${p}55`}}),t.jsx("span",{className:`ht-connector ht-loop ht-anim-${n} ${s?"ht-c-left":"ht-c-right"}`,style:{position:"absolute",top:-.5,height:1,width:m,left:s?`calc(50% - ${m}px)`:"50%",background:s?`linear-gradient(270deg, ${p}cc, ${e.connectorTail})`:`linear-gradient(90deg, ${p}cc, ${e.connectorTail})`,transformOrigin:s?"right center":"left center"}}),t.jsxs("div",{className:`ht-card ht-loop ht-anim-${n} ${s?"ht-card-left":"ht-card-right"}`,style:{position:"absolute",width:v,padding:"11px 14px",background:e.surface,border:`1px solid ${e.border}`,borderRadius:9,boxShadow:e.cardShadow,top:-34,left:s?`calc(50% - ${m}px - ${v}px)`:`calc(50% + ${m}px)`},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:7,marginBottom:4},children:[t.jsx("div",{style:{width:7,height:7,borderRadius:999,background:p}}),t.jsx("div",{style:{fontFamily:r,fontSize:9.5,letterSpacing:"0.12em",color:e.textMid},children:E[i.type]}),t.jsx("div",{style:{flex:1}}),t.jsx("div",{style:{fontFamily:r,fontSize:9.5,color:e.textDim,letterSpacing:"0.06em"},children:i.timestamp})]}),t.jsx("div",{style:{fontSize:14,fontWeight:600,color:e.text,marginBottom:3,letterSpacing:"-0.01em"},children:i.title}),t.jsx("div",{style:{fontSize:11.5,color:e.textDim,lineHeight:1.5},children:i.meta})]})]},n)})]}),t.jsx("div",{style:{position:"absolute",bottom:20,left:0,right:0,textAlign:"center",fontFamily:r,fontSize:10,letterSpacing:"0.3em",color:e.textDim,opacity:.7},children:"DEVCYCLE.APP"})]})}function D(o){const{loop:e,spineStartPct:r,spineEndPct:l,fadeStartPct:a,entries:h}=o,c="cubic-bezier(.34,1.56,.64,1)",x=h.map((i,n)=>{const d=Math.min(i+6,a),s=100;return`
        @keyframes ht-dot-${n} {
          0%, ${i.toFixed(2)}% { opacity: 0; transform: scale(0); }
          ${(i+3).toFixed(2)}% { opacity: 1; transform: scale(1.25); }
          ${d.toFixed(2)}%, ${a.toFixed(2)}% { opacity: 1; transform: scale(1); }
          ${s}% { opacity: 0; transform: scale(1); }
        }
        @keyframes ht-conn-${n} {
          0%, ${i.toFixed(2)}% { transform: scaleX(0); opacity: 0; }
          ${(i+1).toFixed(2)}% { opacity: 1; }
          ${d.toFixed(2)}%, ${a.toFixed(2)}% { transform: scaleX(1); opacity: 1; }
          ${s}% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes ht-card-left-${n} {
          0%, ${i.toFixed(2)}% { opacity: 0; transform: translateX(-60px); }
          ${d.toFixed(2)}%, ${a.toFixed(2)}% { opacity: 1; transform: translateX(0); }
          ${s}% { opacity: 0; transform: translateX(0); }
        }
        @keyframes ht-card-right-${n} {
          0%, ${i.toFixed(2)}% { opacity: 0; transform: translateX(60px); }
          ${d.toFixed(2)}%, ${a.toFixed(2)}% { opacity: 1; transform: translateX(0); }
          ${s}% { opacity: 0; transform: translateX(0); }
        }
        .ht-anim-${n}.ht-dot       { animation: ht-dot-${n} ${e}s ${c} infinite; }
        .ht-anim-${n}.ht-connector { animation: ht-conn-${n} ${e}s ease-out infinite; }
        .ht-anim-${n}.ht-card-left  { animation: ht-card-left-${n} ${e}s ${c} infinite; }
        .ht-anim-${n}.ht-card-right { animation: ht-card-right-${n} ${e}s ${c} infinite; }
      `}).join(`
`);return`
    @keyframes ht-spine {
      0%, ${r.toFixed(2)}% { transform: scaleY(0); opacity: 1; }
      ${l.toFixed(2)}%, ${a.toFixed(2)}% { transform: scaleY(1); opacity: 1; }
      100% { transform: scaleY(1); opacity: 0; }
    }
    @keyframes ht-head {
      0%, ${r.toFixed(2)}% { transform: translateY(0); opacity: 0; }
      ${(r+.5).toFixed(2)}% { opacity: 1; }
      ${(l-.5).toFixed(2)}% { opacity: 1; }
      ${l.toFixed(2)}%, 100% { transform: translateY(var(--ht-travel, 100%)); opacity: 0; }
    }

    .ht-spine { transform: scaleY(0); animation: ht-spine ${e}s linear infinite; }
    .ht-head  { opacity: 0; animation: ht-head ${e}s linear infinite; }

    ${x}

    .ht-stage { --ht-scale: 1; }
    @media (max-width: 1100px) { .ht-stage { --ht-scale: 0.85; } }
    @media (max-width: 900px)  { .ht-stage { --ht-scale: 0.72; } }
    @media (max-width: 700px)  { .ht-stage { --ht-scale: 0.6; } }

    @media (prefers-reduced-motion: reduce) {
      .ht-loop { animation: none !important; opacity: 1 !important; transform: none !important; }
      .ht-spine { transform: scaleY(1) !important; }
      .ht-head  { display: none; }
    }
  `}function I(){const[o,e]=y.useState(()=>typeof window>"u"?"dark":localStorage.getItem("devcycle.theme")||"dark");y.useEffect(()=>{document.documentElement.setAttribute("data-theme",o),localStorage.setItem("devcycle.theme",o)},[o]);const r=()=>e(l=>l==="dark"?"light":"dark");return t.jsxs("div",{style:{height:"100vh",width:"100vw",overflow:"hidden",position:"relative",background:"var(--bg)",color:"var(--text)"},children:[t.jsxs("nav",{style:{position:"absolute",top:0,left:0,right:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 28px"},children:[t.jsx("div",{style:{fontWeight:600,fontSize:15,letterSpacing:"-0.01em"},children:"DevCycle"}),t.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[t.jsx("button",{className:"btn btn-ghost",onClick:r,"aria-label":"Toggle theme",title:o==="dark"?"Switch to light mode":"Switch to dark mode",children:o==="dark"?"☀":t.jsx(S,{size:16,style:{display:"inline-block",verticalAlign:"-3px"}})}),t.jsx(f,{to:"/login",className:"btn btn-ghost",children:"Login"}),t.jsx(f,{to:"/register",className:"btn btn-secondary",children:"Register"})]})]}),t.jsxs("div",{style:{position:"absolute",inset:0,display:"grid",gridTemplateColumns:"minmax(0, 1fr) minmax(0, 1.1fr)"},children:[t.jsxs("section",{style:{display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 clamp(28px, 5vw, 72px)",zIndex:5},children:[t.jsx("div",{style:{fontFamily:"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:12,letterSpacing:"0.25em",color:"var(--text-dim)",marginBottom:18,textTransform:"uppercase"},children:"The Build Record →"}),t.jsxs("h1",{style:{fontSize:"clamp(34px, 4.6vw, 64px)",lineHeight:1.04,letterSpacing:"-0.025em",fontWeight:600,margin:0,color:"var(--text)"},children:["The complete story",t.jsx("br",{}),"of how",t.jsx("br",{}),"YOUR Product",t.jsx("br",{}),"is being built."]}),t.jsx("p",{style:{marginTop:18,marginBottom:28,fontSize:15,color:"var(--text-dim)",maxWidth:480,lineHeight:1.55},children:"Track every decision, milestone, and commit from day one and beyond."}),t.jsx("div",{children:t.jsx(f,{to:"/register",className:"btn btn-primary",style:{padding:"11px 22px"},children:"Get Started →"})})]}),t.jsxs("div",{style:{position:"relative",overflow:"hidden"},children:[t.jsx(N,{theme:o}),t.jsx("div",{"aria-hidden":!0,style:{position:"absolute",inset:0,pointerEvents:"none",background:o==="dark"?"linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 18%)":"linear-gradient(90deg, rgba(250,249,245,1) 0%, rgba(250,249,245,0) 18%)"}})]})]})]})}export{I as component};
