import{S as x,i as S,s as j,e as _,t as u,k,c as d,a as h,h as v,d as p,m as q,g as c,M as E,j as $,E as b,_ as y}from"../../../chunks/index-9bffbb89.js";import{f as B}from"../../../chunks/scroll-4d474ca9.js";import"../../../chunks/singletons-4999ee60.js";function C(r){let e,s=r[0].title+"",i,n,o,l=r[0].description+"",m;return{c(){e=_("h1"),i=u(s),n=k(),o=_("p"),m=u(l)},l(t){e=d(t,"H1",{});var a=h(e);i=v(a,s),a.forEach(p),n=q(t),o=d(t,"P",{});var f=h(o);m=v(f,l),f.forEach(p)},m(t,a){c(t,e,a),E(e,i),c(t,n,a),c(t,o,a),E(o,m)},p(t,[a]){a&1&&s!==(s=t[0].title+"")&&$(i,s),a&1&&l!==(l=t[0].description+"")&&$(m,l)},i:b,o:b,d(t){t&&p(e),t&&p(n),t&&p(o)}}}function D(r,e,s){let i;return y(r,B,n=>s(0,i=n)),[i]}class U extends x{constructor(e){super(),S(this,e,D,C,j,{})}}export{U as default};