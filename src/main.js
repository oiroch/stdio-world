import { portraitSource, readPortrait, portraitPDF, downloadBlob } from './portrait.js';
import profile from './profile.json';
import { STORAGE_KEY, mergeProjects } from './admin-model.js';
import { createAdmin } from './admin.js';
import './style.css';
import { zones, interactables, validateCatalog, calculateBeats } from './model.js';
const $=s=>document.querySelector(s);
let catalog=[],catalogReady=false,world,filter='all',sound=false,audio,returnFocus;
const visited=new Set();
try{const saved=JSON.parse(localStorage.getItem('stdio-visited')||'[]');if(Array.isArray(saved))for(const id of saved)if(zones.some(z=>z.id===id))visited.add(id);}catch{}
const dialog=$('#detail');
function node(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
function chirp(){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(520,audio.currentTime);o.frequency.exponentialRampToValueAtTime(780,audio.currentTime+.09);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.14);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.15);}catch{}}
function progress(){ $('#progress').textContent=`${visited.size} / ${zones.length} LUGARES`;document.querySelectorAll('.place').forEach(b=>b.classList.toggle('visited',visited.has(b.dataset.zone)));}
function mark(id){visited.add(id);try{localStorage.setItem('stdio-visited',JSON.stringify([...visited]));}catch{}progress();}
function show(title,eyebrow){if(!dialog.open){returnFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open');}$('#detail-eyebrow').textContent=eyebrow;const content=$('#detail-content');content.replaceChildren();content.classList.remove('profile-content');const h=node('h2',title);h.id='detail-title';content.append(h);chirp();return content;}
function close(){dialog.close();}
dialog.addEventListener('close',()=>{dialog.querySelectorAll('iframe').forEach(frame=>frame.remove());document.body.classList.remove('modal-open');if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
$('#close-detail').addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
function openZone(id){if(id==='admin'){openAdmin();return;}const z=zones.find(z=>z.id===id);mark(id);const content=show(z.name,z.tag+' / MUNDO STDIO.MX');content.append(node('p',z.description));const list=node('div',undefined,'zone-items');const items=catalog.filter(i=>i.zone===id);for(const item of items){const b=node('button');const label=node('span');label.append(node('strong',item.title),node('small',item.role));b.append(label,node('span','↗'));b.addEventListener('click',()=>openItem(item));list.append(b);}if(!items.length)list.append(node('p','El catálogo no está disponible todavía. Puedes cerrar esta ventana y volver a intentarlo.'));content.append(list);}
function openItem(item){mark(item.zone);if(item.tool==='beats'){openBeats();return;}if(item.type==='Herramienta'){openTool(item);return;}if(item.tool==='profile'){openProfile();return;}const content=show(item.title,item.type.toUpperCase());if(item.image){const img=node('img',undefined,'project-cover');img.src=item.image;img.alt=item.title;img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();content.append(img);}content.append(node('p',item.role,'detail-role'),node('p',item.description));const link=node('a',item.action,'detail-action');link.href=item.url;if(!item.url.startsWith('mailto:')){link.target='_blank';link.rel='noopener';}content.append(link);}
function openProfile(){
 mark('studio');const c=show(profile.name,'ESTUDIO / PERFIL Y CURRÍCULUM');c.classList.add('profile-content');
 const hero=node('div',undefined,'profile-hero'),portrait=node('figure',undefined,'profile-portrait');
 const photo=node('img');photo.src=portraitSource();photo.alt='Mauricio Araiza en su espacio de trabajo audiovisual';photo.width=294;photo.height=303;photo.decoding='async';
 const caption=node('figcaption','MAURICIO / STDIO.MX');portrait.append(photo,caption);
 const intro=node('div',undefined,'profile-intro');intro.append(c.querySelector('#detail-title'),node('p',profile.headline,'detail-role'),node('p',profile.tagline,'profile-tagline'));
 hero.append(portrait,intro);c.append(hero);
 const actions=node('div',undefined,'admin-actions');
 for(const [label,download] of [['Ver CV completo (PDF)',false],['Descargar CV (PDF)',true]]){const a=node('a',label,'detail-action');a.href=`${import.meta.env.BASE_URL}cv/mauricio-araiza-cv.pdf`;if(download)a.download='Mauricio-Araiza-CV.pdf';else{a.target='_blank';a.rel='noopener';}a.addEventListener('click',async e=>{
 if(!readPortrait())return;e.preventDefault();
 const original=a.textContent;if(a.dataset.busy)return;a.dataset.busy='1';a.textContent='Preparando PDF…';
 const previewWindow=download?null:window.open('about:blank','_blank');if(previewWindow)previewWindow.opener=null;
 try{const blob=await portraitPDF();if(download||!previewWindow)downloadBlob(blob,'Mauricio-Araiza-CV.pdf');else{const url=URL.createObjectURL(blob);previewWindow.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),120000);}}
 catch(error){previewWindow?.close();const message=node('p',error.message);message.setAttribute('role','alert');actions.after(message);}
 finally{a.textContent=original;delete a.dataset.busy;}
 });actions.append(a);}
 c.append(actions,node('p',profile.about),node('p',profile.approach));
 const section=(title)=>{const el=node('section',undefined,'profile-section');el.append(node('h3',title));c.append(el);return el;};
 const skills=section('Qué aporto a tu proyecto'),grid=node('div',undefined,'profile-grid');
 for(const skill of profile.skills){const card=node('article',undefined,'profile-skill');card.append(node('h4',skill.title),node('p',skill.text));grid.append(card);}skills.append(grid);
 const process=section('Cómo trabajo'),steps=node('ol',undefined,'profile-steps');for(const step of profile.workflow){const li=node('li');li.append(node('strong',step.title),node('p',step.text));steps.append(li);}process.append(steps);
 const experience=section('Experiencia');for(const job of profile.experience){const article=node('article',undefined,'profile-job');article.append(node('small',job.date),node('h4',job.title),node('p',job.text),node('p',job.details));experience.append(article);}
 const education=section('Formación');for(const [date,title,school] of profile.education){const article=node('article',undefined,'profile-study');article.append(node('small',date),node('h4',title),node('p',school));education.append(article);}
 const software=section('Herramientas de trabajo');software.append(node('p','Software y tecnologías que forman parte de mi recorrido.'));const tags=node('ul',undefined,'profile-tags');for(const name of profile.software)tags.append(node('li',name));software.append(tags);
 const projects=section('Algunas piezas de mi recorrido');for(const item of profile.projects){const link=node('a',`${item.title} · ${item.role} ↗`,'profile-project');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';projects.append(link);}
 section('Fuera del set, sigo explorando').append(node('p',profile.interests));
 const contact=node('a','Cuéntame tu proyecto ↗','detail-action');contact.href=`mailto:${profile.email}`;c.append(contact);
}
function openBeats(){mark('lab');const c=show('Mapa de una historia','LABORATORIO / HERRAMIENTA 001');c.append(node('p','Una guía de 15 momentos narrativos basada en los porcentajes de mi herramienta original, inspirada en Snyder. Una referencia flexible; la historia siempre manda.'));const form=node('form');const label=node('label','¿Cuántas páginas tiene tu guion?');label.htmlFor='pages';const row=node('div',undefined,'field-row');const input=node('input');Object.assign(input,{type:'number',min:'1',max:'10000',step:'1',value:'120',id:'pages',required:true});const submit=node('button','Calcular ↗');submit.type='submit';row.append(input,submit);form.append(label,row);const status=node('p','Introduce entre 1 y 10 000 páginas.');status.id='beats-status';status.setAttribute('role','status');const results=node('div');results.id='beats-results';c.append(form,status,results);input.addEventListener('input',()=>{results.replaceChildren();status.textContent=input.validity.valid?'Pulsa Calcular para actualizar.':'Introduce un número entero entre 1 y 10 000.';});form.addEventListener('submit',e=>{e.preventDefault();try{const data=calculateBeats(Number(input.value));const table=node('table');const caption=node('caption','Guía de momentos narrativos','sr-only');table.append(caption);const head=node('thead'),hr=node('tr');for(const text of ['Momento','Página(s)']){const th=node('th',text);th.scope='col';hr.append(th);}head.append(hr);const body=node('tbody');for(const item of data){const tr=node('tr');tr.append(node('td',item.name),node('td',item.end===null?String(item.start):`${item.start} – ${item.end}`));body.append(tr);}table.append(head,body);results.replaceChildren(table);status.textContent=`Guía para ${input.value} páginas · 15 momentos.`;}catch(error){status.textContent=error.message;}});}
function renderCatalog(){const query=$('#search').value.toLocaleLowerCase('es').trim();const items=catalog.filter(i=>(filter==='all'||i.type===filter)&&`${i.title} ${i.description} ${i.role}`.toLocaleLowerCase('es').includes(query));const grid=$('#catalog-grid');grid.replaceChildren();for(const item of items){const b=node('button',undefined,'catalog-card');if(item.image){const img=node('img');img.src=item.image;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';img.onerror=()=>img.remove();b.append(img);}b.append(node('small',item.type.toUpperCase()),node('strong',item.title),node('span',item.role),node('b','↗'));b.addEventListener('click',()=>openItem(item));grid.append(b);}$('#catalog-count').textContent=`${items.length} DESCUBRIMIENTOS`;$('#catalog-empty').hidden=items.length>0;}
async function loadCatalog(){try{
 const response=await fetch(`${import.meta.env.BASE_URL}catalogo.json`);
 if(!response.ok)throw new Error('Catálogo no disponible');
 catalog=validateCatalog(await response.json());
 try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)catalog=mergeProjects(catalog,JSON.parse(saved));}catch{console.warn('No se pudo cargar la copia local. Se muestra el catálogo publicado.');}
 catalogReady=true;$('#catalog-error').hidden=true;renderCatalog();
 }catch{$('#catalog-error').hidden=false;$('#catalog-empty').hidden=true;}}
$('#retry-catalog').addEventListener('click',loadCatalog);loadCatalog();
$('#search').addEventListener('input',renderCatalog);
for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderCatalog();});
function closeCatalog(){$('#catalog').hidden=true;$('#catalog-button').focus();}
$('#catalog-button').addEventListener('click',()=>{$('#catalog').hidden=false;$('#search').focus();});
$('#close-catalog').addEventListener('click',closeCatalog);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open&&!$('#catalog').hidden)closeCatalog();});
$('#advance').addEventListener('click',()=>{world?.advance(6);$('#welcome').hidden=true;});
$('#about-button').addEventListener('click',openProfile);
$('#sound').addEventListener('click',()=>{sound=!sound;$('#sound').textContent=sound?'SONIDO ON':'SONIDO OFF';$('#sound').setAttribute('aria-pressed',String(sound));$('#sound').setAttribute('aria-label',sound?'Desactivar sonidos':'Activar sonidos');chirp();});
$('#night').addEventListener('click',()=>{const active=document.body.classList.toggle('night');$('#night').setAttribute('aria-pressed',String(active));$('#night').textContent=active?'☾ TENUE':'☾ LUZ';chirp();});
$('#dismiss-welcome').addEventListener('click',()=>{$('#welcome').hidden=true;$('#game').focus({preventScroll:true});});
$('#secret').addEventListener('click',()=>{const c=show('La curiosidad tiene recompensa.','✦ RINCÓN SECRETO');c.append(node('p','Los videojuegos también son parte de mi universo: explorar, experimentar y volver a intentarlo. Este pequeño mundo es una invitación a hacer lo mismo.'),node('p','Encontraste la estrella del estudio. Un recordatorio de que las mejores ideas a veces están fuera del camino.'));const b=node('button','Cambiar la iluminación ☾','detail-action');b.addEventListener('click',()=>{document.body.classList.add('night');$('#night').setAttribute('aria-pressed','true');$('#night').textContent='☾ NOCHE';close();});c.append(b);});
const labels=$('#map-labels');for(const z of interactables){const b=node('button',undefined,'place');b.dataset.zone=z.id;b.setAttribute('aria-label',`Caminar a ${z.name}`);b.append(node('span',z.name),node('small',z.tag));b.addEventListener('click',()=>{chirp();$('#welcome').hidden=true;if(world){world.go(z.id);$('#map-status').textContent=`En camino a ${z.name}…`;$('#game').focus({preventScroll:true});}else openZone(z.id);});labels.append(b);}
function layoutLabels(view){
 for(const b of labels.children){const z=interactables.find(z=>z.id===b.dataset.zone),x=((z.x+z.w/2)*32-view.x)*view.zoom,y=((z.y+z.h)*32-view.y)*view.zoom+40;b.style.left=`${Math.max(100,Math.min(view.width-100,x))}px`;b.style.top=`${y}px`;b.hidden=y<100||y>view.height-145||x< -90||x>view.width+90;}
 const secret=$('#secret');secret.style.left=`${(487-view.x)*view.zoom}px`;secret.style.top=`${(260-view.y)*view.zoom}px`;secret.hidden=(260-view.y)*view.zoom<100||(260-view.y)*view.zoom>view.height-160;
 const row=Number($('#game').dataset.position?.split(',')[1]||8),i=row<14?0:row<29?1:row<45?2:row<61?3:4;
 $('#room-name').textContent=['01 / ESTUDIO','02 / PROYECCIÓN','03 / LABORATORIO','04 / ARCHIVO','05 / SIGUIENTE AVENTURA'][i];$('#game').dataset.cameraY=Math.round(view.y);
}
progress();
$('#interact').addEventListener('click',()=>world?.enter());$('#reset-position').addEventListener('click',()=>{world?.reset();$('#game').focus({preventScroll:true});});
for(const button of document.querySelectorAll('[data-direction]')){button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);world?.hold(button.dataset.direction,true);$('#welcome').hidden=true;});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>world?.hold(button.dataset.direction,false));button.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();world?.hold(button.dataset.direction,true);}});button.addEventListener('keyup',()=>world?.hold(button.dataset.direction,false));}
import('./world.js').then(async({startWorld})=>{world=await startWorld({isModal:()=>dialog.open||!$('#catalog').hidden,onView:layoutLabels,onOpen:openZone,onReady:()=>{$('#loading').hidden=true;},onPosition:tile=>{$('#game').dataset.position=tile.join(',');if(tile[1]!==8)$('#welcome').hidden=true;},onNear:z=>{$('#interact').disabled=!z;$('#map-status').textContent=z?`${z.name} · Toca DESCUBRIR`:'Toca un objeto o desliza para seguir explorando.';}});}).catch(()=>{$('#loading').hidden=true;$('#map-status').textContent='No se pudo iniciar el mapa. Puedes abrir los lugares o usar el catálogo.';});

const openAdmin=createAdmin({show,node,dialog,getCatalog:()=>catalog,saveProject:item=>{
 if(!catalogReady)throw new Error('Espera a que se cargue el catálogo antes de guardar.');
 const next=mergeProjects(catalog,[item]);
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next.filter(entry=>['Proyecto','Herramienta'].includes(entry.type))));}catch{throw new Error('No se pudo guardar: el almacenamiento está lleno o deshabilitado. Prueba con una portada más pequeña.');}
 catalog=next;renderCatalog();
}});

function openTool(item){
 const c=show(item.title,'LABORATORIO / HERRAMIENTA');c.append(node('p',item.description));
 const actions=node('div',undefined,'admin-actions');
 const external=node('a','Abrir en otra pestaña ↗','detail-action');external.href=item.url;external.target='_blank';external.rel='noopener noreferrer';actions.append(external);
 if(item.repository){const repo=node('a','Ver código en GitHub ↗','detail-action');repo.href=item.repository;repo.target='_blank';repo.rel='noopener noreferrer';actions.append(repo);}
 c.append(actions);
 if(item.display==='embedded'){
  const run=node('button',item.action||'Probar herramienta','detail-action');c.append(run);
  run.addEventListener('click',()=>{run.remove();const frame=node('iframe',undefined,'tool-frame');frame.title=item.title;frame.setAttribute('sandbox','allow-scripts');frame.referrerPolicy='no-referrer';frame.src=item.url;c.append(node('p','Si la aplicación impide mostrarse aquí, usa Abrir en otra pestaña.'),frame);});
 }
}
