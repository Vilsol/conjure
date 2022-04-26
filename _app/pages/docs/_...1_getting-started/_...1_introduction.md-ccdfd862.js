import{S as E,i as b,s as h,e as A,t as F,k as u,w,c as C,a as _,h as D,d as c,m as $,x as K,g as d,M as v,y as L,j as x,q as k,o as q,B as S,_ as j}from"../../../chunks/index-b3e2d4c5.js";import{f as H}from"../../../chunks/scroll-c3143216.js";import{C as M}from"../../../chunks/CodeFence-6bc3340f.js";import"../../../chunks/singletons-770e68ce.js";import"../../../chunks/contexts-9dfa1e7f.js";import"../../../chunks/clsx.m-bc8192c6.js";function P(B){let a,e=B[0].title+"",o,p,t,i=B[0].description+"",y,m,l,r;return l=new M({props:{lang:"svelte",ext:"svelte",linesCount:12,rawCode:`<script&#8203>
import { createKitDocsLoader } from '@svelteness/kit-docs';

export const prerender = true;

export const load = createKitDocsLoader({
  sidebar: {
    '/': null,
    '/docs': '/docs'
  }
});
`,showCopyCode:!0,code:`<pre><code><span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E06C75">script</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> { </span><span style="color: #E06C75">createKitDocsLoader</span><span style="color: #ABB2BF"> } </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;@svelteness/kit-docs&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #C678DD">export</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">prerender</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">true</span><span style="color: #ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #C678DD">export</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">load</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">createKitDocsLoader</span><span style="color: #ABB2BF">({</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #E06C75">sidebar</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">    </span><span style="color: #98C379">&#39;/&#39;</span><span style="color: #ABB2BF">: </span><span style="color: #D19A66">null</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">    </span><span style="color: #98C379">&#39;/docs&#39;</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;/docs&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">  }</span></span>
<span class="line"><span style="color: #ABB2BF">});</span></span>
<span class="line"></span></code></pre>`}}),{c(){a=A("h1"),o=F(e),p=u(),t=A("p"),y=F(i),m=u(),w(l.$$.fragment)},l(s){a=C(s,"H1",{});var n=_(a);o=D(n,e),n.forEach(c),p=$(s),t=C(s,"P",{});var f=_(t);y=D(f,i),f.forEach(c),m=$(s),K(l.$$.fragment,s)},m(s,n){d(s,a,n),v(a,o),d(s,p,n),d(s,t,n),v(t,y),d(s,m,n),L(l,s,n),r=!0},p(s,[n]){(!r||n&1)&&e!==(e=s[0].title+"")&&x(o,e),(!r||n&1)&&i!==(i=s[0].description+"")&&x(y,i)},i(s){r||(k(l.$$.fragment,s),r=!0)},o(s){q(l.$$.fragment,s),r=!1},d(s){s&&c(a),s&&c(p),s&&c(t),s&&c(m),S(l,s)}}}function U(B,a,e){let o;return j(B,H,p=>e(0,o=p)),[o]}class O extends E{constructor(a){super(),b(this,a,U,P,h,{})}}export{O as default};
