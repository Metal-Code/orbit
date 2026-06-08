import{j as r}from"./index-JpvyJtIA.js";function l({size:t=16,className:i,style:n}){return r.jsx("svg",{width:t,height:t,viewBox:"0 0 300 296.30541871921184",xmlns:"http://www.w3.org/2000/svg",className:i,style:n,"aria-hidden":"true",children:r.jsx("path",{fill:"currentColor",d:"M115.02451,71.90468c4.7976,0.37297 5.38023,4.11466 3.09458,7.63393c-1.29033,1.98658 -2.72549,4.33079 -3.82426,6.40751c-4.92137,9.31201 -7.9415,19.50998 -8.88473,30.00037c-1.7322,20.54132 4.76084,40.93023 18.05246,56.68707c22.096,26.31041 58.67993,35.29563 90.45,22.21127c6.59852,-2.78017 11.83374,-6.11084 17.66195,-10.09175c0.53017,-0.36355 2.02278,-0.51096 2.65456,-0.39717c5.75985,1.26909 3.18658,6.51539 1.38916,9.80542c-8.19643,15.00185 -17.625,24.90517 -31.92118,34.38362c-10.42057,6.19027 -17.95567,9.68534 -30.03196,12.24754c-23.74821,5.03387 -48.52315,0.29926 -68.74249,-13.13424c-20.00339,-13.05111 -33.98996,-33.52833 -38.87161,-56.90764c-7.66404,-36.8553 8.50179,-75.11675 40.76675,-94.708c2.49015,-1.51201 5.32759,-3.5431 8.20677,-4.13793z"})})}function b({size:t=32,showText:i=!0}){const n=t*.9818181818181818,e=t*(66/110),a=Math.max(3,t*(14/110)),o=t*(72/110),s=Math.max(1,t*(1.5/110));return r.jsxs("span",{className:"orbit-logo",style:{"--orbit-size":`${t}px`,"--ring-outer":`${n}px`,"--ring-inner":`${e}px`,"--planet":`${a}px`,"--ring-border":`${s}px`,"--text-size":`${o}px`},children:[r.jsxs("span",{className:"orbit-container","aria-hidden":"true",children:[r.jsx("span",{className:"orbit-ring orbit-ring-outer"}),r.jsx("span",{className:"orbit-ring orbit-ring-inner"}),r.jsx("span",{className:"orbit-track orbit-track-outer",children:r.jsx("span",{className:"orbit-planet orbit-planet-blue"})}),r.jsx("span",{className:"orbit-track orbit-track-inner",children:r.jsx("span",{className:"orbit-planet orbit-planet-pink"})})]}),i&&r.jsx("span",{className:"orbit-wordmark",children:"rbit"}),r.jsx("style",{children:`
        .orbit-logo {
          display: inline-flex;
          align-items: center;
          line-height: 1;
          user-select: none;
        }
        .orbit-container {
          position: relative;
          width: var(--orbit-size);
          height: var(--orbit-size);
          flex-shrink: 0;
        }
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: var(--ring-border) solid rgba(255,255,255,0.6);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .orbit-ring-outer { width: var(--ring-outer); height: var(--ring-outer); }
        .orbit-ring-inner { width: var(--ring-inner); height: var(--ring-inner); }

        .orbit-track {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
        }
        .orbit-track-outer {
          width: var(--ring-outer);
          height: var(--ring-outer);
          margin-left: calc(var(--ring-outer) / -2);
          margin-top:  calc(var(--ring-outer) / -2);
          animation: orbit-ccw 6s linear infinite;
        }
        .orbit-track-inner {
          width: var(--ring-inner);
          height: var(--ring-inner);
          margin-left: calc(var(--ring-inner) / -2);
          margin-top:  calc(var(--ring-inner) / -2);
          animation: orbit-cw 3.8s linear infinite;
        }
        .orbit-planet {
          position: absolute;
          border-radius: 50%;
          top: calc(var(--planet) / -2);
          left: 50%;
          transform: translateX(-50%);
          width: var(--planet);
          height: var(--planet);
        }
        .orbit-planet-blue { background: #6ca8f0; }
        .orbit-planet-pink { background: #e870a0; }

        .orbit-wordmark {
          color: currentColor;
          font-size: var(--text-size);
          font-weight: 900;
          font-family: 'Arial Black', Impact, sans-serif;
          letter-spacing: calc(var(--text-size) * -0.042);
          line-height: 1;
          margin-left: calc(var(--orbit-size) * 0.036);
        }

        @keyframes orbit-cw  { to { transform: rotate(360deg);  } }
        @keyframes orbit-ccw { to { transform: rotate(-360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .orbit-track-outer, .orbit-track-inner { animation: none !important; }
        }
      `})]})}export{l as M,b as O};
