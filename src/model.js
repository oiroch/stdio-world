import { validateTool } from './admin-model.js';
export const COLS = 20, ROWS = 76, TILE = 32;
export const SPAWN = [9, 8];
export const zones = [
 {id:'studio',name:'Estudio Mauricio',tag:'SOBRE MÍ',icon:'✳',x:4,y:3,w:4,h:3,door:[6,6],color:'#ab77dc',description:'Producción, creatividad y maneras de resolver.'},
 {id:'cinema',name:'Sala de proyección',tag:'PROYECTOS',icon:'▶',x:11,y:17,w:6,h:4,door:[13,21],color:'#dc76bf',description:'Cada proyecto tiene una historia detrás de cámara.'},
 {id:'lab',name:'Laboratorio',tag:'HERRAMIENTAS',icon:'>_',x:3,y:32,w:5,h:4,door:[5,36],color:'#56cbda',description:'Ideas que se convierten en herramientas que puedes usar.'},
 {id:'library',name:'Archivo de historias',tag:'LECTURAS',icon:'▤',x:11,y:48,w:6,h:4,door:[13,52],color:'#b995e5',description:'Un lugar para leer, imaginar y construir relatos.'},
 {id:'contact',name:'La siguiente aventura',tag:'CONTACTO',icon:'↗',x:7,y:65,w:6,h:4,door:[9,69],color:'#65bade',description:'¿Qué vamos a hacer que suceda?'}
];
export const computer={id:'admin',name:'Computadora',tag:'TERMINAL',x:12,y:8,w:3,h:2,door:[13,10]};
export const interactables=[...zones,computer];
export function blocked(x,y){
 if(x<2||x>=18||y<2||y>=74)return true;
 if([13,28,44,60].includes(y)&&(x<8||x>11))return true;
 return interactables.some(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h);
}

export function findPath(from, to) {
  if (blocked(to[0], to[1])) return [];
  const key = ([x,y]) => `${x},${y}`;
  const queue = [from], visited = new Map([[key(from), null]]);
  for (let i=0; i<queue.length; i++) {
    const current=queue[i];
    if (key(current)===key(to)) {
      const path=[]; let node=current;
      while (node) {path.unshift(node);node=visited.get(key(node));}
      return path.slice(1);
    }
    for (const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const next=[current[0]+dx,current[1]+dy];
      if (!blocked(...next)&&!visited.has(key(next))) {visited.set(key(next),current);queue.push(next);}
    }
  }
  return [];
}

export const beats = [ ['Imagen de apertura',.001],['Establecimiento del tema',.0376],['Planteamiento',.001,.09],['Catalizador',.1045],['Debate',.1045,.2245],['Entrada al segundo acto',.2245],['Historia secundaria',.27],['Diversión y juegos',.27,.5],['Punto medio',.5],['El enemigo se acerca',.5,.675],['Todo está perdido',.675],['Noche oscura del alma',.675,.77],['Entrada al tercer acto',.77],['Final',.77,.999],['Imagen final',1] ];
export function calculateBeats(pages) {
  if (!Number.isInteger(pages)||pages<1||pages>10000) throw new RangeError('Usa de 1 a 10 000 páginas enteras.');
  return beats.map(([name,start,end])=>({name,start:Math.ceil(pages*start),end:end===undefined?null:Math.ceil(pages*end)}));
}
export function validURL(value) {
  if (typeof value !== 'string') return false;
  if (value.startsWith('./')&&!value.includes('..',2)) return true;
  try {return ['https:','mailto:'].includes(new URL(value).protocol);} catch {return false;}
}
export function validateCatalog(items) {
  if(!Array.isArray(items)) throw new Error('El catálogo debe ser una lista.');
  const ids=new Set();
  for(const item of items){
    if(!item.id||ids.has(item.id)||!item.title||!zones.some(z=>z.id===item.zone)) throw new Error('Revisa identificadores, títulos y zonas del catálogo.');
    if(item.url&&!validURL(item.url))throw new Error('Enlace no válido en '+item.id);
    if(item.tool&&!['beats','profile'].includes(item.tool))throw new Error('Herramienta desconocida.');
    if(!item.tool&&!item.url)throw new Error('Falta una acción en '+item.id);
    if(item.type==='Herramienta'&&!item.tool)validateTool(item);
    ids.add(item.id);
  }
  return items;
}
