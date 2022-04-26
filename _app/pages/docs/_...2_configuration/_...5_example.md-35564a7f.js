var us=Object.defineProperty,Es=Object.defineProperties;var fs=Object.getOwnPropertyDescriptors;var es=Object.getOwnPropertySymbols;var Ds=Object.prototype.hasOwnProperty,ds=Object.prototype.propertyIsEnumerable;var ts=(l,s,n)=>s in l?us(l,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):l[s]=n,W=(l,s)=>{for(var n in s||(s={}))Ds.call(s,n)&&ts(l,n,s[n]);if(es)for(var n of es(s))ds.call(s,n)&&ts(l,n,s[n]);return l},X=(l,s)=>Es(l,fs(s));import{S as ns,i as as,s as ls,w as J,k as _,e as g,t as x,x as O,m as w,c as h,a as k,h as z,d as c,y as I,g as u,M as m,j as V,q as R,o as j,B as M,a5 as Bs,_ as ps,a9 as rs,l as K,aa as gs,E as P,b as G,a8 as hs}from"../../../chunks/index-9bffbb89.js";import{F as Cs,B as ms,s as H,n as bs}from"../../../chunks/base-20d7510c.js";import{f as $s}from"../../../chunks/scroll-4d474ca9.js";import{C as cs}from"../../../chunks/CodeFence-4a2f990a.js";import{L as ys}from"../../../chunks/Link-dae17348.js";import"../../../chunks/singletons-4999ee60.js";import"../../../chunks/contexts-904695ee.js";import"../../../chunks/clsx.m-bc8192c6.js";function vs(l){let s,n,o,t=JSON.stringify(l[0],null,4)+"",B,e;return s=new Cs({props:{form:l[1]}}),{c(){J(s.$$.fragment),n=_(),o=g("pre"),B=x(t)},l(p){O(s.$$.fragment,p),n=w(p),o=h(p,"PRE",{});var r=k(o);B=z(r,t),r.forEach(c)},m(p,r){I(s,p,r),u(p,n,r),u(p,o,r),m(o,B),e=!0},p(p,[r]){(!e||r&1)&&t!==(t=JSON.stringify(p[0],null,4)+"")&&V(B,t)},i(p){e||(R(s.$$.fragment,p),e=!0)},o(p){j(s.$$.fragment,p),e=!1},d(p){M(s,p),p&&c(n),p&&c(o)}}}function _s(l,s,n){let o;const t=ms.newForm([{type:"input",name:"name",label:"Name",schema:H(),params:{placeholder:"Name"}},{type:"textarea",name:"description",label:"Description",schema:H(),params:{placeholder:"Description"}},{type:"input",name:"dob",label:"Date of birth",schema:H(),params:{type:"date"}},{type:"input",name:"password",label:"Password",schema:H().min(16),params:{type:"password",placeholder:"Password"}},{type:"input",name:"level",label:"Level",schema:bs().min(3).max(100),params:{type:"number",placeholder:"Level"}},{type:"select",name:"selection",label:"Option",schema:H(),hide:e=>!("level"in e&&typeof e.level=="number"&&e.level>0),options:async e=>{let p=3;return"level"in e&&typeof e.level=="number"&&e.level>0&&(p=e.level),p=Math.min(50,p),new Promise(r=>{r(Array(p).fill(0).map((f,E)=>({label:"I: "+E,value:E})))})}},{type:"button",text:"Set name to John",click:()=>B.set(X(W({},Bs(B)),{name:"John"})),params:{class:"demo-button mr-1"}},{type:"button",text:"Set level to 10",click:()=>B.set(X(W({},Bs(B)),{level:10})),params:{class:"demo-button"}}]),B=t.getData();return ps(l,B,e=>n(0,o=e)),[o,t,B]}class ws extends ns{constructor(s){super(),as(this,s,_s,vs,ls,{})}}const os="https://www.dnd5eapi.co/api";let Y;const Z={},ss={},xs=async()=>(Y||(Y=await fetch(os+"/classes").then(l=>l.json())),Y),zs=async l=>(l in Z||(Z[l]=await fetch(os+"/classes/"+l+"/features").then(s=>s.json())),Z[l]),ks=async l=>{if(l)return l in ss||(ss[l]=await fetch(os+"/features/"+l).then(s=>s.json())),ss[l]};function Fs(l,s,n){const o=l.slice();return o[5]=s[n],o}function Ss(l){return{c:P,l:P,m:P,p:P,d:P}}function Ns(l){let s,n=l[4]&&As(l);return{c(){n&&n.c(),s=K()},l(o){n&&n.l(o),s=K()},m(o,t){n&&n.m(o,t),u(o,s,t)},p(o,t){o[4]?n?n.p(o,t):(n=As(o),n.c(),n.m(s.parentNode,s)):n&&(n.d(1),n=null)},d(o){n&&n.d(o),o&&c(s)}}}function As(l){let s,n,o,t,B,e=l[4].name+"",p,r,f,E,T,L,D,S=l[4].level+"",b,d,$,N=l[4].desc,C=[];for(let y=0;y<N.length;y+=1)C[y]=is(Fs(l,N,y));return{c(){s=g("div"),n=g("strong"),o=x("Name:"),t=_(),B=g("span"),p=x(e),r=g("br"),f=_(),E=g("strong"),T=x("Level:"),L=_(),D=g("span"),b=x(S),d=g("br"),$=_();for(let y=0;y<C.length;y+=1)C[y].c();this.h()},l(y){s=h(y,"DIV",{});var i=k(s);n=h(i,"STRONG",{});var F=k(n);o=z(F,"Name:"),F.forEach(c),t=w(i),B=h(i,"SPAN",{class:!0});var v=k(B);p=z(v,e),v.forEach(c),r=h(i,"BR",{}),f=w(i),E=h(i,"STRONG",{});var a=k(E);T=z(a,"Level:"),a.forEach(c),L=w(i),D=h(i,"SPAN",{class:!0});var A=k(D);b=z(A,S),A.forEach(c),d=h(i,"BR",{}),$=w(i);for(let q=0;q<C.length;q+=1)C[q].l(i);i.forEach(c),this.h()},h(){G(B,"class","text-neutral-300"),G(D,"class","text-neutral-300")},m(y,i){u(y,s,i),m(s,n),m(n,o),m(s,t),m(s,B),m(B,p),m(s,r),m(s,f),m(s,E),m(E,T),m(s,L),m(s,D),m(D,b),m(s,d),m(s,$);for(let F=0;F<C.length;F+=1)C[F].m(s,null)},p(y,i){if(i&1&&e!==(e=y[4].name+"")&&V(p,e),i&1&&S!==(S=y[4].level+"")&&V(b,S),i&1){N=y[4].desc;let F;for(F=0;F<N.length;F+=1){const v=Fs(y,N,F);C[F]?C[F].p(v,i):(C[F]=is(v),C[F].c(),C[F].m(s,null))}for(;F<C.length;F+=1)C[F].d(1);C.length=N.length}},d(y){y&&c(s),hs(C,y)}}}function is(l){let s,n=l[5]+"",o;return{c(){s=g("p"),o=x(n),this.h()},l(t){s=h(t,"P",{class:!0});var B=k(s);o=z(B,n),B.forEach(c),this.h()},h(){G(s,"class","text-neutral-300")},m(t,B){u(t,s,B),m(s,o)},p(t,B){B&1&&n!==(n=t[5]+"")&&V(o,n)},d(t){t&&c(s)}}}function Ps(l){return{c:P,l:P,m:P,p:P,d:P}}function qs(l){let s,n,o,t,B;s=new Cs({props:{form:l[1]}});let e={ctx:l,current:null,token:null,hasCatch:!1,pending:Ps,then:Ns,catch:Ss,value:4};return rs(t=l[0],e),{c(){J(s.$$.fragment),n=_(),o=K(),e.block.c()},l(p){O(s.$$.fragment,p),n=w(p),o=K(),e.block.l(p)},m(p,r){I(s,p,r),u(p,n,r),u(p,o,r),e.block.m(p,e.anchor=r),e.mount=()=>o.parentNode,e.anchor=o,B=!0},p(p,[r]){l=p,e.ctx=l,r&1&&t!==(t=l[0])&&rs(t,e)||gs(e,l,r)},i(p){B||(R(s.$$.fragment,p),B=!0)},o(p){j(s.$$.fragment,p),B=!1},d(p){M(s,p),p&&c(n),p&&c(o),e.block.d(p),e.token=null,e=null}}}function Ls(l,s,n){let o,t;const B=ms.newForm([{type:"select",name:"class",label:"Class",schema:H(),options:async()=>[{label:"Select class...",value:""},...(await xs()).results.map(p=>({label:p.name,value:p.index}))]},{type:"select",name:"feature",label:"Feature",schema:H(),hide:p=>!("class"in p&&p.class),options:async p=>"class"in p&&p.class?[{label:"Select feature...",value:""},...(await zs(p.class)).results.map(r=>({label:r.name,value:r.index}))]:[]}]),e=B.getData();return ps(l,e,p=>n(3,t=p)),l.$$.update=()=>{l.$$.dirty&8&&n(0,o=ks(t.feature))},[o,B,e,t]}class Js extends ns{constructor(s){super(),as(this,s,Ls,qs,ls,{})}}function Os(l){let s;return{c(){s=x("#")},l(n){s=z(n,"#")},m(n,o){u(n,s,o)},d(n){n&&c(s)}}}function Is(l){let s;return{c(){s=x("#")},l(n){s=z(n,"#")},m(n,o){u(n,s,o)},d(n){n&&c(s)}}}function Rs(l){let s,n=l[0].title+"",o,t,B,e=l[0].description+"",p,r,f,E,T,L,D,S,b,d,$,N,C,y,i,F,v;return E=new ys({props:{class:"header-anchor",href:"#simple-example","aria-hidden":"true",$$slots:{default:[Os]},$$scope:{ctx:l}}}),D=new ws({}),b=new cs({props:{lang:"svelte",ext:"svelte",linesCount:114,rawCode:`<script&#8203 lang="ts">
  import { Base, Form } from '$lib';
  import { get } from 'svelte/store';
  import * as zod from 'zod';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'name',
      label: 'Name',
      schema: zod.string(),
      params: {
        placeholder: 'Name'
      }
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      schema: zod.string(),
      params: {
        placeholder: 'Description'
      }
    },
    {
      type: 'input',
      name: 'dob',
      label: 'Date of birth',
      schema: zod.string(),
      params: {
        type: 'date'
      }
    },
    {
      type: 'input',
      name: 'password',
      label: 'Password',
      schema: zod.string().min(16),
      params: {
        type: 'password',
        placeholder: 'Password'
      }
    },
    {
      type: 'input',
      name: 'level',
      label: 'Level',
      schema: zod.number().min(3).max(100),
      params: {
        type: 'number',
        placeholder: 'Level'
      }
    },
    {
      type: 'select',
      name: 'selection',
      label: 'Option',
      schema: zod.string(),
      hide: (data) => {
        return !('level' in data && typeof data.level === 'number' && data.level > 0);
      },
      options: async (data) => {
        let selections = 3;
        if ('level' in data && typeof data.level === 'number' && data.level > 0) {
          selections = data.level;
        }

        selections = Math.min(50, selections);

        return new Promise((resolve) => {
          resolve(
            Array(selections)
              .fill(0)
              .map((_, i) => ({
                label: 'I: ' + i,
                value: i
              }))
          );
        });
      }
    },
    {
      type: 'button',
      text: 'Set name to John',
      click: () =>
        data.set({
          ...get(data),
          name: 'John'
        }),
      params: {
        class: 'demo-button mr-1'
      }
    },
    {
      type: 'button',
      text: 'Set level to 10',
      click: () =>
        data.set({
          ...get(data),
          level: 10
        }),
      params: {
        class: 'demo-button'
      }
    }
  ] as const);

  const data = form.getData();
<\/script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
`,showCopyCode:!0,code:`<pre><code><span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E06C75">script</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">lang</span><span style="color: #ABB2BF">=</span><span style="color: #98C379">&quot;ts&quot;</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> { </span><span style="color: #E06C75">Base</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75">Form</span><span style="color: #ABB2BF"> } </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;$lib&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> { </span><span style="color: #E06C75">get</span><span style="color: #ABB2BF"> } </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;svelte/store&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">*</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">zod</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;zod&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">form</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">Base</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">newForm</span><span style="color: #ABB2BF">([</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;input&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;name&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Name&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">placeholder</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Name&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;textarea&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;description&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Description&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">placeholder</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Description&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;input&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;dob&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Date of birth&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;date&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;input&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;password&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Password&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">().</span><span style="color: #61AFEF">min</span><span style="color: #ABB2BF">(</span><span style="color: #D19A66">16</span><span style="color: #ABB2BF">),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;password&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">placeholder</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Password&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;input&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;level&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Level&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">number</span><span style="color: #ABB2BF">().</span><span style="color: #61AFEF">min</span><span style="color: #ABB2BF">(</span><span style="color: #D19A66">3</span><span style="color: #ABB2BF">).</span><span style="color: #61AFEF">max</span><span style="color: #ABB2BF">(</span><span style="color: #D19A66">100</span><span style="color: #ABB2BF">),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;number&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">placeholder</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Level&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;select&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;selection&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Option&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">hide</span><span style="color: #ABB2BF">: (</span><span style="color: #E06C75; font-style: italic">data</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">!</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;level&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">in</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">typeof</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">===</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;number&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&gt;</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">0</span><span style="color: #ABB2BF">);</span></span>
<span class="line"><span style="color: #ABB2BF">      },</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">options</span><span style="color: #ABB2BF">: </span><span style="color: #C678DD">async</span><span style="color: #ABB2BF"> (</span><span style="color: #E06C75; font-style: italic">data</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">let</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">selections</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">3</span><span style="color: #ABB2BF">;</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">if</span><span style="color: #ABB2BF"> (</span><span style="color: #98C379">&#39;level&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">in</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">typeof</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">===</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;number&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&gt;</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">0</span><span style="color: #ABB2BF">) {</span></span>
<span class="line"><span style="color: #ABB2BF">          </span><span style="color: #E06C75">selections</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #ABB2BF">;</span></span>
<span class="line"><span style="color: #ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">selections</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">Math</span><span style="color: #ABB2BF">.</span><span style="color: #56B6C2">min</span><span style="color: #ABB2BF">(</span><span style="color: #D19A66">50</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75">selections</span><span style="color: #ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">new</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">Promise</span><span style="color: #ABB2BF">((</span><span style="color: #E06C75; font-style: italic">resolve</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">          </span><span style="color: #61AFEF">resolve</span><span style="color: #ABB2BF">(</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #E5C07B">Array</span><span style="color: #ABB2BF">(</span><span style="color: #E06C75">selections</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">              .</span><span style="color: #61AFEF">fill</span><span style="color: #ABB2BF">(</span><span style="color: #D19A66">0</span><span style="color: #ABB2BF">)</span></span>
<span class="line"><span style="color: #ABB2BF">              .</span><span style="color: #61AFEF">map</span><span style="color: #ABB2BF">((</span><span style="color: #E06C75; font-style: italic">_</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75; font-style: italic">i</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> ({</span></span>
<span class="line"><span style="color: #ABB2BF">                </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;I: &#39;</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">+</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">i</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">                </span><span style="color: #E06C75">value</span><span style="color: #ABB2BF">: </span><span style="color: #E06C75">i</span></span>
<span class="line"><span style="color: #ABB2BF">              }))</span></span>
<span class="line"><span style="color: #ABB2BF">          );</span></span>
<span class="line"><span style="color: #ABB2BF">        });</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;button&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">text</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Set name to John&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">click</span><span style="color: #ABB2BF">: () </span><span style="color: #C678DD">=&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">set</span><span style="color: #ABB2BF">({</span></span>
<span class="line"><span style="color: #ABB2BF">          ...</span><span style="color: #61AFEF">get</span><span style="color: #ABB2BF">(</span><span style="color: #E06C75">data</span><span style="color: #ABB2BF">),</span></span>
<span class="line"><span style="color: #ABB2BF">          </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;John&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">        }),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">class</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;demo-button mr-1&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;button&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">text</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Set level to 10&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">click</span><span style="color: #ABB2BF">: () </span><span style="color: #C678DD">=&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">set</span><span style="color: #ABB2BF">({</span></span>
<span class="line"><span style="color: #ABB2BF">          ...</span><span style="color: #61AFEF">get</span><span style="color: #ABB2BF">(</span><span style="color: #E06C75">data</span><span style="color: #ABB2BF">),</span></span>
<span class="line"><span style="color: #ABB2BF">          </span><span style="color: #E06C75">level</span><span style="color: #ABB2BF">: </span><span style="color: #D19A66">10</span></span>
<span class="line"><span style="color: #ABB2BF">        }),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">params</span><span style="color: #ABB2BF">: {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #E06C75">class</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;demo-button&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    }</span></span>
<span class="line"><span style="color: #ABB2BF">  ] </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">form</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">getData</span><span style="color: #ABB2BF">();</span></span>
<span class="line"><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">script</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E5C07B">Form</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">{</span><span style="color: #E06C75">form</span><span style="color: #D19A66">}</span><span style="color: #ABB2BF"> /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E06C75">pre</span><span style="color: #ABB2BF">&gt;</span><span style="color: #C678DD">{</span><span style="color: #D19A66">JSON</span><span style="color: #ABB2BF">.</span><span style="color: #56B6C2">stringify</span><span style="color: #ABB2BF">($</span><span style="color: #E06C75">data</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">null</span><span style="color: #ABB2BF">, </span><span style="color: #D19A66">4</span><span style="color: #ABB2BF">)</span><span style="color: #C678DD">}</span><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">pre</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"></span></code></pre>`}}),$=new ys({props:{class:"header-anchor",href:"#async-example","aria-hidden":"true",$$slots:{default:[Is]},$$scope:{ctx:l}}}),y=new Js({}),F=new cs({props:{lang:"svelte",ext:"svelte",linesCount:77,rawCode:`<script&#8203 lang="ts">
  import { Base, Form } from '$lib';
  import * as zod from 'zod';

  import { getClasses, getFeature, getFeatures } from '../../dnd';

  const form = Base.newForm([
    {
      type: 'select',
      name: 'class',
      label: 'Class',
      schema: zod.string(),
      options: async () => {
        return [
          {
            label: 'Select class...',
            value: ''
          },
          ...(await getClasses()).results.map((clazz) => {
            return {
              label: clazz.name,
              value: clazz.index
            };
          })
        ];
      }
    },
    {
      type: 'select',
      name: 'feature',
      label: 'Feature',
      schema: zod.string(),
      hide: (data) => {
        return !('class' in data && data.class);
      },
      options: async (data: { class?: string }) => {
        if (!('class' in data && data.class)) {
          return [];
        }

        return [
          {
            label: 'Select feature...',
            value: ''
          },
          ...(await getFeatures(data.class)).results.map((feature) => {
            return {
              label: feature.name,
              value: feature.index
            };
          })
        ];
      }
    }
  ] as const);

  const data = form.getData();

  $: featureData = getFeature($data.feature as string);
<\/script>

<Form {form} />

{#await featureData then feature}
  {#if feature}
    <div>
      <strong>Name: </strong>
      <span class="text-neutral-300">{feature.name}</span><br />
      <strong>Level: </strong>
      <span class="text-neutral-300">{feature.level}</span><br />
      {#each feature.desc as line}
        <p class="text-neutral-300">{line}</p>
      {/each}
    </div>
  {/if}
{/await}
`,showCopyCode:!0,code:`<pre><code><span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E06C75">script</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">lang</span><span style="color: #ABB2BF">=</span><span style="color: #98C379">&quot;ts&quot;</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> { </span><span style="color: #E06C75">Base</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75">Form</span><span style="color: #ABB2BF"> } </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;$lib&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">*</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">zod</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;zod&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">import</span><span style="color: #ABB2BF"> { </span><span style="color: #E06C75">getClasses</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75">getFeature</span><span style="color: #ABB2BF">, </span><span style="color: #E06C75">getFeatures</span><span style="color: #ABB2BF"> } </span><span style="color: #C678DD">from</span><span style="color: #ABB2BF"> </span><span style="color: #98C379">&#39;../../dnd&#39;</span><span style="color: #ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">form</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">Base</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">newForm</span><span style="color: #ABB2BF">([</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;select&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;class&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Class&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">options</span><span style="color: #ABB2BF">: </span><span style="color: #C678DD">async</span><span style="color: #ABB2BF"> () </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> [</span></span>
<span class="line"><span style="color: #ABB2BF">          {</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Select class...&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #E06C75">value</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">          },</span></span>
<span class="line"><span style="color: #ABB2BF">          ...(</span><span style="color: #C678DD">await</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">getClasses</span><span style="color: #ABB2BF">()).</span><span style="color: #E5C07B">results</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">map</span><span style="color: #ABB2BF">((</span><span style="color: #E06C75; font-style: italic">clazz</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">              </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">clazz</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">              </span><span style="color: #E06C75">value</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">clazz</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">index</span></span>
<span class="line"><span style="color: #ABB2BF">            };</span></span>
<span class="line"><span style="color: #ABB2BF">          })</span></span>
<span class="line"><span style="color: #ABB2BF">        ];</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    },</span></span>
<span class="line"><span style="color: #ABB2BF">    {</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">type</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;select&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;feature&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Feature&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #E06C75">schema</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">zod</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">string</span><span style="color: #ABB2BF">(),</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">hide</span><span style="color: #ABB2BF">: (</span><span style="color: #E06C75; font-style: italic">data</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">!</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;class&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">in</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">class</span><span style="color: #ABB2BF">);</span></span>
<span class="line"><span style="color: #ABB2BF">      },</span></span>
<span class="line"><span style="color: #ABB2BF">      </span><span style="color: #61AFEF">options</span><span style="color: #ABB2BF">: </span><span style="color: #C678DD">async</span><span style="color: #ABB2BF"> (</span><span style="color: #E06C75; font-style: italic">data</span><span style="color: #ABB2BF">: { </span><span style="color: #E06C75">class</span><span style="color: #C678DD">?</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">string</span><span style="color: #ABB2BF"> }) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">if</span><span style="color: #ABB2BF"> (</span><span style="color: #56B6C2">!</span><span style="color: #ABB2BF">(</span><span style="color: #98C379">&#39;class&#39;</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">in</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">&amp;&amp;</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">class</span><span style="color: #ABB2BF">)) {</span></span>
<span class="line"><span style="color: #ABB2BF">          </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> [];</span></span>
<span class="line"><span style="color: #ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">        </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> [</span></span>
<span class="line"><span style="color: #ABB2BF">          {</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;Select feature...&#39;</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #E06C75">value</span><span style="color: #ABB2BF">: </span><span style="color: #98C379">&#39;&#39;</span></span>
<span class="line"><span style="color: #ABB2BF">          },</span></span>
<span class="line"><span style="color: #ABB2BF">          ...(</span><span style="color: #C678DD">await</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">getFeatures</span><span style="color: #ABB2BF">(</span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">class</span><span style="color: #ABB2BF">)).</span><span style="color: #E5C07B">results</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">map</span><span style="color: #ABB2BF">((</span><span style="color: #E06C75; font-style: italic">feature</span><span style="color: #ABB2BF">) </span><span style="color: #C678DD">=&gt;</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">            </span><span style="color: #C678DD">return</span><span style="color: #ABB2BF"> {</span></span>
<span class="line"><span style="color: #ABB2BF">              </span><span style="color: #E06C75">label</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">feature</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">name</span><span style="color: #ABB2BF">,</span></span>
<span class="line"><span style="color: #ABB2BF">              </span><span style="color: #E06C75">value</span><span style="color: #ABB2BF">: </span><span style="color: #E5C07B">feature</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">index</span></span>
<span class="line"><span style="color: #ABB2BF">            };</span></span>
<span class="line"><span style="color: #ABB2BF">          })</span></span>
<span class="line"><span style="color: #ABB2BF">        ];</span></span>
<span class="line"><span style="color: #ABB2BF">      }</span></span>
<span class="line"><span style="color: #ABB2BF">    }</span></span>
<span class="line"><span style="color: #ABB2BF">  ] </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  </span><span style="color: #C678DD">const</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">form</span><span style="color: #ABB2BF">.</span><span style="color: #61AFEF">getData</span><span style="color: #ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">  $: </span><span style="color: #E06C75">featureData</span><span style="color: #ABB2BF"> </span><span style="color: #56B6C2">=</span><span style="color: #ABB2BF"> </span><span style="color: #61AFEF">getFeature</span><span style="color: #ABB2BF">($</span><span style="color: #E5C07B">data</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">feature</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">string</span><span style="color: #ABB2BF">);</span></span>
<span class="line"><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">script</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">&lt;</span><span style="color: #E5C07B">Form</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">{</span><span style="color: #E06C75">form</span><span style="color: #D19A66">}</span><span style="color: #ABB2BF"> /&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color: #ABB2BF">{#</span><span style="color: #C678DD">await</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">featureData</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">then</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">feature</span><span style="color: #ABB2BF">}</span></span>
<span class="line"><span style="color: #ABB2BF">  {#</span><span style="color: #C678DD">if</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">feature</span><span style="color: #ABB2BF">}</span></span>
<span class="line"><span style="color: #ABB2BF">    &lt;</span><span style="color: #E06C75">div</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      &lt;</span><span style="color: #E06C75">strong</span><span style="color: #ABB2BF">&gt;Name: &lt;/</span><span style="color: #E06C75">strong</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      &lt;</span><span style="color: #E06C75">span</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">class</span><span style="color: #ABB2BF">=</span><span style="color: #98C379">&quot;text-neutral-300&quot;</span><span style="color: #ABB2BF">&gt;</span><span style="color: #C678DD">{</span><span style="color: #E5C07B">feature</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">name</span><span style="color: #C678DD">}</span><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">span</span><span style="color: #ABB2BF">&gt;&lt;</span><span style="color: #E06C75">br</span><span style="color: #ABB2BF"> /&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      &lt;</span><span style="color: #E06C75">strong</span><span style="color: #ABB2BF">&gt;Level: &lt;/</span><span style="color: #E06C75">strong</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      &lt;</span><span style="color: #E06C75">span</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">class</span><span style="color: #ABB2BF">=</span><span style="color: #98C379">&quot;text-neutral-300&quot;</span><span style="color: #ABB2BF">&gt;</span><span style="color: #C678DD">{</span><span style="color: #E5C07B">feature</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">level</span><span style="color: #C678DD">}</span><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">span</span><span style="color: #ABB2BF">&gt;&lt;</span><span style="color: #E06C75">br</span><span style="color: #ABB2BF"> /&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      {#</span><span style="color: #C678DD">each</span><span style="color: #ABB2BF"> </span><span style="color: #E5C07B">feature</span><span style="color: #ABB2BF">.</span><span style="color: #E06C75">desc</span><span style="color: #ABB2BF"> </span><span style="color: #C678DD">as</span><span style="color: #ABB2BF"> </span><span style="color: #E06C75">line</span><span style="color: #ABB2BF">}</span></span>
<span class="line"><span style="color: #ABB2BF">        &lt;</span><span style="color: #E06C75">p</span><span style="color: #ABB2BF"> </span><span style="color: #D19A66">class</span><span style="color: #ABB2BF">=</span><span style="color: #98C379">&quot;text-neutral-300&quot;</span><span style="color: #ABB2BF">&gt;</span><span style="color: #C678DD">{</span><span style="color: #E06C75">line</span><span style="color: #C678DD">}</span><span style="color: #ABB2BF">&lt;/</span><span style="color: #E06C75">p</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">      {/</span><span style="color: #C678DD">each</span><span style="color: #ABB2BF">}</span></span>
<span class="line"><span style="color: #ABB2BF">    &lt;/</span><span style="color: #E06C75">div</span><span style="color: #ABB2BF">&gt;</span></span>
<span class="line"><span style="color: #ABB2BF">  {/</span><span style="color: #C678DD">if</span><span style="color: #ABB2BF">}</span></span>
<span class="line"><span style="color: #ABB2BF">{/</span><span style="color: #C678DD">await</span><span style="color: #ABB2BF">}</span></span>
<span class="line"></span></code></pre>`}}),{c(){s=g("h1"),o=x(n),t=_(),B=g("p"),p=x(e),r=_(),f=g("h2"),J(E.$$.fragment),T=x(" Simple Example"),L=_(),J(D.$$.fragment),S=_(),J(b.$$.fragment),d=g("h2"),J($.$$.fragment),N=x(" Async Example"),C=_(),J(y.$$.fragment),i=_(),J(F.$$.fragment),this.h()},l(a){s=h(a,"H1",{});var A=k(s);o=z(A,n),A.forEach(c),t=w(a),B=h(a,"P",{});var q=k(B);p=z(q,e),q.forEach(c),r=w(a),f=h(a,"H2",{id:!0,tabindex:!0});var U=k(f);O(E.$$.fragment,U),T=z(U," Simple Example"),U.forEach(c),L=w(a),O(D.$$.fragment,a),S=w(a),O(b.$$.fragment,a),d=h(a,"H2",{id:!0,tabindex:!0});var Q=k(d);O($.$$.fragment,Q),N=z(Q," Async Example"),Q.forEach(c),C=w(a),O(y.$$.fragment,a),i=w(a),O(F.$$.fragment,a),this.h()},h(){G(f,"id","simple-example"),G(f,"tabindex","-1"),G(d,"id","async-example"),G(d,"tabindex","-1")},m(a,A){u(a,s,A),m(s,o),u(a,t,A),u(a,B,A),m(B,p),u(a,r,A),u(a,f,A),I(E,f,null),m(f,T),u(a,L,A),I(D,a,A),u(a,S,A),I(b,a,A),u(a,d,A),I($,d,null),m(d,N),u(a,C,A),I(y,a,A),u(a,i,A),I(F,a,A),v=!0},p(a,[A]){(!v||A&1)&&n!==(n=a[0].title+"")&&V(o,n),(!v||A&1)&&e!==(e=a[0].description+"")&&V(p,e);const q={};A&2&&(q.$$scope={dirty:A,ctx:a}),E.$set(q);const U={};A&2&&(U.$$scope={dirty:A,ctx:a}),$.$set(U)},i(a){v||(R(E.$$.fragment,a),R(D.$$.fragment,a),R(b.$$.fragment,a),R($.$$.fragment,a),R(y.$$.fragment,a),R(F.$$.fragment,a),v=!0)},o(a){j(E.$$.fragment,a),j(D.$$.fragment,a),j(b.$$.fragment,a),j($.$$.fragment,a),j(y.$$.fragment,a),j(F.$$.fragment,a),v=!1},d(a){a&&c(s),a&&c(t),a&&c(B),a&&c(r),a&&c(f),M(E),a&&c(L),M(D,a),a&&c(S),M(b,a),a&&c(d),M($),a&&c(C),M(y,a),a&&c(i),M(F,a)}}}function js(l,s,n){let o;return ps(l,$s,t=>n(0,o=t)),[o]}class Xs extends ns{constructor(s){super(),as(this,s,js,Rs,ls,{})}}export{Xs as default};
