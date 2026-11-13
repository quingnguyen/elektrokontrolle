/* Offline-Zwischenspeicher. Bei jeder neuen App-Version die Nummer in VERSION erhöhen. */
var VERSION='mt-v1';
var FILES=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "vendor/jspdf.umd.min.js",
 "fonts/barlow-condensed-latin-600-normal.woff2",
 "fonts/barlow-condensed-latin-700-normal.woff2",
 "fonts/barlow-latin-400-normal.woff2",
 "fonts/barlow-latin-500-normal.woff2",
 "fonts/barlow-latin-600-normal.woff2",
 "fonts/ibm-plex-mono-latin-500-normal.woff2",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/apple-touch-icon.png"
];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res;}).catch(function(){return null;});
      if(hit){e.waitUntil(net);return hit;}
      return net.then(function(res){return res||(r.mode==='navigate'?c.match('index.html'):Response.error());});
    });
  }));
});
