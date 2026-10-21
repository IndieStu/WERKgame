import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
async function files(dir) {
 const result=[];
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  const file=`${dir}/${entry.name}`;
  if(entry.isDirectory()) result.push(...await files(file)); else if(entry.name!=='sw.js') result.push(file);
 }
 return result.sort();
}
const paths=await files('dist');const hash=createHash('sha256');
for(const p of paths) hash.update(await readFile(p));
hash.update(await readFile(new URL(import.meta.url)));
const version=hash.digest('hex').slice(0,12);
const urls=paths.map(p=>'./'+p.slice(5));
await writeFile('dist/sw.js',`
const CACHE='werk-phase2-${version}';
const URLS=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 try { const cache=await caches.open(CACHE); await cache.addAll(URLS); }
 catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// No skipWaiting: an active test is never forcefully replaced.
self.addEventListener('message',event=>{
 if(event.data==='status') event.waitUntil((async()=>{const c=await caches.open(CACHE);const entries=await Promise.all(URLS.map(u=>c.match(new URL(u,self.registration.scope))));event.ports[0]?.postMessage({ready:entries.every(Boolean)});})());
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{const c=await caches.open(CACHE);const cached=await c.match(event.request,{ignoreVary:true});if(cached)return cached;
 if(event.request.mode==='navigate'){const shell=await c.match(new URL('./index.html',self.registration.scope));if(shell)return shell;}
 return fetch(event.request);})());
});
`);
console.log(`Offlinepaket ${version}: ${paths.length} Dateien. Alte Releasecaches bleiben für Rollback erhalten.`);
