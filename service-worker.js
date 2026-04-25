const CACHE_NAME="carcare-v3";
const urls=["/","/index.html","/manifest.json"];
self.addEventListener("install",e=>{
e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urls)));
self.skipWaiting();
});
self.addEventListener("activate",e=>{
e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));
self.clients.claim();
});
self.addEventListener("fetch",e=>{
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
return caches.open(CACHE_NAME).then(c=>{c.put(e.request,res.clone());return res;});
}).catch(()=>caches.match("/index.html"))));
});