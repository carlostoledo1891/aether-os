---
source: "Meteoric Website"
authority: Meteoric
jurisdiction: AU
tags: [meteoric]
source_url: https://meteoric.com.au/
---
# Meteoric Website
<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8"><script type="text/javascript">(window.NREUM||(NREUM={})).init={privacy:{cookies_enabled:true},ajax:{deny_list:["bam.nr-data.net"]},feature_flags:["soft_nav"],distributed_tracing:{enabled:true}};(window.NREUM||(NREUM={})).loader_config={agentID:"1134583913",accountID:"3190724",trustKey:"3190724",xpid:"VwcOUVFRDBAJXFJWAQMAVlU=",licenseKey:"NRJS-a0c1a93fd583edd9965",applicationID:"983462701",browserID:"1134583913"};;/*! For license information please see nr-loader-spa-1.312.1.min.js.LICENSE.txt */
(()=>{var e,t,r={384:(e,t,r)=>{"use strict";r.d(t,{NT:()=>a,Zm:()=>c,bQ:()=>u,dV:()=>d,pV:()=>l});var n=r(6154),i=r(1863),s=r(944),o=r(1910);const a={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net"};function c(){return n.gm.NREUM||(n.gm.NREUM={}),void 0===n.gm.newrelic&&(n.gm.newrelic=n.gm.NREUM),n.gm.NREUM}function d(){let e=c();return e.o||(e.o={ST:n.gm.setTimeout,SI:n.gm.setImmediate||n.gm.setInterval,CT:n.gm.clearTimeout,XHR:n.gm.XMLHttpRequest,REQ:n.gm.Request,EV:n.gm.Event,PR:n.gm.Promise,MO:n.gm.MutationObserver,FETCH:n.gm.fetch,WS:n.gm.WebSocket},(0,o.i)(...Object.values(e.o))),e}function u(e,t){let r=c();r.initializedAgents??={},t.initializedAt={ms:(0,i.t)(),date:new Date},r.initializedAgents[e]=t,2===Object.keys(r.initializedAgents).length&&(0,s.R)(69)}function l(){return function(){let e=c();const t=e.info||{};e.info={beacon:a.beacon,errorBeacon:a.errorBeacon,...t}}(),function(){let e=c();const t=e.init||{};e.init={...t}}(),d(),function(){let e=c();const t=e.loader_config||{};e.loader_config={...t}}(),c()}},782:(e,t,r)=>{"use strict";r.d(t,{T:()=>n});const n=r(860).K7.pageViewTiming},860:(e,t,r)=>{"use strict";r.d(t,{$J:()=>u,K7:()=>c,P3:()=>d,XX:()=>i,Yy:()=>a,df:()=>s,qY:()=>n,v4:()=>o});const n="events",i="jserrors",s="browser/blobs",o="rum",a="browser/logs",c={ajax:"ajax",genericEvents:"generic_events",jserrors:i,logging:"logging",metrics:"metrics",pageAction:"page_action",pageViewEvent:"page_view_event",pageViewTiming:"page_view_timing",sessionReplay:"session_replay",sessionTrace:"session_trace",softNav:"soft_navigations"},d={[c.pageViewEvent]:1,[c.pageViewTiming]:2,[c.metrics]:3,[c.jserrors]:4,[c.softNav]:5,[c.ajax]:6,[c.sessionTrace]:7,[c.sessionReplay]:8,[c.logging]:9,[c.genericEvents]:10},u={[c.pageViewEvent]:o,[c.pageViewTiming]:n,[c.ajax]:n,[c.softNav]:n,[c.metrics]:i,[c.jserrors]:i,[c.sessionTrace]:s,[c.sessionReplay]:s,[c.logging]:a,[c.genericEvents]:"ins"}},944:(e,t,r)=>{"use strict";r.d(t,{R:()=>i});var n=r(3241);function i(e,t){"function"==typeof console.debug&&(console.debug("New Relic Warning: https://github.com/newrelic/newrelic-browser-agent/blob/main/docs/warning-codes.md#".concat(e),t),(0,n.W)({drained:null,type:"data",name:"warn",feature:"warn",data:{code:e,secondary:t}}))}},993:(e,t,r)=>{"use strict";r.d(t,{A$:()=>s,ET:()=>o,TZ:()=>a,p_:()=>i});var n=r(860);const i={ERROR:"ERROR",WARN:"WARN",INFO:"INFO",DEBUG:"DEBUG",TRACE:"TRACE"},s={OFF:0,ERROR:1,WARN:2,INFO:3,DEBUG:4,TRACE:5},o="log",a=n.K7.logging},1541:(e,t,r)=>{"use strict";r.d(t,{$5:()=>d,B5:()=>c,Ux:()=>o,YA:()=>a,fQ:()=>i});var n=r(5871);const i={MFE:"MFE",BA:"BA"};function s(e,t){if(!e||!t?.init.api.allow_registered_children)return[];const r=t.runtime.registeredEntities;return r?.filter(t=>t.metadata.timings?.asset?.endsWith(e)).map(e=>e.metadata.target)||[]}function o(e,t){if(!u(t))return{};const r=t.agentRef.runtime.appMetadata.agents[0].entityGuid;return e?e.attributes:{"entity.guid":r,appId:t.agentRef.info.applicationID}}function a(e,t){return c(e,t)?{"child.id":e.id,"child.type":e.type,...o(void 0,t)}:{}}function c(e,t){return!!e&&!!u(t)&&t.agentRef.init.api.duplicate_registered_data}function d(e){if(!e?.init.api.allow_registered_children)return[void 0];const t=[];try{var r=(0,n.AZ)((0,n.QL)());let i=r.length-1;for(;r[i];)t.push(...s(r[i--],e))}catch(e){}return t.length||t.push(void 0),t}function u(e){return 2===e?.harvestEndpointVersion}},1687:(e,t,r)=>{"use strict";r.d(t,{Ak:()=>a,Ze:()=>d,x3:()=>c});var n=r(3241),i=r(3606),s=r(860),o=r(2646);function a(e,t){if(!e)return;const r={staged:!1,priority:s.P3[t]||0};e.runtime.drainRegistry.get(t)||e.runtime.drainRegistry.set(t,r)}function c(e,t){if(!e)return;const r=e.runtime.drainRegistry;r&&(r.get(t)&&r.delete(t),l(e,t,!1),r.size&&u(e))}function d(e,t="feature",r=!1){if(e){if(!e.runtime.drainRegistry.get(t)||r)return l(e,t);e.runtime.drainRegistry.get(t).staged=!0,u(e)}}function u(e){if(!e)return;const t=Array.from(e.runtime.drainRegistry);t.every(([e,t])=>t.staged)&&(t.sort((e,t)=>e[1].priority-t[1].priority),t.forEach(([t])=>{e.runtime.drainRegistry.delete(t),l(e,t)}))}function l(e,t,r=!0){if(!e)return;const s=e.ee,a=i.i.handlers;if(s&&!s.aborted&&s.backlog&&a){if((0,n.W)({type:"lifecycle",name:"drain",feature:t}),r){const e=s.backlog[t],r=a[t];if(r){for(let t=0;e&&t<e.length;++t)f(e[t],r);Object.entries(r).forEach(([e,t])=>{Object.values(t||{}).forEach(t=>{t[0]?.on&&t[0].context()instanceof o.y&&!t[0].listeners(e).includes(t[1])&&t[0].on(e,t[1])})})}}s.isolatedBacklog||delete a[t],s.backlog[t]=null,s.emit("drain-"+t,[])}}function f(e,t){var r=e[1];Object.values(t[r]||{}).forEach(t=>{var r=e[0];if(t[0]===r){var n=t[1],i=e[3],s=e[2];n.apply(i,s)}})}},1738:(e,t,r)=>{"use strict";r.d(t,{U:()=>f,Y:()=>l});var n=r(3241),i=r(9908),s=r(1863),o=r(944),a=r(3969),c=r(8362),d=r(860),u=r(4261);function l(e,t,r,s){const l=s||r;!l||l[e]&&l[e]!==c.d.prototype[e]||(l[e]=function(){(0,i.p)(a.xV,["API/"+e+"/called"],void 0,d.K7.metrics,r.ee),(0,n.W)({drained:!!r.runtime?.activatedFeatures,type:"data",name:"api",feature:u.Pl+e,data:{}});try{return t.apply(this,arguments)}catch(e){(0,o.R)(23,e)}})}function f(e,t,r,n,o){const a=e.info;null===r?delete a.jsAttributes[t]:a.jsAttributes[t]=r,(o||null===r)&&(0,i.p)(u.Pl+n,[(0,s.t)(),t,r],void 0,"session",e.ee)}},1741:(e,t,r)=>{"use strict";r.d(t,{W:()=>s});var n=r(944),i=r(4261);class s{#e(e,...t){if(this[e]!==s.prototype[e])return this[e](...t);(0,n.R)(35,e)}addPageAction(e,t){return this.#e(i.hG,e,t)}register(e){return this.#e(i.eY,e)}recordCustomEvent(e,t){return this.#e(i.fF,e,t)}setPageViewName(e,t){return this.#e(i.Fw,e,t)}setCustomAttribute(e,t,r){return this.#e(i.cD,e,t,r)}noticeError(e,t){return this.#e(i.o5,e,t)}setUserId(e,t=!1){return this.#e(i.Dl,e,t)}setApplicationVersion(e){return this.#e(i.nb,e)}setErrorHandler(e){return this.#e(i.bt,e)}addRelease(e,t){return this.#e(i.k6,e,t)}log(e,t){return this.#e(i.$9,e,t)}start(){return this.#e(i.d3)}finished(e){return this.#e(i.BL,e)}recordReplay(){return this.#e(i.CH)}pauseReplay(){return this.#e(i.Tb)}addToTrace(e){return this.#e(i.U2,e)}setCurrentRouteName(e){return this.#e(i.PA,e)}interaction(e){return this.#e(i.dT,e)}wrapLogger(e,t,r){return this.#e(i.Wb,e,t,r)}measure(e,t){return this.#e(i.V1,e,t)}consent(e){return this.#e(i.Pv,e)}}},1863:(e,t,r)=>{"use strict";function n(){return Math.floor(performance.now())}r.d(t,{t:()=>n})},1910:(e,t,r)=>{"use strict";r.d(t,{i:()=>s});var n=r(944);const i=new Map;function s(...e){return e.every(e=>{if(i.has(e))return i.get(e);const t="function"==typeof e?e.toString():"",r=t.includes("[native code]"),s=t.includes("nrWrapper");return r||s||(0,n.R)(64,e?.name||t),i.set(e,r),r})}},2555:(e,t,r)=>{"use strict";r.d(t,{D:()=>a,f:()=>o});var n=r(384),i=r(8122);const s={beacon:n.NT.beacon,errorBeacon:n.NT.errorBeacon,licenseKey:void 0,applicationID:void 0,sa:void 0,queueTime:void 0,applicationTime:void 0,ttGuid:void 0,user:void 0,account:void 0,product:void 0,extra:void 0,jsAttributes:{},userAttributes:void 0,atts:void 0,transactionName:void 0,tNamePlain:void 0};function o(e){try{return!!e.licenseKey&&!!e.errorBeacon&&!!e.applicationID}catch(e){return!1}}const a=e=>(0,i.a)(e,s)},2614:(e,t,r)=>{"use strict";r.d(t,{BB:()=>o,H3:()=>n,g:()=>d,iL:()=>c,tS:()=>a,uh:()=>i,wk:()=>s});const n="NRBA",i="SESSION",s=144e5,o=18e5,a={STARTED:"session-started",PAUSE:"session-pause",RESET:"session-reset",RESUME:"session-resume",UPDATE:"session-update"},c={SAME_TAB:"same-tab",CROSS_TAB:"cross-tab"},d={OFF:0,FULL:1,ERROR:2}},2646:(e,t,r)=>{"use strict";r.d(t,{y:()=>n});class n{constructor(e){this.contextId=e}}},2843:(e,t,r)=>{"use strict";r.d(t,{G:()=>s,u:()=>i});var n=r(3878);function i(e,t=!1,r,i){(0,n.DD)("visibilitychange",function(){if(t)return void("hidden"===document.visibilityState&&e());e(document.visibilityState)},r,i)}function s(e,t,r){(0,n.sp)("pagehide",e,t,r)}},3241:(e,t,r)=>{"use strict";r.d(t,{W:()=>s});var n=r(6154);const i="newrelic";function s(e={}){try{n.gm.dispatchEvent(new CustomEvent(i,{detail:e}))}catch(e){}}},3304:(e,t,r)=>{"use strict";r.d(t,{A:()=>s});var n=r(7836);const i=()=>{const e=new WeakSet;return(t,r)=>{if("object"==typeof r&&null!==r){if(e.has(r))return;e.add(r)}return r}};function s(e){try{return JSON.stringify(e,i())??""}catch(e){try{n.ee.emit("internal-error",[e])}catch(e){}return""}}},3333:(e,t,r)=>{"use strict";r.d(t,{$v:()=>u,TZ:()=>n,Xh:()=>c,Zp:()=>i,kd:()=>d,mq:()=>a,nf:()=>o,qN:()=>s});const n=r(860).K7.genericEvents,i=["auxclick","click","copy","keydown","paste","scrollend"],s=["focus","blur"],o=4,a=1e3,c=2e3,d=["PageAction","UserAction","BrowserPerformance"],u={RESOURCES:"experimental.resources",REGISTER:"register"}},3434:(e,t,r)=>{"use strict";r.d(t,{Jt:()=>o,YM:()=>u});var n=r(7836),i=r(5607),s=r(1541);const o="nr@original:".concat(i.W),a=50;var c=Object.prototype.hasOwnProperty,d=!1;function u(e,t,r){return e||(e=n.ee),i.inPlace=function(e,t,r,n,s,o){r||(r="");const a="-"===r.charAt(0);for(let c=0;c<t.length;c++){const d=t[c],u=e[d];f(u)||(e[d]=i(u,a?d+r:r,n,d,s,o))}},i.flag=o,i;function i(t,n,i,d,h,p){return f(t)?t:(n||(n=""),nrWrapper[o]=t,function(e,t,r){if(Object.defineProperty&&Object.keys)try{return Object.keys(e).forEach(function(r){Object.defineProperty(t,r,{get:function(){return e[r]},set:function(t){return e[r]=t,t}})}),t}catch(e){l([e],r)}for(var n in e)c.call(e,n)&&(t[n]=e[n])}(t,nrWrapper,e),nrWrapper);function nrWrapper(){var o,c,f,g;let m,v;try{c=this,o=[...arguments],v=p?(0,s.$5)(r):[void 0],f="function"==typeof i?i(o,c):i||{}}catch(t){l([t,"",[o,c,d],f],e)}u(n+"start",[o,c,d,v],f,h);const y=performance.now();let b;try{return g=t.apply(c,o),b=performance.now(),g}catch(e){throw b=performance.now(),u(n+"err",[o,c,e,v],f,h),m=e,m}finally{const e=b-y,t={start:y,end:b,duration:e,isLongTask:e>=a,methodName:d,thrownError:m};t.isLongTask&&u("long-task",[t,c,v],f,h),u(n+"end",[o,c,g,v],f,h)}}}function u(r,n,i,s){if(!d||t){var o=d;d=!0;try{e.emit(r,n,i,t,s)}catch(t){l([t,r,n,i],e)}d=o}}}function l(e,t){t||(t=n.ee);try{t.emit("internal-error",e)}catch(e){}}function f(e){return!(e&&"function"==typeof e&&e.apply&&!e[o])}},3606:(e,t,r)=>{"use strict";r.d(t,{i:()=>s});var n=r(9908);s.on=o;var i=s.handlers={};function s(e,t,r,s){o(s||n.d,i,e,t,r)}function o(e,t,r,i,s){s||(s="feature"),e||(e=n.d);var o=t[s]=t[s]||{};(o[r]=o[r]||[]).push([e,i])}},3738:(e,t,r)=>{"use strict";r.d(t,{He:()=>i,Kp:()=>a,Lc:()=>d,Rz:()=>u,TZ:()=>n,bD:()=>s,d3:()=>o,jx:()=>l,sl:()=>f,uP:()=>c});const n=r(860).K7.sessionTrace,i="bstResource",s="resource",o="-start",a="-end",c="fn"+o,d="fn"+a,u="pushState",l=1e3,f=3e4},3785:(e,t,r)=>{"use strict";r.d(t,{R:()=>c,b:()=>d});var n=r(9908),i=r(1863),s=r(860),o=r(3969),a=r(993);function c(e,t,r={},c=a.p_.INFO,d=!0,u,l=(0,i.t)()){(0,n.p)(o.xV,["API/logging/".concat(c.toLowerCase(),"/called")],void 0,s.K7.metrics,e),(0,n.p)(a.ET,[l,t,r,c,d,u],void 0,s.K7.logging,e)}function d(e){return"string"==typeof e&&Object.values(a.p_).some(t=>t===e.toUpperCase().trim())}},3878:(e,t,r)=>{"use strict";function n(e,t){return{capture:e,passive:!1,signal:t}}function i(e,t,r=!1,i){window.addEventListener(e,t,n(r,i))}function s(e,t,r=!1,i){document.addEventListener(e,t,n(r,i))}r.d(t,{DD:()=>s,jT:()=>n,sp:()=>i})},3962:(e,t,r)=>{"use strict";r.d(t,{AM:()=>o,O2:()=>l,OV:()=>s,Qu:()=>f,TZ:()=>c,ih:()=>h,pP:()=>a,t1:()=>u,tC:()=>i,wD:()=>d});var n=r(860);const i=["click","keydown","submit"],s="popstate",o="api",a="initialPageLoad",c=n.K7.softNav,d=5e3,u=500,l={INITIAL_PAGE_LOAD:"",ROUTE_CHANGE:1,UNSPECIFIED:2},f={INTERACTION:1,AJAX:2,CUSTOM_END:3,CUSTOM_TRACER:4},h={IP:"in progress",PF:"pending finish",FIN:"finished",CAN:"cancelled"}},3969:(e,t,r)=>{"use strict";r.d(t,{TZ:()=>n,XG:()=>a,rs:()=>i,xV:()=>o,z_:()=>s});const n=r(860).K7.metrics,i="sm",s="cm",o="storeSupportabilityMetrics",a="storeEventMetrics"},4234:(e,t,r)=>{"use strict";r.d(t,{W:()=>i});var n=r(1687);class i{constructor(e,t){this.agentRef=e,this.ee=e?.ee,this.featureName=t,this.blocked=!1}deregisterDrain(){(0,n.x3)(this.agentRef,this.featureName)}}},4261:(e,t,r)=>{"use strict";r.d(t,{$9:()=>u,BL:()=>c,CH:()=>p,Dl:()=>R,Fw:()=>w,PA:()=>v,Pl:()=>n,Pv:()=>x,Tb:()=>f,U2:()=>o,V1:()=>A,Wb:()=>T,bt:()=>b,cD:()=>y,d3:()=>E,dT:()=>d,eY:()=>g,fF:()=>h,hG:()=>s,hw:()=>i,k6:()=>a,nb:()=>m,o5:()=>l});const n="api-",i=n+"ixn-",s="addPageAction",o="addToTrace",a="addRelease",c="finished",d="interaction",u="log",l="noticeError",f="pauseReplay",h="recordCustomEvent",p="recordReplay",g="register",m="setApplicationVersion",v="setCurrentRouteName",y="setCustomAttribute",b="setErrorHandler",w="setPageViewName",R="setUserId",E="start",T="wrapLogger",A="measure",x="consent"},5205:(e,t,r)=>{"use strict";r.d(t,{j:()=>x});var n=r(384),i=r(1741);var s=r(2555),o=r(3333);const a=e=>{if(!e||"string"!=typeof e)return!1;try{document.createDocumentFragment().querySelector(e)}catch{return!1}return!0};var c=r(2614),d=r(944),u=r(8122);const l="[data-nr-mask]",f=e=>(0,u.a)(e,(()=>{const e={feature_flags:[],experimental:{allow_registered_children:!1,resources:!1},mask_selector:"*",block_selector:"[data-nr-block]",mask_input_options:{color:!1,date:!1,"datetime-local":!1,email:!1,month:!1,number:!1,range:!1,search:!1,tel:!1,text:!1,time:!1,url:!1,week:!1,textarea:!1,select:!1,password:!0}};return{ajax:{deny_list:void 0,block_internal:!0,enabled:!0,autoStart:!0},api:{get allow_registered_children(){return e.feature_flags.includes(o.$v.REGISTER)||e.experimental.allow_registered_children},set allow_registered_children(t){e.experimental.allow_registered_children=t},duplicate_registered_data:!1},browser_consent_mode:{enabled:!1},distributed_tracing:{enabled:void 0,exclude_newrelic_header:void 0,cors_use_newrelic_header:void 0,cors_use_tracecontext_headers:void 0,allowed_origins:void 0},get feature_flags(){return e.feature_flags},set feature_flags(t){e.feature_flags=t},generic_events:{enabled:!0,autoStart:!0},harvest:{interval:30},jserrors:{enabled:!0,autoStart:!0},logging:{enabled:!0,autoStart:!0},metrics:{enabled:!0,autoStart:!0},obfuscate:void 0,page_action:{enabled:!0},page_view_event:{enabled:!0,autoStart:!0},page_view_timing:{enabled:!0,autoStart:!0},performance:{capture_marks:!1,capture_measures:!1,capture_detail:!0,resources:{get enabled(){return e.feature_flags.includes(o.$v.RESOURCES)||e.experimental.resources},set enabled(t){e.experimental.resources=t},asset_types:[],first_party_domains:[],ignore_newrelic:!0}},privacy:{cookies_enabled:!0},proxy:{assets:void 0,beacon:void 0},session:{expiresMs:c.wk,inactiveMs:c.BB},session_replay:{autoStart:!0,enabled:!1,preload:!1,sampling_rate:10,error_sampling_rate:100,collect_fonts:!1,inline_images:!1,fix_stylesheets:!0,mask_all_inputs:!0,get mask_text_selector(){return e.mask_selector},set mask_text_selector(t){a(t)?e.mask_selector="".concat(t,",").concat(l):""===t||null===t?e.mask_selector=l:(0,d.R)(5,t)},get block_class(){return"nr-block"},get ignore_class(){return"nr-ignore"},get mask_text_class(){return"nr-mask"},get block_selector(){return e.block_selector},set block_selector(t){a(t)?e.block_selector+=",".concat(t):""!==t&&(0,d.R)(6,t)},get mask_input_options(){return e.mask_input_options},set mask_input_options(t){t&&"object"==typeof t?e.mask_input_options={...t,password:!0}:(0,d.R)(7,t)}},session_trace:{enabled:!0,autoStart:!0},soft_navigations:{enabled:!0,autoStart:!0},ssl:void 0,user_actions:{enabled:!0,elementAttributes:["id","className","tagName","type"]}}})());var h=r(6154),p=r(9324);let g=0;const m={buildEnv:p.F3,distMethod:p.Xs,version:p.xv,originTime:h.WN},v={consented:!1},y={activatedFeatures:void 0,appMetadata:{},configured:!1,get consented(){return this.session?.state?.consent||v.consented},set consented(e){v.consented=e},customTransaction:void 0,denyList:[],disabled:!1,drainRegistry:new Map,harvester:void 0,isolatedBacklog:!1,isRecording:!1,loaderType:void 0,maxBytes:3e4,obfuscator:void 0,onerror:void 0,ptid:void 0,releaseIds:{},session:void 0,timeKeeper:void 0,registeredEntities:[],jsAttributesMetadata:{bytes:0},get harvestCount(){return++g}},b=e=>{const t=(0,u.a)(e,y),r=Object.keys(m).reduce((e,t)=>(e[t]={value:m[t],writable:!1,configurable:!0,enumerable:!0},e),{});return Object.defineProperties(t,r)},w=e=>{const t=e.startsWith("http");e+="/",r.p=t?e:"https://"+e};var R=r(7836),E=r(3241);const T={accountID:void 0,trustKey:void 0,agentID:void 0,licenseKey:void 0,applicationID:void 0,xpid:void 0},A=e=>(0,u.a)(e,T);function x(e,t={},r,o){let{init:a,info:c,loader_config:d,runtime:u={},exposed:l=!0}=t;if(!c){const e=(0,n.pV)();a=e.init,c=e.info,d=e.loader_config}e.init=f(a||{}),e.loader_config=A(d||{}),c.jsAttributes??={},h.bv&&(c.jsAttributes.isWorker=!0),e.info=(0,s.D)(c);const p=e.init;e.runtime??=b(u),p.proxy.assets&&w(p.proxy.assets),e.runtime.configured||(Object.defineProperty(e,"beacons",{get:()=>[e.info.beacon,e.info.errorBeacon,e.init.proxy.assets,e.init.proxy.beacon].filter(Boolean)}),Object.defineProperty(e.runtime,"denyList",{get:()=>[...e.init.ajax.deny_list||[],...e.init.ajax.block_internal?e.beacons:[]]}),e.runtime.ptid=e.agentIdentifier,function(e){const t=(0,n.pV)();Object.getOwnPropertyNames(i.W.prototype).forEach(r=>{const n=i.W.prototype[r];if("function"!=typeof n||"constructor"===n)return;let s=t[r];e[r]&&!1!==e.exposed&&"micro-agent"!==e.runtime?.loaderType&&(t[r]=(...t)=>{const n=e[r](...t);return s?s(...t):n})})}(e),e.runtime.loaderType=r,e.ee=R.ee.get(e.agentIdentifier),e.exposed=l,(0,E.W)({drained:!!e.runtime.activatedFeatures,type:"lifecycle",name:"initialize",feature:void 0,data:e.config}),e.runtime.configured=!0)}},5270:(e,t,r)=>{"use strict";r.d(t,{Aw:()=>o,SR:()=>s,rF:()=>a});var n=r(384),i=r(7767);function s(e){return!!(0,n.dV)().o.MO&&(0,i.V)(e)&&!0===e?.session_trace.enabled}function o(e){return!0===e?.session_replay.preload&&s(e)}function a(e,t){try{if("string"==typeof t?.type){if("password"===t.type.toLowerCase())return"*".repeat(e?.length||0);if(void 0!==t?.dataset?.nrUnmask||t?.classList?.contains("nr-unmask"))return e}}catch(e){}return"string"==typeof e?e.replace(/[\S]/g,"*"):"*".repeat(e?.length||0)}},5289:(e,t,r)=>{"use strict";r.d(t,{GG:()=>o,Qr:()=>c,sB:()=>a});var n=r(3878),i=r(6389);function s(){return"undefined"==typeof document||"complete"===document.readyState}function o(e,t){if(s())return e();const r=(0,i.J)(e),o=setInterval(()=>{s()&&(clearInterval(o),r())},500);(0,n.sp)("load",r,t)}function a(e){if(s())return e();(0,n.DD)("DOMContentLoaded",e)}function c(e){if(s())return e();(0,n.sp)("popstate",e)}},5607:(e,t,r)=>{"use strict";r.d(t,{W:()=>n});const n=(0,r(9566).bz)()},5871:(e,t,r)=>{"use strict";r.d(t,{AZ:()=>u,QL:()=>l,Qr:()=>f});var n=r(6154),i=r(1863),s=r(9119),o=r(7866);let a;try{a=u(l())[0]}catch(e){a=u(e)[0]}const c=new Set;let d=[];if(n.gm.PerformanceObserver?.supportedEntryTypes.includes("resource")){new PerformanceObserver(e=>{e.getEntries().forEach(e=>{if((e=>"script"===e.initiatorType||["link","fetch"].includes(e.initiatorType)&&e.name.endsWith(".js"))(e)){c.size>250&&c.delete(c.values().next().value),c.add(e);const t=[];d.forEach(({test:r,addedAt:n},s)=>{(r(e)||(0,i.t)()-n>1e4)&&t.push(s)}),d=d.filter((e,r)=>!t.includes(r))}})}).observe({type:"resource",buffered:!0})}function u(e){if(!e||"string"!=typeof e)return[];const t=new Set,r=e.split("\n");for(const e of r){const r=e.match(o.cn)||e.match(o.hB)||e.match(o.fL);if(r&&r[2])t.add((0,s.L)(r[2]));else{const r=e.match(/\(([^)]+\.js):\d+:\d+\)/)||e.match(/^\s+at\s+([^\s(]+\.js):\d+:\d+/);r&&r[1]&&t.add((0,s.L)(r[1]))}}return[...t]}function l(){let e;try{const t=Error.stackTraceLimit;Error.stackTraceLimit=50,e=(new Error).stack,Error.stackTraceLimit=t}catch(t){e=(new Error).stack}return e}function f(){const e={registeredAt:(0,i.t)(),reportedAt:void 0,fetchStart:0,fetchEnd:0,asset:void 0,type:"unknown"},t=l();if(!t)return e;const r=n.gm.performance?.getEntriesByType("navigation")?.[0]?.name||"";try{const o=u(t),f=(o.length>1?o.filter(e=>!a.endsWith(e)&&!e.endsWith(a)):o)[0];if(!f)return e;if(r.includes(f))return e.asset=(0,s.L)(r),e.type="inline",e;const h=performance.getEntriesByType("resource").find(p)||[...c].find(p);function p(e){const t=(0,s.L)(e.name);return t.endsWith(f)||f.endsWith(t)}function g(t){e.fetchStart=Math.floor(t.startTime),e.fetchEnd=Math.floor(t.responseEnd),e.asset=t.name,e.type=t.initiatorType}h?g(h):function(e){if(!e||!n.gm.document)return!1;try{const t=n.gm.document.querySelectorAll('link[rel="preload"][as="script"]');for(const r of t)if((0,s.L)(r.href)===e)return!0}catch(e){}return!1}(f)&&(e.asset=f,e.type="preload",d.push({addedAt:(0,i.t)(),test:e=>!!p(e)&&(g(e),!0)}))}catch(m){}return e}},6154:(e,t,r)=>{"use strict";r.d(t,{OF:()=>d,RI:()=>i,WN:()=>f,bv:()=>s,gm:()=>o,lR:()=>l,m:()=>c,mw:()=>a,sb:()=>u,zk:()=>h});var n=r(1863);const i="undefined"!=typeof window&&!!window.document,s="undefined"!=typeof WorkerGlobalScope&&("undefined"!=typeof self&&self instanceof WorkerGlobalScope&&self.navigator instanceof WorkerNavigator||"undefined"!=typeof globalThis&&globalThis instanceof WorkerGlobalScope&&globalThis.navigator instanceof WorkerNavigator),o=i?window:"undefined"!=typeof WorkerGlobalScope&&("undefined"!=typeof self&&self instanceof WorkerGlobalScope&&self||"undefined"!=typeof globalThis&&globalThis instanceof WorkerGlobalScope&&globalThis),a=Boolean("hidden"===o?.document?.visibilityState),c=""+o?.location,d=/iPad|iPhone|iPod/.test(o.navigator?.userAgent),u=d&&"undefined"==typeof SharedWorker,l=(()=>{const e=o.navigator?.userAgent?.match(/Firefox[/\s](\d+\.\d+)/);return Array.isArray(e)&&e.length>=2?+e[1]:0})(),f=Date.now()-(0,n.t)(),h=()=>{const e=o?.performance?.getEntriesByType?.("navigation")?.[0];if(e&&e.responseStart>0&&e.responseStart<o.performance.now())return e}},6344:(e,t,r)=>{"use strict";r.d(t,{BB:()=>u,Qb:()=>l,TZ:()=>i,Ug:()=>o,Vh:()=>s,_s:()=>a,bc:()=>d,yP:()=>c});var n=r(2614);const i=r(860).K7.sessionReplay,s="errorDuringReplay",o=.12,a={DomContentLoaded:0,Load:1,FullSnapshot:2,IncrementalSnapshot:3,Meta:4,Custom:5},c={[n.g.ERROR]:15e3,[n.g.FULL]:3e5,[n.g.OFF]:0},d={RESET:{message:"Session was reset",sm:"Reset"},IMPORT:{message:"Recorder failed to import",sm:"Import"},TOO_MANY:{message:"429: Too Many Requests",sm:"Too-Many"},TOO_BIG:{message:"Payload was too large",sm:"Too-Big"},CROSS_TAB:{message:"Session Entity was set to OFF on another tab",sm:"Cross-Tab"},ENTITLEMENTS:{message:"Session Replay is not allowed and will not be started",sm:"Entitlement"}},u=5e3,l={API:"api",RESUME:"resume",SWITCH_TO_FULL:"switchToFull",INITIALIZE:"initialize",PRELOAD:"preload"}},6389:(e,t,r)=>{"use strict";function n(e,t=500,r={}){const n=r?.leading||!1;let i;return(...r)=>{n&&void 0===i&&(e.apply(this,r),i=setTimeout(()=>{i=clearTimeout(i)},t)),n||(clearTimeout(i),i=setTimeout(()=>{e.apply(this,r)},t))}}function i(e){let t=!1;return(...r)=>{t||(t=!0,e.apply(this,r))}}r.d(t,{J:()=>i,s:()=>n})},6630:(e,t,r)=>{"use strict";r.d(t,{T:()=>n});const n=r(860).K7.pageViewEvent},6774:(e,t,r)=>{"use strict";r.d(t,{T:()=>n});const n=r(860).K7.jserrors},7295:(e,t,r)=>{"use strict";r.d(t,{Xv:()=>o,gX:()=>i,iW:()=>s});var n=[];function i(e){if(!e||s(e))return!1;if(0===n.length)return!0;if("*"===n[0].hostname)return!1;for(var t=0;t<n.length;t++){var r=n[t];if(r.hostname.test(e.hostname)&&r.pathname.test(e.pathname))return!1}return!0}function s(e){return void 0===e.hostname}function o(e){if(n=[],e&&e.length)for(var t=0;t<e.length;t++){let r=e[t];if(!r)continue;if("*"===r)return void(n=[{hostname:"*"}]);0===r.indexOf("http://")?r=r.substring(7):0===r.indexOf("https://")&&(r=r.substring(8));const i=r.indexOf("/");let s,o;i>0?(s=r.substring(0,i),o=r.substring(i)):(s=r,o="*");let[c]=s.split(":");n.push({hostname:a(c),pathname:a(o,!0)})}}function a(e,t=!1){const r=e.replace(/[.+?^${}()|[\]\\]/g,e=>"\\"+e).replace(/\*/g,".*?");return new RegExp((t?"^":"")+r+"$")}},7485:(e,t,r)=>{"use strict";r.d(t,{D:()=>i});var n=r(6154);function i(e){if(0===(e||"").indexOf("data:"))return{protocol:"data"};try{const t=new URL(e,location.href),r={port:t.port,hostname:t.hostname,pathname:t.pathname,search:t.search,protocol:t.protocol.slice(0,t.protocol.indexOf(":")),sameOrigin:t.protocol===n.gm?.location?.protocol&&t.host===n.gm?.location?.host};return r.port&&""!==r.port||("http:"===t.protocol&&(r.port="80"),"https:"===t.protocol&&(r.port="443")),r.pathname&&""!==r.pathname?r.pathname.startsWith("/")||(r.pathname="/".concat(r.pathname)):r.pathname="/",r}catch(e){return{}}}},7699:(e,t,r)=>{"use strict";r.d(t,{It:()=>s,KC:()=>a,No:()=>i,qh:()=>o});var n=r(860);const i=16e3,s=1e6,o="SESSION_ERROR",a={[n.K7.logging]:!0,[n.K7.genericEvents]:!0,[n.K7.jserrors]:!0,[n.K7.ajax]:!0}},7767:(e,t,r)=>{"use strict";r.d(t,{V:()=>i});var n=r(6154);const i=e=>n.RI&&!0===e?.privacy.cookies_enabled},7836:(e,t,r)=>{"use strict";r.d(t,{P:()=>a,ee:()=>c});var n=r(384),i=r(8990),s=r(2646),o=r(5607);const a="nr@context:".concat(o.W),c=function e(t,r){var n={},o={},u={},l=!1;try{l=16===r.length&&d.initializedAgents?.[r]?.runtime.isolatedBacklog}catch(e){}var f={on:p,addEventListener:p,removeEventListener:function(e,t){var r=n[e];if(!r)return;for(var i=0;i<r.length;i++)r[i]===t&&r.splice(i,1)},emit:function(e,r,n,i,s){!1!==s&&(s=!0);if(c.aborted&&!i)return;t&&s&&t.emit(e,r,n);var a=h(n);g(e).forEach(e=>{e.apply(a,r)});var d=v()[o[e]];d&&d.push([f,e,r,a]);return a},get:m,listeners:g,context:h,buffer:function(e,t){const r=v();if(t=t||"feature",f.aborted)return;Object.entries(e||{}).forEach(([e,n])=>{o[n]=t,t in r||(r[t]=[])})},abort:function(){f._aborted=!0,Object.keys(f.backlog).forEach(e=>{delete f.backlog[e]})},isBuffering:function(e){return!!v()[o[e]]},debugId:r,backlog:l?{}:t&&"object"==typeof t.backlog?t.backlog:{},isolatedBacklog:l};return Object.defineProperty(f,"aborted",{get:()=>{let e=f._aborted||!1;return e||(t&&(e=t.aborted),e)}}),f;function h(e){return e&&e instanceof s.y?e:e?(0,i.I)(e,a,()=>new s.y(a)):new s.y(a)}function p(e,t){n[e]=g(e).concat(t)}function g(e){return n[e]||[]}function m(t){return u[t]=u[t]||e(f,t)}function v(){return f.backlog}}(void 0,"globalEE"),d=(0,n.Zm)();d.ee||(d.ee=c)},7866:(e,t,r)=>{"use strict";r.d(t,{Nc:()=>s,cn:()=>a,fL:()=>i,h3:()=>n,hB:()=>o});const n=/function (.+?)\s*\(/,i=/^\s*at .+ \(eval at \S+ \((?:(?:file|http|https):[^)]+)?\)(?:, [^:]*:\d+:\d+)?\)$/i,s=/^\s*at Function code \(Function code:\d+:\d+\)\s*/i,o=/^\s*at (?:((?:\[object object\])?(?:[^(]*\([^)]*\))*[^()]*(?: \[as \S+\])?) )?\(?((?:file|http|https|chrome-extension):.*?)?:(\d+)(?::(\d+))?\)?\s*$/i,a=/^\s*(?:([^@]*)(?:\(.*?\))?@)?((?:file|http|https|chrome|safari-extension).*?):(\d+)(?::(\d+))?\s*$/i},8122:(e,t,r)=>{"use strict";r.d(t,{a:()=>i});var n=r(944);function i(e,t){try{if(!e||"object"!=typeof e)return(0,n.R)(3);if(!t||"object"!=typeof t)return(0,n.R)(4);const r=Object.create(Object.getPrototypeOf(t),Object.getOwnPropertyDescriptors(t)),s=0===Object.keys(r).length?e:r;for(let o in s)if(void 0!==e[o])try{if(null===e[o]){r[o]=null;continue}Array.isArray(e[o])&&Array.isArray(t[o])?r[o]=Array.from(new Set([...e[o],...t[o]])):e[o]instanceof Map||e[o]instanceof Set||e[o]instanceof Date||e[o]instanceof RegExp?r[o]=e[o]:"object"==typeof e[o]&&"object"==typeof t[o]?r[o]=i(e[o],t[o]):r[o]=e[o]}catch(e){r[o]||(0,n.R)(1,e)}return r}catch(e){(0,n.R)(2,e)}}},8139:(e,t,r)=>{"use strict";r.d(t,{u:()=>f});var n=r(7836),i=r(3434),s=r(8990),o=r(6154);const a={},c=o.gm.XMLHttpRequest,d="addEventListener",u="removeEventListener",l="nr@wrapped:".concat(n.P);function f(e){var t=function(e){return(e||n.ee).get("events")}(e);if(a[t.debugId]++)return t;a[t.debugId]=1;var r=(0,i.YM)(t,!0);function f(e){r.inPlace(e,[d,u],"-",p)}function p(e,t){return e[1]}return"getPrototypeOf"in Object&&(o.RI&&h(document,f),c&&h(c.prototype,f),h(o.gm,f)),t.on(d+"-start",function(e,t){var n=e[1];if(null!==n&&("function"==typeof n||"object"==typeof n)&&"newrelic"!==e[0]){var i=(0,s.I)(n,l,function(){var e={object:function(){if("function"!=typeof n.handleEvent)return;return n.handleEvent.apply(n,arguments)},function:n}[typeof n];return e?r(e,"fn-",null,e.name||"anonymous"):n});this.wrapped=e[1]=i}}),t.on(u+"-start",function(e){e[1]=this.wrapped||e[1]}),t}function h(e,t,...r){let n=e;for(;"object"==typeof n&&!Object.prototype.hasOwnProperty.call(n,d);)n=Object.getPrototypeOf(n);n&&t(n,...r)}},8362:(e,t,r)=>{"use strict";r.d(t,{d:()=>s});var n=r(9566),i=r(1741);class s extends i.W{agentIdentifier=(0,n.LA)(16)}},8374:(e,t,r)=>{r.nc=(()=>{try{return document?.currentScript?.nonce}catch(e){}return""})()},8990:(e,t,r)=>{"use strict";r.d(t,{I:()=>i});var n=Object.prototype.hasOwnProperty;function i(e,t,r){if(n.call(e,t))return e[t];var i=r();if(Object.defineProperty&&Object.keys)try{return Object.defineProperty(e,t,{value:i,writable:!0,enumerable:!1}),i}catch(e){}return e[t]=i,i}},9119:(e,t,r)=>{"use strict";r.d(t,{L:()=>s});var n=/([^?#]*)[^#]*(#[^?]*|$).*/,i=/([^?#]*)().*/;function s(e,t){return e?e.replace(t?n:i,"$1$2"):e}},9300:(e,t,r)=>{"use strict";r.d(t,{T:()=>n});const n=r(860).K7.ajax},9324:(e,t,r)=>{"use strict";r.d(t,{AJ:()=>o,F3:()=>i,Xs:()=>s,Yq:()=>a,xv:()=>n});const n="1.312.1",i="PROD",s="CDN",o="@newrelic/rrweb",a="1.1.0"},9566:(e,t,r)=>{"use strict";r.d(t,{LA:()=>a,ZF:()=>c,bz:()=>o,el:()=>d});var n=r(6154);const i="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";function s(e,t){return e?15&e[t]:16*Math.random()|0}function o(){const e=n.gm?.crypto||n.gm?.msCrypto;let t,r=0;return e&&e.getRandomValues&&(t=e.getRandomValues(new Uint8Array(30))),i.split("").map(e=>"x"===e?s(t,r++).toString(16):"y"===e?(3&s()|8).toString(16):e).join("")}function a(e){const t=n.gm?.crypto||n.gm?.msCrypto;let r,i=0;t&&t.getRandomValues&&(r=t.getRandomValues(new Uint8Array(e)));const o=[];for(var a=0;a<e;a++)o.push(s(r,i++).toString(16));return o.join("")}function c(){return a(16)}function d(){return a(32)}},9908:(e,t,r)=>{"use strict";r.d(t,{d:()=>n,p:()=>i});var n=r(7836).ee.get("handle");function i(e,t,r,i,s){s?(s.buffer([e],i),s.emit(e,t,r)):(n.buffer([e],i),n.emit(e,t,r))}}},n={};function i(e){var t=n[e];if(void 0!==t)return t.exports;var s=n[e]={exports:{}};return r[e](s,s.exports,i),s.exports}i.m=r,i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.f={},i.e=e=>Promise.all(Object.keys(i.f).reduce((t,r)=>(i.f[r](e,t),t),[])),i.u=e=>({212:"nr-spa-compressor",249:"nr-spa-recorder",478:"nr-spa"}[e]+"-1.312.1.min.js"),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="NRBA-1.312.1.PROD:",i.l=(r,n,s,o)=>{if(e[r])e[r].push(n);else{var a,c;if(void 0!==s)for(var d=document.getElementsByTagName("script"),u=0;u<d.length;u++){var l=d[u];if(l.getAttribute("src")==r||l.getAttribute("data-webpack")==t+s){a=l;break}}if(!a){c=!0;var f={478:"sha512-dZhtzLTOyIsYHGHWAipD4+6jjzEIycTqL1F9NwinUiYL8cf0kIXf7WUbskVMB7p/nhDF+zJ9Bfd6LU9PMn0Yhw==",249:"sha512-SJV3E/3SdEyaahYm8FHEFwhJvDQy/nRJJV/o+18MgXENJWR/8tfvIKfc4LE1xV9RniczXT7eQLcZi2G99UlugA==",212:"sha512-dRFaJY5mEo/nxzPqxS/sHnvU66fpkTff91nWUFOafyPR61R+r2GZiy81lT47BWA4MouemCj4tvhHmn8Ofh/UOg=="};(a=document.createElement("script")).charset="utf-8",i.nc&&a.setAttribute("nonce",i.nc),a.setAttribute("data-webpack",t+s),a.src=r,0!==a.src.indexOf(window.location.origin+"/")&&(a.crossOrigin="anonymous"),f[o]&&(a.integrity=f[o])}e[r]=[n];var h=(t,n)=>{a.onerror=a.onload=null,clearTimeout(p);var i=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach(e=>e(n)),t)return t(n)},p=setTimeout(h.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=h.bind(null,a.onerror),a.onload=h.bind(null,a.onload),c&&document.head.appendChild(a)}},i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="https://js-agent.newrelic.com/",(()=>{var e={38:0,788:0};i.f.j=(t,r)=>{var n=i.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var s=new Promise((r,i)=>n=e[t]=[r,i]);r.push(n[2]=s);var o=i.p+i.u(t),a=new Error;i.l(o,r=>{if(i.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var s=r&&("load"===r.type?"missing":r.type),o=r&&r.target&&r.target.src;a.message="Loading chunk "+t+" failed: ("+s+": "+o+")",a.name="ChunkLoadError",a.type=s,a.request=o,n[1](a)}},"chunk-"+t,t)}};var t=(t,r)=>{var n,s,[o,a,c]=r,d=0;if(o.some(t=>0!==e[t])){for(n in a)i.o(a,n)&&(i.m[n]=a[n]);if(c)c(i)}for(t&&t(r);d<o.length;d++)s=o[d],i.o(e,s)&&e[s]&&e[s][0](),e[s]=0},r=self["webpackChunk:NRBA-1.312.1.PROD"]=self["webpackChunk:NRBA-1.312.1.PROD"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),(()=>{"use strict";i(8374);var e=i(8362),t=i(860);const r=Object.values(t.K7);var n=i(5205);var s=i(9908),o=i(1863),a=i(4261),c=i(1738);var d=i(1687),u=i(4234),l=i(5289),f=i(6154),h=i(944),p=i(5270),g=i(7767),m=i(6389),v=i(7699);class y extends u.W{constructor(e,t){super(e,t),this.abortHandler=void 0,this.featAggregate=void 0,this.loadedSuccessfully=void 0,this.onAggregateImported=new Promise(e=>{this.loadedSuccessfully=e}),this.deferred=Promise.resolve(),!1===e.init[this.featureName].autoStart?this.deferred=new Promise((t,r)=>{this.ee.on("manual-start-all",(0,m.J)(()=>{(0,d.Ak)(e,this.featureName),t()}))}):(0,d.Ak)(e,t)}importAggregator(e,t,r={}){if(this.featAggregate)return;const n=async()=>{let n;await this.deferred;try{if((0,g.V)(e.init)){const{setupAgentSession:t}=await i.e(478).then(i.bind(i,8766));n=t(e)}}catch(e){(0,h.R)(20,e),this.ee.emit("internal-error",[e]),(0,s.p)(v.qh,[e],void 0,this.featureName,this.ee)}try{if(!this.#t(this.featureName,n,e.init))return(0,d.Ze)(this.agentRef,this.featureName),void this.loadedSuccessfully(!1);const{Aggregate:i}=await t();this.featAggregate=new i(e,r),e.runtime.harvester.initializedAggregates.push(this.featAggregate),this.loadedSuccessfully(!0)}catch(e){(0,h.R)(34,e),this.abortHandler?.(),(0,d.Ze)(this.agentRef,this.featureName,!0),this.loadedSuccessfully(!1),this.ee&&this.ee.abort()}};f.RI?(0,l.GG)(()=>n(),!0):n()}#t(e,r,n){if(this.blocked)return!1;switch(e){case t.K7.sessionReplay:return(0,p.SR)(n)&&!!r;case t.K7.sessionTrace:return!!r;default:return!0}}}var b=i(6630),w=i(2614),R=i(3241);class E extends y{static featureName=b.T;constructor(e){var t;super(e,b.T),this.setupInspectionEvents(),t=e,(0,c.Y)(a.Fw,function(e,r){"string"==typeof e&&("/"!==e.charAt(0)&&(e="/"+e),t.runtime.customTransaction=(r||"http://custom.transaction")+e,(0,s.p)(a.Pl+a.Fw,[(0,o.t)()],void 0,void 0,t.ee))},t),this.importAggregator(e,()=>i.e(478).then(i.bind(i,5839)))}setupInspectionEvents(){const e=(e,t)=>{e&&(0,R.W)({timeStamp:e.timeStamp,loaded:"complete"===e.target.readyState,type:"window",name:t,data:e.target.location+""})};(0,l.sB)(t=>{e(t,"DOMContentLoaded")}),(0,l.GG)(t=>{e(t,"load")}),(0,l.Qr)(t=>{e(t,"navigate")}),this.ee.on(w.tS.UPDATE,(e,t)=>{(0,R.W)({type:"lifecycle",name:"session",data:t})})}}var T=i(384);class A extends e.d{constructor(e){var t;(super(),f.gm)?(this.features={},(0,T.bQ)(this.agentIdentifier,this),this.desiredFeatures=new Set(e.features||[]),this.desiredFeatures.add(E),(0,n.j)(this,e,e.loaderType||"agent"),t=this,(0,c.Y)(a.cD,function(e,r,n=!1){if("string"==typeof e){if(["string","number","boolean"].includes(typeof r)||null===r)return(0,c.U)(t,e,r,a.cD,n);(0,h.R)(40,typeof r)}else(0,h.R)(39,typeof e)},t),function(e){(0,c.Y)(a.Dl,function(t,r=!1){if("string"!=typeof t&&null!==t)return void(0,h.R)(41,typeof t);const n=e.info.jsAttributes["enduser.id"];r&&null!=n&&n!==t?(0,s.p)(a.Pl+"setUserIdAndResetSession",[t],void 0,"session",e.ee):(0,c.U)(e,"enduser.id",t,a.Dl,!0)},e)}(this),function(e){(0,c.Y)(a.nb,function(t){if("string"==typeof t||null===t)return(0,c.U)(e,"application.version",t,a.nb,!1);(0,h.R)(42,typeof t)},e)}(this),function(e){(0,c.Y)(a.d3,function(){e.ee.emit("manual-start-all")},e)}(this),function(e){(0,c.Y)(a.Pv,function(t=!0){if("boolean"==typeof t){if((0,s.p)(a.Pl+a.Pv,[t],void 0,"session",e.ee),e.runtime.consented=t,t){const t=e.features.page_view_event;t.onAggregateImported.then(e=>{const r=t.featAggregate;e&&!r.sentRum&&r.sendRum()})}}else(0,h.R)(65,typeof t)},e)}(this),this.run()):(0,h.R)(21)}get config(){return{info:this.info,init:this.init,loader_config:this.loader_config,runtime:this.runtime}}get api(){return this}run(){try{const e=function(e){const t={};return r.forEach(r=>{t[r]=!!e[r]?.enabled}),t}(this.init),n=[...this.desiredFeatures];n.sort((e,r)=>t.P3[e.featureName]-t.P3[r.featureName]),n.forEach(r=>{if(!e[r.featureName]&&r.featureName!==t.K7.pageViewEvent)return;const n=function(e){switch(e){case t.K7.ajax:return[t.K7.jserrors];case t.K7.sessionTrace:return[t.K7.ajax,t.K7.pageViewEvent];case t.K7.sessionReplay:return[t.K7.sessionTrace];case t.K7.pageViewTiming:return[t.K7.pageViewEvent];default:return[]}}(r.featureName).filter(e=>!(e in this.features));n.length>0&&(0,h.R)(36,{targetFeature:r.featureName,missingDependencies:n}),this.features[r.featureName]=new r(this)})}catch(e){(0,h.R)(22,e);for(const e in this.features)this.features[e].abortHandler?.();const t=(0,T.Zm)();delete t.initializedAgents[this.agentIdentifier]?.features,delete this.sharedAggregator;return t.ee.get(this.agentIdentifier).abort(),!1}}}var x=i(2843),S=i(782);class _ extends y{static featureName=S.T;constructor(e){super(e,S.T),f.RI&&((0,x.u)(()=>(0,s.p)("docHidden",[(0,o.t)()],void 0,S.T,this.ee),!0),(0,x.G)(()=>(0,s.p)("winPagehide",[(0,o.t)()],void 0,S.T,this.ee)),this.importAggregator(e,()=>i.e(478).then(i.bind(i,9917))))}}var O=i(3969);class P extends y{static featureName=O.TZ;constructor(e){super(e,O.TZ),f.RI&&document.addEventListener("securitypolicyviolation",e=>{(0,s.p)(O.xV,["Generic/CSPViolation/Detected"],void 0,this.featureName,this.ee)}),this.importAggregator(e,()=>i.e(478).then(i.bind(i,6555)))}}var k=i(6774),N=i(3878),D=i(3304);class j{constructor(e,t,r,n,i){this.name="UncaughtError",this.message="string"==typeof e?e:(0,D.A)(e),this.sourceURL=t,this.line=r,this.column=n,this.__newrelic=i}}function C(e){return M(e)?e:new j(void 0!==e?.message?e.message:e,e?.filename||e?.sourceURL,e?.lineno||e?.line,e?.colno||e?.col,e?.__newrelic,e?.cause)}function L(e){const t="Unhandled Promise Rejection: ";if(!e?.reason)return;if(M(e.reason)){try{e.reason.message.startsWith(t)||(e.reason.message=t+e.reason.message)}catch(e){}return C(e.reason)}const r=C(e.reason);return(r.message||"").startsWith(t)||(r.message=t+r.message),r}function I(e){if(e.error instanceof SyntaxError&&!/:\d+$/.test(e.error.stack?.trim())){const t=new j(e.message,e.filename,e.lineno,e.colno,e.error.__newrelic,e.cause);return t.name=SyntaxError.name,t}return M(e.error)?e.error:C(e)}function M(e){return e instanceof Error&&!!e.stack}function B(e,r,n,i,a=(0,o.t)()){"string"==typeof e&&(e=new Error(e)),(0,s.p)("err",[e,a,!1,r,n.runtime.isRecording,void 0,i],void 0,t.K7.jserrors,n.ee),(0,s.p)("uaErr",[],void 0,t.K7.genericEvents,n.ee)}var H=i(1541),W=i(993),K=i(3785);function F(e,{customAttributes:t={},level:r=W.p_.INFO}={},n,i,s=(0,o.t)()){(0,K.R)(n.ee,e,t,r,!1,i,s)}function U(e,r,n,i,c=(0,o.t)()){(0,s.p)(a.Pl+a.hG,[c,e,r,i],void 0,t.K7.genericEvents,n.ee)}function V(e,r,n,i,c=(0,o.t)()){const{start:d,end:u,customAttributes:l}=r||{},f={customAttributes:l||{}};if("object"!=typeof f.customAttributes||"string"!=typeof e||0===e.length)return void(0,h.R)(57);const p=(e,t)=>null==e?t:"number"==typeof e?e:e instanceof PerformanceMark?e.startTime:Number.NaN;if(f.start=p(d,0),f.end=p(u,c),Number.isNaN(f.start)||Number.isNaN(f.end))(0,h.R)(57);else{if(f.duration=f.end-f.start,!(f.duration<0))return(0,s.p)(a.Pl+a.V1,[f,e,i],void 0,t.K7.genericEvents,n.ee),f;(0,h.R)(58)}}function G(e,r={},n,i,c=(0,o.t)()){(0,s.p)(a.Pl+a.fF,[c,e,r,i],void 0,t.K7.genericEvents,n.ee)}var z=i(5871),Y=i(9566);const Z=["name","id","type"];function q(e){(0,c.Y)(a.eY,function(t){return X(e,t)},e)}function X(e,r,n){(0,h.R)(54,"newrelic.register"),r||={},r.instance=(0,Y.LA)(8),r.type=H.fQ.MFE,r.licenseKey||=e.info.licenseKey,r.blocked=!1,("object"!=typeof r.tags||null===r.tags||Array.isArray(r.tags))&&(r.tags={}),r.parent=n||{get id(){return e.runtime.appMetadata.agents[0].entityGuid},type:H.fQ.BA};const i=(0,z.Qr)(),a={};Object.defineProperty(r,"attributes",{get:()=>({...a,"source.id":r.id,"source.name":r.name,"source.type":r.type,"parent.type":r.parent?.type||H.fQ.BA,"parent.id":r.parent?.id})}),Object.entries(r.tags).forEach(([e,t])=>{Z.includes(e)||(a["source.".concat(e)]=t)}),r.isolated??=!0;let c=()=>{};const d=e.runtime.registeredEntities;if(!r.isolated){const e=d.find(({metadata:{target:{id:e}}})=>e===r.id&&!r.isolated);if(e)return e}const u=e=>{r.blocked=!0,c=e};function l(e){return"string"==typeof e&&!!e.trim()&&e.trim().length<501}e.init.api.allow_registered_children||u((0,m.J)(()=>(0,h.R)(55))),l(r.id)&&l(r.name)||u((0,m.J)(()=>(0,h.R)(48,r)));const f={addPageAction:(t,n={})=>y(U,[t,{...a,...n},e],r),deregister:()=>{g(),u((0,m.J)(()=>(0,h.R)(68)))},log:(t,n={})=>y(F,[t,{...n,customAttributes:{...a,...n.customAttributes||{}}},e],r),measure:(t,n={})=>y(V,[t,{...n,customAttributes:{...a,...n.customAttributes||{}}},e],r),noticeError:(t,n={})=>y(B,[t,{...a,...n},e],r),register:(t={})=>y(X,[e,t],f.metadata.target),recordCustomEvent:(t,n={})=>y(G,[t,{...a,...n},e],r),setApplicationVersion:e=>v("application.version",e),setCustomAttribute:(e,t)=>v(e,t),setUserId:e=>v("enduser.id",e),metadata:{get customAttributes(){return a},target:r,timings:i}},p=()=>(r.blocked&&c(),r.blocked);function g(){i.reportedAt||(i.reportedAt=(0,o.t)(),f.recordCustomEvent("MicroFrontEndTiming",{assetUrl:i.asset,assetType:i.type,timeToLoad:i.registeredAt-i.fetchStart,timeToBeRequested:i.fetchStart,timeToFetch:i.fetchEnd-i.fetchStart,timeToRegister:i.registeredAt-i.fetchEnd,timeAlive:i.reportedAt-i.registeredAt}))}p()||(d.push(f),(0,x.G)(g));const v=(e,t)=>{p()||(a[e]=t)},y=(r,n,i)=>{if(p()&&r!==X)return;const a=(0,o.t)();(0,s.p)(O.xV,["API/register/".concat(r.name,"/called")],void 0,t.K7.metrics,e.ee);try{return r(...n,i,a)}catch(e){(0,h.R)(50,e)}};return f}class Q extends y{static featureName=k.T;constructor(e){var t;super(e,k.T),t=e,(0,c.Y)(a.o5,(e,r)=>B(e,r,t),t),function(e){(0,c.Y)(a.bt,function(t){e.runtime.onerror=t},e)}(e),function(e){let t=0;(0,c.Y)(a.k6,function(e,r){++t>10||(this.runtime.releaseIds[e.slice(-200)]=(""+r).slice(-200))},e)}(e),q(e);try{this.removeOnAbort=new AbortController}catch(e){}this.ee.on("internal-error",(t,r)=>{this.abortHandler&&(0,s.p)("ierr",[C(t),(0,o.t)(),!0,{},e.runtime.isRecording,r],void 0,this.featureName,this.ee)}),f.gm.addEventListener("unhandledrejection",t=>{this.abortHandler&&(0,s.p)("err",[L(t),(0,o.t)(),!1,{unhandledPromiseRejection:1},e.runtime.isRecording],void 0,this.featureName,this.ee)},(0,N.jT)(!1,this.removeOnAbort?.signal)),f.gm.addEventListener("error",t=>{this.abortHandler&&(0,s.p)("err",[I(t),(0,o.t)(),!1,{},e.runtime.isRecording],void 0,this.featureName,this.ee)},(0,N.jT)(!1,this.removeOnAbort?.signal)),this.abortHandler=this.#r,this.importAggregator(e,()=>i.e(478).then(i.bind(i,2176)))}#r(){this.removeOnAbort?.abort(),this.abortHandler=void 0}}var J=i(8990);let ee=1;function te(e){const t=typeof e;return!e||"object"!==t&&"function"!==t?-1:e===f.gm?0:(0,J.I)(e,"nr@id",function(){return ee++})}function re(e){if("string"==typeof e&&e.length)return e.length;if("object"==typeof e){if("undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer&&e.byteLength)return e.byteLength;if("undefined"!=typeof Blob&&e instanceof Blob&&e.size)return e.size;if(!("undefined"!=typeof FormData&&e instanceof FormData))try{return(0,D.A)(e).length}catch(e){return}}}var ne=i(8139),ie=i(7836),se=i(3434);const oe={},ae=["open","send"];function ce(e,t){var r=e||ie.ee;const n=function(e){return(e||ie.ee).get("xhr")}(r);if(void 0===f.gm.XMLHttpRequest)return n;if(oe[n.debugId]++)return n;oe[n.debugId]=1,(0,ne.u)(r);var i=(0,se.YM)(n),s=f.gm.XMLHttpRequest,o=f.gm.MutationObserver,a=f.gm.Promise,c=f.gm.setInterval,d="readystatechange",u=["onload","onerror","onabort","onloadstart","onloadend","onprogress","ontimeout"],l=[],p=f.gm.XMLHttpRequest=function(e){const r=new s(e),o=n.context(r);o.targets=(0,H.$5)(t);try{n.emit("new-xhr",[r],o),r.addEventListener(d,(a=o,function(){var e=this;e.readyState>3&&!a.resolved&&(a.resolved=!0,n.emit("xhr-resolved",[],e)),i.inPlace(e,u,"fn-",w)}),(0,N.jT)(!1))}catch(e){(0,h.R)(15,e);try{n.emit("internal-error",[e])}catch(e){}}var a;return r};function g(e,t){i.inPlace(t,["onreadystatechange"],"fn-",w)}if(function(e,t){for(var r in e)t[r]=e[r]}(s,p),p.prototype=s.prototype,i.inPlace(p.prototype,ae,"-xhr-",w),n.on("send-xhr-start",function(e,t){g(e,t),function(e){l.push(e),o&&(m?m.then(b):c?c(b):(v=-v,y.data=v))}(t)}),n.on("open-xhr-start",g),o){var m=a&&a.resolve();if(!c&&!a){var v=1,y=document.createTextNode(v);new o(b).observe(y,{characterData:!0})}}else r.on("fn-end",function(e){e[0]&&e[0].type===d||b()});function b(){for(var e=0;e<l.length;e++)g(0,l[e]);l.length&&(l=[])}function w(e,t){return t}return n}var de="fetch-",ue=de+"body-",le=["arrayBuffer","blob","json","text","formData"],fe=f.gm.Request,he=f.gm.Response,pe="prototype";const ge={};function me(e,t){const r=function(e){return(e||ie.ee).get("fetch")}(e);if(!(fe&&he&&f.gm.fetch))return r;if(ge[r.debugId]++)return r;function n(e,n,i){var s=e[n];"function"==typeof s&&(e[n]=function(){var e=[...arguments];const n={},o=(0,H.$5)(t);var a;r.emit(i+"before-start",[e],n),n[ie.P]&&n[ie.P].dt&&(a=n[ie.P].dt);var c=s.apply(this,e);return r.emit(i+"start",[e,a],c),c.then(function(e){return r.emit(i+"end",[null,e,o],c),e},function(e){throw r.emit(i+"end",[e,void 0,o],c),e})})}return ge[r.debugId]=1,le.forEach(e=>{n(fe[pe],e,ue),n(he[pe],e,ue)}),n(f.gm,"fetch",de),r.on(de+"end",function(e,t,n){var i=this;if(i.targets=n||[void 0],t){var s=t.headers.get("content-length");null!==s&&(i.rxSize=s),r.emit(de+"done",[null,t],i)}else r.emit(de+"done",[e],i)}),r}var ve=i(7485);class ye{constructor(e){this.agentRef=e}generateTracePayload(e){const t=this.agentRef.loader_config;if(!this.shouldGenerateTrace(e)||!t)return null;var r=(t.accountID||"").toString()||null,n=(t.agentID||"").toString()||null,i=(t.trustKey||"").toString()||null;if(!r||!n)return null;var s=(0,Y.ZF)(),o=(0,Y.el)(),a=Date.now(),c={spanId:s,traceId:o,timestamp:a};return(e.sameOrigin||this.isAllowedOrigin(e)&&this.useTraceContextHeadersForCors())&&(c.traceContextParentHeader=this.generateTraceContextParentHeader(s,o),c.traceContextStateHeader=this.generateTraceContextStateHeader(s,a,r,n,i)),(e.sameOrigin&&!this.excludeNewrelicHeader()||!e.sameOrigin&&this.isAllowedOrigin(e)&&this.useNewrelicHeaderForCors())&&(c.newrelicHeader=this.generateTraceHeader(s,o,a,r,n,i)),c}generateTraceContextParentHeader(e,t){return"00-"+t+"-"+e+"-01"}generateTraceContextStateHeader(e,t,r,n,i){return i+"@nr=0-1-"+r+"-"+n+"-"+e+"----"+t}generateTraceHeader(e,t,r,n,i,s){if(!("function"==typeof f.gm?.btoa))return null;var o={v:[0,1],d:{ty:"Browser",ac:n,ap:i,id:e,tr:t,ti:r}};return s&&n!==s&&(o.d.tk=s),btoa((0,D.A)(o))}shouldGenerateTrace(e){return this.agentRef.init?.distributed_tracing?.enabled&&this.isAllowedOrigin(e)}isAllowedOrigin(e){var t=!1;const r=this.agentRef.init?.distributed_tracing;if(e.sameOrigin)t=!0;else if(r?.allowed_origins instanceof Array)for(var n=0;n<r.allowed_origins.length;n++){var i=(0,ve.D)(r.allowed_origins[n]);if(e.hostname===i.hostname&&e.protocol===i.protocol&&e.port===i.port){t=!0;break}}return t}excludeNewrelicHeader(){var e=this.agentRef.init?.distributed_tracing;return!!e&&!!e.exclude_newrelic_header}useNewrelicHeaderForCors(){var e=this.agentRef.init?.distributed_tracing;return!!e&&!1!==e.cors_use_newrelic_header}useTraceContextHeadersForCors(){var e=this.agentRef.init?.distributed_tracing;return!!e&&!!e.cors_use_tracecontext_headers}}var be=i(9300),we=i(7295);function Re(e){return"string"==typeof e?e:e instanceof(0,T.dV)().o.REQ?e.url:f.gm?.URL&&e instanceof URL?e.href:void 0}var Ee=["load","error","abort","timeout"],Te=Ee.length,Ae=(0,T.dV)().o.REQ,xe=(0,T.dV)().o.XHR;const Se="X-NewRelic-App-Data";class _e extends y{static featureName=be.T;constructor(e){super(e,be.T),this.dt=new ye(e),this.handler=(e,t,r,n)=>(0,s.p)(e,t,r,n,this.ee);try{const e={xmlhttprequest:"xhr",fetch:"fetch",beacon:"beacon"};f.gm?.performance?.getEntriesByType("resource").forEach(r=>{if(r.initiatorType in e&&0!==r.responseStatus){const n={status:r.responseStatus},i={rxSize:r.transferSize,duration:Math.floor(r.duration),cbTime:0};Oe(n,r.name),this.handler("xhr",[n,i,r.startTime,r.responseEnd,e[r.initiatorType]],void 0,t.K7.ajax)}})}catch(e){}me(this.ee,e),ce(this.ee,e),function(e,r,n,i){function a(e){var t=this;t.totalCbs=0,t.called=0,t.cbTime=0,t.end=T,t.ended=!1,t.xhrGuids={},t.lastSize=null,t.loadCaptureCalled=!1,t.params=this.params||{},t.metrics=this.metrics||{},t.latestLongtaskEnd=0,e.addEventListener("load",function(r){x(t,e)},(0,N.jT)(!1)),f.lR||e.addEventListener("progress",function(e){t.lastSize=e.loaded},(0,N.jT)(!1))}function c(e){this.params={method:e[0]},Oe(this,e[1]),this.metrics={}}function d(t,r){e.loader_config.xpid&&this.sameOrigin&&r.setRequestHeader("X-NewRelic-ID",e.loader_config.xpid);var n=i.generateTracePayload(this.parsedOrigin);if(n){var s=!1;n.newrelicHeader&&(r.setRequestHeader("newrelic",n.newrelicHeader),s=!0),n.traceContextParentHeader&&(r.setRequestHeader("traceparent",n.traceContextParentHeader),n.traceContextStateHeader&&r.setRequestHeader("tracestate",n.traceContextStateHeader),s=!0),s&&(this.dt=n)}}function u(e,t){var n=this.metrics,i=e[0],s=this;if(n&&i){var a=re(i);a&&(n.txSize=a)}this.startTime=(0,o.t)(),this.body=i,this.listener=function(e){try{"abort"!==e.type||s.loadCaptureCalled||(s.params.aborted=!0),("load"!==e.type||s.called===s.totalCbs&&(s.onloadCalled||"function"!=typeof t.onload)&&"function"==typeof s.end)&&s.end(t)}catch(e){try{r.emit("internal-error",[e])}catch(e){}}};for(var c=0;c<Te;c++)t.addEventListener(Ee[c],this.listener,(0,N.jT)(!1))}function l(e,t,r){this.cbTime+=e,t?this.onloadCalled=!0:this.called+=1,this.called!==this.totalCbs||!this.onloadCalled&&"function"==typeof r.onload||"function"!=typeof this.end||this.end(r)}function h(e,t){var r=""+te(e)+!!t;this.xhrGuids&&!this.xhrGuids[r]&&(this.xhrGuids[r]=!0,this.totalCbs+=1)}function p(e,t){var r=""+te(e)+!!t;this.xhrGuids&&this.xhrGuids[r]&&(delete this.xhrGuids[r],this.totalCbs-=1)}function g(){this.endTime=(0,o.t)()}function m(e,t){t instanceof xe&&"load"===e[0]&&r.emit("xhr-load-added",[e[1],e[2]],t)}function v(e,t){t instanceof xe&&"load"===e[0]&&r.emit("xhr-load-removed",[e[1],e[2]],t)}function y(e,t,r){t instanceof xe&&("onload"===r&&(this.onload=!0),("load"===(e[0]&&e[0].type)||this.onload)&&(this.xhrCbStart=(0,o.t)()))}function b(e,t){this.xhrCbStart&&r.emit("xhr-cb-time",[(0,o.t)()-this.xhrCbStart,this.onload,t],t)}function w(e){var t,r=e[1]||{};if("string"==typeof e[0]?0===(t=e[0]).length&&f.RI&&(t=""+f.gm.location.href):e[0]&&e[0].url?t=e[0].url:f.gm?.URL&&e[0]&&e[0]instanceof URL?t=e[0].href:"function"==typeof e[0].toString&&(t=e[0].toString()),"string"==typeof t&&0!==t.length){t&&(this.parsedOrigin=(0,ve.D)(t),this.sameOrigin=this.parsedOrigin.sameOrigin);var n=i.generateTracePayload(this.parsedOrigin);if(n&&(n.newrelicHeader||n.traceContextParentHeader))if(e[0]&&e[0].headers)a(e[0].headers,n)&&(this.dt=n);else{var s={};for(var o in r)s[o]=r[o];s.headers=new Headers(r.headers||{}),a(s.headers,n)&&(this.dt=n),e.length>1?e[1]=s:e.push(s)}}function a(e,t){var r=!1;return t.newrelicHeader&&(e.set("newrelic",t.newrelicHeader),r=!0),t.traceContextParentHeader&&(e.set("traceparent",t.traceContextParentHeader),t.traceContextStateHeader&&e.set("tracestate",t.traceContextStateHeader),r=!0),r}}function R(e,t){this.params={},this.metrics={},this.startTime=(0,o.t)(),this.dt=t;let[r,n={}]=e;Oe(this,Re(r));const i=(""+(r&&r instanceof Ae&&r.method||n.method||"GET")).toUpperCase();this.params.method=i,this.body=n.body,this.txSize=re(n.body)||0}function E(e,t){if(this.endTime=(0,o.t)(),this.params||(this.params={}),(0,we.iW)(this.params))return;let r;this.params.status=t?t.status:0,"string"==typeof this.rxSize&&this.rxSize.length>0&&(r=+this.rxSize);const n={txSize:this.txSize,rxSize:r,duration:(0,o.t)()-this.startTime},i=[this.params,n,this.startTime,this.endTime,"fetch"];this.targets.forEach(e=>A(i,this,e))}function T(e){const t=this.params,r=this.metrics;if(this.ended)return;this.ended=!0;for(let t=0;t<Te;t++)e.removeEventListener(Ee[t],this.listener,!1);if(t.aborted)return;if((0,we.iW)(t))return;r.duration=(0,o.t)()-this.startTime,this.loadCaptureCalled||4!==e.readyState?null==t.status&&(t.status=0):x(this,e),r.cbTime=this.cbTime;const n=[t,r,this.startTime,this.endTime,"xhr"];this.targets.forEach(e=>A(n,this,e))}function A(e,r,i){n("xhr",[...e,i],r,t.K7.ajax)}function x(e,n){e.params.status=n.status;var i=function(e,t){var r=e.responseType;return"json"===r&&null!==t?t:"arraybuffer"===r||"blob"===r||"json"===r?re(e.response):"text"===r||""===r||void 0===r?re(e.responseText):void 0}(n,e.lastSize);if(i&&(e.metrics.rxSize=i),e.sameOrigin&&n.getAllResponseHeaders().indexOf(Se)>=0){var o=n.getResponseHeader(Se);o&&((0,s.p)(O.rs,["Ajax/CrossApplicationTracing/Header/Seen"],void 0,t.K7.metrics,r),e.params.cat=o.split(", ").pop())}e.loadCaptureCalled=!0}r.on("new-xhr",a),r.on("open-xhr-start",c),r.on("open-xhr-end",d),r.on("send-xhr-start",u),r.on("xhr-cb-time",l),r.on("xhr-load-added",h),r.on("xhr-load-removed",p),r.on("xhr-resolved",g),r.on("addEventListener-end",m),r.on("removeEventListener-end",v),r.on("fn-end",b),r.on("fetch-before-start",w),r.on("fetch-start",R),r.on("fn-start",y),r.on("fetch-done",E)}(e,this.ee,this.handler,this.dt),this.importAggregator(e,()=>i.e(478).then(i.bind(i,3845)))}}function Oe(e,t){var r=(0,ve.D)(t),n=e.params||e;n.hostname=r.hostname,n.port=r.port,n.protocol=r.protocol,n.host=r.hostname+":"+r.port,n.pathname=r.pathname,e.parsedOrigin=r,e.sameOrigin=r.sameOrigin}const Pe={},ke=["pushState","replaceState"];function Ne(e){const t=function(e){return(e||ie.ee).get("history")}(e);return!f.RI||Pe[t.debugId]++||(Pe[t.debugId]=1,(0,se.YM)(t).inPlace(window.history,ke,"-")),t}var De=i(3738);function je(e){(0,c.Y)(a.BL,function(r=Date.now()){const n=r-f.WN;n<0&&(0,h.R)(62,r),(0,s.p)(O.XG,[a.BL,{time:n}],void 0,t.K7.metrics,e.ee),e.addToTrace({name:a.BL,start:r,origin:"nr"}),(0,s.p)(a.Pl+a.hG,[n,a.BL],void 0,t.K7.genericEvents,e.ee)},e)}const{He:Ce,bD:Le,d3:Ie,Kp:Me,TZ:Be,Lc:He,uP:We,Rz:Ke}=De;class Fe extends y{static featureName=Be;constructor(e){var r;super(e,Be),r=e,(0,c.Y)(a.U2,function(e){if(!(e&&"object"==typeof e&&e.name&&e.start))return;const n={n:e.name,s:e.start-f.WN,e:(e.end||e.start)-f.WN,o:e.origin||"",t:"api"};n.s<0||n.e<0||n.e<n.s?(0,h.R)(61,{start:n.s,end:n.e}):(0,s.p)("bstApi",[n],void 0,t.K7.sessionTrace,r.ee)},r),je(e);if(!(0,g.V)(e.init))return void this.deregisterDrain();const n=this.ee;let d;Ne(n),this.eventsEE=(0,ne.u)(n),this.eventsEE.on(We,function(e,t){this.bstStart=(0,o.t)()}),this.eventsEE.on(He,function(e,r){(0,s.p)("bst",[e[0],r,this.bstStart,(0,o.t)()],void 0,t.K7.sessionTrace,n)}),n.on(Ke+Ie,function(e){this.time=(0,o.t)(),this.startPath=location.pathname+location.hash}),n.on(Ke+Me,function(e){(0,s.p)("bstHist",[location.pathname+location.hash,this.startPath,this.time],void 0,t.K7.sessionTrace,n)});try{d=new PerformanceObserver(e=>{const r=e.getEntries();(0,s.p)(Ce,[r],void 0,t.K7.sessionTrace,n)}),d.observe({type:Le,buffered:!0})}catch(e){}this.importAggregator(e,()=>i.e(478).then(i.bind(i,6974)),{resourceObserver:d})}}var Ue=i(6344);class Ve extends y{static featureName=Ue.TZ;#n;recorder;constructor(e){var r;let n;super(e,Ue.TZ),r=e,(0,c.Y)(a.CH,function(){(0,s.p)(a.CH,[],void 0,t.K7.sessionReplay,r.ee)},r),function(e){(0,c.Y)(a.Tb,function(){(0,s.p)(a.Tb,[],void 0,t.K7.sessionReplay,e.ee)},e)}(e);try{n=JSON.parse(localStorage.getItem("".concat(w.H3,"_").concat(w.uh)))}catch(e){}(0,p.SR)(e.init)&&this.ee.on(a.CH,()=>this.#i()),this.#s(n)&&this.importRecorder().then(e=>{e.startRecording(Ue.Qb.PRELOAD,n?.sessionReplayMode)}),this.importAggregator(this.agentRef,()=>i.e(478).then(i.bind(i,6167)),this),this.ee.on("err",e=>{this.blocked||this.agentRef.runtime.isRecording&&(this.errorNoticed=!0,(0,s.p)(Ue.Vh,[e],void 0,this.featureName,this.ee))})}#s(e){return e&&(e.sessionReplayMode===w.g.FULL||e.sessionReplayMode===w.g.ERROR)||(0,p.Aw)(this.agentRef.init)}importRecorder(){return this.recorder?Promise.resolve(this.recorder):(this.#n??=Promise.all([i.e(478),i.e(249)]).then(i.bind(i,4866)).then(({Recorder:e})=>(this.recorder=new e(this),this.recorder)).catch(e=>{throw this.ee.emit("internal-error",[e]),this.blocked=!0,e}),this.#n)}#i(){this.blocked||(this.featAggregate?this.featAggregate.mode!==w.g.FULL&&this.featAggregate.initializeRecording(w.g.FULL,!0,Ue.Qb.API):this.importRecorder().then(()=>{this.recorder.startRecording(Ue.Qb.API,w.g.FULL)}))}}var Ge=i(3962);class ze extends y{static featureName=Ge.TZ;constructor(e){if(super(e,Ge.TZ),function(e){const r=e.ee.get("tracer");function n(){}(0,c.Y)(a.dT,function(e){return(new n).get("object"==typeof e?e:{})},e);const i=n.prototype={createTracer:function(n,i){var a={},c=this,d="function"==typeof i;return(0,s.p)(O.xV,["API/createTracer/called"],void 0,t.K7.metrics,e.ee),function(){if(r.emit((d?"":"no-")+"fn-start",[(0,o.t)(),c,d],a),d)try{return i.apply(this,arguments)}catch(e){const t="string"==typeof e?new Error(e):e;throw r.emit("fn-err",[arguments,this,t],a),t}finally{r.emit("fn-end",[(0,o.t)()],a)}}}};["actionText","setName","setAttribute","save","ignore","onEnd","getContext","end","get"].forEach(r=>{c.Y.apply(this,[r,function(){return(0,s.p)(a.hw+r,[performance.now(),...arguments],this,t.K7.softNav,e.ee),this},e,i])}),(0,c.Y)(a.PA,function(){(0,s.p)(a.hw+"routeName",[performance.now(),...arguments],void 0,t.K7.softNav,e.ee)},e)}(e),!f.RI||!(0,T.dV)().o.MO)return;const r=Ne(this.ee);try{this.removeOnAbort=new AbortController}catch(e){}Ge.tC.forEach(e=>{(0,N.sp)(e,e=>{l(e)},!0,this.removeOnAbort?.signal)});const n=()=>(0,s.p)("newURL",[(0,o.t)(),""+window.location],void 0,this.featureName,this.ee);r.on("pushState-end",n),r.on("replaceState-end",n),(0,N.sp)(Ge.OV,e=>{l(e),(0,s.p)("newURL",[e.timeStamp,""+window.location],void 0,this.featureName,this.ee)},!0,this.removeOnAbort?.signal);let d=!1;const u=new((0,T.dV)().o.MO)((e,t)=>{d||(d=!0,requestAnimationFrame(()=>{(0,s.p)("newDom",[(0,o.t)()],void 0,this.featureName,this.ee),d=!1}))}),l=(0,m.s)(e=>{"loading"!==document.readyState&&((0,s.p)("newUIEvent",[e],void 0,this.featureName,this.ee),u.observe(document.body,{attributes:!0,childList:!0,subtree:!0,characterData:!0}))},100,{leading:!0});this.abortHandler=function(){this.removeOnAbort?.abort(),u.disconnect(),this.abortHandler=void 0},this.importAggregator(e,()=>i.e(478).then(i.bind(i,4393)),{domObserver:u})}}var Ye=i(3333),Ze=i(9119);const qe={},Xe=new Set;function $e(e){return"string"==typeof e?{type:"string",size:(new TextEncoder).encode(e).length}:e instanceof ArrayBuffer?{type:"ArrayBuffer",size:e.byteLength}:e instanceof Blob?{type:"Blob",size:e.size}:e instanceof DataView?{type:"DataView",size:e.byteLength}:ArrayBuffer.isView(e)?{type:"TypedArray",size:e.byteLength}:{type:"unknown",size:0}}class Qe{constructor(e,t){this.timestamp=(0,o.t)(),this.currentUrl=(0,Ze.L)(window.location.href),this.socketId=(0,Y.LA)(8),this.requestedUrl=(0,Ze.L)(e),this.requestedProtocols=Array.isArray(t)?t.join(","):t||"",this.openedAt=void 0,this.protocol=void 0,this.extensions=void 0,this.binaryType=void 0,this.messageOrigin=void 0,this.messageCount=0,this.messageBytes=0,this.messageBytesMin=0,this.messageBytesMax=0,this.messageTypes=void 0,this.sendCount=0,this.sendBytes=0,this.sendBytesMin=0,this.sendBytesMax=0,this.sendTypes=void 0,this.closedAt=void 0,this.closeCode=void 0,this.closeReason="unknown",this.closeWasClean=void 0,this.connectedDuration=0,this.hasErrors=void 0}}class Je extends y{static featureName=Ye.TZ;constructor(e){super(e,Ye.TZ);const r=e.init.feature_flags.includes("websockets"),n=[e.init.page_action.enabled,e.init.performance.capture_marks,e.init.performance.capture_measures,e.init.performance.resources.enabled,e.init.user_actions.enabled,r];var d;let u,l;if(d=e,(0,c.Y)(a.hG,(e,t)=>U(e,t,d),d),function(e){(0,c.Y)(a.fF,(t,r)=>G(t,r,e),e)}(e),je(e),q(e),function(e){(0,c.Y)(a.V1,(t,r)=>V(t,r,e),e)}(e),r&&(l=function(e){if(!(0,T.dV)().o.WS)return e;const t=e.get("websockets");if(qe[t.debugId]++)return t;qe[t.debugId]=1,(0,x.G)(()=>{const e=(0,o.t)();Xe.forEach(r=>{r.nrData.closedAt=e,r.nrData.closeCode=1001,r.nrData.closeReason="Page navigating away",r.nrData.closeWasClean=!1,r.nrData.openedAt&&(r.nrData.connectedDuration=e-r.nrData.openedAt),t.emit("ws",[r.nrData],r)})});class r extends WebSocket{static name="WebSocket";static toString(){return"function WebSocket() { [native code] }"}toString(){return"[object WebSocket]"}get[Symbol.toStringTag](){return r.name}#o(e){(e.__newrelic??={}).socketId=this.nrData.socketId,this.nrData.hasErrors??=!0}constructor(...e){super(...e),this.nrData=new Qe(e[0],e[1]),this.addEventListener("open",()=>{this.nrData.openedAt=(0,o.t)(),["protocol","extensions","binaryType"].forEach(e=>{this.nrData[e]=this[e]}),Xe.add(this)}),this.addEventListener("message",e=>{const{type:t,size:r}=$e(e.data);this.nrData.messageOrigin??=(0,Ze.L)(e.origin),this.nrData.messageCount++,this.nrData.messageBytes+=r,this.nrData.messageBytesMin=Math.min(this.nrData.messageBytesMin||1/0,r),this.nrData.messageBytesMax=Math.max(this.nrData.messageBytesMax,r),(this.nrData.messageTypes??"").includes(t)||(this.nrData.messageTypes=this.nrData.messageTypes?"".concat(this.nrData.messageTypes,",").concat(t):t)}),this.addEventListener("close",e=>{this.nrData.closedAt=(0,o.t)(),this.nrData.closeCode=e.code,e.reason&&(this.nrData.closeReason=e.reason),this.nrData.closeWasClean=e.wasClean,this.nrData.connectedDuration=this.nrData.closedAt-this.nrData.openedAt,Xe.delete(this),t.emit("ws",[this.nrData],this)})}addEventListener(e,t,...r){const n=this,i="function"==typeof t?function(...e){try{return t.apply(this,e)}catch(e){throw n.#o(e),e}}:t?.handleEvent?{handleEvent:function(...e){try{return t.handleEvent.apply(t,e)}catch(e){throw n.#o(e),e}}}:t;return super.addEventListener(e,i,...r)}send(e){if(this.readyState===WebSocket.OPEN){const{type:t,size:r}=$e(e);this.nrData.sendCount++,this.nrData.sendBytes+=r,this.nrData.sendBytesMin=Math.min(this.nrData.sendBytesMin||1/0,r),this.nrData.sendBytesMax=Math.max(this.nrData.sendBytesMax,r),(this.nrData.sendTypes??"").includes(t)||(this.nrData.sendTypes=this.nrData.sendTypes?"".concat(this.nrData.sendTypes,",").concat(t):t)}try{return super.send(e)}catch(e){throw this.#o(e),e}}close(...e){try{super.close(...e)}catch(e){throw this.#o(e),e}}}return f.gm.WebSocket=r,t}(this.ee)),f.RI){if(me(this.ee,e),ce(this.ee,e),u=Ne(this.ee),e.init.user_actions.enabled){function h(t){const r=(0,ve.D)(t);return e.beacons.includes(r.hostname+":"+r.port)}function p(){u.emit("navChange")}Ye.Zp.forEach(e=>(0,N.sp)(e,e=>(0,s.p)("ua",[e],void 0,this.featureName,this.ee),!0)),Ye.qN.forEach(e=>{const t=(0,m.s)(e=>{(0,s.p)("ua",[e],void 0,this.featureName,this.ee)},500,{leading:!0});(0,N.sp)(e,t)}),f.gm.addEventListener("error",()=>{(0,s.p)("uaErr",[],void 0,t.K7.genericEvents,this.ee)},(0,N.jT)(!1,this.removeOnAbort?.signal)),this.ee.on("open-xhr-start",(e,r)=>{h(e[1])||r.addEventListener("readystatechange",()=>{2===r.readyState&&(0,s.p)("uaXhr",[],void 0,t.K7.genericEvents,this.ee)})}),this.ee.on("fetch-start",e=>{e.length>=1&&!h(Re(e[0]))&&(0,s.p)("uaXhr",[],void 0,t.K7.genericEvents,this.ee)}),u.on("pushState-end",p),u.on("replaceState-end",p),window.addEventListener("hashchange",p,(0,N.jT)(!0,this.removeOnAbort?.signal)),window.addEventListener("popstate",p,(0,N.jT)(!0,this.removeOnAbort?.signal))}if(e.init.performance.resources.enabled&&f.gm.PerformanceObserver?.supportedEntryTypes.includes("resource")){new PerformanceObserver(e=>{e.getEntries().forEach(e=>{(0,s.p)("browserPerformance.resource",[e],void 0,this.featureName,this.ee)})}).observe({type:"resource",buffered:!0})}}r&&l.on("ws",e=>{(0,s.p)("ws-complete",[e],void 0,this.featureName,this.ee)});try{this.removeOnAbort=new AbortController}catch(g){}this.abortHandler=()=>{this.removeOnAbort?.abort(),this.abortHandler=void 0},n.some(e=>e)?this.importAggregator(e,()=>i.e(478).then(i.bind(i,8019))):this.deregisterDrain()}}var et=i(2646);const tt=new Map;function rt(e,t,r,n,i=!0,s){if("object"!=typeof t||!t||"string"!=typeof r||!r||"function"!=typeof t[r])return(0,h.R)(29);const o=function(e){return(e||ie.ee).get("logger")}(e),a=(0,se.YM)(o,void 0,s),c=new et.y(ie.P);c.level=n.level,c.customAttributes=n.customAttributes,c.autoCaptured=i;const d=t[r]?.[se.Jt]||t[r];return tt.set(d,c),a.inPlace(t,[r],"wrap-logger-",()=>tt.get(d),void 0,!0),o}var nt=i(1910);class it extends y{static featureName=W.TZ;constructor(e){var t;super(e,W.TZ),t=e,(0,c.Y)(a.$9,(e,r)=>F(e,r,t),t),function(e){(0,c.Y)(a.Wb,(t,r,{customAttributes:n={},level:i=W.p_.INFO}={})=>{rt(e.ee,t,r,{customAttributes:n,level:i},!1,e)},e)}(e),q(e);const r=this.ee;["log","error","warn","info","debug","trace"].forEach(t=>{(0,nt.i)(f.gm.console[t]),rt(r,f.gm.console,t,{level:"log"===t?"info":t},void 0,e)}),this.ee.on("wrap-logger-end",function([e],t,n,i=[]){const{level:s,customAttributes:o,autoCaptured:a}=this;i.forEach(t=>{(0,K.R)(r,e,o,s,a,t)})}),this.importAggregator(e,()=>i.e(478).then(i.bind(i,5288)))}}new A({features:[_e,E,_,Fe,Ve,P,Q,Je,it,ze],loaderType:"spa"})})()})();</script>
<script>
var gform;gform||(document.addEventListener("gform_main_scripts_loaded",function(){gform.scriptsLoaded=!0}),document.addEventListener("gform/theme/scripts_loaded",function(){gform.themeScriptsLoaded=!0}),window.addEventListener("DOMContentLoaded",function(){gform.domLoaded=!0}),gform={domLoaded:!1,scriptsLoaded:!1,themeScriptsLoaded:!1,isFormEditor:()=>"function"==typeof InitializeEditor,callIfLoaded:function(o){return!(!gform.domLoaded||!gform.scriptsLoaded||!gform.themeScriptsLoaded&&!gform.isFormEditor()||(gform.isFormEditor()&&console.warn("The use of gform.initializeOnLoaded() is deprecated in the form editor context and will be removed in Gravity Forms 3.1."),o(),0))},initializeOnLoaded:function(o){gform.callIfLoaded(o)||(document.addEventListener("gform_main_scripts_loaded",()=>{gform.scriptsLoaded=!0,gform.callIfLoaded(o)}),document.addEventListener("gform/theme/scripts_loaded",()=>{gform.themeScriptsLoaded=!0,gform.callIfLoaded(o)}),window.addEventListener("DOMContentLoaded",()=>{gform.domLoaded=!0,gform.callIfLoaded(o)}))},hooks:{action:{},filter:{}},addAction:function(o,r,e,t){gform.addHook("action",o,r,e,t)},addFilter:function(o,r,e,t){gform.addHook("filter",o,r,e,t)},doAction:function(o){gform.doHook("action",o,arguments)},applyFilters:function(o){return gform.doHook("filter",o,arguments)},removeAction:function(o,r){gform.removeHook("action",o,r)},removeFilter:function(o,r,e){gform.removeHook("filter",o,r,e)},addHook:function(o,r,e,t,n){null==gform.hooks[o][r]&&(gform.hooks[o][r]=[]);var d=gform.hooks[o][r];null==n&&(n=r+"_"+d.length),gform.hooks[o][r].push({tag:n,callable:e,priority:t=null==t?10:t})},doHook:function(r,o,e){var t;if(e=Array.prototype.slice.call(e,1),null!=gform.hooks[r][o]&&((o=gform.hooks[r][o]).sort(function(o,r){return o.priority-r.priority}),o.forEach(function(o){"function"!=typeof(t=o.callable)&&(t=window[t]),"action"==r?t.apply(null,e):e[0]=t.apply(null,e)})),"filter"==r)return e[0]},removeHook:function(o,r,t,n){var e;null!=gform.hooks[o][r]&&(e=(e=gform.hooks[o][r]).filter(function(o,r,e){return!!(null!=n&&n!=o.tag||null!=t&&t!=o.priority)}),gform.hooks[o][r]=e)}});
</script>

<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11"> 
	<link rel="preload" href="https://meteoric.com.au/wp-content/astra-local-fonts/roboto/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2" as="font" type="font/woff2" crossorigin><meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
<link rel="alternate" hreflang="en" href="https://meteoric.com.au/" />
<link rel="alternate" hreflang="pt-pt" href="https://meteoric.com.au/pt-pt/" />
<link rel="alternate" hreflang="x-default" href="https://meteoric.com.au/" />

	<!-- This site is optimized with the Yoast SEO plugin v27.2 - https://yoast.com/product/yoast-seo-wordpress/ -->
	<title>Meteoric Resources | Caldeira Rare Earth Project in Brazil</title>
	<meta name="description" content="Meteoric Resources is developing the Caldeira Rare Earth Project in Brazil—the world’s highest-grade ionic clay rare earth deposit." />
	<link rel="canonical" href="https://meteoric.com.au/" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Meteoric Resources | Caldeira Rare Earth Project in Brazil" />
	<meta property="og:description" content="Meteoric Resources is developing the Caldeira Rare Earth Project in Brazil—the world’s highest-grade ionic clay rare earth deposit." />
	<meta property="og:url" content="https://meteoric.com.au/" />
	<meta property="og:site_name" content="Meteoric Resources" />
	<meta property="article:modified_time" content="2026-03-23T05:04:49+00:00" />
	<meta property="og:image" content="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@ASX_MEI" />
	<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://meteoric.com.au/","url":"https://meteoric.com.au/","name":"Meteoric Resources | Caldeira Rare Earth Project in Brazil","isPartOf":{"@id":"https://meteoric.com.au/#website"},"about":{"@id":"https://meteoric.com.au/#organization"},"primaryImageOfPage":{"@id":"https://meteoric.com.au/#primaryimage"},"image":{"@id":"https://meteoric.com.au/#primaryimage"},"thumbnailUrl":"https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png","datePublished":"2025-05-09T08:04:26+00:00","dateModified":"2026-03-23T05:04:49+00:00","description":"Meteoric Resources is developing the Caldeira Rare Earth Project in Brazil—the world’s highest-grade ionic clay rare earth deposit.","breadcrumb":{"@id":"https://meteoric.com.au/#breadcrumb"},"inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["https://meteoric.com.au/"]}]},{"@type":"ImageObject","inLanguage":"en-US","@id":"https://meteoric.com.au/#primaryimage","url":"https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png","contentUrl":"https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png","width":256,"height":206},{"@type":"BreadcrumbList","@id":"https://meteoric.com.au/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]},{"@type":"WebSite","@id":"https://meteoric.com.au/#website","url":"https://meteoric.com.au/","name":"Meteoric Resources","description":"Your sustainable source for specialty rare earth materials.","publisher":{"@id":"https://meteoric.com.au/#organization"},"potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://meteoric.com.au/?s={search_term_string}"},"query-input":{"@type":"PropertyValueSpecification","valueRequired":true,"valueName":"search_term_string"}}],"inLanguage":"en-US"},{"@type":"Organization","@id":"https://meteoric.com.au/#organization","name":"Meteoric Resources","url":"https://meteoric.com.au/","logo":{"@type":"ImageObject","inLanguage":"en-US","@id":"https://meteoric.com.au/#/schema/logo/image/","url":"https://meteoric.com.au/wp-content/uploads/2025/05/logo-meteoric.webp","contentUrl":"https://meteoric.com.au/wp-content/uploads/2025/05/logo-meteoric.webp","width":262,"height":178,"caption":"Meteoric Resources"},"image":{"@id":"https://meteoric.com.au/#/schema/logo/image/"},"sameAs":["https://x.com/ASX_MEI","https://www.linkedin.com/company/meteoric-resources/","https://www.youtube.com/@meteoricresources"]}]}</script>
	<!-- / Yoast SEO plugin. -->


<link rel='dns-prefetch' href='//meteoric.com.au' />
<link rel='dns-prefetch' href='//www.google.com' />
<link rel="alternate" type="application/rss+xml" title="Meteoric Resources &raquo; Feed" href="https://meteoric.com.au/feed/" />
<link rel="alternate" type="application/rss+xml" title="Meteoric Resources &raquo; Comments Feed" href="https://meteoric.com.au/comments/feed/" />
<link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://meteoric.com.au/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fmeteoric.com.au%2F" />
<link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://meteoric.com.au/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fmeteoric.com.au%2F&#038;format=xml" />
<style id='wp-img-auto-sizes-contain-inline-css'>
img:is([sizes=auto i],[sizes^="auto," i]){contain-intrinsic-size:3000px 1500px}
/*# sourceURL=wp-img-auto-sizes-contain-inline-css */
</style>
<link rel='stylesheet' id='astra-theme-css-css' href='https://meteoric.com.au/wp-content/themes/astra/assets/css/minified/main.min.css?ver=4.12.5' media='all' />
<style id='astra-theme-css-inline-css'>
:root{--ast-post-nav-space:0;--ast-container-default-xlg-padding:2.5em;--ast-container-default-lg-padding:2.5em;--ast-container-default-slg-padding:2em;--ast-container-default-md-padding:2.5em;--ast-container-default-sm-padding:2.5em;--ast-container-default-xs-padding:2.4em;--ast-container-default-xxs-padding:1.8em;--ast-code-block-background:#ECEFF3;--ast-comment-inputs-background:#F9FAFB;--ast-normal-container-width:1200px;--ast-narrow-container-width:750px;--ast-blog-title-font-weight:600;--ast-blog-meta-weight:600;--ast-global-color-primary:var(--ast-global-color-4);--ast-global-color-secondary:var(--ast-global-color-5);--ast-global-color-alternate-background:var(--ast-global-color-6);--ast-global-color-subtle-background:var(--ast-global-color-7);--ast-bg-style-guide:var( --ast-global-color-secondary,--ast-global-color-5 );--ast-shadow-style-guide:0px 0px 4px 0 #00000057;--ast-global-dark-bg-style:#fff;--ast-global-dark-lfs:#fbfbfb;--ast-widget-bg-color:#fafafa;--ast-wc-container-head-bg-color:#fbfbfb;--ast-title-layout-bg:#eeeeee;--ast-search-border-color:#e7e7e7;--ast-lifter-hover-bg:#e6e6e6;--ast-gallery-block-color:#000;--srfm-color-input-label:var(--ast-global-color-2);}html{font-size:112.5%;}a{color:var(--ast-global-color-0);}a:hover,a:focus{color:var(--ast-global-color-1);}body,button,input,select,textarea,.ast-button,.ast-custom-button{font-family:'Roboto',sans-serif;font-weight:400;font-size:18px;font-size:1rem;line-height:var(--ast-body-line-height,26px);}blockquote{color:var(--ast-global-color-3);}h1,h2,h3,h4,h5,h6,.entry-content :where(h1,h2,h3,h4,h5,h6),.site-title,.site-title a{font-family:'Roboto',sans-serif;font-weight:600;}.ast-site-identity .site-title a{color:var(--ast-global-color-2);}.site-title{font-size:26px;font-size:1.4444444444444rem;display:none;}.site-header .site-description{font-size:15px;font-size:0.83333333333333rem;display:none;}.entry-title{font-size:20px;font-size:1.1111111111111rem;}.ast-blog-single-element.ast-taxonomy-container a{font-size:14px;font-size:0.77777777777778rem;}.ast-blog-meta-container{font-size:13px;font-size:0.72222222222222rem;}.archive .ast-article-post .ast-article-inner,.blog .ast-article-post .ast-article-inner,.archive .ast-article-post .ast-article-inner:hover,.blog .ast-article-post .ast-article-inner:hover{border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-right-radius:6px;border-bottom-left-radius:6px;overflow:hidden;}h1,.entry-content :where(h1){font-size:36px;font-size:2rem;font-weight:600;font-family:'Roboto',sans-serif;line-height:1.4em;}h2,.entry-content :where(h2){font-size:30px;font-size:1.6666666666667rem;font-weight:600;font-family:'Roboto',sans-serif;line-height:1.3em;}h3,.entry-content :where(h3){font-size:24px;font-size:1.3333333333333rem;font-weight:600;font-family:'Roboto',sans-serif;line-height:1.3em;}h4,.entry-content :where(h4){font-size:20px;font-size:1.1111111111111rem;line-height:1.2em;font-weight:600;font-family:'Roboto',sans-serif;}h5,.entry-content :where(h5){font-size:18px;font-size:1rem;line-height:1.2em;font-weight:600;font-family:'Roboto',sans-serif;}h6,.entry-content :where(h6){font-size:16px;font-size:0.88888888888889rem;line-height:1.25em;font-weight:600;font-family:'Roboto',sans-serif;}::selection{background-color:var(--ast-global-color-0);color:#ffffff;}body,h1,h2,h3,h4,h5,h6,.entry-title a,.entry-content :where(h1,h2,h3,h4,h5,h6){color:var(--ast-global-color-3);}.tagcloud a:hover,.tagcloud a:focus,.tagcloud a.current-item{color:#ffffff;border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);}input:focus,input[type="text"]:focus,input[type="email"]:focus,input[type="url"]:focus,input[type="password"]:focus,input[type="reset"]:focus,input[type="search"]:focus,textarea:focus{border-color:var(--ast-global-color-0);}input[type="radio"]:checked,input[type=reset],input[type="checkbox"]:checked,input[type="checkbox"]:hover:checked,input[type="checkbox"]:focus:checked,input[type=range]::-webkit-slider-thumb{border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);box-shadow:none;}.site-footer a:hover + .post-count,.site-footer a:focus + .post-count{background:var(--ast-global-color-0);border-color:var(--ast-global-color-0);}.single .nav-links .nav-previous,.single .nav-links .nav-next{color:var(--ast-global-color-0);}.entry-meta,.entry-meta *{line-height:1.45;color:var(--ast-global-color-0);}.entry-meta a:not(.ast-button):hover,.entry-meta a:not(.ast-button):hover *,.entry-meta a:not(.ast-button):focus,.entry-meta a:not(.ast-button):focus *,.page-links > .page-link,.page-links .page-link:hover,.post-navigation a:hover{color:var(--ast-global-color-1);}#cat option,.secondary .calendar_wrap thead a,.secondary .calendar_wrap thead a:visited{color:var(--ast-global-color-0);}.secondary .calendar_wrap #today,.ast-progress-val span{background:var(--ast-global-color-0);}.secondary a:hover + .post-count,.secondary a:focus + .post-count{background:var(--ast-global-color-0);border-color:var(--ast-global-color-0);}.calendar_wrap #today > a{color:#ffffff;}.page-links .page-link,.single .post-navigation a{color:var(--ast-global-color-3);}.ast-search-menu-icon .search-form button.search-submit{padding:0 4px;}.ast-search-menu-icon form.search-form{padding-right:0;}.ast-header-search .ast-search-menu-icon.ast-dropdown-active .search-form,.ast-header-search .ast-search-menu-icon.ast-dropdown-active .search-field:focus{transition:all 0.2s;}.search-form input.search-field:focus{outline:none;}.ast-mobile-header-content .ast-builder-layout-element:not(.ast-builder-menu):not(.ast-header-divider-element),.ast-mobile-popup-content .ast-builder-layout-element:not(.ast-builder-menu):not(.ast-header-divider-element){padding:15px 20px;}.ast-search-menu-icon .search-form button.search-submit:focus,.ast-theme-transparent-header .ast-header-search .ast-dropdown-active .ast-icon,.ast-theme-transparent-header .ast-inline-search .search-field:focus .ast-icon{color:var(--ast-global-color-1);}.ast-desktop .ast-header-search .slide-search .search-form{border:2px solid var(--ast-global-color-0);}.ast-header-search .slide-search .search-field{background-color:(--ast-global-dark-bg-style);}.ast-archive-title{color:var(--ast-global-color-2);}.widget-title{font-size:25px;font-size:1.3888888888889rem;color:var(--ast-global-color-2);}.single .ast-author-details .author-title{color:var(--ast-global-color-1);}.ast-search-menu-icon.slide-search a:focus-visible:focus-visible,.astra-search-icon:focus-visible,#close:focus-visible,a:focus-visible,.ast-menu-toggle:focus-visible,.site .skip-link:focus-visible,.wp-block-loginout input:focus-visible,.wp-block-search.wp-block-search__button-inside .wp-block-search__inside-wrapper,.ast-header-navigation-arrow:focus-visible,.ast-orders-table__row .ast-orders-table__cell:focus-visible,a#ast-apply-coupon:focus-visible,#ast-apply-coupon:focus-visible,#close:focus-visible,.button.search-submit:focus-visible,#search_submit:focus,.normal-search:focus-visible,.ast-header-account-wrap:focus-visible,.astra-cart-drawer-close:focus,.ast-single-variation:focus,.ast-button:focus,.ast-builder-button-wrap:has(.ast-custom-button-link:focus),.ast-builder-button-wrap .ast-custom-button-link:focus{outline-style:dotted;outline-color:inherit;outline-width:thin;}input:focus,input[type="text"]:focus,input[type="email"]:focus,input[type="url"]:focus,input[type="password"]:focus,input[type="reset"]:focus,input[type="search"]:focus,input[type="number"]:focus,textarea:focus,.wp-block-search__input:focus,[data-section="section-header-mobile-trigger"] .ast-button-wrap .ast-mobile-menu-trigger-minimal:focus,.ast-mobile-popup-drawer.active .menu-toggle-close:focus,#ast-scroll-top:focus,#coupon_code:focus,#ast-coupon-code:focus{border-style:dotted;border-color:inherit;border-width:thin;}input{outline:none;}.ast-logo-title-inline .site-logo-img{padding-right:1em;}.site-logo-img img{ transition:all 0.2s linear;}body .ast-oembed-container *{position:absolute;top:0;width:100%;height:100%;left:0;}body .wp-block-embed-pocket-casts .ast-oembed-container *{position:unset;}.ast-single-post-featured-section + article {margin-top: 2em;}.site-content .ast-single-post-featured-section img {width: 100%;overflow: hidden;object-fit: cover;}.ast-separate-container .site-content .ast-single-post-featured-section + article {margin-top: -80px;z-index: 9;position: relative;border-radius: 4px;}@media (min-width: 922px) {.ast-no-sidebar .site-content .ast-article-image-container--wide {margin-left: -120px;margin-right: -120px;max-width: unset;width: unset;}.ast-left-sidebar .site-content .ast-article-image-container--wide,.ast-right-sidebar .site-content .ast-article-image-container--wide {margin-left: -10px;margin-right: -10px;}.site-content .ast-article-image-container--full {margin-left: calc( -50vw + 50%);margin-right: calc( -50vw + 50%);max-width: 100vw;width: 100vw;}.ast-left-sidebar .site-content .ast-article-image-container--full,.ast-right-sidebar .site-content .ast-article-image-container--full {margin-left: -10px;margin-right: -10px;max-width: inherit;width: auto;}}.site > .ast-single-related-posts-container {margin-top: 0;}@media (min-width: 922px) {.ast-desktop .ast-container--narrow {max-width: var(--ast-narrow-container-width);margin: 0 auto;}}.ast-page-builder-template .hentry {margin: 0;}.ast-page-builder-template .site-content > .ast-container {max-width: 100%;padding: 0;}.ast-page-builder-template .site .site-content #primary {padding: 0;margin: 0;}.ast-page-builder-template .no-results {text-align: center;margin: 4em auto;}.ast-page-builder-template .ast-pagination {padding: 2em;}.ast-page-builder-template .entry-header.ast-no-title.ast-no-thumbnail {margin-top: 0;}.ast-page-builder-template .entry-header.ast-header-without-markup {margin-top: 0;margin-bottom: 0;}.ast-page-builder-template .entry-header.ast-no-title.ast-no-meta {margin-bottom: 0;}.ast-page-builder-template.single .post-navigation {padding-bottom: 2em;}.ast-page-builder-template.single-post .site-content > .ast-container {max-width: 100%;}.ast-page-builder-template .entry-header {margin-top: 2em;margin-left: auto;margin-right: auto;}.ast-page-builder-template .ast-archive-description {margin: 2em auto 0;padding-left: 20px;padding-right: 20px;}.ast-page-builder-template .ast-row {margin-left: 0;margin-right: 0;}.single.ast-page-builder-template .entry-header + .entry-content,.single.ast-page-builder-template .ast-single-entry-banner + .site-content article .entry-content {margin-bottom: 2em;}@media(min-width: 921px) {.ast-page-builder-template.archive.ast-right-sidebar .ast-row article,.ast-page-builder-template.archive.ast-left-sidebar .ast-row article {padding-left: 0;padding-right: 0;}}input[type="text"],input[type="number"],input[type="email"],input[type="url"],input[type="password"],input[type="search"],input[type=reset],input[type=tel],input[type=date],select,textarea{font-size:16px;font-style:normal;font-weight:400;line-height:24px;width:100%;padding:12px 16px;border-radius:4px;box-shadow:0px 1px 2px 0px rgba(0,0,0,0.05);color:var(--ast-form-input-text,#475569);}input[type="text"],input[type="number"],input[type="email"],input[type="url"],input[type="password"],input[type="search"],input[type=reset],input[type=tel],input[type=date],select{height:40px;}input[type="date"]{border-width:1px;border-style:solid;border-color:var(--ast-border-color);background:var( --ast-global-color-secondary,--ast-global-color-5 );}input[type="text"]:focus,input[type="number"]:focus,input[type="email"]:focus,input[type="url"]:focus,input[type="password"]:focus,input[type="search"]:focus,input[type=reset]:focus,input[type="tel"]:focus,input[type="date"]:focus,select:focus,textarea:focus{border-color:#046BD2;box-shadow:none;outline:none;color:var(--ast-form-input-focus-text,#475569);}label,legend{color:var(--ast-global-color-2,#111827 );font-size:14px;font-style:normal;font-weight:500;line-height:20px;}select{padding:6px 10px;}fieldset{padding:30px;border-radius:4px;}button,.ast-button,.button,input[type="button"],input[type="reset"],input[type="submit"]{border-radius:4px;box-shadow:0px 1px 2px 0px rgba(0,0,0,0.05);}:root{--ast-comment-inputs-background:#FFF;}::placeholder{color:var(--ast-form-field-color,#9CA3AF);}::-ms-input-placeholder{color:var(--ast-form-field-color,#9CA3AF);}input[type="radio"].gfield-choice-input:checked,input[type="checkbox"].gfield-choice-input:checked,.ginput_container_consent input[type="checkbox"]:checked{border-color:inherit;background-color:inherit;}input[type="radio"].gfield-choice-input:focus,input[type="checkbox"].gfield-choice-input:focus,.ginput_container_consent input[type="checkbox"]:focus{border-style:disable;border-color:#046BD2;border-width:thin;box-shadow:none;outline:none;color:var(--ast-form-input-focus-text,#475569);}@media (max-width:921.9px){#ast-desktop-header{display:none;}}@media (min-width:922px){#ast-mobile-header{display:none;}}.wp-block-buttons.aligncenter{justify-content:center;}@media (max-width:921px){.ast-theme-transparent-header #primary,.ast-theme-transparent-header #secondary{padding:0;}}@media (max-width:921px){.ast-plain-container.ast-no-sidebar #primary{padding:0;}}.ast-plain-container.ast-no-sidebar #primary{margin-top:0;margin-bottom:0;}.ast-separate-container #primary,.ast-narrow-container #primary{padding-top:0px;}.ast-separate-container #primary,.ast-narrow-container #primary{padding-bottom:0px;}.wp-block-button.is-style-outline .wp-block-button__link{border-color:var(--ast-global-color-0);}div.wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color),div.wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color){color:var(--ast-global-color-0);}.wp-block-button.is-style-outline .wp-block-button__link:hover,.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link:focus,.wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color):hover,.wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color):hover{color:#ffffff;background-color:var(--ast-global-color-1);border-color:var(--ast-global-color-1);}.post-page-numbers.current .page-link,.ast-pagination .page-numbers.current{color:#ffffff;border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);}.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link.wp-element-button,.ast-outline-button,.wp-block-uagb-buttons-child .uagb-buttons-repeater.ast-outline-button{border-color:var(--ast-global-color-0);border-top-width:2px;border-right-width:2px;border-bottom-width:2px;border-left-width:2px;font-family:inherit;font-weight:500;font-size:16px;font-size:0.88888888888889rem;line-height:1em;padding-top:13px;padding-right:30px;padding-bottom:13px;padding-left:30px;}.wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color),.wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color),.ast-outline-button{color:var(--ast-global-color-0);}.wp-block-button.is-style-outline .wp-block-button__link:hover,.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link:focus,.wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color):hover,.wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color):hover,.ast-outline-button:hover,.ast-outline-button:focus,.wp-block-uagb-buttons-child .uagb-buttons-repeater.ast-outline-button:hover,.wp-block-uagb-buttons-child .uagb-buttons-repeater.ast-outline-button:focus{color:#ffffff;background-color:var(--ast-global-color-1);border-color:var(--ast-global-color-1);}.wp-block-button .wp-block-button__link.wp-element-button.is-style-outline:not(.has-background),.wp-block-button.is-style-outline>.wp-block-button__link.wp-element-button:not(.has-background),.ast-outline-button{background-color:transparent;}.uagb-buttons-repeater.ast-outline-button{border-radius:9999px;}@media (max-width:921px){.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link.wp-element-button,.ast-outline-button,.wp-block-uagb-buttons-child .uagb-buttons-repeater.ast-outline-button{padding-top:12px;padding-right:28px;padding-bottom:12px;padding-left:28px;}}@media (max-width:544px){.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link.wp-element-button,.ast-outline-button,.wp-block-uagb-buttons-child .uagb-buttons-repeater.ast-outline-button{padding-top:10px;padding-right:24px;padding-bottom:10px;padding-left:24px;}}.entry-content[data-ast-blocks-layout] > figure{margin-bottom:1em;}h1.widget-title{font-weight:600;}h2.widget-title{font-weight:600;}h3.widget-title{font-weight:600;}.elementor-widget-container .elementor-loop-container .e-loop-item[data-elementor-type="loop-item"]{width:100%;} .content-area .elementor-widget-theme-post-content h1,.content-area .elementor-widget-theme-post-content h2,.content-area .elementor-widget-theme-post-content h3,.content-area .elementor-widget-theme-post-content h4,.content-area .elementor-widget-theme-post-content h5,.content-area .elementor-widget-theme-post-content h6{margin-top:1.5em;margin-bottom:calc(0.3em + 10px);}#page{display:flex;flex-direction:column;min-height:100vh;}.ast-404-layout-1 h1.page-title{color:var(--ast-global-color-2);}.single .post-navigation a{line-height:1em;height:inherit;}.error-404 .page-sub-title{font-size:1.5rem;font-weight:inherit;}.search .site-content .content-area .search-form{margin-bottom:0;}#page .site-content{flex-grow:1;}.widget{margin-bottom:1.25em;}#secondary li{line-height:1.5em;}#secondary .wp-block-group h2{margin-bottom:0.7em;}#secondary h2{font-size:1.7rem;}.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .comment-respond{padding:3em;}.ast-separate-container .ast-article-single .ast-article-single{padding:0;}.ast-article-single .wp-block-post-template-is-layout-grid{padding-left:0;}.ast-separate-container .comments-title,.ast-narrow-container .comments-title{padding:1.5em 2em;}.ast-page-builder-template .comment-form-textarea,.ast-comment-formwrap .ast-grid-common-col{padding:0;}.ast-comment-formwrap{padding:0;display:inline-flex;column-gap:20px;width:100%;margin-left:0;margin-right:0;}.comments-area textarea#comment:focus,.comments-area textarea#comment:active,.comments-area .ast-comment-formwrap input[type="text"]:focus,.comments-area .ast-comment-formwrap input[type="text"]:active {box-shadow:none;outline:none;}.archive.ast-page-builder-template .entry-header{margin-top:2em;}.ast-page-builder-template .ast-comment-formwrap{width:100%;}.entry-title{margin-bottom:0.6em;}.ast-archive-description p{font-size:inherit;font-weight:inherit;line-height:inherit;}.ast-separate-container .ast-comment-list li.depth-1,.hentry{margin-bottom:1.5em;}.site-content section.ast-archive-description{margin-bottom:2em;}@media (min-width:921px){.ast-left-sidebar.ast-page-builder-template #secondary,.archive.ast-right-sidebar.ast-page-builder-template .site-main{padding-left:20px;padding-right:20px;}}@media (max-width:544px){.ast-comment-formwrap.ast-row{column-gap:10px;display:inline-block;}#ast-commentform .ast-grid-common-col{position:relative;width:100%;}}@media (min-width:1201px){.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .ast-author-box,.ast-separate-container .ast-404-layout-1,.ast-separate-container .no-results{padding:3em;}} .content-area .elementor-widget-theme-post-content h1,.content-area .elementor-widget-theme-post-content h2,.content-area .elementor-widget-theme-post-content h3,.content-area .elementor-widget-theme-post-content h4,.content-area .elementor-widget-theme-post-content h5,.content-area .elementor-widget-theme-post-content h6{margin-top:1.5em;margin-bottom:calc(0.3em + 10px);}.elementor-loop-container .e-loop-item,.elementor-loop-container .ast-separate-container .ast-article-post,.elementor-loop-container .ast-separate-container .ast-article-single,.elementor-loop-container .ast-separate-container .comment-respond{padding:0px;}@media (max-width:921px){.ast-left-sidebar #content > .ast-container{display:flex;flex-direction:column-reverse;width:100%;}}@media (min-width:922px){.ast-separate-container.ast-right-sidebar #primary,.ast-separate-container.ast-left-sidebar #primary{border:0;}.search-no-results.ast-separate-container #primary{margin-bottom:4em;}}.elementor-widget-button .elementor-button{border-style:solid;text-decoration:none;border-top-width:0;border-right-width:0;border-left-width:0;border-bottom-width:0;}.elementor-button.elementor-size-sm,.elementor-button.elementor-size-xs,.elementor-button.elementor-size-md,.elementor-button.elementor-size-lg,.elementor-button.elementor-size-xl,.elementor-button{padding-top:15px;padding-right:30px;padding-bottom:15px;padding-left:30px;}@media (max-width:921px){.elementor-widget-button .elementor-button.elementor-size-sm,.elementor-widget-button .elementor-button.elementor-size-xs,.elementor-widget-button .elementor-button.elementor-size-md,.elementor-widget-button .elementor-button.elementor-size-lg,.elementor-widget-button .elementor-button.elementor-size-xl,.elementor-widget-button .elementor-button{padding-top:14px;padding-right:28px;padding-bottom:14px;padding-left:28px;}}@media (max-width:544px){.elementor-widget-button .elementor-button.elementor-size-sm,.elementor-widget-button .elementor-button.elementor-size-xs,.elementor-widget-button .elementor-button.elementor-size-md,.elementor-widget-button .elementor-button.elementor-size-lg,.elementor-widget-button .elementor-button.elementor-size-xl,.elementor-widget-button .elementor-button{padding-top:12px;padding-right:24px;padding-bottom:12px;padding-left:24px;}}.elementor-widget-button .elementor-button{border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);}.elementor-widget-button .elementor-button:hover,.elementor-widget-button .elementor-button:focus{color:#ffffff;background-color:var(--ast-global-color-1);border-color:var(--ast-global-color-1);}.wp-block-button .wp-block-button__link ,.elementor-widget-button .elementor-button,.elementor-widget-button .elementor-button:visited{color:#ffffff;}.elementor-widget-button .elementor-button{font-weight:500;font-size:16px;font-size:0.88888888888889rem;line-height:1em;}body .elementor-button.elementor-size-sm,body .elementor-button.elementor-size-xs,body .elementor-button.elementor-size-md,body .elementor-button.elementor-size-lg,body .elementor-button.elementor-size-xl,body .elementor-button{font-size:16px;font-size:0.88888888888889rem;}.wp-block-button .wp-block-button__link:hover,.wp-block-button .wp-block-button__link:focus{color:#ffffff;background-color:var(--ast-global-color-1);border-color:var(--ast-global-color-1);}.elementor-widget-heading h1.elementor-heading-title{line-height:1.4em;}.elementor-widget-heading h2.elementor-heading-title{line-height:1.3em;}.elementor-widget-heading h3.elementor-heading-title{line-height:1.3em;}.elementor-widget-heading h4.elementor-heading-title{line-height:1.2em;}.elementor-widget-heading h5.elementor-heading-title{line-height:1.2em;}.elementor-widget-heading h6.elementor-heading-title{line-height:1.25em;}.wp-block-button .wp-block-button__link,.wp-block-search .wp-block-search__button,body .wp-block-file .wp-block-file__button{border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);color:#ffffff;font-family:inherit;font-weight:500;line-height:1em;font-size:16px;font-size:0.88888888888889rem;padding-top:15px;padding-right:30px;padding-bottom:15px;padding-left:30px;}@media (max-width:921px){.wp-block-button .wp-block-button__link,.wp-block-search .wp-block-search__button,body .wp-block-file .wp-block-file__button{padding-top:14px;padding-right:28px;padding-bottom:14px;padding-left:28px;}}@media (max-width:544px){.wp-block-button .wp-block-button__link,.wp-block-search .wp-block-search__button,body .wp-block-file .wp-block-file__button{padding-top:12px;padding-right:24px;padding-bottom:12px;padding-left:24px;}}.menu-toggle,button,.ast-button,.ast-custom-button,.button,input#submit,input[type="button"],input[type="submit"],input[type="reset"],#comments .submit,.search .search-submit,form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button,body .wp-block-file .wp-block-file__button,.search .search-submit{border-style:solid;border-top-width:0;border-right-width:0;border-left-width:0;border-bottom-width:0;color:#ffffff;border-color:var(--ast-global-color-0);background-color:var(--ast-global-color-0);padding-top:15px;padding-right:30px;padding-bottom:15px;padding-left:30px;font-family:inherit;font-weight:500;font-size:16px;font-size:0.88888888888889rem;line-height:1em;}button:focus,.menu-toggle:hover,button:hover,.ast-button:hover,.ast-custom-button:hover .button:hover,.ast-custom-button:hover ,input[type=reset]:hover,input[type=reset]:focus,input#submit:hover,input#submit:focus,input[type="button"]:hover,input[type="button"]:focus,input[type="submit"]:hover,input[type="submit"]:focus,form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button:hover,form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button:focus,body .wp-block-file .wp-block-file__button:hover,body .wp-block-file .wp-block-file__button:focus{color:#ffffff;background-color:var(--ast-global-color-1);border-color:var(--ast-global-color-1);}form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button.has-icon{padding-top:calc(15px - 3px);padding-right:calc(30px - 3px);padding-bottom:calc(15px - 3px);padding-left:calc(30px - 3px);}@media (max-width:921px){.menu-toggle,button,.ast-button,.ast-custom-button,.button,input#submit,input[type="button"],input[type="submit"],input[type="reset"],#comments .submit,.search .search-submit,form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button,body .wp-block-file .wp-block-file__button,.search .search-submit{padding-top:14px;padding-right:28px;padding-bottom:14px;padding-left:28px;}}@media (max-width:544px){.menu-toggle,button,.ast-button,.ast-custom-button,.button,input#submit,input[type="button"],input[type="submit"],input[type="reset"],#comments .submit,.search .search-submit,form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button,body .wp-block-file .wp-block-file__button,.search .search-submit{padding-top:12px;padding-right:24px;padding-bottom:12px;padding-left:24px;}}@media (max-width:921px){.ast-mobile-header-stack .main-header-bar .ast-search-menu-icon{display:inline-block;}.ast-header-break-point.ast-header-custom-item-outside .ast-mobile-header-stack .main-header-bar .ast-search-icon{margin:0;}.ast-comment-avatar-wrap img{max-width:2.5em;}.ast-comment-meta{padding:0 1.8888em 1.3333em;}}@media (min-width:544px){.ast-container{max-width:100%;}}@media (max-width:544px){.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .comments-title,.ast-separate-container .ast-archive-description{padding:1.5em 1em;}.ast-separate-container #content .ast-container{padding-left:0.54em;padding-right:0.54em;}.ast-separate-container .ast-comment-list .bypostauthor{padding:.5em;}.ast-search-menu-icon.ast-dropdown-active .search-field{width:170px;}} #ast-mobile-header .ast-site-header-cart-li a{pointer-events:none;}.ast-separate-container{background-color:var(--ast-global-color-5);}@media (max-width:921px){.site-title{display:none;}.site-header .site-description{display:none;}h1,.entry-content :where(h1){font-size:30px;font-size:1.6666666666667rem;}h2,.entry-content :where(h2){font-size:25px;font-size:1.3888888888889rem;}h3,.entry-content :where(h3){font-size:20px;font-size:1.1111111111111rem;}}@media (max-width:544px){.site-title{display:none;}.site-header .site-description{display:none;}h1,.entry-content :where(h1){font-size:30px;font-size:1.6666666666667rem;}h2,.entry-content :where(h2){font-size:25px;font-size:1.3888888888889rem;}h3,.entry-content :where(h3){font-size:20px;font-size:1.1111111111111rem;}}@media (max-width:921px){html{font-size:102.6%;}}@media (max-width:544px){html{font-size:102.6%;}}@media (min-width:922px){.ast-container{max-width:1240px;}}@media (min-width:922px){.site-content .ast-container{display:flex;}}@media (max-width:921px){.site-content .ast-container{flex-direction:column;}}.entry-content :where(h1,h2,h3,h4,h5,h6){clear:none;}@media (min-width:922px){.main-header-menu .sub-menu .menu-item.ast-left-align-sub-menu:hover > .sub-menu,.main-header-menu .sub-menu .menu-item.ast-left-align-sub-menu.focus > .sub-menu{margin-left:-0px;}}.entry-content li > p{margin-bottom:0;}.wp-block-file {display: flex;align-items: center;flex-wrap: wrap;justify-content: space-between;}.wp-block-pullquote {border: none;}.wp-block-pullquote blockquote::before {content: "\201D";font-family: "Helvetica",sans-serif;display: flex;transform: rotate( 180deg );font-size: 6rem;font-style: normal;line-height: 1;font-weight: bold;align-items: center;justify-content: center;}.has-text-align-right > blockquote::before {justify-content: flex-start;}.has-text-align-left > blockquote::before {justify-content: flex-end;}figure.wp-block-pullquote.is-style-solid-color blockquote {max-width: 100%;text-align: inherit;}:root {--wp--custom--ast-default-block-top-padding: 3em;--wp--custom--ast-default-block-right-padding: 3em;--wp--custom--ast-default-block-bottom-padding: 3em;--wp--custom--ast-default-block-left-padding: 3em;--wp--custom--ast-container-width: 1200px;--wp--custom--ast-content-width-size: 1200px;--wp--custom--ast-wide-width-size: calc(1200px + var(--wp--custom--ast-default-block-left-padding) + var(--wp--custom--ast-default-block-right-padding));}.ast-narrow-container {--wp--custom--ast-content-width-size: 750px;--wp--custom--ast-wide-width-size: 750px;}@media(max-width: 921px) {:root {--wp--custom--ast-default-block-top-padding: 3em;--wp--custom--ast-default-block-right-padding: 2em;--wp--custom--ast-default-block-bottom-padding: 3em;--wp--custom--ast-default-block-left-padding: 2em;}}@media(max-width: 544px) {:root {--wp--custom--ast-default-block-top-padding: 3em;--wp--custom--ast-default-block-right-padding: 1.5em;--wp--custom--ast-default-block-bottom-padding: 3em;--wp--custom--ast-default-block-left-padding: 1.5em;}}.entry-content > .wp-block-group,.entry-content > .wp-block-cover,.entry-content > .wp-block-columns {padding-top: var(--wp--custom--ast-default-block-top-padding);padding-right: var(--wp--custom--ast-default-block-right-padding);padding-bottom: var(--wp--custom--ast-default-block-bottom-padding);padding-left: var(--wp--custom--ast-default-block-left-padding);}.ast-plain-container.ast-no-sidebar .entry-content > .alignfull,.ast-page-builder-template .ast-no-sidebar .entry-content > .alignfull {margin-left: calc( -50vw + 50%);margin-right: calc( -50vw + 50%);max-width: 100vw;width: 100vw;}.ast-plain-container.ast-no-sidebar .entry-content .alignfull .alignfull,.ast-page-builder-template.ast-no-sidebar .entry-content .alignfull .alignfull,.ast-plain-container.ast-no-sidebar .entry-content .alignfull .alignwide,.ast-page-builder-template.ast-no-sidebar .entry-content .alignfull .alignwide,.ast-plain-container.ast-no-sidebar .entry-content .alignwide .alignfull,.ast-page-builder-template.ast-no-sidebar .entry-content .alignwide .alignfull,.ast-plain-container.ast-no-sidebar .entry-content .alignwide .alignwide,.ast-page-builder-template.ast-no-sidebar .entry-content .alignwide .alignwide,.ast-plain-container.ast-no-sidebar .entry-content .wp-block-column .alignfull,.ast-page-builder-template.ast-no-sidebar .entry-content .wp-block-column .alignfull,.ast-plain-container.ast-no-sidebar .entry-content .wp-block-column .alignwide,.ast-page-builder-template.ast-no-sidebar .entry-content .wp-block-column .alignwide {margin-left: auto;margin-right: auto;width: 100%;}[data-ast-blocks-layout] .wp-block-separator:not(.is-style-dots) {height: 0;}[data-ast-blocks-layout] .wp-block-separator {margin: 20px auto;}[data-ast-blocks-layout] .wp-block-separator:not(.is-style-wide):not(.is-style-dots) {max-width: 100px;}[data-ast-blocks-layout] .wp-block-separator.has-background {padding: 0;}.entry-content[data-ast-blocks-layout] > * {max-width: var(--wp--custom--ast-content-width-size);margin-left: auto;margin-right: auto;}.entry-content[data-ast-blocks-layout] > .alignwide {max-width: var(--wp--custom--ast-wide-width-size);}.entry-content[data-ast-blocks-layout] .alignfull {max-width: none;}.entry-content .wp-block-columns {margin-bottom: 0;}blockquote {margin: 1.5em;border-color: rgba(0,0,0,0.05);}.wp-block-quote:not(.has-text-align-right):not(.has-text-align-center) {border-left: 5px solid rgba(0,0,0,0.05);}.has-text-align-right > blockquote,blockquote.has-text-align-right {border-right: 5px solid rgba(0,0,0,0.05);}.has-text-align-left > blockquote,blockquote.has-text-align-left {border-left: 5px solid rgba(0,0,0,0.05);}.wp-block-site-tagline,.wp-block-latest-posts .read-more {margin-top: 15px;}.wp-block-loginout p label {display: block;}.wp-block-loginout p:not(.login-remember):not(.login-submit) input {width: 100%;}.wp-block-loginout input:focus {border-color: transparent;}.wp-block-loginout input:focus {outline: thin dotted;}.entry-content .wp-block-media-text .wp-block-media-text__content {padding: 0 0 0 8%;}.entry-content .wp-block-media-text.has-media-on-the-right .wp-block-media-text__content {padding: 0 8% 0 0;}.entry-content .wp-block-media-text.has-background .wp-block-media-text__content {padding: 8%;}.entry-content .wp-block-cover:not([class*="background-color"]):not(.has-text-color.has-link-color) .wp-block-cover__inner-container,.entry-content .wp-block-cover:not([class*="background-color"]) .wp-block-cover-image-text,.entry-content .wp-block-cover:not([class*="background-color"]) .wp-block-cover-text,.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover__inner-container,.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover-image-text,.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover-text {color: var(--ast-global-color-primary,var(--ast-global-color-5));}.wp-block-loginout .login-remember input {width: 1.1rem;height: 1.1rem;margin: 0 5px 4px 0;vertical-align: middle;}.wp-block-latest-posts > li > *:first-child,.wp-block-latest-posts:not(.is-grid) > li:first-child {margin-top: 0;}.entry-content > .wp-block-buttons,.entry-content > .wp-block-uagb-buttons {margin-bottom: 1.5em;}.wp-block-search__inside-wrapper .wp-block-search__input {padding: 0 10px;color: var(--ast-global-color-3);background: var(--ast-global-color-primary,var(--ast-global-color-5));border-color: var(--ast-border-color);}.wp-block-latest-posts .read-more {margin-bottom: 1.5em;}.wp-block-search__no-button .wp-block-search__inside-wrapper .wp-block-search__input {padding-top: 5px;padding-bottom: 5px;}.wp-block-latest-posts .wp-block-latest-posts__post-date,.wp-block-latest-posts .wp-block-latest-posts__post-author {font-size: 1rem;}.wp-block-latest-posts > li > *,.wp-block-latest-posts:not(.is-grid) > li {margin-top: 12px;margin-bottom: 12px;}.ast-page-builder-template .entry-content[data-ast-blocks-layout] > .alignwide:where(:not(.uagb-is-root-container):not(.spectra-is-root-container)) > * {max-width: var(--wp--custom--ast-wide-width-size);}.ast-page-builder-template .entry-content[data-ast-blocks-layout] > .inherit-container-width > *,.ast-page-builder-template .entry-content[data-ast-blocks-layout] > *:not(.wp-block-group):where(:not(.uagb-is-root-container):not(.spectra-is-root-container)) > *,.entry-content[data-ast-blocks-layout] > .wp-block-cover .wp-block-cover__inner-container {max-width: none ;margin-left: auto;margin-right: auto;}.ast-page-builder-template .entry-content[data-ast-blocks-layout] > *,.ast-page-builder-template .entry-content[data-ast-blocks-layout] > .alignfull:where(:not(.wp-block-group):not(.uagb-is-root-container):not(.spectra-is-root-container)) > * {max-width: none;}.entry-content[data-ast-blocks-layout] .wp-block-cover:not(.alignleft):not(.alignright) {width: auto;}@media(max-width: 1200px) {.ast-separate-container .entry-content > .alignfull,.ast-separate-container .entry-content[data-ast-blocks-layout] > .alignwide,.ast-plain-container .entry-content[data-ast-blocks-layout] > .alignwide,.ast-plain-container .entry-content .alignfull {margin-left: calc(-1 * min(0px,20px)) ;margin-right: calc(-1 * min(0px,20px));}}@media(min-width: 1201px) {.ast-separate-container .entry-content > .alignfull {margin-left: calc(-1 * 0px );margin-right: calc(-1 * 0px );}.ast-separate-container .entry-content[data-ast-blocks-layout] > .alignwide,.ast-plain-container .entry-content[data-ast-blocks-layout] > .alignwide {margin-left: auto;margin-right: auto;}}@media(min-width: 921px) {.ast-separate-container .entry-content .wp-block-group.alignwide:not(.inherit-container-width) > :where(:not(.alignleft):not(.alignright)),.ast-plain-container .entry-content .wp-block-group.alignwide:not(.inherit-container-width) > :where(:not(.alignleft):not(.alignright)) {max-width: calc( var(--wp--custom--ast-content-width-size) + 80px );}.ast-plain-container.ast-right-sidebar .entry-content[data-ast-blocks-layout] .alignfull,.ast-plain-container.ast-left-sidebar .entry-content[data-ast-blocks-layout] .alignfull {margin-left: -60px;margin-right: -60px;}}@media(min-width: 544px) {.entry-content > .alignleft {margin-right: 20px;}.entry-content > .alignright {margin-left: 20px;}}@media (max-width:544px){.wp-block-columns .wp-block-column:not(:last-child){margin-bottom:20px;}.wp-block-latest-posts{margin:0;}}@media( max-width: 600px ) {.entry-content .wp-block-media-text .wp-block-media-text__content,.entry-content .wp-block-media-text.has-media-on-the-right .wp-block-media-text__content {padding: 8% 0 0;}.entry-content .wp-block-media-text.has-background .wp-block-media-text__content {padding: 8%;}}.ast-page-builder-template .entry-header {padding-left: 0;}.ast-narrow-container .site-content .wp-block-uagb-image--align-full .wp-block-uagb-image__figure {max-width: 100%;margin-left: auto;margin-right: auto;}.entry-content ul,.entry-content ol {padding: revert;margin: revert;padding-left: 20px;}.entry-content ul.wc-block-product-template{padding: 0;}:root .has-ast-global-color-0-color{color:var(--ast-global-color-0);}:root .has-ast-global-color-0-background-color{background-color:var(--ast-global-color-0);}:root .wp-block-button .has-ast-global-color-0-color{color:var(--ast-global-color-0);}:root .wp-block-button .has-ast-global-color-0-background-color{background-color:var(--ast-global-color-0);}:root .has-ast-global-color-1-color{color:var(--ast-global-color-1);}:root .has-ast-global-color-1-background-color{background-color:var(--ast-global-color-1);}:root .wp-block-button .has-ast-global-color-1-color{color:var(--ast-global-color-1);}:root .wp-block-button .has-ast-global-color-1-background-color{background-color:var(--ast-global-color-1);}:root .has-ast-global-color-2-color{color:var(--ast-global-color-2);}:root .has-ast-global-color-2-background-color{background-color:var(--ast-global-color-2);}:root .wp-block-button .has-ast-global-color-2-color{color:var(--ast-global-color-2);}:root .wp-block-button .has-ast-global-color-2-background-color{background-color:var(--ast-global-color-2);}:root .has-ast-global-color-3-color{color:var(--ast-global-color-3);}:root .has-ast-global-color-3-background-color{background-color:var(--ast-global-color-3);}:root .wp-block-button .has-ast-global-color-3-color{color:var(--ast-global-color-3);}:root .wp-block-button .has-ast-global-color-3-background-color{background-color:var(--ast-global-color-3);}:root .has-ast-global-color-4-color{color:var(--ast-global-color-4);}:root .has-ast-global-color-4-background-color{background-color:var(--ast-global-color-4);}:root .wp-block-button .has-ast-global-color-4-color{color:var(--ast-global-color-4);}:root .wp-block-button .has-ast-global-color-4-background-color{background-color:var(--ast-global-color-4);}:root .has-ast-global-color-5-color{color:var(--ast-global-color-5);}:root .has-ast-global-color-5-background-color{background-color:var(--ast-global-color-5);}:root .wp-block-button .has-ast-global-color-5-color{color:var(--ast-global-color-5);}:root .wp-block-button .has-ast-global-color-5-background-color{background-color:var(--ast-global-color-5);}:root .has-ast-global-color-6-color{color:var(--ast-global-color-6);}:root .has-ast-global-color-6-background-color{background-color:var(--ast-global-color-6);}:root .wp-block-button .has-ast-global-color-6-color{color:var(--ast-global-color-6);}:root .wp-block-button .has-ast-global-color-6-background-color{background-color:var(--ast-global-color-6);}:root .has-ast-global-color-7-color{color:var(--ast-global-color-7);}:root .has-ast-global-color-7-background-color{background-color:var(--ast-global-color-7);}:root .wp-block-button .has-ast-global-color-7-color{color:var(--ast-global-color-7);}:root .wp-block-button .has-ast-global-color-7-background-color{background-color:var(--ast-global-color-7);}:root .has-ast-global-color-8-color{color:var(--ast-global-color-8);}:root .has-ast-global-color-8-background-color{background-color:var(--ast-global-color-8);}:root .wp-block-button .has-ast-global-color-8-color{color:var(--ast-global-color-8);}:root .wp-block-button .has-ast-global-color-8-background-color{background-color:var(--ast-global-color-8);}:root{--ast-global-color-0:#046bd2;--ast-global-color-1:#045cb4;--ast-global-color-2:#1e293b;--ast-global-color-3:#334155;--ast-global-color-4:#FFFFFF;--ast-global-color-5:#F0F5FA;--ast-global-color-6:#111111;--ast-global-color-7:#D1D5DB;--ast-global-color-8:#111111;}:root {--ast-border-color : var(--ast-global-color-7);}.ast-archive-entry-banner {-js-display: flex;display: flex;flex-direction: column;justify-content: center;text-align: center;position: relative;background: var(--ast-title-layout-bg);}.ast-archive-entry-banner[data-banner-width-type="custom"] {margin: 0 auto;width: 100%;}.ast-archive-entry-banner[data-banner-layout="layout-1"] {background: inherit;padding: 20px 0;text-align: left;}body.archive .ast-archive-description{max-width:1200px;width:100%;text-align:left;padding-top:3em;padding-right:3em;padding-bottom:3em;padding-left:3em;}body.archive .ast-archive-description .ast-archive-title,body.archive .ast-archive-description .ast-archive-title *{font-weight:600;font-size:32px;font-size:1.7777777777778rem;}body.archive .ast-archive-description > *:not(:last-child){margin-bottom:10px;}@media (max-width:921px){body.archive .ast-archive-description{text-align:left;}}@media (max-width:544px){body.archive .ast-archive-description{text-align:left;}}.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg{width:150px;}.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img{ max-width:150px; width:150px;}@media (max-width:921px){.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg{width:120px;}.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img{ max-width:120px; width:120px;}}@media (max-width:543px){.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg{width:100px;}.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img{ max-width:100px; width:100px;}}@media (min-width:921px){.ast-theme-transparent-header #masthead{position:absolute;left:0;right:0;}.ast-theme-transparent-header .main-header-bar,.ast-theme-transparent-header.ast-header-break-point .main-header-bar{background:none;}body.elementor-editor-active.ast-theme-transparent-header #masthead,.fl-builder-edit .ast-theme-transparent-header #masthead,body.vc_editor.ast-theme-transparent-header #masthead,body.brz-ed.ast-theme-transparent-header #masthead{z-index:0;}.ast-header-break-point.ast-replace-site-logo-transparent.ast-theme-transparent-header .custom-mobile-logo-link{display:none;}.ast-header-break-point.ast-replace-site-logo-transparent.ast-theme-transparent-header .transparent-custom-logo{display:inline-block;}.ast-theme-transparent-header .ast-above-header,.ast-theme-transparent-header .ast-above-header.ast-above-header-bar{background-image:none;background-color:transparent;}.ast-theme-transparent-header .ast-below-header,.ast-theme-transparent-header .ast-below-header.ast-below-header-bar{background-image:none;background-color:transparent;}}.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-link,.ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link{background-color:transparent;}@media (max-width:921px){.ast-theme-transparent-header #masthead{position:absolute;left:0;right:0;}.ast-theme-transparent-header .main-header-bar,.ast-theme-transparent-header.ast-header-break-point .main-header-bar{background:none;}body.elementor-editor-active.ast-theme-transparent-header #masthead,.fl-builder-edit .ast-theme-transparent-header #masthead,body.vc_editor.ast-theme-transparent-header #masthead,body.brz-ed.ast-theme-transparent-header #masthead{z-index:0;}.ast-header-break-point.ast-replace-site-logo-transparent.ast-theme-transparent-header .custom-mobile-logo-link{display:none;}.ast-header-break-point.ast-replace-site-logo-transparent.ast-theme-transparent-header .transparent-custom-logo{display:inline-block;}.ast-theme-transparent-header .ast-above-header,.ast-theme-transparent-header .ast-above-header.ast-above-header-bar{background-image:none;background-color:transparent;}.ast-theme-transparent-header .ast-below-header,.ast-theme-transparent-header .ast-below-header.ast-below-header-bar{background-image:none;background-color:transparent;}}.ast-theme-transparent-header #ast-desktop-header > .ast-main-header-wrap > .main-header-bar,.ast-theme-transparent-header.ast-header-break-point #ast-mobile-header > .ast-main-header-wrap > .main-header-bar{border-bottom-width:0px;border-bottom-style:solid;}.ast-breadcrumbs .trail-browse,.ast-breadcrumbs .trail-items,.ast-breadcrumbs .trail-items li{display:inline-block;margin:0;padding:0;border:none;background:inherit;text-indent:0;text-decoration:none;}.ast-breadcrumbs .trail-browse{font-size:inherit;font-style:inherit;font-weight:inherit;color:inherit;}.ast-breadcrumbs .trail-items{list-style:none;}.trail-items li::after{padding:0 0.3em;content:"\00bb";}.trail-items li:last-of-type::after{display:none;}h1,h2,h3,h4,h5,h6,.entry-content :where(h1,h2,h3,h4,h5,h6){color:var(--ast-global-color-2);}.entry-title a{color:var(--ast-global-color-2);}@media (max-width:921px){.ast-builder-grid-row-container.ast-builder-grid-row-tablet-3-firstrow .ast-builder-grid-row > *:first-child,.ast-builder-grid-row-container.ast-builder-grid-row-tablet-3-lastrow .ast-builder-grid-row > *:last-child{grid-column:1 / -1;}}@media (max-width:544px){.ast-builder-grid-row-container.ast-builder-grid-row-mobile-3-firstrow .ast-builder-grid-row > *:first-child,.ast-builder-grid-row-container.ast-builder-grid-row-mobile-3-lastrow .ast-builder-grid-row > *:last-child{grid-column:1 / -1;}}.ast-builder-layout-element .ast-site-identity{margin-top:0px;margin-bottom:0px;margin-right:20px;}@media (max-width:921px){.ast-builder-layout-element .ast-site-identity{margin-left:0px;}}.ast-builder-layout-element[data-section="title_tagline"]{display:flex;}@media (max-width:921px){.ast-header-break-point .ast-builder-layout-element[data-section="title_tagline"]{display:flex;}}@media (max-width:544px){.ast-header-break-point .ast-builder-layout-element[data-section="title_tagline"]{display:flex;}}.ast-builder-menu-1{font-family:'Roboto',sans-serif;font-weight:500;text-transform:uppercase;}.ast-builder-menu-1 .menu-item > .menu-link{line-height:16px;font-size:16px;font-size:0.88888888888889rem;color:var(--ast-global-color-4);padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:30px;}.ast-builder-menu-1 .menu-item > .ast-menu-toggle{color:var(--ast-global-color-4);}.ast-builder-menu-1 .menu-item:hover > .menu-link,.ast-builder-menu-1 .inline-on-mobile .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-4);}.ast-builder-menu-1 .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-4);}.ast-builder-menu-1 .menu-item.current-menu-item > .menu-link,.ast-builder-menu-1 .inline-on-mobile .menu-item.current-menu-item > .ast-menu-toggle,.ast-builder-menu-1 .current-menu-ancestor > .menu-link{color:var(--ast-global-color-4);}.ast-builder-menu-1 .menu-item.current-menu-item > .ast-menu-toggle{color:var(--ast-global-color-4);}.ast-builder-menu-1 .sub-menu,.ast-builder-menu-1 .inline-on-mobile .sub-menu{border-top-width:2px;border-bottom-width:0px;border-right-width:0px;border-left-width:0px;border-color:var(--ast-global-color-0);border-style:solid;}.ast-builder-menu-1 .sub-menu .sub-menu{top:-2px;}.ast-builder-menu-1 .main-header-menu > .menu-item > .sub-menu,.ast-builder-menu-1 .main-header-menu > .menu-item > .astra-full-megamenu-wrapper{margin-top:0px;}.ast-desktop .ast-builder-menu-1 .main-header-menu > .menu-item > .sub-menu:before,.ast-desktop .ast-builder-menu-1 .main-header-menu > .menu-item > .astra-full-megamenu-wrapper:before{height:calc( 0px + 2px + 5px );}.ast-builder-menu-1 .menu-item.menu-item-has-children > .ast-menu-toggle{top:0px;right:calc( 30px - 0.907em );}.ast-desktop .ast-builder-menu-1 .menu-item .sub-menu .menu-link{border-style:none;}@media (max-width:921px){.ast-header-break-point .ast-builder-menu-1 .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}.ast-builder-menu-1 .inline-on-mobile .menu-item.menu-item-has-children > .ast-menu-toggle{right:-15px;}.ast-builder-menu-1 .menu-item-has-children > .menu-link:after{content:unset;}.ast-builder-menu-1 .main-header-menu > .menu-item > .sub-menu,.ast-builder-menu-1 .main-header-menu > .menu-item > .astra-full-megamenu-wrapper{margin-top:0;}}@media (max-width:544px){.ast-header-break-point .ast-builder-menu-1 .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}.ast-builder-menu-1 .main-header-menu > .menu-item > .sub-menu,.ast-builder-menu-1 .main-header-menu > .menu-item > .astra-full-megamenu-wrapper{margin-top:0;}}.ast-builder-menu-1{display:flex;}@media (max-width:921px){.ast-header-break-point .ast-builder-menu-1{display:flex;}}@media (max-width:544px){.ast-header-break-point .ast-builder-menu-1{display:flex;}}.ast-desktop .ast-menu-hover-style-underline > .menu-item > .menu-link:before,.ast-desktop .ast-menu-hover-style-overline > .menu-item > .menu-link:before {content: "";position: absolute;width: 100%;right: 50%;height: 1px;background-color: transparent;transform: scale(0,0) translate(-50%,0);transition: transform .3s ease-in-out,color .0s ease-in-out;}.ast-desktop .ast-menu-hover-style-underline > .menu-item:hover > .menu-link:before,.ast-desktop .ast-menu-hover-style-overline > .menu-item:hover > .menu-link:before {width: calc(100% - 1.2em);background-color: currentColor;transform: scale(1,1) translate(50%,0);}.ast-desktop .ast-menu-hover-style-underline > .menu-item > .menu-link:before {bottom: 0;}.ast-desktop .ast-menu-hover-style-overline > .menu-item > .menu-link:before {top: 0;}.ast-desktop .ast-menu-hover-style-zoom > .menu-item > .menu-link:hover {transition: all .3s ease;transform: scale(1.2);}.footer-widget-area.widget-area.site-footer-focus-item{width:auto;}.ast-footer-row-inline .footer-widget-area.widget-area.site-footer-focus-item{width:100%;}.elementor-widget-heading .elementor-heading-title{margin:0;}.elementor-page .ast-menu-toggle{color:unset !important;background:unset !important;}.elementor-post.elementor-grid-item.hentry{margin-bottom:0;}.woocommerce div.product .elementor-element.elementor-products-grid .related.products ul.products li.product,.elementor-element .elementor-wc-products .woocommerce[class*='columns-'] ul.products li.product{width:auto;margin:0;float:none;}.elementor-toc__list-wrapper{margin:0;}body .elementor hr{background-color:#ccc;margin:0;}.ast-left-sidebar .elementor-section.elementor-section-stretched,.ast-right-sidebar .elementor-section.elementor-section-stretched{max-width:100%;left:0 !important;}.elementor-posts-container [CLASS*="ast-width-"]{width:100%;}.elementor-template-full-width .ast-container{display:block;}.elementor-screen-only,.screen-reader-text,.screen-reader-text span,.ui-helper-hidden-accessible{top:0 !important;}@media (max-width:544px){.elementor-element .elementor-wc-products .woocommerce[class*="columns-"] ul.products li.product{width:auto;margin:0;}.elementor-element .woocommerce .woocommerce-result-count{float:none;}}.ast-desktop .ast-mega-menu-enabled .ast-builder-menu-1 div:not( .astra-full-megamenu-wrapper) .sub-menu,.ast-builder-menu-1 .inline-on-mobile .sub-menu,.ast-desktop .ast-builder-menu-1 .astra-full-megamenu-wrapper,.ast-desktop .ast-builder-menu-1 .menu-item .sub-menu{box-shadow:0px 4px 10px -2px rgba(0,0,0,0.1);}.ast-desktop .ast-mobile-popup-drawer.active .ast-mobile-popup-inner{max-width:35%;}@media (max-width:921px){.ast-mobile-popup-drawer.active .ast-mobile-popup-inner{max-width:90%;}}@media (max-width:544px){.ast-mobile-popup-drawer.active .ast-mobile-popup-inner{max-width:90%;}}.ast-header-break-point .main-header-bar{border-bottom-width:1px;}@media (min-width:922px){.main-header-bar{border-bottom-width:1px;}}.main-header-menu .menu-item,#astra-footer-menu .menu-item,.main-header-bar .ast-masthead-custom-menu-items{-js-display:flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;}.main-header-menu > .menu-item > .menu-link,#astra-footer-menu > .menu-item > .menu-link{height:100%;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-js-display:flex;display:flex;}.ast-header-break-point .main-navigation ul .menu-item .menu-link .icon-arrow:first-of-type svg{top:.2em;margin-top:0px;margin-left:0px;width:.65em;transform:translate(0,-2px) rotateZ(270deg);}.ast-mobile-popup-content .ast-submenu-expanded > .ast-menu-toggle{transform:rotateX(180deg);overflow-y:auto;}@media (min-width:922px){.ast-builder-menu .main-navigation > ul > li:last-child a{margin-right:0;}}.ast-separate-container .ast-article-inner{background-color:var(--ast-global-color-4);}@media (max-width:921px){.ast-separate-container .ast-article-inner{background-color:var(--ast-global-color-4);}}@media (max-width:544px){.ast-separate-container .ast-article-inner{background-color:var(--ast-global-color-4);}}.ast-separate-container .ast-article-single:not(.ast-related-post),.ast-separate-container .error-404,.ast-separate-container .no-results,.single.ast-separate-container .site-main .ast-author-meta,.ast-separate-container .related-posts-title-wrapper,.ast-separate-container .comments-count-wrapper,.ast-box-layout.ast-plain-container .site-content,.ast-padded-layout.ast-plain-container .site-content,.ast-separate-container .ast-archive-description,.ast-separate-container .comments-area{background-color:var(--ast-global-color-4);}@media (max-width:921px){.ast-separate-container .ast-article-single:not(.ast-related-post),.ast-separate-container .error-404,.ast-separate-container .no-results,.single.ast-separate-container .site-main .ast-author-meta,.ast-separate-container .related-posts-title-wrapper,.ast-separate-container .comments-count-wrapper,.ast-box-layout.ast-plain-container .site-content,.ast-padded-layout.ast-plain-container .site-content,.ast-separate-container .ast-archive-description{background-color:var(--ast-global-color-4);}}@media (max-width:544px){.ast-separate-container .ast-article-single:not(.ast-related-post),.ast-separate-container .error-404,.ast-separate-container .no-results,.single.ast-separate-container .site-main .ast-author-meta,.ast-separate-container .related-posts-title-wrapper,.ast-separate-container .comments-count-wrapper,.ast-box-layout.ast-plain-container .site-content,.ast-padded-layout.ast-plain-container .site-content,.ast-separate-container .ast-archive-description{background-color:var(--ast-global-color-4);}}.ast-separate-container.ast-two-container #secondary .widget{background-color:var(--ast-global-color-4);}@media (max-width:921px){.ast-separate-container.ast-two-container #secondary .widget{background-color:var(--ast-global-color-4);}}@media (max-width:544px){.ast-separate-container.ast-two-container #secondary .widget{background-color:var(--ast-global-color-4);}}.ast-plain-container,.ast-page-builder-template{background-color:var(--ast-global-color-4);}@media (max-width:921px){.ast-plain-container,.ast-page-builder-template{background-color:var(--ast-global-color-4);}}@media (max-width:544px){.ast-plain-container,.ast-page-builder-template{background-color:var(--ast-global-color-4);}}#ast-scroll-top {display: none;position: fixed;text-align: center;cursor: pointer;z-index: 99;width: 2.1em;height: 2.1em;line-height: 2.1;color: #ffffff;border-radius: 2px;content: "";outline: inherit;}@media (min-width: 769px) {#ast-scroll-top {content: "769";}}#ast-scroll-top .ast-icon.icon-arrow svg {margin-left: 0px;vertical-align: middle;transform: translate(0,-20%) rotate(180deg);width: 1.6em;}.ast-scroll-to-top-right {right: 30px;bottom: 30px;}.ast-scroll-to-top-left {left: 30px;bottom: 30px;}#ast-scroll-top{background-color:var(--ast-global-color-0);font-size:15px;}@media (max-width:921px){#ast-scroll-top .ast-icon.icon-arrow svg{width:1em;}}.ast-mobile-header-wrap .ast-primary-header-bar,.ast-primary-header-bar .site-primary-header-wrap{min-height:76px;}.ast-desktop .ast-primary-header-bar .main-header-menu > .menu-item{line-height:76px;}#masthead .ast-container,.site-header-focus-item + .ast-breadcrumbs-wrapper{max-width:100%;padding-left:35px;padding-right:35px;}.ast-header-break-point #masthead .ast-mobile-header-wrap .ast-primary-header-bar,.ast-header-break-point #masthead .ast-mobile-header-wrap .ast-below-header-bar,.ast-header-break-point #masthead .ast-mobile-header-wrap .ast-above-header-bar{padding-left:20px;padding-right:20px;}.ast-header-break-point .ast-primary-header-bar{border-bottom-width:1px;border-bottom-color:var( --ast-global-color-subtle-background,--ast-global-color-7 );border-bottom-style:solid;}@media (min-width:922px){.ast-primary-header-bar{border-bottom-width:1px;border-bottom-color:var( --ast-global-color-subtle-background,--ast-global-color-7 );border-bottom-style:solid;}}.ast-primary-header-bar{background-color:var( --ast-global-color-primary,--ast-global-color-4 );background-image:none;}.ast-desktop .ast-primary-header-bar.main-header-bar,.ast-header-break-point #masthead .ast-primary-header-bar.main-header-bar{padding-top:0px;padding-bottom:0px;padding-left:0px;padding-right:0px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px;}.ast-primary-header-bar{display:block;}@media (max-width:921px){.ast-header-break-point .ast-primary-header-bar{display:grid;}}@media (max-width:544px){.ast-header-break-point .ast-primary-header-bar{display:grid;}}.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item > .menu-link{color:var(--ast-global-color-3);}.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item > .ast-menu-toggle{color:var(--ast-global-color-3);}.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item:hover > .menu-link,.ast-builder-menu-mobile .main-navigation .inline-on-mobile .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .menu-item:hover > .menu-link,.ast-builder-menu-mobile .main-navigation .inline-on-mobile .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-item > .menu-link,.ast-builder-menu-mobile .main-navigation .inline-on-mobile .menu-item.current-menu-item > .ast-menu-toggle,.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-ancestor > .menu-link,.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-ancestor > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-item > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}.ast-builder-menu-mobile .main-navigation .menu-item-has-children > .menu-link:after{content:unset;}.ast-hfb-header .ast-builder-menu-mobile .main-header-menu,.ast-hfb-header .ast-builder-menu-mobile .main-navigation .menu-item .menu-link,.ast-hfb-header .ast-builder-menu-mobile .main-navigation .menu-item .sub-menu .menu-link{border-style:none;}.ast-builder-menu-mobile .main-navigation .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}@media (max-width:921px){.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item > .menu-link{color:var(--ast-global-color-3);}.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item > .ast-menu-toggle{color:var(--ast-global-color-3);}.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item:hover > .menu-link,.ast-builder-menu-mobile .main-navigation .inline-on-mobile .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-1);background:var(--ast-global-color-5);}.ast-builder-menu-mobile .main-navigation .menu-item:hover > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-item > .menu-link,.ast-builder-menu-mobile .main-navigation .inline-on-mobile .menu-item.current-menu-item > .ast-menu-toggle,.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-ancestor > .menu-link,.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-ancestor > .ast-menu-toggle{color:var(--ast-global-color-1);background:var(--ast-global-color-5);}.ast-builder-menu-mobile .main-navigation .menu-item.current-menu-item > .ast-menu-toggle{color:var(--ast-global-color-1);}.ast-builder-menu-mobile .main-navigation .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}.ast-builder-menu-mobile .main-navigation .menu-item-has-children > .menu-link:after{content:unset;}.ast-builder-menu-mobile .main-navigation .main-header-menu ,.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-link,.ast-builder-menu-mobile .main-navigation .main-header-menu .sub-menu{background-color:var(--ast-global-color-4);}}@media (max-width:544px){.ast-builder-menu-mobile .main-navigation .menu-item.menu-item-has-children > .ast-menu-toggle{top:0;}}.ast-builder-menu-mobile .main-navigation{display:block;}@media (max-width:921px){.ast-header-break-point .ast-builder-menu-mobile .main-navigation{display:block;}}@media (max-width:544px){.ast-header-break-point .ast-builder-menu-mobile .main-navigation{display:block;}}:root{--e-global-color-astglobalcolor0:#046bd2;--e-global-color-astglobalcolor1:#045cb4;--e-global-color-astglobalcolor2:#1e293b;--e-global-color-astglobalcolor3:#334155;--e-global-color-astglobalcolor4:#FFFFFF;--e-global-color-astglobalcolor5:#F0F5FA;--e-global-color-astglobalcolor6:#111111;--e-global-color-astglobalcolor7:#D1D5DB;--e-global-color-astglobalcolor8:#111111;}.ast-desktop .astra-menu-animation-slide-up>.menu-item>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-up>.menu-item>.sub-menu,.ast-desktop .astra-menu-animation-slide-up>.menu-item>.sub-menu .sub-menu{opacity:0;visibility:hidden;transform:translateY(.5em);transition:visibility .2s ease,transform .2s ease}.ast-desktop .astra-menu-animation-slide-up>.menu-item .menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-slide-up>.menu-item .menu-item:hover>.sub-menu,.ast-desktop .astra-menu-animation-slide-up>.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-up>.menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-slide-up>.menu-item:hover>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-up>.menu-item:hover>.sub-menu{opacity:1;visibility:visible;transform:translateY(0);transition:opacity .2s ease,visibility .2s ease,transform .2s ease}.ast-desktop .astra-menu-animation-slide-up>.full-width-mega.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-up>.full-width-mega.menu-item:hover>.astra-full-megamenu-wrapper{-js-display:flex;display:flex}.ast-desktop .astra-menu-animation-slide-down>.menu-item>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-down>.menu-item>.sub-menu,.ast-desktop .astra-menu-animation-slide-down>.menu-item>.sub-menu .sub-menu{opacity:0;visibility:hidden;transform:translateY(-.5em);transition:visibility .2s ease,transform .2s ease}.ast-desktop .astra-menu-animation-slide-down>.menu-item .menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-slide-down>.menu-item .menu-item:hover>.sub-menu,.ast-desktop .astra-menu-animation-slide-down>.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-down>.menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-slide-down>.menu-item:hover>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-down>.menu-item:hover>.sub-menu{opacity:1;visibility:visible;transform:translateY(0);transition:opacity .2s ease,visibility .2s ease,transform .2s ease}.ast-desktop .astra-menu-animation-slide-down>.full-width-mega.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-slide-down>.full-width-mega.menu-item:hover>.astra-full-megamenu-wrapper{-js-display:flex;display:flex}.ast-desktop .astra-menu-animation-fade>.menu-item>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-fade>.menu-item>.sub-menu,.ast-desktop .astra-menu-animation-fade>.menu-item>.sub-menu .sub-menu{opacity:0;visibility:hidden;transition:opacity ease-in-out .3s}.ast-desktop .astra-menu-animation-fade>.menu-item .menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-fade>.menu-item .menu-item:hover>.sub-menu,.ast-desktop .astra-menu-animation-fade>.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-fade>.menu-item.focus>.sub-menu,.ast-desktop .astra-menu-animation-fade>.menu-item:hover>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-fade>.menu-item:hover>.sub-menu{opacity:1;visibility:visible;transition:opacity ease-in-out .3s}.ast-desktop .astra-menu-animation-fade>.full-width-mega.menu-item.focus>.astra-full-megamenu-wrapper,.ast-desktop .astra-menu-animation-fade>.full-width-mega.menu-item:hover>.astra-full-megamenu-wrapper{-js-display:flex;display:flex}.ast-desktop .menu-item.ast-menu-hover>.sub-menu.toggled-on{opacity:1;visibility:visible}
/*# sourceURL=astra-theme-css-inline-css */
</style>
<link rel='stylesheet' id='astra-google-fonts-css' href='https://meteoric.com.au/wp-content/astra-local-fonts/astra-local-fonts.css?ver=4.12.5' media='all' />
<link rel='stylesheet' id='la-icon-maneger-style-css' href='https://meteoric.com.au/wp-content/uploads/la_icon_sets/style.min.css?ver=6.9.4' media='all' />
<style id='wp-emoji-styles-inline-css'>

	img.wp-smiley, img.emoji {
		display: inline !important;
		border: none !important;
		box-shadow: none !important;
		height: 1em !important;
		width: 1em !important;
		margin: 0 0.07em !important;
		vertical-align: -0.1em !important;
		background: none !important;
		padding: 0 !important;
	}
/*# sourceURL=wp-emoji-styles-inline-css */
</style>
<style id='global-styles-inline-css'>
:root{--wp--preset--aspect-ratio--square: 1;--wp--preset--aspect-ratio--4-3: 4/3;--wp--preset--aspect-ratio--3-4: 3/4;--wp--preset--aspect-ratio--3-2: 3/2;--wp--preset--aspect-ratio--2-3: 2/3;--wp--preset--aspect-ratio--16-9: 16/9;--wp--preset--aspect-ratio--9-16: 9/16;--wp--preset--color--black: #000000;--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--color--ast-global-color-0: var(--ast-global-color-0);--wp--preset--color--ast-global-color-1: var(--ast-global-color-1);--wp--preset--color--ast-global-color-2: var(--ast-global-color-2);--wp--preset--color--ast-global-color-3: var(--ast-global-color-3);--wp--preset--color--ast-global-color-4: var(--ast-global-color-4);--wp--preset--color--ast-global-color-5: var(--ast-global-color-5);--wp--preset--color--ast-global-color-6: var(--ast-global-color-6);--wp--preset--color--ast-global-color-7: var(--ast-global-color-7);--wp--preset--color--ast-global-color-8: var(--ast-global-color-8);--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgb(252,185,0) 0%,rgb(255,105,0) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgb(255,105,0) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--font-size--small: 13px;--wp--preset--font-size--medium: 20px;--wp--preset--font-size--large: 36px;--wp--preset--font-size--x-large: 42px;--wp--preset--spacing--20: 0.44rem;--wp--preset--spacing--30: 0.67rem;--wp--preset--spacing--40: 1rem;--wp--preset--spacing--50: 1.5rem;--wp--preset--spacing--60: 2.25rem;--wp--preset--spacing--70: 3.38rem;--wp--preset--spacing--80: 5.06rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgb(255, 255, 255), 6px 6px rgb(0, 0, 0);--wp--preset--shadow--crisp: 6px 6px 0px rgb(0, 0, 0);}:root { --wp--style--global--content-size: var(--wp--custom--ast-content-width-size);--wp--style--global--wide-size: var(--wp--custom--ast-wide-width-size); }:where(body) { margin: 0; }.wp-site-blocks > .alignleft { float: left; margin-right: 2em; }.wp-site-blocks > .alignright { float: right; margin-left: 2em; }.wp-site-blocks > .aligncenter { justify-content: center; margin-left: auto; margin-right: auto; }:where(.wp-site-blocks) > * { margin-block-start: 24px; margin-block-end: 0; }:where(.wp-site-blocks) > :first-child { margin-block-start: 0; }:where(.wp-site-blocks) > :last-child { margin-block-end: 0; }:root { --wp--style--block-gap: 24px; }:root :where(.is-layout-flow) > :first-child{margin-block-start: 0;}:root :where(.is-layout-flow) > :last-child{margin-block-end: 0;}:root :where(.is-layout-flow) > *{margin-block-start: 24px;margin-block-end: 0;}:root :where(.is-layout-constrained) > :first-child{margin-block-start: 0;}:root :where(.is-layout-constrained) > :last-child{margin-block-end: 0;}:root :where(.is-layout-constrained) > *{margin-block-start: 24px;margin-block-end: 0;}:root :where(.is-layout-flex){gap: 24px;}:root :where(.is-layout-grid){gap: 24px;}.is-layout-flow > .alignleft{float: left;margin-inline-start: 0;margin-inline-end: 2em;}.is-layout-flow > .alignright{float: right;margin-inline-start: 2em;margin-inline-end: 0;}.is-layout-flow > .aligncenter{margin-left: auto !important;margin-right: auto !important;}.is-layout-constrained > .alignleft{float: left;margin-inline-start: 0;margin-inline-end: 2em;}.is-layout-constrained > .alignright{float: right;margin-inline-start: 2em;margin-inline-end: 0;}.is-layout-constrained > .aligncenter{margin-left: auto !important;margin-right: auto !important;}.is-layout-constrained > :where(:not(.alignleft):not(.alignright):not(.alignfull)){max-width: var(--wp--style--global--content-size);margin-left: auto !important;margin-right: auto !important;}.is-layout-constrained > .alignwide{max-width: var(--wp--style--global--wide-size);}body .is-layout-flex{display: flex;}.is-layout-flex{flex-wrap: wrap;align-items: center;}.is-layout-flex > :is(*, div){margin: 0;}body .is-layout-grid{display: grid;}.is-layout-grid > :is(*, div){margin: 0;}body{padding-top: 0px;padding-right: 0px;padding-bottom: 0px;padding-left: 0px;}a:where(:not(.wp-element-button)){text-decoration: none;}:root :where(.wp-element-button, .wp-block-button__link){background-color: #32373c;border-width: 0;color: #fff;font-family: inherit;font-size: inherit;font-style: inherit;font-weight: inherit;letter-spacing: inherit;line-height: inherit;padding-top: calc(0.667em + 2px);padding-right: calc(1.333em + 2px);padding-bottom: calc(0.667em + 2px);padding-left: calc(1.333em + 2px);text-decoration: none;text-transform: inherit;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-ast-global-color-0-color{color: var(--wp--preset--color--ast-global-color-0) !important;}.has-ast-global-color-1-color{color: var(--wp--preset--color--ast-global-color-1) !important;}.has-ast-global-color-2-color{color: var(--wp--preset--color--ast-global-color-2) !important;}.has-ast-global-color-3-color{color: var(--wp--preset--color--ast-global-color-3) !important;}.has-ast-global-color-4-color{color: var(--wp--preset--color--ast-global-color-4) !important;}.has-ast-global-color-5-color{color: var(--wp--preset--color--ast-global-color-5) !important;}.has-ast-global-color-6-color{color: var(--wp--preset--color--ast-global-color-6) !important;}.has-ast-global-color-7-color{color: var(--wp--preset--color--ast-global-color-7) !important;}.has-ast-global-color-8-color{color: var(--wp--preset--color--ast-global-color-8) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-ast-global-color-0-background-color{background-color: var(--wp--preset--color--ast-global-color-0) !important;}.has-ast-global-color-1-background-color{background-color: var(--wp--preset--color--ast-global-color-1) !important;}.has-ast-global-color-2-background-color{background-color: var(--wp--preset--color--ast-global-color-2) !important;}.has-ast-global-color-3-background-color{background-color: var(--wp--preset--color--ast-global-color-3) !important;}.has-ast-global-color-4-background-color{background-color: var(--wp--preset--color--ast-global-color-4) !important;}.has-ast-global-color-5-background-color{background-color: var(--wp--preset--color--ast-global-color-5) !important;}.has-ast-global-color-6-background-color{background-color: var(--wp--preset--color--ast-global-color-6) !important;}.has-ast-global-color-7-background-color{background-color: var(--wp--preset--color--ast-global-color-7) !important;}.has-ast-global-color-8-background-color{background-color: var(--wp--preset--color--ast-global-color-8) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-ast-global-color-0-border-color{border-color: var(--wp--preset--color--ast-global-color-0) !important;}.has-ast-global-color-1-border-color{border-color: var(--wp--preset--color--ast-global-color-1) !important;}.has-ast-global-color-2-border-color{border-color: var(--wp--preset--color--ast-global-color-2) !important;}.has-ast-global-color-3-border-color{border-color: var(--wp--preset--color--ast-global-color-3) !important;}.has-ast-global-color-4-border-color{border-color: var(--wp--preset--color--ast-global-color-4) !important;}.has-ast-global-color-5-border-color{border-color: var(--wp--preset--color--ast-global-color-5) !important;}.has-ast-global-color-6-border-color{border-color: var(--wp--preset--color--ast-global-color-6) !important;}.has-ast-global-color-7-border-color{border-color: var(--wp--preset--color--ast-global-color-7) !important;}.has-ast-global-color-8-border-color{border-color: var(--wp--preset--color--ast-global-color-8) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}
:root :where(.wp-block-pullquote){font-size: 1.5em;line-height: 1.6;}
/*# sourceURL=global-styles-inline-css */
</style>
<link rel='stylesheet' id='sf_styles-css' href='https://meteoric.com.au/wp-content/plugins/superfly-menu/css/public.min.css?ver=6.9.4' media='all' />
<link rel='stylesheet' id='wpml-legacy-dropdown-click-0-css' href='https://meteoric.com.au/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-dropdown-click/style.min.css?ver=1' media='all' />
<style id='wpml-legacy-dropdown-click-0-inline-css'>
.wpml-ls-statics-shortcode_actions a, .wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a, .wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a:link, .wpml-ls-statics-shortcode_actions li:not(.wpml-ls-current-language) .wpml-ls-link, .wpml-ls-statics-shortcode_actions li:not(.wpml-ls-current-language) .wpml-ls-link:link {background-color:#00052e;}.wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a:hover,.wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a:focus, .wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a:link:hover, .wpml-ls-statics-shortcode_actions .wpml-ls-sub-menu a:link:focus {color:#ffffff;background-color:#00052e;}.wpml-ls-statics-shortcode_actions .wpml-ls-current-language > a {color:#ffffff;background-color:#00052e;}.wpml-ls-statics-shortcode_actions .wpml-ls-current-language:hover>a, .wpml-ls-statics-shortcode_actions .wpml-ls-current-language>a:focus {color:#ffffff;background-color:#00052e;}
/*# sourceURL=wpml-legacy-dropdown-click-0-inline-css */
</style>
<link rel='stylesheet' id='cms-navigation-style-base-css' href='https://meteoric.com.au/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation-base.css?ver=1.5.6' media='screen' />
<link rel='stylesheet' id='cms-navigation-style-css' href='https://meteoric.com.au/wp-content/plugins/wpml-cms-nav/res/css/cms-navigation.css?ver=1.5.6' media='screen' />
<link rel='stylesheet' id='astra-addon-css-css' href='https://meteoric.com.au/wp-content/uploads/astra-addon/astra-addon-69d498348acd07-49936443.css?ver=4.12.4' media='all' />
<style id='astra-addon-css-inline-css'>
#content:before{content:"921";position:absolute;overflow:hidden;opacity:0;visibility:hidden;}.blog-layout-2{position:relative;}.single .ast-author-details .author-title{color:var(--ast-global-color-0);}.single.ast-page-builder-template .ast-single-author-box{padding:2em 20px;}.single.ast-separate-container .ast-author-meta{padding:3em;}@media (max-width:921px){.single.ast-separate-container .ast-author-meta{padding:1.5em 2.14em;}.single .ast-author-meta .post-author-avatar{margin-bottom:1em;}.ast-separate-container .ast-grid-2 .ast-article-post,.ast-separate-container .ast-grid-3 .ast-article-post,.ast-separate-container .ast-grid-4 .ast-article-post{width:100%;}.ast-separate-container .ast-grid-md-1 .ast-article-post{width:100%;}.ast-separate-container .ast-grid-md-2 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-md-3 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-md-4 .ast-article-post.ast-separate-posts{padding:0 .75em 0;}.blog-layout-1 .post-content,.blog-layout-1 .ast-blog-featured-section{float:none;}.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .square .posted-on{margin-top:0;}.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on{margin-top:1em;}.ast-separate-container .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content{margin-top:-1.5em;}.ast-separate-container .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content{margin-left:-2.14em;margin-right:-2.14em;}.ast-separate-container .ast-article-single.remove-featured-img-padding .single-layout-1 .entry-header .post-thumb-img-content:first-child{margin-top:-1.5em;}.ast-separate-container .ast-article-single.remove-featured-img-padding .single-layout-1 .post-thumb-img-content{margin-left:-2.14em;margin-right:-2.14em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on{margin-left:-1.5em;margin-right:-1.5em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on{margin-left:-0.5em;margin-right:-0.5em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .square .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .square .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .square .posted-on{margin-top:0;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on{margin-top:1em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content{margin-top:-1.5em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content{margin-left:-1.5em;margin-right:-1.5em;}.blog-layout-2{display:flex;flex-direction:column-reverse;}.ast-separate-container .blog-layout-3,.ast-separate-container .blog-layout-1{display:block;}.ast-plain-container .ast-grid-2 .ast-article-post,.ast-plain-container .ast-grid-3 .ast-article-post,.ast-plain-container .ast-grid-4 .ast-article-post,.ast-page-builder-template .ast-grid-2 .ast-article-post,.ast-page-builder-template .ast-grid-3 .ast-article-post,.ast-page-builder-template .ast-grid-4 .ast-article-post{width:100%;}.ast-separate-container .ast-blog-layout-4-grid .ast-article-post{display:flex;}}@media (max-width:921px){.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on{margin-top:0;margin-left:-2.14em;}.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on{margin-top:0;margin-left:-1.14em;}}@media (min-width:922px){.ast-separate-container.ast-blog-grid-2 .ast-archive-description,.ast-separate-container.ast-blog-grid-3 .ast-archive-description,.ast-separate-container.ast-blog-grid-4 .ast-archive-description{margin-bottom:1.33333em;}.blog-layout-2.ast-no-thumb .post-content,.blog-layout-3.ast-no-thumb .post-content{width:calc(100% - 5.714285714em);}.blog-layout-2.ast-no-thumb.ast-no-date-box .post-content,.blog-layout-3.ast-no-thumb.ast-no-date-box .post-content{width:100%;}.ast-separate-container .ast-grid-2 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-3 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-4 .ast-article-post.ast-separate-posts{border-bottom:0;}.ast-separate-container .ast-grid-2 > .site-main > .ast-row:before,.ast-separate-container .ast-grid-2 > .site-main > .ast-row:after,.ast-separate-container .ast-grid-3 > .site-main > .ast-row:before,.ast-separate-container .ast-grid-3 > .site-main > .ast-row:after,.ast-separate-container .ast-grid-4 > .site-main > .ast-row:before,.ast-separate-container .ast-grid-4 > .site-main > .ast-row:after{flex-basis:0;width:0;}.ast-separate-container .ast-grid-2 .ast-article-post,.ast-separate-container .ast-grid-3 .ast-article-post,.ast-separate-container .ast-grid-4 .ast-article-post{display:flex;padding:0;}.ast-plain-container .ast-grid-2 > .site-main > .ast-row,.ast-plain-container .ast-grid-3 > .site-main > .ast-row,.ast-plain-container .ast-grid-4 > .site-main > .ast-row,.ast-page-builder-template .ast-grid-2 > .site-main > .ast-row,.ast-page-builder-template .ast-grid-3 > .site-main > .ast-row,.ast-page-builder-template .ast-grid-4 > .site-main > .ast-row{margin-left:-1em;margin-right:-1em;display:flex;flex-flow:row wrap;align-items:stretch;}.ast-plain-container .ast-grid-2 > .site-main > .ast-row:before,.ast-plain-container .ast-grid-2 > .site-main > .ast-row:after,.ast-plain-container .ast-grid-3 > .site-main > .ast-row:before,.ast-plain-container .ast-grid-3 > .site-main > .ast-row:after,.ast-plain-container .ast-grid-4 > .site-main > .ast-row:before,.ast-plain-container .ast-grid-4 > .site-main > .ast-row:after,.ast-page-builder-template .ast-grid-2 > .site-main > .ast-row:before,.ast-page-builder-template .ast-grid-2 > .site-main > .ast-row:after,.ast-page-builder-template .ast-grid-3 > .site-main > .ast-row:before,.ast-page-builder-template .ast-grid-3 > .site-main > .ast-row:after,.ast-page-builder-template .ast-grid-4 > .site-main > .ast-row:before,.ast-page-builder-template .ast-grid-4 > .site-main > .ast-row:after{flex-basis:0;width:0;}.ast-plain-container .ast-grid-2 .ast-article-post,.ast-plain-container .ast-grid-3 .ast-article-post,.ast-plain-container .ast-grid-4 .ast-article-post,.ast-page-builder-template .ast-grid-2 .ast-article-post,.ast-page-builder-template .ast-grid-3 .ast-article-post,.ast-page-builder-template .ast-grid-4 .ast-article-post{display:flex;}.ast-plain-container .ast-grid-2 .ast-article-post:last-child,.ast-plain-container .ast-grid-3 .ast-article-post:last-child,.ast-plain-container .ast-grid-4 .ast-article-post:last-child,.ast-page-builder-template .ast-grid-2 .ast-article-post:last-child,.ast-page-builder-template .ast-grid-3 .ast-article-post:last-child,.ast-page-builder-template .ast-grid-4 .ast-article-post:last-child{margin-bottom:1.5em;}.ast-separate-container .ast-grid-2 > .site-main > .ast-row,.ast-separate-container .ast-grid-3 > .site-main > .ast-row,.ast-separate-container .ast-grid-4 > .site-main > .ast-row{margin-left:-1em;margin-right:-1em;display:flex;flex-flow:row wrap;align-items:stretch;}.single .ast-author-meta .ast-author-details{display:flex;align-items:center;}.post-author-bio .author-title{margin-bottom:10px;}}@media (min-width:922px){.single .post-author-avatar,.single .post-author-bio{float:left;clear:right;}.single .ast-author-meta .post-author-avatar{margin-right:1.33333em;}.single .ast-author-meta .about-author-title-wrapper,.single .ast-author-meta .post-author-bio{text-align:left;}.blog-layout-2 .post-content{padding-right:2em;}.blog-layout-2.ast-no-date-box.ast-no-thumb .post-content{padding-right:0;}.blog-layout-3 .post-content{padding-left:2em;}.blog-layout-3.ast-no-date-box.ast-no-thumb .post-content{padding-left:0;}.ast-separate-container .ast-grid-2 .ast-article-post.ast-separate-posts:nth-child(2n+0),.ast-separate-container .ast-grid-2 .ast-article-post.ast-separate-posts:nth-child(2n+1),.ast-separate-container .ast-grid-3 .ast-article-post.ast-separate-posts:nth-child(2n+0),.ast-separate-container .ast-grid-3 .ast-article-post.ast-separate-posts:nth-child(2n+1),.ast-separate-container .ast-grid-4 .ast-article-post.ast-separate-posts:nth-child(2n+0),.ast-separate-container .ast-grid-4 .ast-article-post.ast-separate-posts:nth-child(2n+1){padding:0 1em 0;}}@media (max-width:544px){.ast-separate-container .ast-grid-sm-1 .ast-article-post{width:100%;}.ast-separate-container .ast-grid-sm-2 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-sm-3 .ast-article-post.ast-separate-posts,.ast-separate-container .ast-grid-sm-4 .ast-article-post.ast-separate-posts{padding:0 .5em 0;}.ast-separate-container .ast-grid-sm-1 .ast-article-post.ast-separate-posts{padding:0;}.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on{margin-top:0.5em;}.ast-separate-container .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content,.ast-separate-container .ast-article-single.remove-featured-img-padding .single-layout-1 .post-thumb-img-content,.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on{margin-left:-1em;margin-right:-1em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on{margin-left:-0.5em;margin-right:-0.5em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section:first-child .circle .posted-on{margin-top:0.5em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-content .ast-blog-featured-section:first-child .post-thumb-img-content{margin-top:-1.33333em;}.ast-separate-container.ast-blog-grid-2 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content,.ast-separate-container.ast-blog-grid-3 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content,.ast-separate-container.ast-blog-grid-4 .ast-article-post.remove-featured-img-padding .blog-layout-1 .post-thumb-img-content{margin-left:-1em;margin-right:-1em;}.ast-separate-container .ast-grid-2 .ast-article-post .blog-layout-1,.ast-separate-container .ast-grid-2 .ast-article-post .blog-layout-2,.ast-separate-container .ast-grid-2 .ast-article-post .blog-layout-3{padding:1.33333em 1em;}.ast-separate-container .ast-grid-3 .ast-article-post .blog-layout-1,.ast-separate-container .ast-grid-4 .ast-article-post .blog-layout-1{padding:1.33333em 1em;}.single.ast-separate-container .ast-author-meta{padding:1.5em 1em;}}@media (max-width:544px){.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .square .posted-on{margin-left:-1em;}.ast-separate-container .ast-article-post.remove-featured-img-padding.has-post-thumbnail .blog-layout-1 .post-content .ast-blog-featured-section .circle .posted-on{margin-left:-0.5em;}}h1,h2,h3,h4,h5,h6{margin-bottom:20px;}@media (min-width:922px){.ast-hide-display-device-desktop{display:none;}[class^="astra-advanced-hook-"] .wp-block-query .wp-block-post-template .wp-block-post{width:100%;}}@media (min-width:545px) and (max-width:921px){.ast-hide-display-device-tablet{display:none;}}@media (max-width:544px){.ast-hide-display-device-mobile{display:none;}}.ast-article-post .ast-date-meta .posted-on,.ast-article-post .ast-date-meta .posted-on *{background:var(--ast-global-color-0);color:#ffffff;}.ast-article-post .ast-date-meta .posted-on .date-month,.ast-article-post .ast-date-meta .posted-on .date-year{color:#ffffff;}.ast-loader > div{background-color:var(--ast-global-color-0);}.blog-layout-4 .post-thumb-img-content{position:static;}.blog-layout-4 .ast-blog-single-element.ast-taxonomy-container.cat-links{position:static;text-align:inherit;}.ast-page-builder-template .ast-archive-description{margin-bottom:2em;}.ast-load-more {cursor: pointer;display: none;border: 2px solid var(--ast-border-color);transition: all 0.2s linear;color: #000;}.ast-load-more.active {display: inline-block;padding: 0 1.5em;line-height: 3em;}.ast-load-more.no-more:hover {border-color: var(--ast-border-color);color: #000;}.ast-load-more.no-more:hover {background-color: inherit;}.ast-header-search .ast-search-menu-icon .search-field{border-radius:2px;}.ast-header-search .ast-search-menu-icon .search-submit{border-radius:2px;}.ast-header-search .ast-search-menu-icon .search-form{border-top-width:1px;border-bottom-width:1px;border-left-width:1px;border-right-width:1px;border-color:#ddd;border-radius:2px;}@media (min-width:922px){.ast-container{max-width:1240px;}}@media (min-width:993px){.ast-container{max-width:1240px;}}@media (min-width:1201px){.ast-container{max-width:1240px;}}@media (max-width:921px){.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .ast-comment-list li.depth-1,.ast-separate-container .comment-respond .ast-separate-container .ast-related-posts-wrap{padding-top:1.5em;padding-bottom:1.5em;}.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .comments-count-wrapper,.ast-separate-container .ast-comment-list li.depth-1,.ast-separate-container .comment-respond,.ast-separate-container .related-posts-title-wrapper,.ast-separate-container .related-posts-title-wrapper .single.ast-separate-container .about-author-title-wrapper,.ast-separate-container .ast-related-posts-wrap{padding-right:2.14em;padding-left:2.14em;}.ast-narrow-container .ast-article-post,.ast-narrow-container .ast-article-single,.ast-narrow-container .ast-comment-list li.depth-1,.ast-narrow-container .comment-respond,.ast-narrow-container .ast-related-posts-wrap,.ast-narrow-container .ast-single-related-posts-container{padding-top:1.5em;padding-bottom:1.5em;}.ast-narrow-container .ast-article-post,.ast-narrow-container .ast-article-single,.ast-narrow-container .comments-count-wrapper,.ast-narrow-container .ast-comment-list li.depth-1,.ast-narrow-container .comment-respond,.ast-narrow-container .related-posts-title-wrapper,.ast-narrow-container .related-posts-title-wrapper,.single.ast-narrow-container .about-author-title-wrapper,.ast-narrow-container .ast-related-posts-wrap,.ast-narrow-container .ast-single-related-posts-container{padding-right:2.14em;padding-left:2.14em;}.ast-separate-container.ast-right-sidebar #primary,.ast-separate-container.ast-left-sidebar #primary,.ast-separate-container #primary,.ast-plain-container #primary,.ast-narrow-container #primary{margin-top:1.5em;margin-bottom:1.5em;}.ast-left-sidebar #primary,.ast-right-sidebar #primary,.ast-separate-container.ast-right-sidebar #primary,.ast-separate-container.ast-left-sidebar #primary,.ast-separate-container #primary,.ast-narrow-container #primary{padding-left:0em;padding-right:0em;}.ast-no-sidebar.ast-separate-container .entry-content .alignfull,.ast-no-sidebar.ast-narrow-container .entry-content .alignfull{margin-right:-2.14em;margin-left:-2.14em;}}@media (max-width:544px){.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .ast-comment-list li.depth-1,.ast-separate-container .comment-respond,.ast-separate-container .ast-related-posts-wrap{padding-top:1.5em;padding-bottom:1.5em;}.ast-narrow-container .ast-article-post,.ast-narrow-container .ast-article-single,.ast-narrow-container .ast-comment-list li.depth-1,.ast-narrow-container .comment-respond,.ast-narrow-container .ast-related-posts-wrap,.ast-narrow-container .ast-single-related-posts-container{padding-top:1.5em;padding-bottom:1.5em;}.ast-separate-container .ast-article-post,.ast-separate-container .ast-article-single,.ast-separate-container .comments-count-wrapper,.ast-separate-container .ast-comment-list li.depth-1,.ast-separate-container .comment-respond,.ast-separate-container .related-posts-title-wrapper,.ast-separate-container .related-posts-title-wrapper,.single.ast-separate-container .about-author-title-wrapper,.ast-separate-container .ast-related-posts-wrap{padding-right:1em;padding-left:1em;}.ast-narrow-container .ast-article-post,.ast-narrow-container .ast-article-single,.ast-narrow-container .comments-count-wrapper,.ast-narrow-container .ast-comment-list li.depth-1,.ast-narrow-container .comment-respond,.ast-narrow-container .related-posts-title-wrapper,.ast-narrow-container .related-posts-title-wrapper,.single.ast-narrow-container .about-author-title-wrapper,.ast-narrow-container .ast-related-posts-wrap,.ast-narrow-container .ast-single-related-posts-container{padding-right:1em;padding-left:1em;}.ast-no-sidebar.ast-separate-container .entry-content .alignfull,.ast-no-sidebar.ast-narrow-container .entry-content .alignfull{margin-right:-1em;margin-left:-1em;}}@media (max-width:544px){.ast-header-break-point .header-main-layout-2 .site-branding,.ast-header-break-point .ast-mobile-header-stack .ast-mobile-menu-buttons{padding-bottom:0px;}}@media (max-width:921px){.ast-separate-container.ast-two-container #secondary .widget,.ast-separate-container #secondary .widget{margin-bottom:1.5em;}}@media (max-width:921px){.ast-separate-container #primary,.ast-narrow-container #primary{padding-top:0px;}}@media (max-width:921px){.ast-separate-container #primary,.ast-narrow-container #primary{padding-bottom:0px;}}.site-header .ast-sticky-shrunk .ast-site-identity,.ast-sticky-shrunk .main-header-menu > .menu-item > .menu-link,.ast-sticky-shrunk li.ast-masthead-custom-menu-items{padding-top:0px;padding-bottom:0px;} .ast-header-break-point .ast-sticky-shrunk.main-navigation .sub-menu .menu-item .menu-link{padding-top:0px;padding-bottom:0px;}.ast-sticky-shrunk .main-header-menu .sub-menu .menu-link{padding-top:0.9em;padding-bottom:0.9em;}.site-header .ast-sticky-shrunk .ast-site-identity,.ast-sticky-shrunk li.ast-masthead-custom-menu-items{padding-top:0.5em;padding-bottom:0.5em;}.ast-sticky-header-shrink .ast-primary-header-bar.ast-header-sticked,.ast-sticky-header-shrink .ast-primary-header-bar.ast-header-sticked .site-primary-header-wrap,.ast-header-sticked .ast-primary-header-bar .site-primary-header-wrap,.ast-sticky-header-shrink .ast-mobile-header-wrap .ast-primary-header-bar.ast-header-sticked,.ast-sticky-header-shrink .ast-mobile-header-wrap .ast-stick-primary-below-wrapper.ast-header-sticked .ast-below-header ,.ast-sticky-header-shrink .ast-stick-primary-below-wrapper.ast-header-sticked .ast-primary-header-bar .site-primary-header-wrap{min-height:66px;}.ast-desktop.ast-sticky-header-shrink .ast-primary-header-bar.ast-header-sticked .main-header-menu > .menu-item{line-height:66px;}.ast-sticky-header-shrink .ast-above-header-bar.ast-header-sticked .site-above-header-wrap,.ast-sticky-header-shrink .ast-above-header-bar.ast-header-sticked .site-above-header-wrap,.ast-header-sticked .ast-above-header-bar .site-above-header-wrap,.ast-header-sticked .ast-above-header-bar,.ast-sticky-header-shrink .ast-mobile-header-wrap .ast-above-header-bar.ast-header-sticked{min-height:40px;}.ast-desktop.ast-sticky-header-shrink .ast-above-header-bar.ast-header-sticked .main-header-menu > .menu-item{line-height:40px;}.ast-sticky-header-shrink .ast-below-header-bar.ast-header-sticked,.ast-sticky-header-shrink .ast-below-header-bar.ast-header-sticked .site-below-header-wrap,.ast-sticky-header-shrink .ast-below-header-bar.ast-header-sticked.site-below-header-wrap,.ast-header-sticked .ast-below-header-bar .site-below-header-wrap,.ast-sticky-header-shrink .ast-mobile-header-wrap .ast-below-header-bar.ast-header-sticked .site-below-header-wrap{min-height:50px;}.ast-desktop.ast-sticky-header-shrink .ast-below-header-bar.ast-header-sticked .main-header-menu > .menu-item{line-height:50px;}.ast-builder-menu-1 .main-header-menu.submenu-with-border .astra-megamenu,.ast-builder-menu-1 .main-header-menu.submenu-with-border .astra-full-megamenu-wrapper{border-top-width:2px;border-bottom-width:0px;border-right-width:0px;border-left-width:0px;border-style:solid;}@media (max-width:921px){.ast-header-break-point .ast-builder-menu-1 .main-header-menu .sub-menu > .menu-item > .menu-link{padding-top:0px;padding-bottom:0px;padding-left:30px;padding-right:20px;}.ast-header-break-point .ast-builder-menu-1 .sub-menu .menu-item.menu-item-has-children > .ast-menu-toggle{top:0px;right:calc( 20px - 0.907em );}}@media (max-width:544px){.ast-header-break-point .ast-builder-menu-1 .sub-menu .menu-item.menu-item-has-children > .ast-menu-toggle{top:0px;}}.ast-above-header,.main-header-bar,.ast-below-header {-webkit-transition: all 0.2s linear;transition: all 0.2s linear;}.ast-above-header,.main-header-bar,.ast-below-header {max-width:100%;}.site-title,.site-title a{font-weight:600;font-family:'Roboto',sans-serif;line-height:1.23em;}.ast-blog-meta-container{font-weight:600;}.ast-read-more-container a{font-size:16px;font-size:0.88888888888889rem;}.ast-excerpt-container{font-size:16px;font-size:0.88888888888889rem;}.ast-pagination .page-numbers,.ast-pagination .page-navigation{font-size:16px;font-size:0.88888888888889rem;}.widget-area.secondary .sidebar-main .wp-block-heading,#secondary .widget-title{font-size:26px;font-size:1.4444444444444rem;font-weight:600;font-family:'Roboto',sans-serif;line-height:1.23em;}.secondary .widget > *:not(.widget-title){font-size:16px;font-size:0.88888888888889rem;}.blog .entry-title,.blog .entry-title a,.archive .entry-title,.archive .entry-title a,.search .entry-title,.search .entry-title a{font-family:'Roboto',sans-serif;font-weight:500;line-height:1.23em;}button,.ast-button,input#submit,input[type="button"],input[type="submit"],input[type="reset"]{font-size:16px;font-size:0.88888888888889rem;font-weight:500;}h4.widget-title{font-weight:600;}h5.widget-title{font-weight:600;}h6.widget-title{font-weight:600;}.elementor-widget-heading h4.elementor-heading-title{line-height:1.2em;}.elementor-widget-heading h5.elementor-heading-title{line-height:1.2em;}.elementor-widget-heading h6.elementor-heading-title{line-height:1.25em;}.ast-hfb-header.ast-desktop .ast-builder-menu-1 .main-header-menu .menu-item.menu-item-heading > .menu-link{font-weight:700;}.ast-desktop .ast-mm-widget-content .ast-mm-widget-item{padding:0;}.ast-header-break-point .menu-text + .icon-arrow,.ast-desktop .menu-link > .icon-arrow:first-child,.ast-header-break-point .main-header-menu > .menu-item > .menu-link .icon-arrow,.ast-header-break-point .astra-mm-highlight-label + .icon-arrow{display:none;}.ast-advanced-headers-layout.ast-advanced-headers-layout-2 .ast-container{flex-direction:column;}.ast-advanced-headers-different-logo .advanced-header-logo,.ast-header-break-point .ast-has-mobile-header-logo .advanced-header-logo{display:inline-block;}.ast-header-break-point.ast-advanced-headers-different-logo .ast-has-mobile-header-logo .ast-mobile-header-logo{display:none;}.ast-advanced-headers-layout{width:100%;}.ast-header-break-point .ast-advanced-headers-parallax{background-attachment:fixed;}#masthead .site-logo-img .sticky-custom-logo .astra-logo-svg,.site-logo-img .sticky-custom-logo .astra-logo-svg,.ast-sticky-main-shrink .ast-sticky-shrunk .site-logo-img .astra-logo-svg{max-width:90px;width:90px !important;}.ast-hfb-header .site-logo-img .sticky-custom-logo img{max-width:90px !important;width:90px;}#ast-fixed-header .ast-container{max-width:100%;padding-left:35px;padding-right:35px;}@media (max-width:921px){#ast-fixed-header .ast-container{padding-left:20px;padding-right:20px;}}[CLASS*="-sticky-header-active"] #ast-fixed-header.ast-header-sticked .site-title a,[CLASS*="-sticky-header-active"] .ast-header-sticked .site-title a:focus,[CLASS*="-sticky-header-active"] .ast-header-sticked .site-title a:visited ,[CLASS*="-sticky-header-active"] .ast-header-sticked .site-title a{color:var(--ast-global-color-2);}[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-1 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading > .menu-link{background:transparent;}[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-1 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading:hover > .menu-link,[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-1 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading > .menu-link:hover{background:transparent;}@media (max-width:921px){.ast-primary-sticky-header-active.ast-main-header-nav-open nav{overflow-y:auto;max-height:calc(100vh - 100px);}}[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-2 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading > .menu-link{background:transparent;}[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-2 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading:hover > .menu-link,[CLASS*="-sticky-header-active"].ast-desktop .ast-builder-menu-2 .main-header-menu.ast-mega-menu-enabled .sub-menu .menu-item.menu-item-heading > .menu-link:hover{background:transparent;}@media (max-width:921px){.ast-primary-sticky-header-active.ast-main-header-nav-open nav{overflow-y:auto;max-height:calc(100vh - 100px);}}@media (max-width:921px){.ast-primary-sticky-header-active.ast-main-header-nav-open nav{overflow-y:auto;max-height:calc(100vh - 100px);}}#ast-fixed-header .site-title a,#ast-fixed-header .site-title a:focus,#ast-fixed-header .site-title a:hover,#ast-fixed-header .site-title a:visited{color:#222;}#ast-fixed-header.site-header .site-description{color:var(--ast-global-color-3);}.ast-transparent-header #ast-fixed-header .main-header-bar,.ast-transparent-header.ast-primary-sticky-enabled .ast-main-header-wrap .main-header-bar.ast-header-sticked,.ast-primary-sticky-enabled .ast-main-header-wrap .main-header-bar.ast-header-sticked,.ast-primary-sticky-header-ast-primary-sticky-enabled .ast-main-header-wrap .main-header-bar.ast-header-sticked,#ast-fixed-header .main-header-bar,#ast-fixed-header .ast-masthead-custom-menu-items .ast-inline-search .search-field,#ast-fixed-header .ast-masthead-custom-menu-items .ast-inline-search .search-field:focus{background:#00052e;backdrop-filter:unset;-webkit-backdrop-filter:unset;}
/*# sourceURL=astra-addon-css-inline-css */
</style>
<link rel='stylesheet' id='elementor-frontend-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-frontend.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='elementor-post-104-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-104.css?ver=1775757664' media='all' />
<link rel='stylesheet' id='elementor-post-1324-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-1324.css?ver=1775757664' media='all' />
<link rel='stylesheet' id='elementor-post-1342-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-1342.css?ver=1775757664' media='all' />
<link rel='stylesheet' id='elementor-post-8-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-8.css?ver=1775757664' media='all' />
<link rel='stylesheet' id='widget-heading-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/widget-heading.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='e-animation-float-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/animations/styles/e-animation-float.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='widget-image-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/widget-image.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='e-animation-fadeIn-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/animations/styles/fadeIn.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='swiper-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css?ver=8.4.5' media='all' />
<link rel='stylesheet' id='e-swiper-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='widget-image-carousel-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/widget-image-carousel.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='widget-image-box-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-widget-image-box.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='e-animation-bounceIn-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/animations/styles/bounceIn.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='widget-hotspot-css' href='https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/css/widget-hotspot.min.css?ver=3.35.1' media='all' />
<link rel='stylesheet' id='widget-divider-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/widget-divider.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='widget-loop-common-css' href='https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/css/widget-loop-common.min.css?ver=3.35.1' media='all' />
<link rel='stylesheet' id='widget-loop-grid-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-pro-widget-loop-grid.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='e-animation-fadeInUp-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/animations/styles/fadeInUp.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='elementor-post-12-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-12.css?ver=1775761266' media='all' />
<link rel='stylesheet' id='meteoric-theme-css-css' href='https://meteoric.com.au/wp-content/themes/meteoric/style.css?ver=1.0.0' media='all' />
<link rel='stylesheet' id='elementor-gf-local-roboto-css' href='https://meteoric.com.au/wp-content/uploads/elementor/google-fonts/css/roboto.css?ver=1746777899' media='all' />
<link rel='stylesheet' id='elementor-gf-local-robotoslab-css' href='https://meteoric.com.au/wp-content/uploads/elementor/google-fonts/css/robotoslab.css?ver=1746777908' media='all' />
<script src="https://meteoric.com.au/wp-content/themes/astra/assets/js/minified/flexibility.min.js?ver=4.12.5" id="astra-flexibility-js"></script>
<script id="astra-flexibility-js-after">
typeof flexibility !== "undefined" && flexibility(document.documentElement);
//# sourceURL=astra-flexibility-js-after
</script>
<script src="https://meteoric.com.au/wp-content/plugins/superfly-menu/includes/vendor/looks_awesome/icon_manager/js/md5.js?ver=1.0,0" id="la-icon-manager-md5-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/superfly-menu/includes/vendor/looks_awesome/icon_manager/js/util.js?ver=1.0,0" id="la-icon-manager-util-js"></script>
<script id="breeze-prefetch-js-extra">
var breeze_prefetch = {"local_url":"https://meteoric.com.au","ignore_remote_prefetch":"1","ignore_list":["wp-admin","wp-login.php"]};
//# sourceURL=breeze-prefetch-js-extra
</script>
<script src="https://meteoric.com.au/wp-content/plugins/breeze/assets/js/js-front-end/breeze-prefetch-links.min.js?ver=2.4.2" id="breeze-prefetch-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
<script id="sf_main-js-extra">
var SF_Opts = {"wp_menu_id":"12","social":[],"search":"yes","blur":"no","fade":"no","test_mode":"no","hide_def":"no","mob_nav":"no","dynamic":"no","parent_ignore":"yes","sidebar_style":"side","sidebar_behaviour":"slide","alt_menu":"","sidebar_pos":"right","width_panel_1":"260","width_panel_2":"250","width_panel_3":"250","width_panel_4":"200","base_color":"#00052E","opening_type":"click","sub_type":"dropdown","video_bg":"","video_mob":"no","video_preload":"no","sub_mob_type":"dropdown","sub_opening_type":"click","label":"metro","label_top":"20px","label_size":"53","label_vis":"yes","item_padding":"25","bg":"","path":"https://meteoric.com.au/wp-content/plugins/superfly-menu/img/","menu":"{\"12\":{\"term_id\":12,\"name\":\"Mobile Menu\",\"loc\":{\"pages\":{\"2\":1,\"12\":1,\"260\":1,\"275\":1,\"287\":1},\"cposts\":{\"e-floating-buttons\":1,\"elementor_library\":1,\"astra-advanced-hook\":1},\"cats\":{\"1\":1,\"7\":1,\"8\":1,\"9\":1},\"taxes\":{},\"langs\":{},\"wp_pages\":{\"front\":1,\"home\":1,\"archive\":1,\"single\":1,\"forbidden\":1,\"search\":1},\"ids\":[\"\"]},\"isDef\":true}}","togglers":"","subMenuSupport":"yes","subMenuSelector":"sub-menu, children","eventsInterval":"51","activeClassSelector":"current-menu-item","allowedTags":"DIV, NAV, UL, OL, LI, A, P, H1, H2, H3, H4, SPAN","menuData":[],"siteBase":"https://meteoric.com.au","plugin_ver":"5.0.30"};
//# sourceURL=sf_main-js-extra
</script>
<script src="https://meteoric.com.au/wp-content/plugins/superfly-menu/js/public.min.js?ver=5.0.30" id="sf_main-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-dropdown-click/script.min.js?ver=1" id="wpml-legacy-dropdown-click-0-js"></script>
<link rel="https://api.w.org/" href="https://meteoric.com.au/wp-json/" /><link rel="alternate" title="JSON" type="application/json" href="https://meteoric.com.au/wp-json/wp/v2/pages/12" /><link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://meteoric.com.au/xmlrpc.php?rsd" />
<meta name="generator" content="WordPress 6.9.4" />
<link rel='shortlink' href='https://meteoric.com.au/' />
<meta name="generator" content="WPML ver:4.9.2 stt:1,41;" />
<script>

    // global
    window.SFM_is_mobile = (function () {
        var n = navigator.userAgent;
        var reg = new RegExp('Android\s([0-9\.]*)')
        var match = n.toLowerCase().match(reg);
        var android =  match ? parseFloat(match[1]) : false;
        if (android && android < 3.6) {
        	return;
        };

        return n.match(/Android|BlackBerry|IEMobile|iPhone|iPad|iPod|Opera Mini/i);
    })();

    window.SFM_current_page_menu = '12';

    (function(){

        var mob_bar = '';
        var pos = 'right';
        var iconbar = '';

        var SFM_skew_disabled = ( function( ) {
            var window_width = window.innerWidth;
            var sfm_width = 260;
            if ( sfm_width * 2 >= window_width ) {
                return true;
            }
            return false;
        } )( );

        var classes = SFM_is_mobile ? 'sfm-mobile' : 'sfm-desktop';
        var html = document.getElementsByTagName('html')[0]; // pointer
        classes += mob_bar ? ' sfm-mob-nav' : '';
        classes += ' sfm-pos-' + pos;
        classes += iconbar ? ' sfm-bar' : '';
		classes += SFM_skew_disabled ? ' sfm-skew-disabled' : '';

        html.className = html.className == '' ?  classes : html.className + ' ' + classes;

    })();
</script>
<style type="text/css" id="superfly-dynamic">
    @font-face {
        font-family: 'sfm-icomoon';
        src:url('https://meteoric.com.au/wp-content/plugins/superfly-menu/img/fonts/icomoon.eot?wehgh4');
        src: url('https://meteoric.com.au/wp-content/plugins/superfly-menu/img/fonts/icomoon.svg?wehgh4#icomoon') format('svg'),
        url('https://meteoric.com.au/wp-content/plugins/superfly-menu/img/fonts/icomoon.eot?#iefixwehgh4') format('embedded-opentype'),
        url('https://meteoric.com.au/wp-content/plugins/superfly-menu/img/fonts/icomoon.woff?wehgh4') format('woff'),
        url('https://meteoric.com.au/wp-content/plugins/superfly-menu/img/fonts/icomoon.ttf?wehgh4') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }
        .sfm-navicon, .sfm-navicon:after, .sfm-navicon:before, .sfm-sidebar-close:before, .sfm-sidebar-close:after {
        height: 1px !important;
    }
    .sfm-label-square .sfm-navicon-button, .sfm-label-rsquare .sfm-navicon-button, .sfm-label-circle .sfm-navicon-button {
    border-width: 1px !important;
    }

    .sfm-vertical-nav .sfm-submenu-visible > a .sfm-sm-indicator i:after {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    }

    #sfm-mob-navbar .sfm-navicon-button:after {
    /*width: 30px;*/
    }

    .sfm-pos-right .sfm-vertical-nav .sfm-has-child-menu > a:before {
    display: none;
    }

    #sfm-sidebar.sfm-vertical-nav .sfm-menu .sfm-sm-indicator {
    /*background: rgba(255,255,255,0.085);*/
    }

    .sfm-pos-right #sfm-sidebar.sfm-vertical-nav .sfm-menu li a {
    /*padding-left: 10px !important;*/
    }

    .sfm-pos-right #sfm-sidebar.sfm-vertical-nav .sfm-sm-indicator {
    left: auto;
    right: 0;
    }

    #sfm-sidebar.sfm-compact .sfm-nav {
    min-height: 50vh;
    height: auto;
    max-height: none;
    margin-top: 30px;
    }

    #sfm-sidebar.sfm-compact  input[type=search] {
    font-size: 16px;
    }
    /*}*/

            #sfm-sidebar .sfm-sidebar-bg, #sfm-sidebar .sfm-social {
        background-color: #00052E !important;
        }

            #sfm-sidebar .sfm-logo img {
        max-height: px;
        }
    

    #sfm-sidebar, .sfm-sidebar-bg, #sfm-sidebar .sfm-nav, #sfm-sidebar .sfm-widget, #sfm-sidebar .sfm-logo, #sfm-sidebar .sfm-social, .sfm-style-toolbar .sfm-copy {
    width: 260px;
    }
        #sfm-sidebar:not(.sfm-iconbar) .sfm-menu li > a span{
        max-width: calc(260px - 80px);    }
    #sfm-sidebar .sfm-social {
    background-color: transparent !important;
    }

    

        @media only screen and (min-width: 800px) {
        #sfm-sidebar .sfm-menu-level-0 li > a:before,
        #sfm-sidebar .sfm-menu-level-0 .sfm-active-item > a:before,
        #sfm-sidebar .sfm-menu-level-0 .sfm-active-smooth > a:before {
        background-color: #00C2FF;
        }
    }

    #sfm-sidebar .sfm-view-level-1 .sfm-menu a:before,
    #sfm-sidebar .sfm-view-level-1 .sfm-menu .sfm-active-item a:before {
    background-color: #9e466b;
    }

    #sfm-sidebar .sfm-view-level-2 .sfm-menu a:before,
    #sfm-sidebar .sfm-view-level-2 .sfm-menu .sfm-active-item a:before {
    background-color: #36939e;
    }

    #sfm-sidebar .sfm-view-level-3 .sfm-menu a:before,
    #sfm-sidebar .sfm-view-level-3 .sfm-menu .sfm-active-item a:before {
    background-color: #00052E;
    }
    
    
    
        #sfm-sidebar .sfm-menu li:hover > a span,
    #sfm-sidebar .sfm-menu li > a:focus span,
    #sfm-sidebar .sfm-menu li:hover > a img,
    #sfm-sidebar .sfm-menu li > a:focus img,
    #sfm-sidebar .sfm-menu li:hover > a .la_icon,
    #sfm-sidebar .sfm-menu li > a:focus .la_icon,
    #sfm-sidebar .sfm-menu li.sfm-submenu-visible > a img,
    #sfm-sidebar .sfm-menu li.sfm-submenu-visible > a .la_icon,
    #sfm-sidebar .sfm-menu li.sfm-submenu-visible > a span {
    right: -2px;
    left: auto;
    }

    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li > a:focus span,
    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li:hover > a span,
    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li:hover > a img,
    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li > a:focus img,
    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li.sfm-submenu-visible > a img,
    .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li.sfm-submenu-visible > a span {
    right: 2px;
    left: auto;
    }

        #sfm-sidebar .sfm-menu li a,
        #sfm-sidebar .sfm-chapter,
        #sfm-sidebar .widget-area,
        .sfm-search-form input {
        padding-left: 10% !important;
        }

        .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-menu li a,
        .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-view .sfm-back-parent,
        .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .sfm-chapter,
        .sfm-pos-right .sfm-sub-flyout #sfm-sidebar .widget-area,
        .sfm-pos-right .sfm-sub-flyout .sfm-search-form input {
        padding-left: 14% !important;
        }
                #sfm-sidebar .sfm-child-menu.sfm-menu-level-1 li a {
        padding-left: 12% !important;
        }
        #sfm-sidebar .sfm-child-menu.sfm-menu-level-2 li a {
        padding-left: 14% !important;
        }
    
        #sfm-sidebar.sfm-compact .sfm-social li {
        text-align: left;
        }

        #sfm-sidebar.sfm-compact .sfm-social:before {
        right: auto;
        left: auto;
        left: 10%;
        }

                #sfm-sidebar:after {
    display: none !important;
    }

    


    #sfm-sidebar,
    .sfm-pos-right .sfm-sidebar-slide.sfm-body-pushed #sfm-mob-navbar {
    -webkit-transform: translate3d(-260px,0,0);
    transform: translate3d(-260px,0,0);
    }


    .sfm-pos-right #sfm-sidebar, .sfm-sidebar-slide.sfm-body-pushed #sfm-mob-navbar {
    -webkit-transform: translate3d(260px,0,0);
    transform: translate3d(260px,0,0);
    }



    .sfm-pos-left #sfm-sidebar .sfm-view-level-1 {
    left: 260px;
    width: 250px;
    -webkit-transform: translate3d(-250px,0,0);
    transform: translate3d(-250px,0,0);
    }

    #sfm-sidebar .sfm-view-level-1 .sfm-menu {
         width: 250px;
    }
    #sfm-sidebar .sfm-view-level-2 .sfm-menu {
         width: 250px;
    }
    #sfm-sidebar .sfm-view-level-3 .sfm-menu {
         width: 200px;
    }

    .sfm-pos-right #sfm-sidebar .sfm-view-level-1 {
    left: auto;
    right: 260px;
    width: 250px;
    -webkit-transform: translate3d(250px,0,0);
    transform: translate3d(250px,0,0);
    }

    .sfm-pos-left #sfm-sidebar .sfm-view-level-2 {
    left: 510px;
    width: 250px;
    -webkit-transform: translate3d(-760px,0,0);
    transform: translate3d(-760px,0,0);
    }

    .sfm-pos-right #sfm-sidebar .sfm-view-level-2
    {
    left: auto;
    right: 510px;
    width: 250px;
    -webkit-transform: translate3d(760px,0,0);
    transform: translate3d(760px,0,0);
    }

    .sfm-pos-left #sfm-sidebar .sfm-view-level-3 {
    left: 760px;
    width: 200px;
    -webkit-transform: translate3d(-960px,0,0);
    transform: translate3d(-960px,0,0);
    }

    .sfm-pos-right #sfm-sidebar .sfm-view-level-3 {
    left: auto;
    right: 760px;
    width: 200px;
    -webkit-transform: translate3d(760px,0,0);
    transform: translate3d(760px,0,0);
    }

    .sfm-view-pushed-1 #sfm-sidebar .sfm-view-level-2 {
    -webkit-transform: translate3d(-250px,0,0);
    transform: translate3d(-250px,0,0);
    }

    .sfm-pos-right .sfm-view-pushed-1 #sfm-sidebar .sfm-view-level-2 {
    -webkit-transform: translate3d(250px,0,0);
    transform: translate3d(250px,0,0);
    }

    .sfm-view-pushed-2 #sfm-sidebar .sfm-view-level-3 {
    -webkit-transform: translate3d(-200px,0,0);
    transform: translate3d(-200px,0,0);
    }

    .sfm-pos-right .sfm-view-pushed-2 #sfm-sidebar .sfm-view-level-3 {
    -webkit-transform: translate3d(200px,0,0);
    transform: translate3d(200px,0,0);
    }

    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-1,
    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-2,
    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-3,
    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-custom,
    .sfm-sub-dropdown #sfm-sidebar .sfm-view-level-custom {
    left: 260px;
    width: 260px;
    }

    .sfm-sub-dropdown #sfm-sidebar .sfm-view-level-custom {
    width: 260px !important;
    }

    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-custom,
    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-custom .sfm-custom-content,
    .sfm-sub-swipe #sfm-sidebar .sfm-view-level-custom .sfm-content-wrapper {
    width: 250px !important;
    }

    .sfm-sub-swipe #sfm-sidebar .sfm-menu {
    width: 260px;
    }

    .sfm-sub-swipe.sfm-view-pushed-1 #sfm-sidebar .sfm-view-level-1,
    .sfm-sub-swipe.sfm-view-pushed-2 #sfm-sidebar .sfm-view-level-2,
    .sfm-sub-swipe.sfm-view-pushed-3 #sfm-sidebar .sfm-view-level-3,
    .sfm-sub-dropdown.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom,
    .sfm-sub-swipe.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    -webkit-transform: translate3d(-260px,0,0) !important;
    transform: translate3d(-260px,0,0) !important;
    }

    .sfm-sub-swipe.sfm-view-pushed-1 #sfm-sidebar .sfm-scroll-main,
    .sfm-sub-swipe.sfm-view-pushed-custom #sfm-sidebar .sfm-scroll-main,
    .sfm-sub-dropdown.sfm-view-pushed-custom #sfm-sidebar .sfm-scroll-main {
    -webkit-transform: translate3d(-100%,0,0) !important;
    transform: translate3d(-100%,0,0) !important;
    }

    .sfm-sub-swipe.sfm-view-pushed-2 #sfm-sidebar .sfm-view-level-1,
    .sfm-sub-swipe.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-1,
    .sfm-sub-swipe.sfm-view-pushed-3 #sfm-sidebar .sfm-view-level-2,
    .sfm-sub-swipe.sfm-view-pushed-custom.sfm-view-pushed-2 #sfm-sidebar .sfm-view-level-2 {
    -webkit-transform: translate3d(-200%,0,0) !important;
    transform: translate3d(-200%,0,0) !important;
    }

    /* custom content */

    .sfm-pos-left .sfm-view-pushed-1.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    right: -250px;
    }
    .sfm-pos-left .sfm-view-pushed-2.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    right: -500px;
    }
    .sfm-pos-left .sfm-view-pushed-3.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    right: -700px;
    }

    .sfm-sub-swipe.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom,
    .sfm-sub-dropdown.sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    right: 0;
    }
    .sfm-pos-right .sfm-view-pushed-1.sfm-view-pushed-custom #sfm-sidebar.sfm-sub-flyout .sfm-view-level-custom {
    left: -250px;
    }
    .sfm-pos-right .sfm-view-pushed-2.sfm-view-pushed-custom #sfm-sidebar.sfm-sub-flyout .sfm-view-level-custom {
    left: -500px;
    }
    .sfm-pos-right .sfm-view-pushed-3.sfm-view-pushed-custom #sfm-sidebar.sfm-sub-flyout .sfm-view-level-custom {
    left: -700px;
    }

    .sfm-pos-left .sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    transform: translate3d(100%,0,0);
    }
    .sfm-pos-right .sfm-view-pushed-custom #sfm-sidebar .sfm-view-level-custom {
    transform: translate3d(-100%,0,0);
    }


    
    #sfm-sidebar .sfm-menu a img{
    max-width: 40px;
    max-height: 40px;
    }
    #sfm-sidebar .sfm-menu .la_icon{
    font-size: 40px;
    min-width: 40px;
    min-height: 40px;
    }

        
    #sfm-sidebar .sfm-back-parent {
        background: #00052E;
    }

    #sfm-sidebar .sfm-view-level-1, #sfm-sidebar ul.sfm-menu-level-1 {
        background: #00C2FF;
    }

    #sfm-sidebar .sfm-view-level-2, #sfm-sidebar ul.sfm-menu-level-2 {
        background: #9e466b;
    }

    #sfm-sidebar .sfm-view-level-3, #sfm-sidebar ul.sfm-menu-level-3 {
    background: #36939e;
    }

    #sfm-sidebar .sfm-menu-level-0 li, #sfm-sidebar .sfm-menu-level-0 li a, .sfm-title h3, #sfm-sidebar .sfm-back-parent {
    color: #ffffff;
    }

    #sfm-sidebar .sfm-menu li a, #sfm-sidebar .sfm-chapter, #sfm-sidebar .sfm-back-parent {
    padding: 25px 0;
    text-transform: capitalize;
    }
    .sfm-style-full #sfm-sidebar.sfm-hl-line .sfm-menu li > a:before {
    bottom:  20px
    }

    #sfm-sidebar .sfm-search-form input[type=text] {
    padding-top:25px;
    padding-bottom:25px;
    }

    .sfm-sub-swipe #sfm-sidebar .sfm-view .sfm-menu,
    .sfm-sub-swipe .sfm-custom-content,
    .sfm-sub-dropdown .sfm-custom-content {
    padding-top:  70px;
    }

    #sfm-sidebar .sfm-search-form span {
    top: 29px;
    font-size: 17px;
    font-weight: normal;
    }

    #sfm-sidebar {
    font-family: inherit;
    }

    #sfm-sidebar .sfm-sm-indicator {
    line-height: 20px;
    }

    #sfm-sidebar.sfm-indicators .sfm-sm-indicator i  {
    width: 6px;
    height: 6px;
    border-top-width: 2px;
    border-right-width: 2px;
    margin: -3px 0 0 -3px;
    }

    #sfm-sidebar .sfm-search-form input {
    font-size: 20px;
    }

    #sfm-sidebar .sfm-menu li a, #sfm-sidebar .sfm-menu .sfm-chapter, #sfm-sidebar .sfm-back-parent {
    font-family: inherit;
    font-weight: normal;
    font-size: 20px;
    letter-spacing: 0px;
    text-align: left;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    }

    #sfm-sidebar .sfm-social-abbr a {
    font-family: inherit;
    }
    #sfm-sidebar .sfm-widget,
    #sfm-sidebar .widget-area {
    text-align: left;
    }

    #sfm-sidebar .sfm-social {
    text-align: center !important;
    }

    #sfm-sidebar .sfm-menu .sfm-chapter {
    font-size: 15px;
    margin-top: 25px;
    font-weight: bold;
    text-transform: uppercase;
    }
    #sfm-sidebar .sfm-menu .sfm-chapter div{
    font-family: inherit;
    font-size: 15px;
    }
        .sfm-rollback a {
    font-family: inherit;
    }
    #sfm-sidebar .sfm-menu .la_icon{
    color: #777;
    }

    #sfm-sidebar .sfm-menu-level-0 li .sfm-sm-indicator i {
    border-color: #ffffff;
    }
    #sfm-sidebar .sfm-menu-level-0 .sfm-sl, .sfm-title h2, .sfm-social:after {
    color: #eeeeee;
    }
    #sfm-sidebar .sfm-menu-level-1 li .sfm-sm-indicator i {
    border-color: #ffffff;
    }
    #sfm-sidebar .sfm-menu-level-1 .sfm-sl {
    color: #eeeeee;
    }
    #sfm-sidebar .sfm-menu-level-2 li .sfm-sm-indicator i {
    border-color: #ffffff;
    }
    #sfm-sidebar .sfm-menu-level-2 .sfm-sl {
    color: #eeeeee;
    }
    #sfm-sidebar .sfm-menu-level-3 li .sfm-sm-indicator i {
    border-color: #ffffff;
    }
    #sfm-sidebar .sfm-menu-level-3 .sfm-sl {
    color: #eeeeee;
    }
    .sfm-menu-level-0 .sfm-chapter {
    color: #00ffb8 !important;
    }
    .sfm-menu-level-1 .sfm-chapter {
    color: #ffffff !important;
    }
    .sfm-menu-level-2 .sfm-chapter {
    color: #ffffff !important;
    }
    .sfm-menu-level-3 .sfm-chapter {
    color: #ffffff !important;
    }
    #sfm-sidebar .sfm-view-level-1 li a,
    #sfm-sidebar .sfm-menu-level-1 li a{
    color: #ffffff;
    border-color: #ffffff;
    }

    #sfm-sidebar:after {
    background-color: #00052E;
    }

    #sfm-sidebar .sfm-view-level-2 li a,
    #sfm-sidebar .sfm-menu-level-2 li a{
    color: #ffffff;
    border-color: #ffffff;
    }

    #sfm-sidebar .sfm-view-level-3 li a,
    #sfm-sidebar .sfm-menu-level-3 li a {
    color: #ffffff;
    border-color: #ffffff;
    }

    .sfm-navicon-button {
    top: 20px;
    }
    @media only screen and (max-width: 800px) {
    .sfm-navicon-button {
    top: 20px;
    }
    }

    
            .sfm-navicon-button {
        right: 20px !important;
        }
        @media only screen and (max-width: 800px) {
        .sfm-navicon-button {
        right: 20px !important;
        }
        }
        @media only screen and (min-width: 800px) {
        .sfm-pos-left.sfm-bar body, .sfm-pos-left.sfm-bar #wpadminbar {
        padding-left: 260px !important;
        }
        .sfm-pos-right.sfm-bar body, .sfm-pos-right.sfm-bar #wpadminbar {
        padding-right: 260px !important;
        }
    }
    .sfm-navicon:after,
    .sfm-label-text .sfm-navicon:after,
    .sfm-label-none .sfm-navicon:after {
    top: -8px;
    }
    .sfm-navicon:before,
    .sfm-label-text .sfm-navicon:before,
    .sfm-label-none .sfm-navicon:before {
    top: 8px;
    }

    .sfm-body-pushed #sfm-overlay, body[class*="sfm-view-pushed"] #sfm-overlay {
    opacity: 0.6;
    }
            .sfm-body-pushed #sfm-overlay, body[class*="sfm-view-pushed"] #sfm-overlay {
        cursor: url("https://meteoric.com.au/wp-content/plugins/superfly-menu/img/close3.png") 16 16,pointer;
        }
    


    .sfm-style-skew #sfm-sidebar .sfm-social{
    height: auto;
    /*min-height: 75px;*/
    }
    .sfm-theme-top .sfm-sidebar-bg,
    .sfm-theme-bottom .sfm-sidebar-bg{
    width: 520px;
    }
    /* Pos left */
    .sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: translate3d(-260px,0,0) skewX(-12.05deg);
    transform: translate3d(-260px,0,0) skewX(-12.05deg);
    }
    .sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: translate3d(-520px,0,0) skewX(12.05deg);
    transform: translate3d(-260px,0,0) skewX(12.05deg);
    }
    /* Pos right */
    .sfm-pos-right .sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: translate3d(-0px,0,0) skewX(12.05deg);
    transform: translate3d(-0px,0,0) skewX(12.05deg);
    }
    .sfm-pos-right .sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: translate3d(-0px,0,0) skewX(-12.05deg);
    transform: translate3d(-0px,0,0) skewX(-12.05deg);
    }
    /* exposed */
    .sfm-sidebar-exposed.sfm-theme-top .sfm-sidebar-bg,
    .sfm-sidebar-always .sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: translate3d(-86.666666666667px,0,0) skewX(-12.05deg);
    transform: translate3d(-86.666666666667px,0,0) skewX(-12.05deg);
    }
    .sfm-pos-right .sfm-sidebar-exposed.sfm-theme-top .sfm-sidebar-bg,
    .sfm-pos-right .sfm-sidebar-always .sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: translate3d(-260px,0,0) skewX(12.05deg);
    transform: translate3d(-130px,0,0) skewX(12.05deg);
    }
    .sfm-sidebar-exposed.sfm-theme-bottom .sfm-sidebar-bg,
    .sfm-sidebar-always .sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: translate3d(-173.33333333333px,0,0) skewX(12.05deg);
    transform: translate3d(-173.33333333333px,0,0) skewX(12.05deg);
    }
    .sfm-pos-right .sfm-sidebar-exposed.sfm-theme-bottom .sfm-sidebar-bg,
    .sfm-pos-right .sfm-sidebar-always .sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: translate3d(-173.33333333333px,0,0) skewX(-12.05deg);
    transform: translate3d(-173.33333333333px,0,0) skewX(-12.05deg);
    }

    /* Always visible */
    .sfm-sidebar-always.sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: skewX(-12.05deg);
    transform: skewX(-12.05deg);
    }
    .sfm-pos-right .sfm-sidebar-always.sfm-theme-top .sfm-sidebar-bg{
    -webkit-transform: skewX(12.05deg);
    transform: skewX(12.05deg);
    }
    .sfm-sidebar-always.sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: skewX(-160.65deg);
    transform: skewX(-160.65deg);
    }
    .sfm-pos-right .sfm-sidebar-always.sfm-theme-bottom .sfm-sidebar-bg{
    -webkit-transform: skewX(160.65deg);
    transform: skewX(160.65deg);
    }

    .sfm-navicon,
    .sfm-navicon:after,
    .sfm-navicon:before,
    .sfm-label-metro .sfm-navicon-button,
    #sfm-mob-navbar {
    background-color: #000000;
    }

    .sfm-label-metro .sfm-navicon,
    #sfm-mob-navbar .sfm-navicon,
    .sfm-label-metro .sfm-navicon:after,
    #sfm-mob-navbar .sfm-navicon:after,
    .sfm-label-metro .sfm-navicon:before,
    #sfm-mob-navbar .sfm-navicon:before  {
    background-color: #ffffff;
    }
    .sfm-navicon-button .sf_label_icon{
    color: #ffffff;
    }

    .sfm-label-square .sfm-navicon-button,
    .sfm-label-rsquare .sfm-navicon-button,
    .sfm-label-circle .sfm-navicon-button {
    color: #000000;
    }

    .sfm-navicon-button .sf_label_icon{
    width: 53px;
    height: 53px;
    font-size: calc(53px * .6);
    }
    .sfm-navicon-button .sf_label_icon.la_icon_manager_custom{
    width: 53px;
    height: 53px;
    }
    .sfm-navicon-button.sf_label_default{
    width: 53px;
    height: 53px;
    }

    #sfm-sidebar [class*="sfm-icon-"] {
    color: #aaaaaa;
    }

    #sfm-sidebar .sfm-social li {
    border-color: #aaaaaa;
    }

    #sfm-sidebar .sfm-social a:before {
    color: #aaaaaa;
    }

    #sfm-sidebar .sfm-search-form {
    background-color: rgba(255, 255, 255, 0.05);
    }

    #sfm-sidebar li:hover span[class*='fa-'] {
    opacity: 1 !important;
    }
                </style>
<script>

    ;(function (){
        var insertListener = function(event){
            if (event.animationName == "bodyArrived") {
                afterContentArrived();
            }
        }
        var timer, _timer;

        if (document.addEventListener && false) {
            document.addEventListener("animationstart", insertListener, false); // standard + firefox
            document.addEventListener("MSAnimationStart", insertListener, false); // IE
            document.addEventListener("webkitAnimationStart", insertListener, false); // Chrome + Safari
        } else {
            timer = setInterval(function(){
                if (document.body) { //
                    clearInterval(timer);
                    afterContentArrived();
                }
            },14);
        }

        function afterContentArrived() {
            clearTimeout(_timer);
            var htmlClss;

            if ( window.jQuery && window.jQuery.Deferred ) { // additional check bc of Divi theme
                htmlClss = document.getElementsByTagName('html')[0].className;
                if (htmlClss.indexOf('sfm-pos') === -1) {
                    document.getElementsByTagName('html')[0].className = htmlClss + ' ' + window.SFM_classes;
                }
                jQuery('body').fadeIn();
                jQuery(document).trigger('sfm_doc_body_arrived');
                window.SFM_EVENT_DISPATCHED = true;
            } else {
                _timer = setTimeout(function(){
                    afterContentArrived();
                },14);
            }
        }
    })()
</script><script type='text/javascript'>var SFM_template ="<div class=\"sfm-rollback sfm-color1 sfm-theme-none sfm-label-visible sfm-label-metro  sfm-fixed\" style=\"\">\r\n    <div role='button' tabindex='0' aria-haspopup=\"true\" class='sfm-navicon-button x sf_label_default '><div class=\"sfm-navicon\"><\/div>    <\/div>\r\n<\/div>\r\n<div id=\"sfm-sidebar\" style=\"opacity:0\" data-wp-menu-id=\"12\" class=\"sfm-theme-none sfm-hl-solid sfm-indicators\">\r\n    <div class=\"sfm-scroll-wrapper sfm-scroll-main\">\r\n        <div class=\"sfm-scroll\">\r\n            <div class=\"sfm-sidebar-close\"><\/div>\r\n            <div class=\"sfm-logo sfm-no-image\">\r\n                                                                <div class=\"sfm-title\"><\/div>\r\n            <\/div>\r\n            <nav class=\"sfm-nav\">\r\n                <div class=\"sfm-va-middle\">\r\n                    <ul id=\"sfm-nav\" class=\"menu\"><li id=\"menu-item-707\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-12 current_page_item menu-item-707\"><a href=\"https:\/\/meteoric.com.au\/\" aria-current=\"page\" class=\"menu-link\">Home<\/a><\/li>\n<li id=\"menu-item-708\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-708\"><a role=\"button\" aria-expanded=\"false\" href=\"https:\/\/meteoric.com.au\/about\/\" class=\"menu-link\">About<\/a>\n<ul class=\"sub-menu\">\n\t<li id=\"menu-item-1984\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1984\"><a href=\"https:\/\/meteoric.com.au\/about\/\" class=\"menu-link\">About Meteoric<\/a><\/li>\n\t<li id=\"menu-item-710\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-710\"><a href=\"https:\/\/meteoric.com.au\/our-leadership\/\" class=\"menu-link\">Board &#038; Management<\/a><\/li>\n\t<li id=\"menu-item-1985\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1985\"><a href=\"https:\/\/meteoric.com.au\/corporate-governance\/\" class=\"menu-link\">Corporate Governance<\/a><\/li>\n\t<li id=\"menu-item-1981\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1981\"><a href=\"https:\/\/meteoric.com.au\/corporate-directory\/\" class=\"menu-link\">Corporate Directory<\/a><\/li>\n<\/ul>\n<\/li>\n<li id=\"menu-item-709\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-709\"><a href=\"https:\/\/meteoric.com.au\/caldeira-project\/\" class=\"menu-link\">Caldeira Project<\/a><\/li>\n<li id=\"menu-item-1986\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1986\"><a href=\"https:\/\/meteoric.com.au\/rare-earths-market\/\" class=\"menu-link\">Rare Earths Market<\/a><\/li>\n<li id=\"menu-item-712\" class=\"menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-712\"><a role=\"button\" aria-expanded=\"false\" href=\"#\" class=\"menu-link\">Investors<\/a>\n<ul class=\"sub-menu\">\n\t<li id=\"menu-item-1989\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1989\"><a href=\"https:\/\/meteoric.com.au\/asx-announcements\/\" class=\"menu-link\">ASX Announcements<\/a><\/li>\n\t<li id=\"menu-item-1988\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1988\"><a href=\"https:\/\/meteoric.com.au\/investor-presentations\/\" class=\"menu-link\">Investor Presentations<\/a><\/li>\n\t<li id=\"menu-item-1987\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1987\"><a href=\"https:\/\/meteoric.com.au\/financial-reports\/\" class=\"menu-link\">Financial Reports<\/a><\/li>\n\t<li id=\"menu-item-1990\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1990\"><a href=\"https:\/\/meteoric.com.au\/news-media\/\" class=\"menu-link\">News &#038; Media<\/a><\/li>\n<\/ul>\n<\/li>\n<li id=\"menu-item-1991\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1991\"><a href=\"https:\/\/meteoric.com.au\/careers\/\" class=\"menu-link\">Careers<\/a><\/li>\n<li id=\"menu-item-1992\" class=\"menu-item menu-item-type-post_type menu-item-object-page menu-item-1992\"><a href=\"https:\/\/meteoric.com.au\/contact-us\/\" class=\"menu-link\">Contact Us<\/a><\/li>\n<\/ul>                    <div class=\"sfm-widget-area\"><\/div>\r\n                <\/div>\r\n            <\/nav>\r\n            <ul class=\"sfm-social sfm-social-icons\"><\/ul>\r\n                    <\/div>\r\n    <\/div>\r\n    <div class=\"sfm-sidebar-bg\">\r\n        <!-- eg. https:\/\/www.youtube.com\/watch?v=AgI7OcZ9g60 or https:\/\/www.youtube.com\/watch?v=gU10ALRQ0ww -->\r\n            <\/div>\r\n    <div class=\"sfm-view sfm-view-level-custom\">\r\n        <span class=\"sfm-close\"><\/span>\r\n            <\/div>\r\n<\/div>\r\n<div id=\"sfm-overlay-wrapper\"><div id=\"sfm-overlay\"><\/div><div class=\"sfm-nav-bg_item -top\"><\/div><div class=\"sfm-nav-bg_item -bottom\"><\/div><\/div>"</script><meta name="generator" content="Elementor 3.35.8; features: e_font_icon_svg, additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-swap">
<script async src='https://www.googletagmanager.com/gtag/js?id=G-TZMDW73Z50'></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}gtag('js', new Date());

 gtag('config', 'G-TZMDW73Z50' , {});

</script>
			<style>
				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload),
				.e-con.e-parent:nth-of-type(n+4):not(.e-lazyloaded):not(.e-no-lazyload) * {
					background-image: none !important;
				}
				@media screen and (max-height: 1024px) {
					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload),
					.e-con.e-parent:nth-of-type(n+3):not(.e-lazyloaded):not(.e-no-lazyload) * {
						background-image: none !important;
					}
				}
				@media screen and (max-height: 640px) {
					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload),
					.e-con.e-parent:nth-of-type(n+2):not(.e-lazyloaded):not(.e-no-lazyload) * {
						background-image: none !important;
					}
				}
			</style>
			<link rel="icon" href="https://meteoric.com.au/wp-content/uploads/2025/05/meteoric-favicon-90x90.png" sizes="32x32" />
<link rel="icon" href="https://meteoric.com.au/wp-content/uploads/2025/05/meteoric-favicon.png" sizes="192x192" />
<link rel="apple-touch-icon" href="https://meteoric.com.au/wp-content/uploads/2025/05/meteoric-favicon.png" />
<meta name="msapplication-TileImage" content="https://meteoric.com.au/wp-content/uploads/2025/05/meteoric-favicon.png" />
		<style id="wp-custom-css">
			.top-h-menu .sub-menu .menu-item a
 {
    color: #fff!important;
}
.search-results .ast-breadcrumbs {
    display: none;
}
.error404 div#content {
    background: #fff;
}
.error404 .ast-container {
    max-width: 1330px;
    padding: 0px;
}
.wpml-ls-sub-menu a.wpml-ls-link:hover {
    background: #00052e !important;
	color: #ffffff !important;
}
.wpml-ls-legacy-dropdown-click .wpml-ls-current-language:hover, .wpml-ls-legacy-dropdown-click a:hover, .wpml-ls-legacy-dropdown-click a:focus
 {
    background: #00052e !important;
    color: #ffffff !important;
}
#sfm-sidebar .sfm-search-form span {
    top: 19px;
}
.elementor-2336 .elementor-element.elementor-element-a2e97af .card-wrapper:hover .card-content
 {
    margin-bottom: 0px;
    height: 40%!important;
}
a.js-wpml-ls-item-toggle.wpml-ls-item-toggle, a.wpml-ls-link {
    background: transparent;
    color: #fff;
    border: 0px;
    font-size: 15px;
    line-height: 19.5px;
    font-weight: bold;
	padding-top: 9.1px;
    padding-bottom: 9.1px;
}
.wpml-ls-legacy-dropdown-click {
    width: unset!important;
}
.wpml-ls-legacy-dropdown-click .wpml-ls-current-language:hover>a, .wpml-ls-legacy-dropdown-click a:focus, .wpml-ls-legacy-dropdown-click a:hover
 {
    color: #1B75BC!important;
    background: transparent!important;
}
html,body{
    overflow-x: hidden;
}
.home-footer-gradient {
  background-image: var(--prefooter-gradient,linear-gradient(to top,hsla(0,0%,100%,0) 0,hsla(0,0%,100%,.013) 8.1%,hsla(0,0%,100%,.049) 15.5%,hsla(0,0%,100%,.104) 22.5%,hsla(0,0%,100%,.175) 29%,hsla(0,0%,100%,.259) 35.3%,hsla(0,0%,100%,.352) 41.2%,hsla(0,0%,100%,.45) 47.1%,hsla(0,0%,100%,.55) 52.9%,hsla(0,0%,100%,.648) 58.8%,hsla(0,0%,100%,.741) 64.7%,hsla(0,0%,100%,.825) 71%,hsla(0,0%,100%,.896) 77.5%,hsla(0,0%,100%,.951) 84.5%,hsla(0,0%,100%,.987) 91.9%,#fff 100%));
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% max(10rem,22.4299065421%);
  position: absolute;
  z-index: 2;
  height: 160px;
  width: 100%;
  top: 0;
}
.ast-primary-sticky-header-active #masthead .ast-container, .ast-primary-sticky-header-active .site-header-focus-item + .ast-breadcrumbs-wrapper {
    max-width: 100%;
    padding-left: 45px;
    padding-right: 45px;
}
.ast-primary-sticky-header-active .ast-primary-header-bar.ast-primary-header.main-header-bar.site-header-focus-item {
    padding: 10px 0px;
}
.ast-sticky-main-shrink .ast-sticky-shrunk .site-logo-img img {
    max-height: 75px !important;
}
.ast-primary-sticky-header-active span.site-logo-img {
    padding: 0px !important;
}
.ast-primary-sticky-header-active span.site-logo-img {
    margin-top: 0px;
}
.ast-primary-sticky-header-active .ast-mm-custom-content.ast-mm-template-content {
    padding-top: 22px !important;
}
.ast-primary-sticky-header-active .astra-advanced-hook-104, .ast-primary-sticky-header-active .astra-advanced-hook-2348, .ast-primary-sticky-header-active .ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center::before { 
    display: none;
}
h2.elementor-heading-title.elementor-size-default, h3.elementor-heading-title.elementor-size-default
 {
    margin: 0;
}
footer.elementor-slideshow__footer.elementor-lightbox-prevent-close {
    display: none;
}

.ast-desktop .ast-menu-hover-style-underline > .menu-item:hover > .menu-link:before, .ast-desktop .ast-menu-hover-style-overline > .menu-item:hover > .menu-link:before {
    width: calc(100% - 55px);
}
.main-header-menu a.menu-link .menu-text {
    border-bottom: 1px solid transparent;
	  padding: 15px 0px;
}
.main-header-menu .current_page_item a.menu-link .menu-text {
    border-bottom: 1px solid #fff;
}
.home-map .e-hotspot__tooltip {
  white-space: unset;
}
.map-pop-up p {
    width: 300px;
}
.e-hotspot__tooltip.e-hotspot--tooltip-position.e-hotspot--fade-in-out p {
    display: none;
}
.e-hotspot__tooltip.e-hotspot--tooltip-position.e-hotspot--fade-in-out {
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 87%, /* bottom right */ 90% 100%, /* bottom right */ 0% 100%, /* bottom left */ 0 95% /* bottom left */);
}
.project-loc-pop {
    margin-top: -23px;
}
.home-map .e-hotspot__tooltip {
    white-space: unset;
    width: 566px;
}
.single-post-img {
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 87%, /* bottom right */ 100% 100%, /* bottom right */ 10% 100%, /* bottom left */ 0% 84% /* bottom left */);
}
.ast-mm-custom-content.ast-mm-template-content {
    /*top: 50px;*/
    position: relative;
	padding-top: 25px!important;
}
ul.astra-megamenu.sub-menu.astra-mega-menu-width-full-stretched {
    padding: 0px !important;
}
.ast-mm-custom-content.ast-mm-template-content {
    margin: 0px !important;
}
#uc_expanding_content_cards_elementor_28c0202.exp-wrapper .ue_options .ue_option::after
{
background: linear-gradient(180deg,rgba(42, 123, 155, 0) 0%, rgba(0, 0, 0, 1) 100%);
}
input#gform_submit_button_2, input#gform_submit_button_3 {
   background: #00052E;
    width: 146px;
    height: 44px;
    font-size: 14px !important;
    text-transform: uppercase;
    border-radius: 8px;
    margin-top: 23px;
}
#gform_wrapper_2 .gform-footer.gform_footer.top_label, #gform_wrapper_3 .gform-footer.gform_footer.top_label {
    display: block;
    vertical-align: top;
    align-items: normal;
    text-align: right;
}
div#gform_fields_2, div#gform_fields_3 {
    column-gap: 13px !important;
    row-gap: 23px !important;
}
#gform_wrapper_2  .gform-body.gform_body {
    display: block;
    width: 100%;
    padding-right: 0px;
    vertical-align: top;
}
#gform_wrapper_2 .ginput_container.ginput_container_text input, #gform_wrapper_2 .ginput_container.ginput_container_email input, #gform_wrapper_2 .ginput_container_textarea textarea, #gform_wrapper_3 .ginput_container.ginput_container_text input, #gform_wrapper_3 .ginput_container.ginput_container_email input, #gform_wrapper_3 .ginput_container_textarea textarea, #gform_wrapper_3 .ginput_container_phone input {
    background: #EEEEEE;
    border: 1px solid #2F3355 !important;
    padding: 17px 24px !important;
    font-size: 14px !important;
    color: #00052E !important;
    height: unset !important;
	line-height: 18px;
}
.custom-icon-list svg.e-font-icon-svg.e-far-file-pdf {
    background: url(/wp-content/uploads/2025/05/icon-document.webp) no-repeat;
    background-size: contain;
    color: transparent;
    fill: transparent;
}
.percent-box:after {
    content: " ";
    width: 20px;
    height: 20px;
    background: url(/wp-content/uploads/2025/05/Triangle-1.png) no-repeat;
    position: absolute;
    left: 41%;
}
.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center::before {
  content: "";
  position: fixed;
  top: 31px;
  bottom: 0;
  width: calc(100%);
  border-top: 1px solid rgba(255,255,255,0.25);
  z-index: -1;
  pointer-events: none;
  left: 260px;
}
.elementor-blockquote__author strong {
    color: #00C2FF;
}
#gform_wrapper_1 .gform-footer.gform_footer.top_label {
    margin-top: 0px;
}
#gform_wrapper_1 .gform-body.gform_body {
    display: inline-block;
}

#gform_wrapper_1 .gform-footer.gform_footer.top_label {
    display: inline-block;
vertical-align: top;
}
#gform_wrapper_1 .gform-body.gform_body {
    display: inline-block;
    width: 85%;
    padding-right: 30px;
    vertical-align: top;
}
.with-arrow-design::after {
    content: " ";
    background: url(/wp-content/uploads/2025/05/Triangle.png;)no-repeat;
    width: 40px;
    height: 20px;
    display: block;
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: calc(50% - 20px);
}
.with-arrow-design-blue::after
 {
    content: " ";
    background: url(/wp-content/uploads/2025/05/Triangle.png;) no-repeat;
    width: 40px;
    height: 20px;
    display: block;
    z-index: 1;
    position: absolute;
    top: -1px;
    left: calc(50% - 20px);
    transform: rotate(180deg);
}
span.site-logo-img {
    margin-top: -20px;
}
.site-branding.ast-site-identity {
    padding: 0px;
}
.sub-menu .menu-item a {
    color: #000 !important;
}
span.list-date {
    position: absolute;
    right: 0px;
}
.scroll-downs {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  
  width :40px;
  height: 40px;
}
.mousey {
  width: 3px;
  padding: 10px 10px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 25px;
  opacity: 0.75;
  box-sizing: content-box;
}
.scroller {
  width: 3px;
  height: 10px;
  border-radius: 25%;
  background-color: #fff;
  animation-name: scroll;
  animation-duration: 2.2s;
  animation-timing-function: cubic-bezier(.15,.41,.69,.94);
  animation-iteration-count: infinite;
}
@keyframes scroll {
  0% { opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0;}
}
.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: calc(100%);
  border-top: 1px solid rgba(255,255,255,0.25);
  z-index: -1;
  pointer-events: none;
  left: 216px;
}
.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center {
  position: relative;
}
.site-logo-img img.custom-logo {
    width: 130px;
}
.footer-bg-white-area {
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 93%, /* bottom right */ 96% 100%, /* bottom right */ 0% 100%, /* bottom left */ 0 95% /* bottom left */);
}
.img-notch img {
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 87%, /* bottom right */ 90% 100%, /* bottom right */ 0% 100%, /* bottom left */ 0 95% /* bottom left */);
}
.img-notch-cta{
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 87%, /* bottom right */ 90% 100%, /* bottom right */ 0% 100%, /* bottom left */ 0 95% /* bottom left */);
}
.featured-img-notch{
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 87%, /* bottom right */ 100% 100%, /* bottom right */ 8% 100%, /* bottom left */ 0% 89% /* bottom left */);
}
.trans-banner-bg{
    background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
}
.home .footer-bg-white-area {
    margin-top: -40px;
}
.sfm-rollback.sfm-color1.sfm-theme-none.sfm-label-visible.sfm-label-metro {
    display: none;
}
@media handheld, only screen and (max-width: 1500px){
.gform-body.gform_body {
    width: 80%;
}
}
@media handheld, only screen and (max-width: 1300px){
.site-primary-header-wrap.ast-builder-grid-row-container.site-header-focus-item.ast-container {
    padding-left: 10px !important;
}
}
@media handheld, only screen and (max-width: 1179px){
.gform-body.gform_body {
    width: 80%;
}
}
@media handheld, only screen and (max-width: 1140px){
.main-header-menu .menu-item a.menu-link {
    padding-left: 19px;
    padding-right: 19px;
}
}
@media handheld, only screen and (max-width: 1024px){
.ast-header-sticked {
    display: none!important;
}
}
@media handheld, only screen and (max-width: 959px){
.gform-footer.gform_footer.top_label {
    display: block;
    margin-top: 30px;
}
.gform-body.gform_body {
    width: 90%;
	padding-right: 0px;
}
}
@media handheld, only screen and (max-width: 880px){
.home-map .e-hotspot__tooltip {
    white-space: unset;
    width: 300px;
}
}
@media handheld, only screen and (max-width: 1024px){
nav#primary-site-navigation-desktop {
    display: none;
}
.astra-advanced-hook-104 {
	display: none;
	}
.sfm-rollback.sfm-color1.sfm-theme-none.sfm-label-visible.sfm-label-metro {
    display: block;
}
	.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center::before{
		display: none;
	}
    span.site-logo-img {
        margin-top: 15px;
        padding-left: 10px;
    }
}
@media handheld, only screen and (max-width: 937px){
div#ast-desktop-header {
    display: none;
}
}
@media handheld, only screen and (max-width: 767px){
#gform_wrapper_1 div#gform_fields_1 {
    display: block 
}
#gform_wrapper_1 div#field_1_1 {
    margin-bottom: 30px;
}
.ast-builder-grid-row.ast-builder-grid-row-has-sides.ast-builder-grid-row-no-center::before{
	display:none;
	}
.footer-bg-white-area {
    clip-path: polygon(0% 0%, /* top left */ 5% 0%, /* top left */ 100% 0%, /* top right */ 100% 5%, /* top right */ 100% 96%, /* bottom right */ 94% 100%, /* bottom right */ 0% 100%, /* bottom left */ 0 95% /* bottom left */);
}
span.site-logo-img {
    padding-left: 20px;
}
}		</style>
		</head>

<body itemtype='https://schema.org/WebPage' itemscope='itemscope' class="home wp-singular page-template-default page page-id-12 wp-custom-logo wp-embed-responsive wp-theme-astra wp-child-theme-meteoric ast-desktop ast-page-builder-template ast-no-sidebar astra-4.12.5 group-blog ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header ast-full-width-primary-header ast-full-width-layout ast-sticky-main-shrink ast-sticky-header-shrink ast-inherit-site-logo-sticky ast-sticky-custom-logo ast-primary-sticky-enabled elementor-default elementor-kit-8 elementor-page elementor-page-12 astra-addon-4.12.4">

<a
	class="skip-link screen-reader-text"
	href="#content">
		Skip to content</a>

<div
class="hfeed site" id="page">
			<header
		class="site-header header-main-layout-1 ast-primary-menu-enabled ast-logo-title-inline ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline" id="masthead" itemtype="https://schema.org/WPHeader" itemscope="itemscope" itemid="#masthead"		>
								<div class="astra-advanced-hook-104 ">
						<div data-elementor-type="wp-post" data-elementor-id="104" class="elementor elementor-104" data-elementor-post-type="astra-advanced-hook">
				<div class="elementor-element elementor-element-003bbb9 e-con-full elementor-hidden-tablet elementor-hidden-mobile_extra elementor-hidden-mobile e-flex e-con e-parent" data-id="003bbb9" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-9239618 e-con-full e-flex e-con e-child" data-id="9239618" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-1e4e6bd elementor-nav-menu--dropdown-none top-h-menu elementor-widget elementor-widget-nav-menu" data-id="1e4e6bd" data-element_type="widget" data-e-type="widget" data-settings="{&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;i aria-hidden=\&quot;true\&quot; class=\&quot;\&quot;&gt;&lt;\/i&gt;&quot;,&quot;library&quot;:&quot;&quot;},&quot;layout&quot;:&quot;horizontal&quot;}" data-widget_type="nav-menu.default">
				<div class="elementor-widget-container">
								<nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none">
				<ul id="menu-1-1e4e6bd" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2833"><a href="https://meteoric.com.au/careers/" class="elementor-item menu-link">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2834"><a role="button" aria-expanded="false" href="https://meteoric.com.au/contact-us/" class="elementor-item menu-link">Contact Us</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-2835"><a target="_blank" href="https://meteoric.factorialhr.com.br/complaints" class="elementor-sub-item menu-link">Complaint Channel</a></li>
</ul>
</li>
</ul>			</nav>
						<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-1e4e6bd" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2833"><a href="https://meteoric.com.au/careers/" class="elementor-item menu-link" tabindex="-1">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2834"><a role="button" aria-expanded="false" href="https://meteoric.com.au/contact-us/" class="elementor-item menu-link" tabindex="-1">Contact Us</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-2835"><a target="_blank" href="https://meteoric.factorialhr.com.br/complaints" class="elementor-sub-item menu-link" tabindex="-1">Complaint Channel</a></li>
</ul>
</li>
</ul>			</nav>
						</div>
				</div>
				<div class="elementor-element elementor-element-1c0bb5a elementor-widget__width-initial elementor-widget elementor-widget-text-editor" data-id="1c0bb5a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<iframe style=""src ="https://wcsecure.weblink.com.au/clients/meteoric/v3/priceframe.aspx" width="100%" height="25px" scrolling="no" frameborder="0"></iframe>								</div>
				</div>
				<div class="elementor-element elementor-element-bcb607c elementor-widget elementor-widget-text-editor" data-id="bcb607c" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Language: </p>								</div>
				</div>
				<div class="elementor-element elementor-element-396627a elementor-widget elementor-widget-text-editor" data-id="396627a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									
<div role="navigation" aria-label="Language Switcher" class="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
	<ul>

		<li class="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-en wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click">

			<a href="#" hreflang="" lang="" class="js-wpml-ls-item-toggle wpml-ls-item-toggle" aria-expanded="false" aria-controls="wpml-ls-submenu-click-default" aria-haspopup="true" aria-label="Language switcher, click to open then tab to navigate" tabindex="0" role="button" title="Switch to English">
				<span class="wpml-ls-native">English</span></a>

			<ul id="wpml-ls-submenu-click-default" class="js-wpml-ls-sub-menu wpml-ls-sub-menu">
				
					<li class="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-pt-pt wpml-ls-last-item">
						<a href="https://meteoric.com.au/pt-pt/" hreflang="pt-pt" lang="pt-pt" class="wpml-ls-link" aria-label="Switch to Português" title="Switch to Português">
							<span class="wpml-ls-native">Português</span></a>
					</li>

							</ul>

		</li>

	</ul>
</div>
								</div>
				</div>
				</div>
				</div>
				</div>
							</div>
				<div id="ast-desktop-header" data-toggle-type="dropdown">
		<div class="ast-main-header-wrap main-header-bar-wrap ">
		<div class="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item" data-section="section-primary-header-builder">
						<div class="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container" data-section="section-primary-header-builder">
				<div class="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
											<div class="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
									<div class="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
							<div
				class="site-branding ast-site-identity" itemtype="https://schema.org/Organization" itemscope="itemscope"				>
					<span class="site-logo-img"><a href="https://meteoric.com.au/" class="custom-logo-link" rel="home" aria-current="page"><img width="262" height="178" src="https://meteoric.com.au/wp-content/uploads/2025/05/logo-meteoric.webp" class="custom-logo" alt="Meteoric Resources" decoding="async" /></a><a href="https://meteoric.com.au/" class="sticky-custom-logo" rel="home" itemprop="url"><img width="90" height="55" src="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp" class="custom-logo" alt="" decoding="async" srcset="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp 90w, https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky.webp 211w" sizes="(max-width: 90px) 100vw, 90px" /></a></span>				</div>
			<!-- .site-branding -->
					</div>
				<div class="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
			<div class="ast-main-header-bar-alignment"><div class="main-header-bar-navigation"><nav class="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item" id="primary-site-navigation-desktop" aria-label="Primary Site Navigation" itemtype="https://schema.org/SiteNavigationElement" itemscope="itemscope"><div class="main-navigation ast-inline-flex"><ul id="ast-hf-menu-1" class="main-header-menu ast-menu-shadow ast-nav-menu ast-flex  submenu-with-border astra-menu-animation-slide-down  ast-menu-hover-style-underline  stack-on-mobile ast-mega-menu-enabled"><li id="menu-item-63" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-12 current_page_item menu-item-63"><a href="https://meteoric.com.au/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Home</span></a></li><li id="menu-item-309" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-309 astra-megamenu-li full-stretched-width-mega" data-megamenu-trigger="hover"><a role="button" aria-expanded="false" href="https://meteoric.com.au/about/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">About</span><span role="application" class="dropdown-menu-toggle ast-header-navigation-arrow" tabindex="0" aria-expanded="false" aria-label="Menu Toggle"  ><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></span></a><button class="ast-menu-toggle" aria-expanded="false" aria-label="Toggle Menu"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></button>
<div class="astra-full-megamenu-wrapper ast-hidden">

<ul class="astra-megamenu sub-menu astra-mega-menu-width-full-stretched ast-hidden">
	<li id="menu-item-1330" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1330"><span href="javascript:void(0)" class="ast-disable-link ast-hide-menu-item menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">About Megamenu</span></span><div class="ast-mm-custom-content ast-mm-template-content">		<div data-elementor-type="section" data-elementor-id="1324" class="elementor elementor-1324" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-db16f77 e-con-full e-flex e-con e-parent" data-id="db16f77" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-0b60f49 e-con-full e-flex e-con e-child" data-id="0b60f49" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6b38552 elementor-widget elementor-widget-heading" data-id="6b38552" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">ABOUT</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-50d4d4e elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="50d4d4e" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/about/">

											<span class="elementor-icon-list-text">About Meteoric </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/our-leadership/">

											<span class="elementor-icon-list-text">Board &amp; Management </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/corporate-governance/">

											<span class="elementor-icon-list-text">Corporate Governance </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/corporate-directory/">

											<span class="elementor-icon-list-text">Corporate Directory</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-f473faf e-con-full e-flex e-con e-child" data-id="f473faf" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e198b2c elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-widget elementor-widget-heading" data-id="e198b2c" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Meteoric is on a pathway to becoming the world’s lowest cost producer of rare earths products through the development of its Caldeira Rare Earths Project.</h4>				</div>
				</div>
				</div>
				</div>
				</div>
		</div></li></ul>
</li><li id="menu-item-310" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-310"><a href="https://meteoric.com.au/caldeira-project/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Caldeira Project</span></a></li><li id="menu-item-1338" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1338"><a href="https://meteoric.com.au/rare-earths-market/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Rare Earths Market</span></a></li><li id="menu-item-67" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-67 astra-megamenu-li full-stretched-width-mega" data-megamenu-trigger="hover"><a role="button" aria-expanded="false" href="#" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Investors</span><span role="application" class="dropdown-menu-toggle ast-header-navigation-arrow" tabindex="0" aria-expanded="false" aria-label="Menu Toggle"  ><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></span></a><button class="ast-menu-toggle" aria-expanded="false" aria-label="Toggle Menu"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></button>
<div class="astra-full-megamenu-wrapper ast-hidden">

<ul class="astra-megamenu sub-menu astra-mega-menu-width-full-stretched ast-hidden">
	<li id="menu-item-1340" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1340"><span href="javascript:void(0)" class="ast-disable-link ast-hide-menu-item menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Investors Megamenu</span></span><div class="ast-mm-custom-content ast-mm-template-content">		<div data-elementor-type="section" data-elementor-id="1342" class="elementor elementor-1342" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-f70bf5e e-con-full e-flex e-con e-parent" data-id="f70bf5e" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-c8679ce e-con-full e-flex e-con e-child" data-id="c8679ce" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-c42687f elementor-widget elementor-widget-heading" data-id="c42687f" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Investors</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-17abae3 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="17abae3" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://meteoric.com.au/asx-announcements/">

											<span class="elementor-icon-list-text">ASX Announcements</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/investor-presentations/">

											<span class="elementor-icon-list-text">Investor Presentations</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/financial-reports//">

											<span class="elementor-icon-list-text">Financial Reports</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/news-media/">

											<span class="elementor-icon-list-text">News &amp; Media</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-efd1290 e-con-full e-flex e-con e-child" data-id="efd1290" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-40b2fa0 elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-widget elementor-widget-heading" data-id="40b2fa0" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Meteoric is an emerging player in the rare earths sector, strategically positioned to fill critical gaps in global supply chains. Analysts forecast exceptional future growth with the company anticipated to become profitable within three years.</h4>				</div>
				</div>
				</div>
				</div>
				</div>
		</div></li></ul>
</li></ul></div></nav></div></div>		</div>
								</div>
																								<div class="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
															</div>
												</div>
					</div>
								</div>
			</div>
	</div> <!-- Main Header Bar Wrap -->
<div id="ast-mobile-header" class="ast-mobile-header-wrap " data-type="dropdown">
		<div class="ast-main-header-wrap main-header-bar-wrap" >
		<div class="ast-primary-header-bar ast-primary-header main-header-bar site-primary-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default" data-section="section-transparent-header">
									<div class="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
													<div class="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
										<div class="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
							<div
				class="site-branding ast-site-identity" itemtype="https://schema.org/Organization" itemscope="itemscope"				>
					<span class="site-logo-img"><a href="https://meteoric.com.au/" class="custom-logo-link" rel="home" aria-current="page"><img width="262" height="178" src="https://meteoric.com.au/wp-content/uploads/2025/05/logo-meteoric.webp" class="custom-logo" alt="Meteoric Resources" decoding="async" /></a><a href="https://meteoric.com.au/" class="sticky-custom-logo" rel="home" itemprop="url"><img width="90" height="55" src="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp" class="custom-logo" alt="" decoding="async" srcset="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp 90w, https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky.webp 211w" sizes="(max-width: 90px) 100vw, 90px" /></a></span>				</div>
			<!-- .site-branding -->
					</div>
									</div>
																									<div class="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
															</div>
											</div>
						</div>
	</div>
	</div>
				<header id="ast-fixed-header" class="site-header header-main-layout-1 ast-primary-menu-enabled ast-logo-title-inline ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline" style="visibility: hidden;" data-type="fixed-header">

					
										<div class="astra-advanced-hook-104 ">
						<div data-elementor-type="wp-post" data-elementor-id="104" class="elementor elementor-104" data-elementor-post-type="astra-advanced-hook">
				<div class="elementor-element elementor-element-003bbb9 e-con-full elementor-hidden-tablet elementor-hidden-mobile_extra elementor-hidden-mobile e-flex e-con e-parent" data-id="003bbb9" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-9239618 e-con-full e-flex e-con e-child" data-id="9239618" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-1e4e6bd elementor-nav-menu--dropdown-none top-h-menu elementor-widget elementor-widget-nav-menu" data-id="1e4e6bd" data-element_type="widget" data-e-type="widget" data-settings="{&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;i aria-hidden=\&quot;true\&quot; class=\&quot;\&quot;&gt;&lt;\/i&gt;&quot;,&quot;library&quot;:&quot;&quot;},&quot;layout&quot;:&quot;horizontal&quot;}" data-widget_type="nav-menu.default">
				<div class="elementor-widget-container">
								<nav aria-label="Menu" class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none">
				<ul id="menu-1-1e4e6bd" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2833"><a href="https://meteoric.com.au/careers/" class="elementor-item menu-link">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2834"><a role="button" aria-expanded="false" href="https://meteoric.com.au/contact-us/" class="elementor-item menu-link">Contact Us</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-2835"><a target="_blank" href="https://meteoric.factorialhr.com.br/complaints" class="elementor-sub-item menu-link">Complaint Channel</a></li>
</ul>
</li>
</ul>			</nav>
						<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-1e4e6bd" class="elementor-nav-menu"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-2833"><a href="https://meteoric.com.au/careers/" class="elementor-item menu-link" tabindex="-1">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-2834"><a role="button" aria-expanded="false" href="https://meteoric.com.au/contact-us/" class="elementor-item menu-link" tabindex="-1">Contact Us</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-2835"><a target="_blank" href="https://meteoric.factorialhr.com.br/complaints" class="elementor-sub-item menu-link" tabindex="-1">Complaint Channel</a></li>
</ul>
</li>
</ul>			</nav>
						</div>
				</div>
				<div class="elementor-element elementor-element-1c0bb5a elementor-widget__width-initial elementor-widget elementor-widget-text-editor" data-id="1c0bb5a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<iframe style=""src ="https://wcsecure.weblink.com.au/clients/meteoric/v3/priceframe.aspx" width="100%" height="25px" scrolling="no" frameborder="0"></iframe>								</div>
				</div>
				<div class="elementor-element elementor-element-bcb607c elementor-widget elementor-widget-text-editor" data-id="bcb607c" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Language: </p>								</div>
				</div>
				<div class="elementor-element elementor-element-396627a elementor-widget elementor-widget-text-editor" data-id="396627a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									
<div role="navigation" aria-label="Language Switcher" class="wpml-ls-statics-shortcode_actions wpml-ls wpml-ls-legacy-dropdown-click js-wpml-ls-legacy-dropdown-click">
	<ul>

		<li class="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-en wpml-ls-current-language wpml-ls-first-item wpml-ls-item-legacy-dropdown-click">

			<a href="#" hreflang="" lang="" class="js-wpml-ls-item-toggle wpml-ls-item-toggle" aria-expanded="false" aria-controls="wpml-ls-submenu-click-default" aria-haspopup="true" aria-label="Language switcher, click to open then tab to navigate" tabindex="0" role="button" title="Switch to English">
				<span class="wpml-ls-native">English</span></a>

			<ul id="wpml-ls-submenu-click-default" class="js-wpml-ls-sub-menu wpml-ls-sub-menu">
				
					<li class="wpml-ls-slot-shortcode_actions wpml-ls-item wpml-ls-item-pt-pt wpml-ls-last-item">
						<a href="https://meteoric.com.au/pt-pt/" hreflang="pt-pt" lang="pt-pt" class="wpml-ls-link" aria-label="Switch to Português" title="Switch to Português">
							<span class="wpml-ls-native">Português</span></a>
					</li>

							</ul>

		</li>

	</ul>
</div>
								</div>
				</div>
				</div>
				</div>
				</div>
							</div>
				
					<div id="ast-desktop-header" data-toggle-type="dropdown">
		<div class="ast-main-header-wrap main-header-bar-wrap ">
		<div class="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item" data-section="section-primary-header-builder">
						<div class="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container" data-section="section-primary-header-builder">
				<div class="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
											<div class="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
									<div class="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
							<div
				class="site-branding ast-site-identity" itemtype="https://schema.org/Organization" itemscope="itemscope"				>
					<span class="site-logo-img"><a href="https://meteoric.com.au/" class="sticky-custom-logo" rel="home" itemprop="url"><img width="90" height="55" src="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp" class="custom-logo" alt="" decoding="async" srcset="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp 90w, https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky.webp 211w" sizes="(max-width: 90px) 100vw, 90px" /></a></span>				</div>
			<!-- .site-branding -->
					</div>
				<div class="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item" data-section="section-hb-menu-1">
			<div class="ast-main-header-bar-alignment"><div class="main-header-bar-navigation"><nav class="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item" id="primary-site-navigation-desktop-sticky" aria-label="Primary Site Navigation" itemtype="https://schema.org/SiteNavigationElement" itemscope="itemscope"><div class="main-navigation ast-inline-flex"><ul id="ast-hf-menu-1-sticky" class="main-header-menu ast-menu-shadow ast-nav-menu ast-flex  submenu-with-border astra-menu-animation-slide-down  ast-menu-hover-style-underline  stack-on-mobile ast-mega-menu-enabled"><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item page_item page-item-12 current_page_item menu-item-63"><a href="https://meteoric.com.au/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Home</span></a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-309 astra-megamenu-li full-stretched-width-mega" data-megamenu-trigger="hover"><a role="button" aria-expanded="false" href="https://meteoric.com.au/about/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">About</span><span role="application" class="dropdown-menu-toggle ast-header-navigation-arrow" tabindex="0" aria-expanded="false" aria-label="Menu Toggle"  ><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></span></a><button class="ast-menu-toggle" aria-expanded="false" aria-label="Toggle Menu"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></button>
<div class="astra-full-megamenu-wrapper ast-hidden">

<ul class="astra-megamenu sub-menu astra-mega-menu-width-full-stretched ast-hidden">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1330"><span href="javascript:void(0)" class="ast-disable-link ast-hide-menu-item menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">About Megamenu</span></span><div class="ast-mm-custom-content ast-mm-template-content">		<div data-elementor-type="section" data-elementor-id="1324" class="elementor elementor-1324" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-db16f77 e-con-full e-flex e-con e-parent" data-id="db16f77" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-0b60f49 e-con-full e-flex e-con e-child" data-id="0b60f49" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-6b38552 elementor-widget elementor-widget-heading" data-id="6b38552" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">ABOUT</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-50d4d4e elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="50d4d4e" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="/about/">

											<span class="elementor-icon-list-text">About Meteoric </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/our-leadership/">

											<span class="elementor-icon-list-text">Board &amp; Management </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/corporate-governance/">

											<span class="elementor-icon-list-text">Corporate Governance </span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/corporate-directory/">

											<span class="elementor-icon-list-text">Corporate Directory</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-f473faf e-con-full e-flex e-con e-child" data-id="f473faf" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-e198b2c elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-widget elementor-widget-heading" data-id="e198b2c" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Meteoric is on a pathway to becoming the world’s lowest cost producer of rare earths products through the development of its Caldeira Rare Earths Project.</h4>				</div>
				</div>
				</div>
				</div>
				</div>
		</div></li></ul>
</li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-310"><a href="https://meteoric.com.au/caldeira-project/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Caldeira Project</span></a></li><li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1338"><a href="https://meteoric.com.au/rare-earths-market/" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Rare Earths Market</span></a></li><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-67 astra-megamenu-li full-stretched-width-mega" data-megamenu-trigger="hover"><a role="button" aria-expanded="false" href="#" class="menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Investors</span><span role="application" class="dropdown-menu-toggle ast-header-navigation-arrow" tabindex="0" aria-expanded="false" aria-label="Menu Toggle"  ><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></span></a><button class="ast-menu-toggle" aria-expanded="false" aria-label="Toggle Menu"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span></button>
<div class="astra-full-megamenu-wrapper ast-hidden">

<ul class="astra-megamenu sub-menu astra-mega-menu-width-full-stretched ast-hidden">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1340"><span href="javascript:void(0)" class="ast-disable-link ast-hide-menu-item menu-link"><span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span><span class="menu-text">Investors Megamenu</span></span><div class="ast-mm-custom-content ast-mm-template-content">		<div data-elementor-type="section" data-elementor-id="1342" class="elementor elementor-1342" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-f70bf5e e-con-full e-flex e-con e-parent" data-id="f70bf5e" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
		<div class="elementor-element elementor-element-c8679ce e-con-full e-flex e-con e-child" data-id="c8679ce" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-c42687f elementor-widget elementor-widget-heading" data-id="c42687f" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Investors</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-17abae3 elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="17abae3" data-element_type="widget" data-e-type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
							<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://meteoric.com.au/asx-announcements/">

											<span class="elementor-icon-list-text">ASX Announcements</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/investor-presentations/">

											<span class="elementor-icon-list-text">Investor Presentations</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/financial-reports//">

											<span class="elementor-icon-list-text">Financial Reports</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="/news-media/">

											<span class="elementor-icon-list-text">News &amp; Media</span>
											</a>
									</li>
						</ul>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-efd1290 e-con-full e-flex e-con e-child" data-id="efd1290" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-40b2fa0 elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-widget elementor-widget-heading" data-id="40b2fa0" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Meteoric is an emerging player in the rare earths sector, strategically positioned to fill critical gaps in global supply chains. Analysts forecast exceptional future growth with the company anticipated to become profitable within three years.</h4>				</div>
				</div>
				</div>
				</div>
				</div>
		</div></li></ul>
</li></ul></div></nav></div></div>		</div>
								</div>
																								<div class="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
															</div>
												</div>
					</div>
								</div>
			</div>
	</div> <!-- Main Header Bar Wrap -->
<div id="ast-mobile-header" class="ast-mobile-header-wrap " data-type="dropdown">
		<div class="ast-main-header-wrap main-header-bar-wrap" >
		<div class="ast-primary-header-bar ast-primary-header main-header-bar site-primary-header-wrap site-header-focus-item ast-builder-grid-row-layout-default ast-builder-grid-row-tablet-layout-default ast-builder-grid-row-mobile-layout-default" data-section="section-transparent-header">
									<div class="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
													<div class="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
										<div class="ast-builder-layout-element ast-flex site-header-focus-item" data-section="title_tagline">
							<div
				class="site-branding ast-site-identity" itemtype="https://schema.org/Organization" itemscope="itemscope"				>
					<span class="site-logo-img"><a href="https://meteoric.com.au/" class="sticky-custom-logo" rel="home" itemprop="url"><img width="90" height="55" src="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp" class="custom-logo" alt="" decoding="async" srcset="https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky-90x55.webp 90w, https://meteoric.com.au/wp-content/uploads/2025/06/logo-meteoric-sticky.webp 211w" sizes="(max-width: 90px) 100vw, 90px" /></a></span>				</div>
			<!-- .site-branding -->
					</div>
									</div>
																									<div class="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
															</div>
											</div>
						</div>
	</div>
	</div>

					
					
				</header><!-- #astra-fixed-header -->

						</header><!-- #masthead -->
			<div id="content" class="site-content">
		<div class="ast-container">
		

	<div id="primary" class="content-area primary">

		
					<main id="main" class="site-main">
				<article
class="post-12 page type-page status-publish ast-article-single" id="post-12" itemtype="https://schema.org/CreativeWork" itemscope="itemscope">
	
	
<div class="entry-content clear"
	itemprop="text">

	
			<div data-elementor-type="wp-page" data-elementor-id="12" class="elementor elementor-12" data-elementor-post-type="page">
				<div class="elementor-element elementor-element-3aedd1b with-arrow-design e-flex e-con-boxed elementor-invisible e-con e-parent" data-id="3aedd1b" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;video&quot;,&quot;background_video_link&quot;:&quot;https:\/\/www.youtube.com\/watch?v=5Btsnsa7RDY&quot;,&quot;animation&quot;:&quot;fadeIn&quot;}">
					<div class="e-con-inner">
		<div class="elementor-background-video-container elementor-hidden-mobile">
							<div class="elementor-background-video-embed" role="presentation"></div>
						</div>		<div class="elementor-element elementor-element-e62baad elementor-widget__width-initial elementor-widget-mobile__width-inherit e-transform e-transform e-transform e-transform elementor-widget elementor-widget-heading" data-id="e62baad" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_transform_rotateZ_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_rotateZ_effect_laptop&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_rotateZ_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_rotateZ_effect_tablet&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_rotateZ_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_rotateZ_effect_mobile&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect_laptop&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect_tablet&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewX_effect_mobile&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect_laptop&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect_tablet&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_skewY_effect_mobile&quot;:{&quot;unit&quot;:&quot;deg&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">A sustainable supplier of the specialty rare earths materials needed for advanced technology and manufacturing</h2>				</div>
				</div>
		<div class="elementor-element elementor-element-b4bedee e-con-full e-flex e-con e-child" data-id="b4bedee" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-2837a1b elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="2837a1b" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm elementor-animation-float" href="https://wcsecure.weblink.com.au/pdf/MEI/02969122.pdf">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">CALDEIRA PROJECT PRE-FEASIBILITY STUDY</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				<div class="elementor-element elementor-element-e2a5549 elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="e2a5549" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm elementor-animation-float" href="/asx-announcements/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">LATEST ANNOUNCEMENTS</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
		<a class="elementor-element elementor-element-4fd4e53 e-con-full trans-banner-bg elementor-hidden-mobile e-flex elementor-invisible e-con e-child" data-id="4fd4e53" data-element_type="container" data-e-type="container" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:1000,&quot;position&quot;:&quot;absolute&quot;}" href="https://www.linkedin.com/posts/ansto_criticalminerals-metallurgy-mineralprocessing-activity-7358643298586013696-ZzyK?utm_source=share&#038;utm_medium=member_desktop&#038;rcm=ACoAAC7es4sBBIhZq8zcwh80rF1Yzh34pdBl_7Y" target="_blank">
		<div class="elementor-element elementor-element-94906a6 e-con-full e-flex e-con e-child" data-id="94906a6" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-37f263d elementor-widget elementor-widget-heading" data-id="37f263d" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">ANSTO pilot plant in action for our
Caldeira Rare Earth Project</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-72fa51a elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="72fa51a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Watch Video</h2>				</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-23dd6ac elementor-widget-tablet__width-initial elementor-widget elementor-widget-image" data-id="23dd6ac" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<picture fetchpriority="high" decoding="async" class="attachment-full size-full wp-image-3198">
<source type="image/webp" srcset="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png.webp"/>
<img fetchpriority="high" decoding="async" width="256" height="206" src="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-17T105823.817.png" alt=""/>
</picture>
															</div>
				</div>
				</a>
					</div>
				</div>
		<div class="elementor-element elementor-element-710c6d9 elementor-hidden-mobile e-flex e-con-boxed e-con e-parent" data-id="710c6d9" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-4bae16e elementor-widget__width-initial elementor-widget elementor-widget-html" data-id="4bae16e" data-element_type="widget" data-e-type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
					<div class="scroll-downs">
    <a href="#sroll-dwn-section">
  <div class="mousey">
    <div class="scroller"></div>
  </div></a>
</div>				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-b443f2a elementor-hidden-desktop elementor-hidden-laptop elementor-hidden-tablet_extra elementor-hidden-tablet elementor-hidden-mobile_extra elementor-hidden-mobile e-flex e-con-boxed e-con e-parent" data-id="b443f2a" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-2dad9c5 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-invisible elementor-widget elementor-widget-heading" data-id="2dad9c5" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:500}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Accelerating technological innovation through clean energy</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-f729d3e elementor-arrows-position-outside elementor-widget__width-initial elementor-widget elementor-widget-image-carousel" data-id="f729d3e" data-element_type="widget" data-e-type="widget" data-settings="{&quot;slides_to_show&quot;:&quot;1&quot;,&quot;navigation&quot;:&quot;arrows&quot;,&quot;autoplay&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;infinite&quot;:&quot;yes&quot;,&quot;effect&quot;:&quot;slide&quot;,&quot;speed&quot;:500}" data-widget_type="image-carousel.default">
				<div class="elementor-widget-container">
							<div class="elementor-image-carousel-wrapper swiper" role="region" aria-roledescription="carousel" aria-label="Image Carousel" dir="ltr">
			<div class="elementor-image-carousel swiper-wrapper" aria-live="off">
								<div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="1 of 5"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" src="https://meteoric.com.au/wp-content/uploads/2025/08/MEI-PFS-preso_Page_1-scaled.png" alt="MEI PFS preso_Page_1" /></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="2 of 5"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" src="https://meteoric.com.au/wp-content/uploads/2025/08/MEI-PFS-preso_Page_3-scaled.png" alt="MEI PFS preso_Page_3" /></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="3 of 5"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" src="https://meteoric.com.au/wp-content/uploads/2025/08/MEI-PFS-preso_Page_4-scaled.png" alt="MEI PFS preso_Page_4" /></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="4 of 5"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" src="https://meteoric.com.au/wp-content/uploads/2025/08/MEI-PFS-preso_Page_5-scaled.png" alt="MEI PFS preso_Page_5" /></figure></div><div class="swiper-slide" role="group" aria-roledescription="slide" aria-label="5 of 5"><figure class="swiper-slide-inner"><img decoding="async" class="swiper-slide-image" src="https://meteoric.com.au/wp-content/uploads/2025/08/MEI-PFS-preso_Page_6-scaled.png" alt="MEI PFS preso_Page_6" /></figure></div>			</div>
												<div class="elementor-swiper-button elementor-swiper-button-prev" role="button" tabindex="0">
						<svg aria-hidden="true" class="e-font-icon-svg e-eicon-chevron-left" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z"></path></svg>					</div>
					<div class="elementor-swiper-button elementor-swiper-button-next" role="button" tabindex="0">
						<svg aria-hidden="true" class="e-font-icon-svg e-eicon-chevron-right" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><path d="M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z"></path></svg>					</div>
				
									</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-a8691a0 elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-invisible elementor-widget elementor-widget-button" data-id="a8691a0" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:1300}" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/presentation-reports/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">View the full PFS presentation here</span>
					</span>
					</a>
				</div>
								</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-feeb772 e-flex e-con-boxed e-con e-parent" data-id="feeb772" data-element_type="container" data-e-type="container" id="sroll-dwn-section">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-160b130 e-con-full e-flex elementor-invisible e-con e-child" data-id="160b130" data-element_type="container" data-e-type="container" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:500}">
		<div class="elementor-element elementor-element-7c45ce0 e-con-full e-flex e-con e-child" data-id="7c45ce0" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-0b5a8df img-notch elementor-widget elementor-widget-image" data-id="0b5a8df" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<picture loading="lazy" decoding="async" class="attachment-full size-full wp-image-3041">
<source type="image/webp" srcset="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098.png.webp 1488w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-300x229.png.webp 300w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-1024x783.png.webp 1024w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-768x587.png.webp 768w" sizes="(max-width: 1488px) 100vw, 1488px"/>
<img loading="lazy" decoding="async" width="1488" height="1138" src="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098.png" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098.png 1488w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-300x229.png 300w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-1024x783.png 1024w, https://meteoric.com.au/wp-content/uploads/2025/09/Untitled-design-2025-09-01T091329.098-768x587.png 768w" sizes="(max-width: 1488px) 100vw, 1488px"/>
</picture>
															</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-7257ef2 e-con-full e-flex e-con e-child" data-id="7257ef2" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-de09582 elementor-widget elementor-widget-heading" data-id="de09582" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">New technology through rare earths</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-3ea0914 elementor-widget elementor-widget-heading" data-id="3ea0914" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Rare Earths for An Electric Future</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-039d46a elementor-widget elementor-widget-text-editor" data-id="039d46a" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Rare Earths Elements are critical components of many products and industries including electric vehicles, computers, smartphones, televisions, batteries, military applications, aerospace, glass making and steel alloys. Their usage in permanent magnets and batteries puts them at the centre of many fast growing applications in the modern world.</p>								</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-1c8b2e7 e-con-full e-flex elementor-invisible e-con e-child" data-id="1c8b2e7" data-element_type="container" data-e-type="container" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:500}">
		<div class="elementor-element elementor-element-4ef2c59 e-con-full e-flex e-con e-child" data-id="4ef2c59" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-d15ad68 elementor-widget elementor-widget-heading" data-id="d15ad68" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">An ionic absorption clay rare earths deposit</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-8aa5f62 elementor-widget elementor-widget-heading" data-id="8aa5f62" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">A sustainable supplier of specialty rare earths materials.</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-424c003 elementor-widget elementor-widget-text-editor" data-id="424c003" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Meteoric is focused on the rapid and responsible development of its flagship Caldeira Rare Earth Ionic Clay Project, a low cost provincial scale asset with the potential to be a true industry disruptor. Caldeira boasts a large, high-grade Mineral Resource Estimate with characteristics which enable selective mining of ultra high-grade areas to drive attractive economic returns throughout the commodity price cycle.</p>								</div>
				</div>
		<a class="elementor-element elementor-element-398af72 e-con-full e-flex e-con e-child" data-id="398af72" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" href="#elementor-action%3Aaction%3Dlightbox%26settings%3DeyJ0eXBlIjoidmlkZW8iLCJ2aWRlb1R5cGUiOiJ5b3V0dWJlIiwidXJsIjoiaHR0cHM6XC9cL3d3dy55b3V0dWJlLmNvbVwvZW1iZWRcL2Z3ODd1LUt1OGVFP2ZlYXR1cmU9b2VtYmVkIn0%3D">
				<div class="elementor-element elementor-element-a7d0123 elementor-widget elementor-widget-image" data-id="a7d0123" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="118" height="118" src="https://meteoric.com.au/wp-content/uploads/2025/05/icon-play.webp" class="attachment-full size-full wp-image-23" alt="" />															</div>
				</div>
				<div class="elementor-element elementor-element-b9ac393 elementor-widget elementor-widget-image-box" data-id="b9ac393" data-element_type="widget" data-e-type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
					<div class="elementor-image-box-wrapper"><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Watch</h3><p class="elementor-image-box-description">2025 Rule Symposium Preview</p></div></div>				</div>
				</div>
				</a>
				</div>
		<div class="elementor-element elementor-element-5f63116 e-con-full e-flex e-con e-child" data-id="5f63116" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-603d9b9 img-notch elementor-widget elementor-widget-image" data-id="603d9b9" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="1488" height="1138" src="https://meteoric.com.au/wp-content/uploads/2025/05/jet-engine.webp" class="attachment-full size-full wp-image-27" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2025/05/jet-engine.webp 1488w, https://meteoric.com.au/wp-content/uploads/2025/05/jet-engine-300x229.webp 300w, https://meteoric.com.au/wp-content/uploads/2025/05/jet-engine-1024x783.webp 1024w, https://meteoric.com.au/wp-content/uploads/2025/05/jet-engine-768x587.webp 768w" sizes="(max-width: 1488px) 100vw, 1488px" />															</div>
				</div>
				</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-3a37202 with-arrow-design-blue e-flex e-con-boxed e-con e-parent" data-id="3a37202" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-707c8e3 e-con-full e-flex e-con e-child" data-id="707c8e3" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-0a939dc e-con-full e-flex e-con e-child" data-id="0a939dc" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-903dfbe elementor-invisible elementor-widget elementor-widget-heading" data-id="903dfbe" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:700}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">The Caldeira Project</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-4759001 elementor-invisible elementor-widget elementor-widget-heading" data-id="4759001" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:900}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">A sustainable operation with low energy intensity and no tailings dam requirement.</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-707d648 elementor-invisible elementor-widget elementor-widget-text-editor" data-id="707d648" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:1100}" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Caldeira is located in the Brazilian state of Minas Gerais, an international mining heartland with clear approvals pathways and access to low cost renewable energy.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-b1bf441 elementor-widget__width-initial elementor-widget-laptop__width-initial elementor-invisible elementor-widget elementor-widget-button" data-id="b1bf441" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:1300}" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/caldeira-project/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-f2c0f96 e-con-full e-flex e-con e-child" data-id="f2c0f96" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-7e21c67 home-map elementor-invisible elementor-widget elementor-widget-hotspot" data-id="7e21c67" data-element_type="widget" data-e-type="widget" data-settings="{&quot;hotspot&quot;:[{&quot;_id&quot;:&quot;df22cf9&quot;,&quot;hotspot_icon&quot;:{&quot;value&quot;:&quot;fas fa-circle&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;hotspot_tooltip_content&quot;:&quot;&lt;p&gt;&lt;\/p&gt;&quot;,&quot;hotspot_custom_size&quot;:&quot;&quot;,&quot;hotspot_width&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:340,&quot;sizes&quot;:[]},&quot;hotspot_offset_x&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:68.2,&quot;sizes&quot;:[]},&quot;hotspot_offset_y&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:51.5,&quot;sizes&quot;:[]},&quot;__dynamic__&quot;:null,&quot;hotspot_label&quot;:&quot;&quot;,&quot;hotspot_link&quot;:{&quot;url&quot;:&quot;&quot;,&quot;is_external&quot;:&quot;&quot;,&quot;nofollow&quot;:&quot;&quot;,&quot;custom_attributes&quot;:&quot;&quot;},&quot;hotspot_horizontal&quot;:&quot;left&quot;,&quot;hotspot_vertical&quot;:&quot;top&quot;,&quot;hotspot_tooltip_position&quot;:&quot;no&quot;,&quot;hotspot_position&quot;:null}],&quot;hotspot_sequenced_animation&quot;:&quot;yes&quot;,&quot;hotspot_sequenced_animation_duration&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:1,&quot;sizes&quot;:[]},&quot;tooltip_position&quot;:&quot;right&quot;,&quot;tooltip_position_mobile_extra&quot;:&quot;top&quot;,&quot;tooltip_trigger&quot;:&quot;mouseenter&quot;,&quot;_animation&quot;:&quot;bounceIn&quot;,&quot;_animation_delay&quot;:500,&quot;tooltip_animation&quot;:&quot;e-hotspot--fade-in-out&quot;}" data-widget_type="hotspot.default">
				<div class="elementor-widget-container">
					<img loading="lazy" decoding="async" width="1604" height="1858" src="https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map.webp" class="attachment-full size-full wp-image-18" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map.webp 1604w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map-259x300.webp 259w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map-884x1024.webp 884w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map-768x890.webp 768w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-map-1326x1536.webp 1326w" sizes="(max-width: 1604px) 100vw, 1604px" />
						<div class="e-hotspot elementor-repeater-item-df22cf9 e-hotspot--sequenced e-hotspot--position-left e-hotspot--position-top   e-hotspot--icon">

								<div class="e-hotspot__button e-hotspot--expand">
																		<div class="e-hotspot__icon"><svg class="e-font-icon-svg e-fas-circle" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path></svg></div>
																					</div>

																		<div class="e-hotspot__tooltip  e-hotspot--tooltip-position e-hotspot--fade-in-out " >
						<p>		<div data-elementor-type="section" data-elementor-id="1473" class="elementor elementor-1473" data-elementor-post-type="elementor_library">
			<div class="elementor-element elementor-element-21499a4 project-pop e-flex e-con-boxed e-con e-parent" data-id="21499a4" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-59998fd elementor-widget-mobile_extra__width-initial project-pop-img elementor-widget elementor-widget-image" data-id="59998fd" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="1132" height="494" src="https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-lightbox-feature.webp" class="attachment-full size-full wp-image-1455" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-lightbox-feature.webp 1132w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-lightbox-feature-300x131.webp 300w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-lightbox-feature-1024x447.webp 1024w, https://meteoric.com.au/wp-content/uploads/2025/05/caldeira-lightbox-feature-768x335.webp 768w" sizes="(max-width: 1132px) 100vw, 1132px" />															</div>
				</div>
				<div class="elementor-element elementor-element-c3238b7 elementor-widget__width-initial project-loc-pop elementor-widget elementor-widget-heading" data-id="c3238b7" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<div class="elementor-heading-title elementor-size-default">Brazil, South America</div>				</div>
				</div>
		<div class="elementor-element elementor-element-f4bec86 e-con-full project-text-sec e-flex e-con e-child" data-id="f4bec86" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3bbc154 elementor-widget-mobile_extra__width-initial project-pop-h elementor-widget elementor-widget-heading" data-id="3bbc154" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">The Caldeira Project</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-04f583f elementor-widget-mobile_extra__width-initial elementor-widget__width-initial project-pop-text elementor-widget elementor-widget-text-editor" data-id="04f583f" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<ul><li>Caldeira is the most significant and advanced rare earths ionic absorption clay project outside of China</li><li>Caldeira enables Brazil’s objective to foster downstream processing and advanced manufacturing</li><li>Also ideally located for the North American market</li></ul>								</div>
				</div>
				</div>
					</div>
				</div>
				</div>
		</p>					</div>
									
			</div>

	
						</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-a7f87fe e-flex e-con-boxed e-con e-child" data-id="a7f87fe" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-4aa5e22 e-con-full e-flex elementor-invisible e-con e-child" data-id="4aa5e22" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:500}">
				<div class="elementor-element elementor-element-663d6c9 elementor-widget elementor-widget-image" data-id="663d6c9" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="104" height="152" src="https://meteoric.com.au/wp-content/uploads/2025/05/icon-cost.webp" class="attachment-full size-full wp-image-35" alt="" />															</div>
				</div>
				<div class="elementor-element elementor-element-5ac3ea2 elementor-widget elementor-widget-heading" data-id="5ac3ea2" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h5 class="elementor-heading-title elementor-size-default">Low costs</h5>				</div>
				</div>
				<div class="elementor-element elementor-element-797a1db elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="797a1db" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
				<div class="elementor-widget-container">
							<div class="elementor-divider">
			<span class="elementor-divider-separator">
						</span>
		</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-2d2252c elementor-widget elementor-widget-text-editor" data-id="2d2252c" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Low operating costs, low capital cost intensity and a multi-decade life</p>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-da973d5 e-con-full e-flex elementor-invisible e-con e-child" data-id="da973d5" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:700}">
				<div class="elementor-element elementor-element-4451a80 elementor-widget elementor-widget-image" data-id="4451a80" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="152" height="152" src="https://meteoric.com.au/wp-content/uploads/2025/05/icon-renewable-energy.webp" class="attachment-full size-full wp-image-25" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2025/05/icon-renewable-energy.webp 152w, https://meteoric.com.au/wp-content/uploads/2025/05/icon-renewable-energy-150x150.webp 150w" sizes="(max-width: 152px) 100vw, 152px" />															</div>
				</div>
				<div class="elementor-element elementor-element-c6b564b elementor-widget elementor-widget-heading" data-id="c6b564b" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h5 class="elementor-heading-title elementor-size-default">Renewable energy</h5>				</div>
				</div>
				<div class="elementor-element elementor-element-aed7845 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="aed7845" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
				<div class="elementor-widget-container">
							<div class="elementor-divider">
			<span class="elementor-divider-separator">
						</span>
		</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-828cefd elementor-widget elementor-widget-text-editor" data-id="828cefd" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Plan to access renewable energy, use dry stacked tailings and backfill mining areas and inert material</p>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-0dd0d4d e-con-full e-flex elementor-invisible e-con e-child" data-id="0dd0d4d" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:900}">
				<div class="elementor-element elementor-element-8ae0b4c elementor-widget elementor-widget-image" data-id="8ae0b4c" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="160" height="152" src="https://meteoric.com.au/wp-content/uploads/2025/08/icon-low-impact.webp" class="attachment-full size-full wp-image-2694" alt="" />															</div>
				</div>
				<div class="elementor-element elementor-element-b847c87 elementor-widget elementor-widget-heading" data-id="b847c87" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h5 class="elementor-heading-title elementor-size-default">Low impact</h5>				</div>
				</div>
				<div class="elementor-element elementor-element-9146214 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="9146214" data-element_type="widget" data-e-type="widget" data-widget_type="divider.default">
				<div class="elementor-widget-container">
							<div class="elementor-divider">
			<span class="elementor-divider-separator">
						</span>
		</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-eafa318 elementor-widget elementor-widget-text-editor" data-id="eafa318" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Has the potential to be the World’s lowest cost and lowest impact rare earth operation outside of China</p>								</div>
				</div>
				</div>
					</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-123fb0f e-flex e-con-boxed e-con e-parent" data-id="123fb0f" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-fa31008 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-invisible elementor-widget elementor-widget-heading" data-id="fa31008" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:500}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Accelerating technological innovation through clean energy</h2>				</div>
				</div>
		<div class="elementor-element elementor-element-a2e97af e-con-full card-wrapper e-flex elementor-invisible e-con e-child" data-id="a2e97af" data-element_type="container" data-e-type="container" data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;,&quot;animation_delay&quot;:700}">
		<a class="elementor-element elementor-element-8217640 e-con-full img-notch-cta card-wrapper e-flex e-con e-child" data-id="8217640" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" href="/calderia-project/">
		<div class="elementor-element elementor-element-6573a74 e-con-full card-content e-flex e-con e-child" data-id="6573a74" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-aa17811 elementor-widget elementor-widget-heading" data-id="aa17811" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">THE CALDEIRA PROJECT</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-f5831e8 elementor-widget elementor-widget-text-editor" data-id="f5831e8" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>The Caldeira Project has a high-grade +1 billion tonne Mineral Resource, giving the project scale, optionality and the capacity to produce specialty rare earths products at a very low operating cost and capital intensity.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-ffe0abd elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="ffe0abd" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Learn More</h2>				</div>
				</div>
				</div>
				</a>
		<a class="elementor-element elementor-element-02ecca5 e-con-full img-notch-cta card-wrapper  e-flex e-con e-child" data-id="02ecca5" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" href="/rare-earths-market/">
		<div class="elementor-element elementor-element-b0c0600 e-con-full card-content e-flex e-con e-child" data-id="b0c0600" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-59a9bde elementor-widget elementor-widget-heading" data-id="59a9bde" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">RARE EARTHS MARKET</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-2c5234e elementor-widget elementor-widget-text-editor" data-id="2c5234e" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Used in many modern technologies including Electric Vehicle Motors, Permanent Magnets, Wind Turbine Generators and Smart Phones.</p>								</div>
				</div>
				<div class="elementor-element elementor-element-b1e70ae elementor-widget__width-initial elementor-widget elementor-widget-heading" data-id="b1e70ae" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Learn More</h2>				</div>
				</div>
				</div>
				</a>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-bb7ed24 e-flex e-con-boxed e-con e-parent" data-id="bb7ed24" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-dae2019 elementor-widget elementor-widget-heading" data-id="dae2019" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Stay up to date</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-12db64c elementor-grid-tablet-3 elementor-grid-3 elementor-grid-mobile-1 elementor-widget elementor-widget-loop-grid" data-id="12db64c" data-element_type="widget" data-e-type="widget" data-settings="{&quot;template_id&quot;:192,&quot;row_gap&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:25,&quot;sizes&quot;:[]},&quot;columns_tablet&quot;:3,&quot;row_gap_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;row_gap_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:40,&quot;sizes&quot;:[]},&quot;_skin&quot;:&quot;post&quot;,&quot;columns&quot;:&quot;3&quot;,&quot;columns_mobile&quot;:&quot;1&quot;,&quot;edit_handle_selector&quot;:&quot;[data-elementor-type=\&quot;loop-item\&quot;]&quot;,&quot;row_gap_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;row_gap_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;row_gap_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="loop-grid.post">
				<div class="elementor-widget-container">
							<div class="elementor-loop-container elementor-grid" role="list">
		<style id="loop-192">.elementor-192 .elementor-element.elementor-element-4dd5d1a{--display:flex;--flex-direction:column;--container-widget-width:100%;--container-widget-height:initial;--container-widget-flex-grow:0;--container-widget-align-self:initial;--flex-wrap-mobile:wrap;--gap:20px 20px;--row-gap:20px;--column-gap:20px;--padding-top:0px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-192 .elementor-element.elementor-element-6b3f435 > .elementor-widget-container:hover{--e-transform-translateY:5px;}.elementor-192 .elementor-element.elementor-element-6b3f435 img{width:100vw;height:268px;object-fit:cover;object-position:center center;border-radius:5px 5px 5px 5px;}.elementor-192 .elementor-element.elementor-element-6b3f435:hover img{filter:brightness( 91% ) contrast( 100% ) saturate( 100% ) blur( 0px ) hue-rotate( 0deg );}.elementor-192 .elementor-element.elementor-element-f1e9bfb{--display:flex;--flex-direction:row;--container-widget-width:calc( ( 1 - var( --container-widget-flex-grow ) ) * 100% );--container-widget-height:100%;--container-widget-flex-grow:1;--container-widget-align-self:stretch;--flex-wrap-mobile:wrap;--align-items:center;--padding-top:5px;--padding-bottom:0px;--padding-left:0px;--padding-right:0px;}.elementor-192 .elementor-element.elementor-element-2edbd80 > .elementor-widget-container{background-color:#00C2FF;padding:6px 15px 6px 15px;}.elementor-192 .elementor-element.elementor-element-2edbd80 .elementor-heading-title{font-family:"Roboto", Sans-serif;font-size:13px;font-weight:600;line-height:14px;color:#00052E;}.elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-icon{width:14px;}.elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-icon i{font-size:14px;}.elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-icon svg{--e-icon-list-icon-size:14px;}.elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-text, .elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-text a{color:#575865;}.elementor-192 .elementor-element.elementor-element-93bf712 .elementor-icon-list-item{font-family:"Roboto", Sans-serif;font-size:13px;font-weight:500;text-transform:uppercase;line-height:14px;}.elementor-192 .elementor-element.elementor-element-3c0909a .elementor-heading-title{font-family:"Roboto", Sans-serif;font-size:21px;font-weight:400;line-height:31px;color:#00052E;}@media(max-width:880px){.elementor-192 .elementor-element.elementor-element-4dd5d1a{--gap:10px 10px;--row-gap:10px;--column-gap:10px;}.elementor-192 .elementor-element.elementor-element-f1e9bfb{--margin-top:0px;--margin-bottom:-5px;--margin-left:0px;--margin-right:0px;}}</style>		<div data-elementor-type="loop-item" data-elementor-id="192" class="elementor elementor-192 e-loop-item e-loop-item-3455 post-3455 post type-post status-publish format-standard has-post-thumbnail hentry category-news-and-media ast-article-single" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<a class="elementor-element elementor-element-4dd5d1a e-flex e-con-boxed e-con e-parent" data-id="4dd5d1a" data-element_type="container" data-e-type="container" href="https://meteoric.com.au/meteoric-pushes-ahead-with-its-us450-million-rare-earths-project-in-brazil/">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-6b3f435 featured-img-notch e-transform e-transform elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image" data-id="6b3f435" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_transform_translateY_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:5,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="theme-post-featured-image.default">
				<div class="elementor-widget-container">
															<picture loading="lazy" decoding="async" class="attachment-full size-full wp-image-3460">
<source type="image/webp" srcset="https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026.png.webp 600w, https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026-300x300.png.webp 300w, https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026-150x150.png.webp 150w" sizes="(max-width: 600px) 100vw, 600px"/>
<img loading="lazy" decoding="async" width="600" height="600" src="https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026.png" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026.png 600w, https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026-300x300.png 300w, https://meteoric.com.au/wp-content/uploads/2026/03/Bnamericas-Published-Monday-March-16-2026-150x150.png 150w" sizes="(max-width: 600px) 100vw, 600px"/>
</picture>
															</div>
				</div>
		<div class="elementor-element elementor-element-f1e9bfb e-con-full e-flex e-con e-child" data-id="f1e9bfb" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-2edbd80 elementor-widget elementor-widget-heading" data-id="2edbd80" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<p class="elementor-heading-title elementor-size-default"><span>News &amp; Media</span></p>				</div>
				</div>
				<div class="elementor-element elementor-element-93bf712 elementor-widget elementor-widget-post-info" data-id="93bf712" data-element_type="widget" data-e-type="widget" data-widget_type="post-info.default">
				<div class="elementor-widget-container">
							<ul class="elementor-inline-items elementor-icon-list-items elementor-post-info">
								<li class="elementor-icon-list-item elementor-repeater-item-4ccf137 elementor-inline-item" itemprop="datePublished">
													<span class="elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-date">
										<time>March 17, 2026</time>					</span>
								</li>
				</ul>
						</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-3c0909a elementor-widget elementor-widget-heading" data-id="3c0909a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Meteoric pushes ahead with its US$450 million rare earths project in Brazil</h2>				</div>
				</div>
					</div>
				</a>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="192" class="elementor elementor-192 e-loop-item e-loop-item-3390 post-3390 post type-post status-publish format-standard has-post-thumbnail hentry category-news-and-media ast-article-single" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<a class="elementor-element elementor-element-4dd5d1a e-flex e-con-boxed e-con e-parent" data-id="4dd5d1a" data-element_type="container" data-e-type="container" href="https://meteoric.com.au/meteoric-resources-riu-explorers-2026-qa-with-the-pick/">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-6b3f435 featured-img-notch e-transform e-transform elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image" data-id="6b3f435" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_transform_translateY_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:5,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="theme-post-featured-image.default">
				<div class="elementor-widget-container">
															<picture loading="lazy" decoding="async" class="attachment-full size-full wp-image-3397">
<source type="image/webp" srcset="https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick.png.webp 1752w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-300x168.png.webp 300w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-1024x574.png.webp 1024w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-768x430.png.webp 768w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-1536x861.png.webp 1536w" sizes="(max-width: 1752px) 100vw, 1752px"/>
<img loading="lazy" decoding="async" width="1752" height="982" src="https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick.png" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick.png 1752w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-300x168.png 300w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-1024x574.png 1024w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-768x430.png 768w, https://meteoric.com.au/wp-content/uploads/2026/03/MEI-the-pick-1536x861.png 1536w" sizes="(max-width: 1752px) 100vw, 1752px"/>
</picture>
															</div>
				</div>
		<div class="elementor-element elementor-element-f1e9bfb e-con-full e-flex e-con e-child" data-id="f1e9bfb" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-2edbd80 elementor-widget elementor-widget-heading" data-id="2edbd80" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<p class="elementor-heading-title elementor-size-default"><span>News &amp; Media</span></p>				</div>
				</div>
				<div class="elementor-element elementor-element-93bf712 elementor-widget elementor-widget-post-info" data-id="93bf712" data-element_type="widget" data-e-type="widget" data-widget_type="post-info.default">
				<div class="elementor-widget-container">
							<ul class="elementor-inline-items elementor-icon-list-items elementor-post-info">
								<li class="elementor-icon-list-item elementor-repeater-item-4ccf137 elementor-inline-item" itemprop="datePublished">
													<span class="elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-date">
										<time>March 4, 2026</time>					</span>
								</li>
				</ul>
						</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-3c0909a elementor-widget elementor-widget-heading" data-id="3c0909a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Meteoric Resources RIU Explorers 2026 Q&#038;A with The Pick</h2>				</div>
				</div>
					</div>
				</a>
				</div>
				<div data-elementor-type="loop-item" data-elementor-id="192" class="elementor elementor-192 e-loop-item e-loop-item-3379 post-3379 post type-post status-publish format-standard has-post-thumbnail hentry category-news-and-media ast-article-single" data-elementor-post-type="elementor_library" data-custom-edit-handle="1">
			<a class="elementor-element elementor-element-4dd5d1a e-flex e-con-boxed e-con e-parent" data-id="4dd5d1a" data-element_type="container" data-e-type="container" href="https://meteoric.com.au/meteoric-riu-explorers-conference-2026/">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-6b3f435 featured-img-notch e-transform e-transform elementor-widget elementor-widget-theme-post-featured-image elementor-widget-image" data-id="6b3f435" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_transform_translateY_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:5,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_laptop&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile_extra&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_hover_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="theme-post-featured-image.default">
				<div class="elementor-widget-container">
															<picture loading="lazy" decoding="async" class="attachment-full size-full wp-image-3385">
<source type="image/webp" srcset="https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso.png.webp 1620w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-300x166.png.webp 300w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-1024x566.png.webp 1024w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-768x425.png.webp 768w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-1536x850.png.webp 1536w" sizes="(max-width: 1620px) 100vw, 1620px"/>
<img loading="lazy" decoding="async" width="1620" height="896" src="https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso.png" alt="" srcset="https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso.png 1620w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-300x166.png 300w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-1024x566.png 1024w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-768x425.png 768w, https://meteoric.com.au/wp-content/uploads/2026/02/MEI-RIU-preso-1536x850.png 1536w" sizes="(max-width: 1620px) 100vw, 1620px"/>
</picture>
															</div>
				</div>
		<div class="elementor-element elementor-element-f1e9bfb e-con-full e-flex e-con e-child" data-id="f1e9bfb" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-2edbd80 elementor-widget elementor-widget-heading" data-id="2edbd80" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<p class="elementor-heading-title elementor-size-default"><span>News &amp; Media</span></p>				</div>
				</div>
				<div class="elementor-element elementor-element-93bf712 elementor-widget elementor-widget-post-info" data-id="93bf712" data-element_type="widget" data-e-type="widget" data-widget_type="post-info.default">
				<div class="elementor-widget-container">
							<ul class="elementor-inline-items elementor-icon-list-items elementor-post-info">
								<li class="elementor-icon-list-item elementor-repeater-item-4ccf137 elementor-inline-item" itemprop="datePublished">
													<span class="elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-date">
										<time>February 20, 2026</time>					</span>
								</li>
				</ul>
						</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-3c0909a elementor-widget elementor-widget-heading" data-id="3c0909a" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Meteoric RIU Explorers Conference 2026</h2>				</div>
				</div>
					</div>
				</a>
				</div>
				</div>
		
						</div>
				</div>
					</div>
				</div>
		<div class="elementor-element elementor-element-351d6c4 e-con-full home-footer-banner e-flex e-con e-parent" data-id="351d6c4" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
				<div class="elementor-element elementor-element-a59f4d5 elementor-invisible elementor-widget elementor-widget-heading" data-id="a59f4d5" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeInUp&quot;,&quot;_animation_delay&quot;:500}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">Interested in working for Meteoric?</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-ffa8303 elementor-invisible elementor-widget elementor-widget-heading" data-id="ffa8303" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:700}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h3 class="elementor-heading-title elementor-size-default">Help drive our green future</h3>				</div>
				</div>
				<div class="elementor-element elementor-element-291fa13 elementor-widget__width-initial elementor-invisible elementor-widget elementor-widget-button" data-id="291fa13" data-element_type="widget" data-e-type="widget" data-settings="{&quot;_animation&quot;:&quot;fadeIn&quot;,&quot;_animation_delay&quot;:900}" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/careers/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">Learn more</span>
					</span>
					</a>
				</div>
								</div>
				</div>
		<div class="elementor-element elementor-element-64f09a6 e-flex e-con-boxed e-con e-child" data-id="64f09a6" data-element_type="container" data-e-type="container">
					<div class="e-con-inner">
				<div class="elementor-element elementor-element-bec5f8c elementor-widget elementor-widget-shortcode" data-id="bec5f8c" data-element_type="widget" data-e-type="widget" data-widget_type="shortcode.default">
				<div class="elementor-widget-container">
							<div class="elementor-shortcode">		<div data-elementor-type="container" data-elementor-id="463" class="elementor elementor-463" data-elementor-post-type="elementor_library">
				<div class="elementor-element elementor-element-3039fe45 footer-bg-white-area e-flex e-con-boxed e-con e-child" data-id="3039fe45" data-element_type="container" data-e-type="container" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
					<div class="e-con-inner">
		<div class="elementor-element elementor-element-2929ca7b e-con-full e-flex e-con e-child" data-id="2929ca7b" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-70a3f373 elementor-widget elementor-widget-heading" data-id="70a3f373" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Receive our latest updates</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-ffe53ce elementor-widget__width-initial elementor-widget-laptop__width-inherit elementor-widget elementor-widget-shortcode" data-id="ffe53ce" data-element_type="widget" data-e-type="widget" data-widget_type="shortcode.default">
				<div class="elementor-widget-container">
							<div class="elementor-shortcode">
                <div class='gf_browser_chrome gform_wrapper gform-theme gform-theme--foundation gform-theme--framework gform-theme--orbital' data-form-theme='orbital' data-form-index='0' id='gform_wrapper_1' ><style>#gform_wrapper_1[data-form-index="0"].gform-theme,[data-parent-form="1_0"]{--gf-color-primary: #204ce5;--gf-color-primary-rgb: 32, 76, 229;--gf-color-primary-contrast: #fff;--gf-color-primary-contrast-rgb: 255, 255, 255;--gf-color-primary-darker: #001AB3;--gf-color-primary-lighter: #527EFF;--gf-color-secondary: #fff;--gf-color-secondary-rgb: 255, 255, 255;--gf-color-secondary-contrast: #112337;--gf-color-secondary-contrast-rgb: 17, 35, 55;--gf-color-secondary-darker: #F5F5F5;--gf-color-secondary-lighter: #FFFFFF;--gf-color-out-ctrl-light: rgba(17, 35, 55, 0.1);--gf-color-out-ctrl-light-rgb: 17, 35, 55;--gf-color-out-ctrl-light-darker: rgba(104, 110, 119, 0.35);--gf-color-out-ctrl-light-lighter: #F5F5F5;--gf-color-out-ctrl-dark: #585e6a;--gf-color-out-ctrl-dark-rgb: 88, 94, 106;--gf-color-out-ctrl-dark-darker: #112337;--gf-color-out-ctrl-dark-lighter: rgba(17, 35, 55, 0.65);--gf-color-in-ctrl: #fff;--gf-color-in-ctrl-rgb: 255, 255, 255;--gf-color-in-ctrl-contrast: #112337;--gf-color-in-ctrl-contrast-rgb: 17, 35, 55;--gf-color-in-ctrl-darker: #F5F5F5;--gf-color-in-ctrl-lighter: #FFFFFF;--gf-color-in-ctrl-primary: #204ce5;--gf-color-in-ctrl-primary-rgb: 32, 76, 229;--gf-color-in-ctrl-primary-contrast: #fff;--gf-color-in-ctrl-primary-contrast-rgb: 255, 255, 255;--gf-color-in-ctrl-primary-darker: #001AB3;--gf-color-in-ctrl-primary-lighter: #527EFF;--gf-color-in-ctrl-light: rgba(17, 35, 55, 0.1);--gf-color-in-ctrl-light-rgb: 17, 35, 55;--gf-color-in-ctrl-light-darker: rgba(104, 110, 119, 0.35);--gf-color-in-ctrl-light-lighter: #F5F5F5;--gf-color-in-ctrl-dark: #585e6a;--gf-color-in-ctrl-dark-rgb: 88, 94, 106;--gf-color-in-ctrl-dark-darker: #112337;--gf-color-in-ctrl-dark-lighter: rgba(17, 35, 55, 0.65);--gf-radius: 3px;--gf-font-size-secondary: 14px;--gf-font-size-tertiary: 13px;--gf-icon-ctrl-number: url("data:image/svg+xml,%3Csvg width='8' height='14' viewBox='0 0 8 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z' fill='rgba(17, 35, 55, 0.65)'/%3E%3C/svg%3E");--gf-icon-ctrl-select: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.292893 0.292893C0.683417 -0.097631 1.31658 -0.097631 1.70711 0.292893L5 3.58579L8.29289 0.292893C8.68342 -0.0976311 9.31658 -0.0976311 9.70711 0.292893C10.0976 0.683417 10.0976 1.31658 9.70711 1.70711L5.70711 5.70711C5.31658 6.09763 4.68342 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893Z' fill='rgba(17, 35, 55, 0.65)'/%3E%3C/svg%3E");--gf-icon-ctrl-search: url("data:image/svg+xml,%3Csvg width='640' height='640' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M256 128c-70.692 0-128 57.308-128 128 0 70.691 57.308 128 128 128 70.691 0 128-57.309 128-128 0-70.692-57.309-128-128-128zM64 256c0-106.039 85.961-192 192-192s192 85.961 192 192c0 41.466-13.146 79.863-35.498 111.248l154.125 154.125c12.496 12.496 12.496 32.758 0 45.254s-32.758 12.496-45.254 0L367.248 412.502C335.862 434.854 297.467 448 256 448c-106.039 0-192-85.962-192-192z' fill='rgba(17, 35, 55, 0.65)'/%3E%3C/svg%3E");--gf-label-space-y-secondary: var(--gf-label-space-y-md-secondary);--gf-ctrl-border-color: #686e77;--gf-ctrl-size: var(--gf-ctrl-size-md);--gf-ctrl-label-color-primary: #112337;--gf-ctrl-label-color-secondary: #112337;--gf-ctrl-choice-size: var(--gf-ctrl-choice-size-md);--gf-ctrl-checkbox-check-size: var(--gf-ctrl-checkbox-check-size-md);--gf-ctrl-radio-check-size: var(--gf-ctrl-radio-check-size-md);--gf-ctrl-btn-font-size: var(--gf-ctrl-btn-font-size-md);--gf-ctrl-btn-padding-x: var(--gf-ctrl-btn-padding-x-md);--gf-ctrl-btn-size: var(--gf-ctrl-btn-size-md);--gf-ctrl-btn-border-color-secondary: #686e77;--gf-ctrl-file-btn-bg-color-hover: #EBEBEB;--gf-field-img-choice-size: var(--gf-field-img-choice-size-md);--gf-field-img-choice-card-space: var(--gf-field-img-choice-card-space-md);--gf-field-img-choice-check-ind-size: var(--gf-field-img-choice-check-ind-size-md);--gf-field-img-choice-check-ind-icon-size: var(--gf-field-img-choice-check-ind-icon-size-md);--gf-field-pg-steps-number-color: rgba(17, 35, 55, 0.8);}</style>
                        <div class='gform_heading'>
                            <p class='gform_description'></p>
                        </div><form method='post' enctype='multipart/form-data'  id='gform_1'  action='/' data-formid='1' novalidate><div class='gf_invisible ginput_recaptchav3' data-sitekey='6LckfKYrAAAAAFAgHl6AKmPZHXt5HQqQSm50Pyok' data-tabindex='0'><input id="input_9e4ac593f2b5cde8e633ad1c4ff5c880" class="gfield_recaptcha_response" type="hidden" name="input_9e4ac593f2b5cde8e633ad1c4ff5c880" value=""/></div>
                        <div class='gform-body gform_body'><div id='gform_fields_1' class='gform_fields top_label form_sublabel_below description_below validation_below'><div id="field_1_4" class="gfield gfield--type-honeypot gform_validation_container field_sublabel_below gfield--has-description field_description_below field_validation_below gfield_visibility_visible"  ><label class='gfield_label gform-field-label' for='input_1_4'>X/Twitter</label><div class='ginput_container'><input name='input_4' id='input_1_4' type='text' value='' autocomplete='new-password'/></div><div class='gfield_description' id='gfield_description_1_4'>This field is for validation purposes and should be left unchanged.</div></div><div id="field_1_1" class="gfield gfield--type-text gfield--input-type-text gfield--width-half field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class='gfield_label gform-field-label' for='input_1_1'>First Name</label><div class='ginput_container ginput_container_text'><input name='input_1' id='input_1_1' type='text' value='' class='large'    placeholder='First Name'  aria-invalid="false"   /></div></div><div id="field_1_3" class="gfield gfield--type-email gfield--input-type-email gfield--width-half gfield_contains_required field_sublabel_below gfield--no-description field_description_below hidden_label field_validation_below gfield_visibility_visible"  ><label class='gfield_label gform-field-label' for='input_1_3'>Email Address<span class="gfield_required"><span class="gfield_required gfield_required_text">(Required)</span></span></label><div class='ginput_container ginput_container_email'>
                            <input name='input_3' id='input_1_3' type='email' value='' class='large'   placeholder='Email Address' aria-required="true" aria-invalid="false"  />
                        </div></div></div></div>
        <div class='gform-footer gform_footer top_label'> <input type='submit' id='gform_submit_button_1' class='gform_button button' onclick='gform.submission.handleButtonClick(this);' data-submission-type='submit' value='Subscribe'  /> 
            <input type='hidden' class='gform_hidden' name='gform_submission_method' data-js='gform_submission_method_1' value='postback' />
            <input type='hidden' class='gform_hidden' name='gform_theme' data-js='gform_theme_1' id='gform_theme_1' value='orbital' />
            <input type='hidden' class='gform_hidden' name='gform_style_settings' data-js='gform_style_settings_1' id='gform_style_settings_1' value='[]' />
            <input type='hidden' class='gform_hidden' name='is_submit_1' value='1' />
            <input type='hidden' class='gform_hidden' name='gform_submit' value='1' />
            
            <input type='hidden' class='gform_hidden' name='gform_currency' data-currency='AUD' value='caGbfwLEQ4gro9XdCeMd0sSh0OJw43s0g0gFCq56CfpOEGO5WOeyuvrOqXcF057XrqR8q1o6TuOtkXfk8wTRtwjLFQ6PC+My8uwQtPq7Mks5I2A=' />
            <input type='hidden' class='gform_hidden' name='gform_unique_id' value='' />
            <input type='hidden' class='gform_hidden' name='state_1' value='WyJbXSIsImNlN2MzZjA4Zjk1NGI2ZTMxMmI0Mzc1ZDM5MmM4YTA5Il0=' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_target_page_number_1' id='gform_target_page_number_1' value='0' />
            <input type='hidden' autocomplete='off' class='gform_hidden' name='gform_source_page_number_1' id='gform_source_page_number_1' value='1' />
            <input type='hidden' name='gform_field_values' value='' />
            
        </div>
                        </form>
                        </div><script>
gform.initializeOnLoaded( function() {gformInitSpinner( 1, 'https://meteoric.com.au/wp-content/plugins/gravityforms/images/spinner.svg', false );jQuery('#gform_ajax_frame_1').on('load',function(){var contents = jQuery(this).contents().find('*').html();var is_postback = contents.indexOf('GF_AJAX_POSTBACK') >= 0;if(!is_postback){return;}var form_content = jQuery(this).contents().find('#gform_wrapper_1');var is_confirmation = jQuery(this).contents().find('#gform_confirmation_wrapper_1').length > 0;var is_redirect = contents.indexOf('gformRedirect(){') >= 0;var is_form = form_content.length > 0 && ! is_redirect && ! is_confirmation;var mt = parseInt(jQuery('html').css('margin-top'), 10) + parseInt(jQuery('body').css('margin-top'), 10) + 100;if(is_form){jQuery('#gform_wrapper_1').html(form_content.html());if(form_content.hasClass('gform_validation_error')){jQuery('#gform_wrapper_1').addClass('gform_validation_error');} else {jQuery('#gform_wrapper_1').removeClass('gform_validation_error');}setTimeout( function() { /* delay the scroll by 50 milliseconds to fix a bug in chrome */  }, 50 );if(window['gformInitDatepicker']) {gformInitDatepicker();}if(window['gformInitPriceFields']) {gformInitPriceFields();}var current_page = jQuery('#gform_source_page_number_1').val();gformInitSpinner( 1, 'https://meteoric.com.au/wp-content/plugins/gravityforms/images/spinner.svg', false );jQuery(document).trigger('gform_page_loaded', [1, current_page]);window['gf_submitting_1'] = false;}else if(!is_redirect){var confirmation_content = jQuery(this).contents().find('.GF_AJAX_POSTBACK').html();if(!confirmation_content){confirmation_content = contents;}jQuery('#gform_wrapper_1').replaceWith(confirmation_content);jQuery(document).trigger('gform_confirmation_loaded', [1]);window['gf_submitting_1'] = false;wp.a11y.speak(jQuery('#gform_confirmation_message_1').text());}else{jQuery('#gform_1').append(contents);if(window['gformRedirect']) {gformRedirect();}}jQuery(document).trigger("gform_pre_post_render", [{ formId: "1", currentPage: "current_page", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_1" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_1";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_1" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 1, current_page );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );} );
</script>
</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-2c65b7e e-con-full e-flex e-con e-child" data-id="2c65b7e" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-2024abde e-con-full e-flex e-con e-child" data-id="2024abde" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-ac3ba45 e-con-full e-flex e-con e-child" data-id="ac3ba45" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-b5a586f elementor-widget elementor-widget-heading" data-id="b5a586f" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h2 class="elementor-heading-title elementor-size-default">Latest Announcements</h2>				</div>
				</div>
				<div class="elementor-element elementor-element-8bbc565 elementor-widget elementor-widget-html" data-id="8bbc565" data-element_type="widget" data-e-type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
					<script src="https://wcsecure.weblink.com.au/styles/chartstyles/responsive/WL_TabFrameFunctions.js"></script>
<iframe id='Top5HdFrame' src ="https://wcsecure.weblink.com.au/clients/meteoric/v3/Top5Headline.html" width="100%" height="250px" frameborder="0" scrolling="no" ALLOWTRANSPARENCY="true" ></iframe>  				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-2138b4e1 e-con-full e-flex e-con e-child" data-id="2138b4e1" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-70de169 e-con-full e-flex e-con e-child" data-id="70de169" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-a1b2e42 elementor-widget elementor-widget-html" data-id="a1b2e42" data-element_type="widget" data-e-type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
					<iframe style=""src ="https://wcsecure.weblink.com.au/clients/meteoric/v3/priceframe2.aspx" width="100%" height="140px" scrolling="no" frameborder="0"></iframe>				</div>
				</div>
				<div class="elementor-element elementor-element-2af58d19 elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="2af58d19" data-element_type="widget" data-e-type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
									<div class="elementor-button-wrapper">
					<a class="elementor-button elementor-button-link elementor-size-sm" href="/asx-announcements/">
						<span class="elementor-button-content-wrapper">
									<span class="elementor-button-text">All Announcements</span>
					</span>
					</a>
				</div>
								</div>
				</div>
				</div>
				</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-4cb000a2 e-con-full e-flex e-con e-child" data-id="4cb000a2" data-element_type="container" data-e-type="container">
		<div class="elementor-element elementor-element-227786ed e-con-full e-flex e-con e-child" data-id="227786ed" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-34ce192b elementor-widget elementor-widget-heading" data-id="34ce192b" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Socials</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-71cb139a elementor-grid-3 e-grid-align-left elementor-shape-rounded elementor-widget elementor-widget-social-icons" data-id="71cb139a" data-element_type="widget" data-e-type="widget" data-widget_type="social-icons.default">
				<div class="elementor-widget-container">
							<div class="elementor-social-icons-wrapper elementor-grid" role="list">
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-x-twitter elementor-repeater-item-a9a7afb" href="https://x.com/ASX_MEI" target="_blank">
						<span class="elementor-screen-only">X-twitter</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-x-twitter" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>					</a>
				</span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-linkedin-in elementor-repeater-item-3b6141a" href="https://www.linkedin.com/company/meteoric-resources/" target="_blank">
						<span class="elementor-screen-only">Linkedin-in</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-linkedin-in" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>					</a>
				</span>
							<span class="elementor-grid-item" role="listitem">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-c43f1ea" href="https://www.youtube.com/@meteoricresources" target="_blank">
						<span class="elementor-screen-only">Youtube</span>
						<svg aria-hidden="true" class="e-font-icon-svg e-fab-youtube" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>					</a>
				</span>
					</div>
						</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-635a4a4c e-con-full e-flex e-con e-child" data-id="635a4a4c" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-3b5bd3ad elementor-widget elementor-widget-heading" data-id="3b5bd3ad" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Get In Touch</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-7c2e0511 elementor-widget elementor-widget-text-editor" data-id="7c2e0511" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p><strong>T:</strong> <a href="tel:(08) 6166 9112">(08) 6166 9112</a></p>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-67097705 e-con-full e-flex e-con e-child" data-id="67097705" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-68b409fb elementor-widget elementor-widget-heading" data-id="68b409fb" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
					<h4 class="elementor-heading-title elementor-size-default">Head Office</h4>				</div>
				</div>
				<div class="elementor-element elementor-element-1616764f elementor-widget elementor-widget-text-editor" data-id="1616764f" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Level 1, 35 Ventnor Avenue<br />West Perth, WA 6005</p>								</div>
				</div>
				</div>
		<div class="elementor-element elementor-element-27dbe645 e-con-full e-flex e-con e-child" data-id="27dbe645" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-737bb09e elementor-widget elementor-widget-image" data-id="737bb09e" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
															<img loading="lazy" decoding="async" width="262" height="178" src="https://meteoric.com.au/wp-content/uploads/2025/05/logo-meteoric-footer.webp" class="attachment-full size-full wp-image-45" alt="" />															</div>
				</div>
				</div>
				</div>
					</div>
				</div>
				</div>
		</div>
						</div>
				</div>
		<div class="elementor-element elementor-element-43d41f2 e-con-full e-flex e-con e-child" data-id="43d41f2" data-element_type="container" data-e-type="container">
				<div class="elementor-element elementor-element-50cdd96 elementor-widget elementor-widget-text-editor" data-id="50cdd96" data-element_type="widget" data-e-type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
									<p>Copyright © 2025 Meteoric &#8211; Website by <a href="https://hivedesign.com.au/" target="_blank" rel="noopener">Hive Design</a></p>								</div>
				</div>
				</div>
					</div>
				</div>
				</div>
				</div>
		
	
	
</div><!-- .entry-content .clear -->

	
	
</article><!-- #post-## -->

			</main><!-- #main -->
			
		
	</div><!-- #primary -->


	</div> <!-- ast-container -->
	</div><!-- #content -->
<footer
class="site-footer" id="colophon" itemtype="https://schema.org/WPFooter" itemscope="itemscope" itemid="#colophon">
				</footer><!-- #colophon -->
	</div><!-- #page -->
<script>
  jQuery(document).ready(function($) {
    $('.home-footer-banner').append('<div class="home-footer-gradient"></div>');
  });
</script><script type="speculationrules">
{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":["/wp-*.php","/wp-admin/*","/wp-content/uploads/*","/wp-content/*","/wp-content/plugins/*","/wp-content/themes/meteoric/*","/wp-content/themes/astra/*","/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}
</script>

<div id="ast-scroll-top" tabindex="0" class="ast-scroll-top-icon ast-scroll-to-top-right" data-on-devices="both">
	<span class="ast-icon icon-arrow"><svg class="ast-arrow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="26px" height="16.043px" viewBox="57 35.171 26 16.043" enable-background="new 57 35.171 26 16.043" xml:space="preserve">
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z" />
                </svg></span>	<span class="screen-reader-text">Scroll to Top</span>
</div>
			<script>
				const lazyloadRunObserver = () => {
					const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
					const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
						entries.forEach( ( entry ) => {
							if ( entry.isIntersecting ) {
								let lazyloadBackground = entry.target;
								if( lazyloadBackground ) {
									lazyloadBackground.classList.add( 'e-lazyloaded' );
								}
								lazyloadBackgroundObserver.unobserve( entry.target );
							}
						});
					}, { rootMargin: '200px 0px 200px 0px' } );
					lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
						lazyloadBackgroundObserver.observe( lazyloadBackground );
					} );
				};
				const events = [
					'DOMContentLoaded',
					'elementor/lazyload/observe',
				];
				events.forEach( ( event ) => {
					document.addEventListener( event, lazyloadRunObserver );
				} );
			</script>
			<link rel='stylesheet' id='widget-nav-menu-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-pro-widget-nav-menu.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='widget-icon-list-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-widget-icon-list.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='elementor-post-1473-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-1473.css?ver=1775759350' media='all' />
<link rel='stylesheet' id='widget-post-info-css' href='https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/css/widget-post-info.min.css?ver=3.35.1' media='all' />
<link rel='stylesheet' id='elementor-post-463-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/post-463.css?ver=1775757665' media='all' />
<link rel='stylesheet' id='widget-social-icons-css' href='https://meteoric.com.au/wp-content/plugins/elementor/assets/css/widget-social-icons.min.css?ver=3.35.8' media='all' />
<link rel='stylesheet' id='e-apple-webkit-css' href='https://meteoric.com.au/wp-content/uploads/elementor/css/custom-apple-webkit.min.css?ver=1775757663' media='all' />
<link rel='stylesheet' id='gravity_forms_theme_reset-css' href='https://meteoric.com.au/wp-content/plugins/gravityforms/assets/css/dist/gravity-forms-theme-reset.min.css?ver=2.9.31' media='all' />
<link rel='stylesheet' id='gravity_forms_theme_foundation-css' href='https://meteoric.com.au/wp-content/plugins/gravityforms/assets/css/dist/gravity-forms-theme-foundation.min.css?ver=2.9.31' media='all' />
<link rel='stylesheet' id='gravity_forms_theme_framework-css' href='https://meteoric.com.au/wp-content/plugins/gravityforms/assets/css/dist/gravity-forms-theme-framework.min.css?ver=2.9.31' media='all' />
<link rel='stylesheet' id='gravity_forms_orbital_theme-css' href='https://meteoric.com.au/wp-content/plugins/gravityforms/assets/css/dist/gravity-forms-orbital-theme.min.css?ver=2.9.31' media='all' />
<link rel='stylesheet' id='astra-addon-megamenu-dynamic-css' href='https://meteoric.com.au/wp-content/plugins/astra-addon/addons/nav-menu/assets/css/minified/magamenu-frontend.min.css?ver=4.12.4' media='all' />
<style id='astra-addon-megamenu-dynamic-inline-css'>
.ast-desktop .menu-item-63 .astra-mm-icon-label.icon-item-63,  .ast-header-break-point .menu-item-63 .astra-mm-icon-label.icon-item-63{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-63 .astra-mm-icon-label.icon-item-63 svg,  .ast-header-break-point .menu-item-63 .astra-mm-icon-label.icon-item-63 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-309 .astra-mm-icon-label.icon-item-309,  .ast-header-break-point .menu-item-309 .astra-mm-icon-label.icon-item-309{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-309 .astra-mm-icon-label.icon-item-309 svg,  .ast-header-break-point .menu-item-309 .astra-mm-icon-label.icon-item-309 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-megamenu{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper .astra-megamenu > .menu-item{border-right-width:0px;}.ast-hfb-header.ast-desktop .main-header-menu > .menu-item-309 > .sub-menu:before{height:calc( 0px + 5px );}.ast-desktop .astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-custom{background-color:unset;}.ast-desktop .astra-megamenu-li.menu-item-309 div.astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-custom{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}.ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-menu-container, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-content, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-custom{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;}.ast-desktop .menu-item-1330 .astra-mm-icon-label.icon-item-1330,  .ast-header-break-point .menu-item-1330 .astra-mm-icon-label.icon-item-1330{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1330 .astra-mm-icon-label.icon-item-1330 svg,  .ast-header-break-point .menu-item-1330 .astra-mm-icon-label.icon-item-1330 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-310 .astra-mm-icon-label.icon-item-310,  .ast-header-break-point .menu-item-310 .astra-mm-icon-label.icon-item-310{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-310 .astra-mm-icon-label.icon-item-310 svg,  .ast-header-break-point .menu-item-310 .astra-mm-icon-label.icon-item-310 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-1338 .astra-mm-icon-label.icon-item-1338,  .ast-header-break-point .menu-item-1338 .astra-mm-icon-label.icon-item-1338{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1338 .astra-mm-icon-label.icon-item-1338 svg,  .ast-header-break-point .menu-item-1338 .astra-mm-icon-label.icon-item-1338 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-67 .astra-mm-icon-label.icon-item-67,  .ast-header-break-point .menu-item-67 .astra-mm-icon-label.icon-item-67{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-67 .astra-mm-icon-label.icon-item-67 svg,  .ast-header-break-point .menu-item-67 .astra-mm-icon-label.icon-item-67 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-megamenu{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper .astra-megamenu > .menu-item{border-right-width:0px;}.ast-hfb-header.ast-desktop .main-header-menu > .menu-item-67 > .sub-menu:before{height:calc( 0px + 5px );}.ast-desktop .astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-custom{background-color:rgba(0,0,0,0);}.ast-desktop .astra-megamenu-li.menu-item-67 div.astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-custom{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}.ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-menu-container, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-content, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-custom{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;}.ast-desktop .menu-item-1340 .astra-mm-icon-label.icon-item-1340,  .ast-header-break-point .menu-item-1340 .astra-mm-icon-label.icon-item-1340{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1340 .astra-mm-icon-label.icon-item-1340 svg,  .ast-header-break-point .menu-item-1340 .astra-mm-icon-label.icon-item-1340 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-63 .astra-mm-icon-label.icon-item-63,  .ast-header-break-point .menu-item-63 .astra-mm-icon-label.icon-item-63{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-63 .astra-mm-icon-label.icon-item-63 svg,  .ast-header-break-point .menu-item-63 .astra-mm-icon-label.icon-item-63 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-309 .astra-mm-icon-label.icon-item-309,  .ast-header-break-point .menu-item-309 .astra-mm-icon-label.icon-item-309{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-309 .astra-mm-icon-label.icon-item-309 svg,  .ast-header-break-point .menu-item-309 .astra-mm-icon-label.icon-item-309 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-megamenu{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper .astra-megamenu > .menu-item{border-right-width:0px;}.ast-hfb-header.ast-desktop .main-header-menu > .menu-item-309 > .sub-menu:before{height:calc( 0px + 5px );}.ast-desktop .astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-custom{background-color:unset;}.ast-desktop .astra-megamenu-li.menu-item-309 div.astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-309 ul.astra-mega-menu-width-custom{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}.ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-full-megamenu-wrapper, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-menu-container, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-content, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-309 .astra-mega-menu-width-custom{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;}.ast-desktop .menu-item-1330 .astra-mm-icon-label.icon-item-1330,  .ast-header-break-point .menu-item-1330 .astra-mm-icon-label.icon-item-1330{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1330 .astra-mm-icon-label.icon-item-1330 svg,  .ast-header-break-point .menu-item-1330 .astra-mm-icon-label.icon-item-1330 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-310 .astra-mm-icon-label.icon-item-310,  .ast-header-break-point .menu-item-310 .astra-mm-icon-label.icon-item-310{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-310 .astra-mm-icon-label.icon-item-310 svg,  .ast-header-break-point .menu-item-310 .astra-mm-icon-label.icon-item-310 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-1338 .astra-mm-icon-label.icon-item-1338,  .ast-header-break-point .menu-item-1338 .astra-mm-icon-label.icon-item-1338{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1338 .astra-mm-icon-label.icon-item-1338 svg,  .ast-header-break-point .menu-item-1338 .astra-mm-icon-label.icon-item-1338 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop .menu-item-67 .astra-mm-icon-label.icon-item-67,  .ast-header-break-point .menu-item-67 .astra-mm-icon-label.icon-item-67{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-67 .astra-mm-icon-label.icon-item-67 svg,  .ast-header-break-point .menu-item-67 .astra-mm-icon-label.icon-item-67 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-megamenu{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper{border-top-width:0px;}.ast-desktop li.astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper .astra-megamenu > .menu-item{border-right-width:0px;}.ast-hfb-header.ast-desktop .main-header-menu > .menu-item-67 > .sub-menu:before{height:calc( 0px + 5px );}.ast-desktop .astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-custom{background-color:rgba(0,0,0,0);}.ast-desktop .astra-megamenu-li.menu-item-67 div.astra-full-megamenu-wrapper, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-menu-container, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-content, .ast-desktop .astra-megamenu-li.menu-item-67 ul.astra-mega-menu-width-custom{margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;}.ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-full-megamenu-wrapper, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-menu-container, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-content, .ast-desktop .ast-mega-menu-enabled .astra-megamenu-li.menu-item-67 .astra-mega-menu-width-custom{padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;}.ast-desktop .menu-item-1340 .astra-mm-icon-label.icon-item-1340,  .ast-header-break-point .menu-item-1340 .astra-mm-icon-label.icon-item-1340{display:inline-block;vertical-align:middle;line-height:0;margin:5px;}.ast-desktop .menu-item-1340 .astra-mm-icon-label.icon-item-1340 svg,  .ast-header-break-point .menu-item-1340 .astra-mm-icon-label.icon-item-1340 svg{color:var(--ast-global-color-0);fill:var(--ast-global-color-0);width:20px;height:20px;}
/*# sourceURL=astra-addon-megamenu-dynamic-inline-css */
</style>
<script id="astra-theme-js-js-extra">
var astra = {"break_point":"921","isRtl":"","is_scroll_to_id":"1","is_scroll_to_top":"1","is_header_footer_builder_active":"1","responsive_cart_click":"flyout","is_dark_palette":"","revealEffectEnable":"","edit_post_url":"https://meteoric.com.au/wp-admin/post.php?post={{id}}&action=edit","ajax_url":"https://meteoric.com.au/wp-admin/admin-ajax.php","infinite_count":"2","infinite_total":"0","pagination":"number","infinite_scroll_event":"scroll","no_more_post_message":"No more posts to show.","grid_layout":{"desktop":3,"tablet":1,"mobile":1},"site_url":"https://meteoric.com.au","blogArchiveTitleLayout":"","blogArchiveTitleOn":"","show_comments":"Show Comments","enableHistoryPushState":"1","masonryEnabled":"","blogMasonryBreakPoint":"0"};
//# sourceURL=astra-theme-js-js-extra
</script>
<script src="https://meteoric.com.au/wp-content/themes/astra/assets/js/minified/frontend.min.js?ver=4.12.5" id="astra-theme-js-js"></script>
<script id="astra-addon-js-js-extra">
var astraAddon = {"is_elementor_active":"1","sticky_active":"1","svgIconClose":"\u003Cspan class=\"ast-icon icon-close\"\u003E\u003Csvg viewBox=\"0 0 512 512\" aria-hidden=\"true\" role=\"img\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"18px\" height=\"18px\"\u003E\n                                \u003Cpath d=\"M71.029 71.029c9.373-9.372 24.569-9.372 33.942 0L256 222.059l151.029-151.03c9.373-9.372 24.569-9.372 33.942 0 9.372 9.373 9.372 24.569 0 33.942L289.941 256l151.03 151.029c9.372 9.373 9.372 24.569 0 33.942-9.373 9.372-24.569 9.372-33.942 0L256 289.941l-151.029 151.03c-9.373 9.372-24.569 9.372-33.942 0-9.372-9.373-9.372-24.569 0-33.942L222.059 256 71.029 104.971c-9.372-9.373-9.372-24.569 0-33.942z\" /\u003E\n                            \u003C/svg\u003E\u003C/span\u003E","hf_account_show_menu_on":"hover","hf_account_action_type":"link","hf_account_logout_action":"link","header_main_stick":"1","header_above_stick":"","header_below_stick":"","stick_header_meta":"","header_main_stick_meta":"","header_above_stick_meta":"","header_below_stick_meta":"","sticky_header_on_devices":"desktop","sticky_header_style":"none","sticky_hide_on_scroll":"1","break_point":"921","tablet_break_point":"921","mobile_break_point":"544","header_main_shrink":"1","header_animation_effect":"none","header_logo_width":"","responsive_header_logo_width":{"desktop":"","tablet":"","mobile":""},"stick_origin_position":"","site_layout":"ast-full-width-layout","site_content_width":"1240","site_layout_padded_width":"1200","site_layout_box_width":"1200","header_builder_active":"1","component_limit":"10","is_header_builder_active":"1"};
//# sourceURL=astra-addon-js-js-extra
</script>
<script src="https://meteoric.com.au/wp-content/uploads/astra-addon/astra-addon-69d498348fb6d8-23263491.js?ver=4.12.4" id="astra-addon-js-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/astra-addon/assets/js/minified/purify.min.js?ver=4.12.4" id="astra-dom-purify-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.35.8" id="elementor-webpack-runtime-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.35.8" id="elementor-frontend-modules-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/jquery/ui/core.min.js?ver=1.13.3" id="jquery-ui-core-js"></script>
<script id="elementor-frontend-js-before">
var elementorFrontendConfig = {"environmentMode":{"edit":false,"wpPreview":false,"isScriptDebug":false},"i18n":{"shareOnFacebook":"Share on Facebook","shareOnTwitter":"Share on Twitter","pinIt":"Pin it","download":"Download","downloadImage":"Download image","fullscreen":"Fullscreen","zoom":"Zoom","share":"Share","playVideo":"Play Video","previous":"Previous","next":"Next","close":"Close","a11yCarouselPrevSlideMessage":"Previous slide","a11yCarouselNextSlideMessage":"Next slide","a11yCarouselFirstSlideMessage":"This is the first slide","a11yCarouselLastSlideMessage":"This is the last slide","a11yCarouselPaginationBulletMessage":"Go to slide"},"is_rtl":false,"breakpoints":{"xs":0,"sm":480,"md":768,"lg":1025,"xl":1440,"xxl":1600},"responsive":{"breakpoints":{"mobile":{"label":"Mobile Portrait","value":767,"default_value":767,"direction":"max","is_enabled":true},"mobile_extra":{"label":"Mobile Landscape","value":880,"default_value":880,"direction":"max","is_enabled":true},"tablet":{"label":"Tablet Portrait","value":1024,"default_value":1024,"direction":"max","is_enabled":true},"tablet_extra":{"label":"Tablet Landscape","value":1200,"default_value":1200,"direction":"max","is_enabled":true},"laptop":{"label":"Laptop","value":1366,"default_value":1366,"direction":"max","is_enabled":true},"widescreen":{"label":"Widescreen","value":2400,"default_value":2400,"direction":"min","is_enabled":false}},"hasCustomBreakpoints":true},"version":"3.35.8","is_static":false,"experimentalFeatures":{"e_font_icon_svg":true,"additional_custom_breakpoints":true,"container":true,"theme_builder_v2":true,"nested-elements":true,"home_screen":true,"global_classes_should_enforce_capabilities":true,"e_variables":true,"cloud-library":true,"e_opt_in_v4_page":true,"e_components":true,"e_interactions":true,"e_editor_one":true,"import-export-customization":true,"e_pro_variables":true},"urls":{"assets":"https:\/\/meteoric.com.au\/wp-content\/plugins\/elementor\/assets\/","ajaxurl":"https:\/\/meteoric.com.au\/wp-admin\/admin-ajax.php","uploadUrl":"https:\/\/meteoric.com.au\/wp-content\/uploads"},"nonces":{"floatingButtonsClickTracking":"02cfa4caca"},"swiperClass":"swiper","settings":{"page":[],"editorPreferences":[]},"kit":{"active_breakpoints":["viewport_mobile","viewport_mobile_extra","viewport_tablet","viewport_tablet_extra","viewport_laptop"],"global_image_lightbox":"yes","lightbox_enable_counter":"yes","lightbox_enable_fullscreen":"yes","lightbox_enable_zoom":"yes","lightbox_enable_share":"yes","lightbox_title_src":"title","lightbox_description_src":"description"},"post":{"id":12,"title":"Meteoric%20Resources%20%7C%20Caldeira%20Rare%20Earth%20Project%20in%20Brazil","excerpt":"","featuredImage":false}};
//# sourceURL=elementor-frontend-js-before
</script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.35.8" id="elementor-frontend-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js?ver=8.4.5" id="swiper-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/imagesloaded.min.js?ver=5.0.0" id="imagesloaded-js"></script>
<script id="gforms_recaptcha_recaptcha-js-extra">
var gforms_recaptcha_recaptcha_strings = {"nonce":"5efdc75c4b","disconnect":"Disconnecting","change_connection_type":"Resetting","spinner":"https://meteoric.com.au/wp-content/plugins/gravityforms/images/spinner.svg","connection_type":"classic","disable_badge":"1","change_connection_type_title":"Change Connection Type","change_connection_type_message":"Changing the connection type will delete your current settings.  Do you want to proceed?","disconnect_title":"Disconnect","disconnect_message":"Disconnecting from reCAPTCHA will delete your current settings.  Do you want to proceed?","site_key":"6LckfKYrAAAAAFAgHl6AKmPZHXt5HQqQSm50Pyok"};
//# sourceURL=gforms_recaptcha_recaptcha-js-extra
</script>
<script src="https://www.google.com/recaptcha/api.js?render=6LckfKYrAAAAAFAgHl6AKmPZHXt5HQqQSm50Pyok&amp;ver=2.1.0" id="gforms_recaptcha_recaptcha-js" defer data-wp-strategy="defer"></script>
<script src="https://meteoric.com.au/wp-content/plugins/gravityformsrecaptcha/js/frontend.min.js?ver=2.1.0" id="gforms_recaptcha_frontend-js" defer data-wp-strategy="defer"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.2.1" id="smartmenus-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/dist/dom-ready.min.js?ver=f77871ff7694fffea381" id="wp-dom-ready-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/dist/hooks.min.js?ver=dd5603f07f9220ed27f1" id="wp-hooks-js"></script>
<script src="https://meteoric.com.au/wp-includes/js/dist/i18n.min.js?ver=c26c3dc7bed366793375" id="wp-i18n-js"></script>
<script id="wp-i18n-js-after">
wp.i18n.setLocaleData( { 'text direction\u0004ltr': [ 'ltr' ] } );
//# sourceURL=wp-i18n-js-after
</script>
<script src="https://meteoric.com.au/wp-includes/js/dist/a11y.min.js?ver=cb460b4676c94bd228ed" id="wp-a11y-js"></script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/js/jquery.json.min.js?ver=2.9.31" id="gform_json-js"></script>
<script id="gform_gravityforms-js-extra">
var gform_i18n = {"datepicker":{"days":{"monday":"Mo","tuesday":"Tu","wednesday":"We","thursday":"Th","friday":"Fr","saturday":"Sa","sunday":"Su"},"months":{"january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December"},"firstDay":1,"iconText":"Select date"}};
var gf_legacy_multi = [];
var gform_gravityforms = {"strings":{"invalid_file_extension":"This type of file is not allowed. Must be one of the following:","delete_file":"Delete this file","in_progress":"in progress","file_exceeds_limit":"File exceeds size limit","illegal_extension":"This type of file is not allowed.","max_reached":"Maximum number of files reached","unknown_error":"There was a problem while saving the file on the server","currently_uploading":"Please wait for the uploading to complete","cancel":"Cancel","cancel_upload":"Cancel this upload","cancelled":"Cancelled","error":"Error","message":"Message"},"vars":{"images_url":"https://meteoric.com.au/wp-content/plugins/gravityforms/images"}};
var gf_global = {"gf_currency_config":{"name":"Australian Dollar","symbol_left":"$","symbol_right":"","symbol_padding":" ","thousand_separator":",","decimal_separator":".","decimals":2,"code":"AUD"},"base_url":"https://meteoric.com.au/wp-content/plugins/gravityforms","number_formats":[],"spinnerUrl":"https://meteoric.com.au/wp-content/plugins/gravityforms/images/spinner.svg","version_hash":"4705d3d5a3bceb7f232d848c42e07a1d","strings":{"newRowAdded":"New row added.","rowRemoved":"Row removed","formSaved":"The form has been saved.  The content contains the link to return and complete the form."}};
//# sourceURL=gform_gravityforms-js-extra
</script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/js/gravityforms.min.js?ver=2.9.31" id="gform_gravityforms-js"></script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/js/placeholders.jquery.min.js?ver=2.9.31" id="gform_placeholder-js"></script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/assets/js/dist/utils.min.js?ver=3f278756f0a3032bed328ff6a9f6c01d" id="gform_gravityforms_utils-js"></script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/assets/js/dist/vendor-theme.min.js?ver=4f8b3915c1c1e1a6800825abd64b03cb" id="gform_gravityforms_theme_vendors-js"></script>
<script id="gform_gravityforms_theme-js-extra">
var gform_theme_config = {"common":{"form":{"honeypot":{"version_hash":"4705d3d5a3bceb7f232d848c42e07a1d"},"ajax":{"ajaxurl":"https://meteoric.com.au/wp-admin/admin-ajax.php","ajax_submission_nonce":"dc9e77d404","i18n":{"step_announcement":"Step %1$s of %2$s, %3$s","unknown_error":"There was an unknown error processing your request. Please try again."}}}},"hmr_dev":"","public_path":"https://meteoric.com.au/wp-content/plugins/gravityforms/assets/js/dist/","config_nonce":"495e6088dd"};
//# sourceURL=gform_gravityforms_theme-js-extra
</script>
<script defer='defer' src="https://meteoric.com.au/wp-content/plugins/gravityforms/assets/js/dist/scripts-theme.min.js?ver=a1e4be6ab14e0f896212221fc6ec8edd" id="gform_gravityforms_theme-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=3.35.1" id="elementor-pro-webpack-runtime-js"></script>
<script id="elementor-pro-frontend-js-before">
var ElementorProFrontendConfig = {"ajaxurl":"https:\/\/meteoric.com.au\/wp-admin\/admin-ajax.php","nonce":"4c65c97019","urls":{"assets":"https:\/\/meteoric.com.au\/wp-content\/plugins\/elementor-pro\/assets\/","rest":"https:\/\/meteoric.com.au\/wp-json\/"},"settings":{"lazy_load_background_images":true},"popup":{"hasPopUps":true},"shareButtonsNetworks":{"facebook":{"title":"Facebook","has_counter":true},"twitter":{"title":"Twitter"},"linkedin":{"title":"LinkedIn","has_counter":true},"pinterest":{"title":"Pinterest","has_counter":true},"reddit":{"title":"Reddit","has_counter":true},"vk":{"title":"VK","has_counter":true},"odnoklassniki":{"title":"OK","has_counter":true},"tumblr":{"title":"Tumblr"},"digg":{"title":"Digg"},"skype":{"title":"Skype"},"stumbleupon":{"title":"StumbleUpon","has_counter":true},"mix":{"title":"Mix"},"telegram":{"title":"Telegram"},"pocket":{"title":"Pocket","has_counter":true},"xing":{"title":"XING","has_counter":true},"whatsapp":{"title":"WhatsApp"},"email":{"title":"Email"},"print":{"title":"Print"},"x-twitter":{"title":"X"},"threads":{"title":"Threads"}},"facebook_sdk":{"lang":"en_US","app_id":""},"lottie":{"defaultAnimationUrl":"https:\/\/meteoric.com.au\/wp-content\/plugins\/elementor-pro\/modules\/lottie\/assets\/animations\/default.json"}};
//# sourceURL=elementor-pro-frontend-js-before
</script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=3.35.1" id="elementor-pro-frontend-js"></script>
<script src="https://meteoric.com.au/wp-content/plugins/elementor-pro/assets/js/elements-handlers.min.js?ver=3.35.1" id="pro-elements-handlers-js"></script>
		<style>
			.unlimited-elements-background-overlay{
				position:absolute;
				top:0px;
				left:0px;
				width:100%;
				height:100%;
				z-index:0;
			}

			.unlimited-elements-background-overlay.uc-bg-front{
				z-index:999;
			}
		</style>

		<script type='text/javascript'>

			jQuery(document).ready(function(){
					
				function ucBackgroundOverlayPutStart(){
				
					var objBG = jQuery(".unlimited-elements-background-overlay").not(".uc-bg-attached");

					if(objBG.length == 0)
						return(false);

					objBG.each(function(index, bgElement){

						var objBgElement = jQuery(bgElement);

						var targetID = objBgElement.data("forid");

						var location = objBgElement.data("location");

						switch(location){
							case "body":
							case "body_front":
								var objTarget = jQuery("body");
							break;
							case "layout":
							case "layout_front":
								var objLayout = jQuery("*[data-id=\""+targetID+"\"]");
								var objTarget = objLayout.parents(".elementor");
								if(objTarget.length > 1)
									objTarget = jQuery(objTarget[0]);
							break;
							default:
								var objTarget = jQuery("*[data-id=\""+targetID+"\"]");
							break;
						}


						if(objTarget.length == 0)
							return(true);

						var objVideoContainer = objTarget.children(".elementor-background-video-container");

						if(objVideoContainer.length == 1)
							objBgElement.detach().insertAfter(objVideoContainer).show();
						else
							objBgElement.detach().prependTo(objTarget).show();


						var objTemplate = objBgElement.children("template");

						if(objTemplate.length){
							
					        var clonedContent = objTemplate[0].content.cloneNode(true);

					    	var objScripts = jQuery(clonedContent).find("script");
					    	if(objScripts.length)
					    		objScripts.attr("type","text/javascript");
					        
					        objBgElement.append(clonedContent);
							
							objTemplate.remove();
						}

						objBgElement.trigger("bg_attached");
						objBgElement.addClass("uc-bg-attached");

					});
				}

				ucBackgroundOverlayPutStart();

				jQuery( document ).on( 'elementor/popup/show', ucBackgroundOverlayPutStart);
				jQuery( "body" ).on( 'uc_dom_updated', ucBackgroundOverlayPutStart);

			});


		</script>
					<script>
			/(trident|msie)/i.test(navigator.userAgent)&&document.getElementById&&window.addEventListener&&window.addEventListener("hashchange",function(){var t,e=location.hash.substring(1);/^[A-z0-9_-]+$/.test(e)&&(t=document.getElementById(e))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())},!1);
			</script>
			<script id="wp-emoji-settings" type="application/json">
{"baseUrl":"https://s.w.org/images/core/emoji/17.0.2/72x72/","ext":".png","svgUrl":"https://s.w.org/images/core/emoji/17.0.2/svg/","svgExt":".svg","source":{"concatemoji":"https://meteoric.com.au/wp-includes/js/wp-emoji-release.min.js?ver=6.9.4"}}
</script>
<script type="module">
/*! This file is auto-generated */
const a=JSON.parse(document.getElementById("wp-emoji-settings").textContent),o=(window._wpemojiSettings=a,"wpEmojiSettingsSupports"),s=["flag","emoji"];function i(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function c(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0);const a=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);return t.every((e,t)=>e===a[t])}function p(e,t){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var n=e.getImageData(16,16,1,1);for(let e=0;e<n.data.length;e++)if(0!==n.data[e])return!1;return!0}function u(e,t,n,a){switch(t){case"flag":return n(e,"\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f","\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f")?!1:!n(e,"\ud83c\udde8\ud83c\uddf6","\ud83c\udde8\u200b\ud83c\uddf6")&&!n(e,"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f","\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");case"emoji":return!a(e,"\ud83e\u1fac8")}return!1}function f(e,t,n,a){let r;const o=(r="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):document.createElement("canvas")).getContext("2d",{willReadFrequently:!0}),s=(o.textBaseline="top",o.font="600 32px Arial",{});return e.forEach(e=>{s[e]=t(o,e,n,a)}),s}function r(e){var t=document.createElement("script");t.src=e,t.defer=!0,document.head.appendChild(t)}a.supports={everything:!0,everythingExceptFlag:!0},new Promise(t=>{let n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if("object"==typeof e&&"number"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&"object"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if("undefined"!=typeof Worker&&"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof URL&&URL.createObjectURL&&"undefined"!=typeof Blob)try{var e="postMessage("+f.toString()+"("+[JSON.stringify(s),u.toString(),c.toString(),p.toString()].join(",")+"));",a=new Blob([e],{type:"text/javascript"});const r=new Worker(URL.createObjectURL(a),{name:"wpTestEmojiSupports"});return void(r.onmessage=e=>{i(n=e.data),r.terminate(),t(n)})}catch(e){}i(n=f(s,u,c,p))}t(n)}).then(e=>{for(const n in e)a.supports[n]=e[n],a.supports.everything=a.supports.everything&&a.supports[n],"flag"!==n&&(a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&a.supports[n]);var t;a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&!a.supports.flag,a.supports.everything||((t=a.source||{}).concatemoji?r(t.concatemoji):t.wpemoji&&t.twemoji&&(r(t.twemoji),r(t.wpemoji)))});
//# sourceURL=https://meteoric.com.au/wp-includes/js/wp-emoji-loader.min.js
</script>
<script>
gform.initializeOnLoaded( function() { jQuery(document).on('gform_post_render', function(event, formId, currentPage){if(formId == 1) {if(typeof Placeholders != 'undefined'){
                        Placeholders.enable();
                    }} } );jQuery(document).on('gform_post_conditional_logic', function(event, formId, fields, isInit){} ) } );
</script>
<script>
gform.initializeOnLoaded( function() {jQuery(document).trigger("gform_pre_post_render", [{ formId: "1", currentPage: "1", abort: function() { this.preventDefault(); } }]);        if (event && event.defaultPrevented) {                return;        }        const gformWrapperDiv = document.getElementById( "gform_wrapper_1" );        if ( gformWrapperDiv ) {            const visibilitySpan = document.createElement( "span" );            visibilitySpan.id = "gform_visibility_test_1";            gformWrapperDiv.insertAdjacentElement( "afterend", visibilitySpan );        }        const visibilityTestDiv = document.getElementById( "gform_visibility_test_1" );        let postRenderFired = false;        function triggerPostRender() {            if ( postRenderFired ) {                return;            }            postRenderFired = true;            gform.core.triggerPostRenderEvents( 1, 1 );            if ( visibilityTestDiv ) {                visibilityTestDiv.parentNode.removeChild( visibilityTestDiv );            }        }        function debounce( func, wait, immediate ) {            var timeout;            return function() {                var context = this, args = arguments;                var later = function() {                    timeout = null;                    if ( !immediate ) func.apply( context, args );                };                var callNow = immediate && !timeout;                clearTimeout( timeout );                timeout = setTimeout( later, wait );                if ( callNow ) func.apply( context, args );            };        }        const debouncedTriggerPostRender = debounce( function() {            triggerPostRender();        }, 200 );        if ( visibilityTestDiv && visibilityTestDiv.offsetParent === null ) {            const observer = new MutationObserver( ( mutations ) => {                mutations.forEach( ( mutation ) => {                    if ( mutation.type === 'attributes' && visibilityTestDiv.offsetParent !== null ) {                        debouncedTriggerPostRender();                        observer.disconnect();                    }                });            });            observer.observe( document.body, {                attributes: true,                childList: false,                subtree: true,                attributeFilter: [ 'style', 'class' ],            });        } else {            triggerPostRender();        }    } );
</script>
	<script type="text/javascript">window.NREUM||(NREUM={});NREUM.info={"beacon":"bam.nr-data.net","licenseKey":"NRJS-a0c1a93fd583edd9965","applicationID":"983462701","transactionName":"MlcAbUVYV0VSU0ANVwsdI1pDUFZYHEBVA10=","queueTime":0,"applicationTime":1914,"atts":"HhADGw1CREs=","errorBeacon":"bam.nr-data.net","agent":""}</script></body>
</html>

<!-- Cache served by breeze CACHE (Desktop) - Last modified: Mon, 13 Apr 2026 04:03:41 GMT -->

<!-- plugin=object-cache-pro client=phpredis metric#hits=10378 metric#misses=49 metric#hit-ratio=99.5 metric#bytes=4121677 metric#prefetches=319 metric#store-reads=51 metric#store-writes=31 metric#store-hits=339 metric#store-misses=31 metric#sql-queries=115 metric#ms-total=1904.14 metric#ms-cache=24.55 metric#ms-cache-avg=0.3031 metric#ms-cache-ratio=1.3 sample#redis-hits=142429831 sample#redis-misses=14472640 sample#redis-hit-ratio=90.8 sample#redis-ops-per-sec=28 sample#redis-evicted-keys=2856261 sample#redis-used-memory=136541200 sample#redis-used-memory-rss=48001024 sample#redis-memory-fragmentation-ratio=0.3 sample#redis-connected-clients=1 sample#redis-tracking-clients=0 sample#redis-rejected-connections=3 sample#redis-keys=5625 -->
