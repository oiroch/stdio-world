export const STORAGE_KEY = 'stdio-projects-v1';

export function httpsURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
export function validImage(value) {
  return !value || (typeof value === 'string' && value.length < 1500000 &&
    (httpsURL(value) || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)));
}
export function linkDefaults(value) {
  if (!httpsURL(value)) throw new Error('Introduce un enlace HTTPS válido.');
  const url = new URL(value), host = url.hostname.replace(/^www\./, '');
  let id;
  if (host === 'youtu.be') id = url.pathname.slice(1);
  if (['youtube.com', 'm.youtube.com'].includes(host)) id = url.searchParams.get('v') || url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
  return { title: `Proyecto · ${host}`, image: /^[\w-]{11}$/.test(id || '') ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '' };
}
export function validateProject(item) {
  if (!item || typeof item.id !== 'string' || !item.id || item.type !== 'Proyecto' || item.zone !== 'cinema' || item.tool) throw new Error('Proyecto no válido.');
  for (const key of ['title', 'role', 'description', 'action']) {
    if (typeof item[key] !== 'string' || !item[key].trim() || item[key].length > 5000) throw new Error('Completa título, participación, descripción y texto del botón.');
  }
  if (!httpsURL(item.url)) throw new Error('El enlace del proyecto debe usar HTTPS.');
  if (!validImage(item.image)) throw new Error('Usa una imagen HTTPS o un archivo PNG, JPEG o WebP menor de 1 MB.');
  return item;
}
export function appURL(value) {
  return httpsURL(value) || (typeof value==='string' && /^\.\/tools\/[a-z0-9-]+\/index\.html$/.test(value));
}
export function validateTool(item) {
  if(!item || item.type!=='Herramienta' || item.zone!=='lab' || typeof item.id!=='string' || !item.id)throw new Error('Herramienta no válida.');
  for(const key of ['title','role','description','action'])if(typeof item[key]!=='string'||!item[key].trim()||item[key].length>5000)throw new Error('Completa los textos de la herramienta.');
  if(item.tool ? item.tool!=='beats' : !appURL(item.url))throw new Error('Usa una URL HTTPS o la ruta de una demo local.');
  if(item.repository && (!httpsURL(item.repository)||new URL(item.repository).hostname!=='github.com'||!/^\/[^/]+\/[^/]+\/?$/.test(new URL(item.repository).pathname)))throw new Error('Introduce la URL de un repositorio de GitHub.');
  if(!['embedded','external'].includes(item.display)&&!(item.tool==='beats'&&item.display===undefined))throw new Error('Selecciona cómo abrir la herramienta.');
  if(!validImage(item.image))throw new Error('Portada no válida.');
  return item;
}
export function validateManaged(item){return item?.type==='Herramienta'?validateTool(item):validateProject(item);}
export function mergeProjects(base, edits) {
  if (!Array.isArray(edits)) throw new Error('El respaldo debe contener una lista.');
  const result = base.map(item => ({ ...item })), seen = new Set();
  for (const item of edits) {
    validateManaged(item);
    if (seen.has(item.id)) throw new Error('Hay identificadores repetidos.');
    seen.add(item.id);
    const index = result.findIndex(entry => entry.id === item.id);
    if (index >= 0 && result[index].type !== item.type) throw new Error('Ese identificador pertenece a otro contenido.');
    if (index >= 0) result[index] = item; else result.push(item);
  }
  return result;
}
