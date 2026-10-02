const CACHE="stock-recovery-v4";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS)}))});
self.addEventListener("activate",function(e){e.waitUntil(Promise.all([
  self.clients.claim(),
  caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))})
]))});
self.addEventListener("fetch",function(e){
 if(e.request.mode==="navigate"){
  e.respondWith(fetch(e.request).then(function(r){var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)});return r}).catch(function(){return caches.match("./index.html")}));
  return;
 }
 e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}))
});