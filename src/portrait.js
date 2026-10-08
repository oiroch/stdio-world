export const PORTRAIT_KEY='stdio-profile-portrait-v1';
export const defaultPortrait=()=>`${import.meta.env.BASE_URL}images/mauricio-araiza.png`;
export function readPortrait(){try{const s=localStorage.getItem(PORTRAIT_KEY);if(s&&s.length<1500000&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(s))return s;}catch{}return null;}
export const portraitSource=()=>readPortrait()||defaultPortrait();
function portraitBytes(source){return Uint8Array.from(atob(source.split(',')[1]),char=>char.charCodeAt(0));}
export async function makePortraitPDF(templateBytes,imageBytes,box){
 const {PDFDocument,rgb}=await import('pdf-lib');
 const doc=await PDFDocument.load(templateBytes),photo=await doc.embedJpg(imageBytes),page=doc.getPages()[0];
 page.drawRectangle({x:box.x-4,y:box.y-4,width:box.width+8,height:box.height+8,color:rgb(.914,.875,.941)});
 const ratio=Math.min(box.width/photo.width,box.height/photo.height),width=photo.width*ratio,height=photo.height*ratio;
 page.drawImage(photo,{x:box.x+(box.width-width)/2,y:box.y+(box.height-height)/2,width,height});
 return doc.save();
}
export async function portraitPDF(source=readPortrait()){
 if(!source)throw Error('No hay una foto personalizada guardada.');
 const [template,config]=await Promise.all([fetch(`${import.meta.env.BASE_URL}cv/template.pdf`),fetch(`${import.meta.env.BASE_URL}cv/portrait-box.json`)]);
 if(!template.ok||!config.ok)throw Error('No se pudo cargar el CV base. Intenta de nuevo.');
 return new Blob([await makePortraitPDF(await template.arrayBuffer(),portraitBytes(source),await config.json())],{type:'application/pdf'});
}
export function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
export function editPortrait({show,node}){
 const c=show('Foto del perfil y del CV','ADMIN / PERFIL');
 c.append(node('p','La foto se guarda en este navegador y se usa también al abrir o descargar tu CV. Descarga la imagen y el PDF si quieres publicarlos para todos.'));
 const preview=node('img',undefined,'portrait-editor-preview');preview.src=portraitSource();preview.alt='Vista previa de tu foto';
 const label=node('label','Elige una foto (JPG, PNG o WebP; hasta 5 MB)'),input=node('input');input.id='profile-photo-file';input.type='file';input.accept='image/jpeg,image/png,image/webp';label.htmlFor=input.id;
 const status=node('p');status.setAttribute('role','status');
 const save=node('button','Guardar foto y actualizar CV','detail-action');save.disabled=true;
 const exportPDF=node('button','Descargar CV con mi foto','detail-action');exportPDF.disabled=!readPortrait();
 const exportPhoto=node('button','Descargar foto','detail-action');exportPhoto.disabled=!readPortrait();
 let selected=null,busy=false;
 input.addEventListener('change',async()=>{
  selected=null;save.disabled=true;const file=input.files[0];if(!file)return;
  if(file.size>5000000||!['image/jpeg','image/png','image/webp'].includes(file.type)){status.textContent='Selecciona JPG, PNG o WebP de hasta 5 MB.';return;}
  try{const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>40000000){bitmap.close();throw Error('La imagen es demasiado grande. Usa una versión más pequeña.');}
   const canvas=document.createElement('canvas'),scale=Math.min(1,640/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();selected=canvas.toDataURL('image/jpeg',.9);preview.src=selected;save.disabled=false;status.textContent='Vista previa. Guarda para actualizar el perfil y el CV.';
  }catch(error){status.textContent=error.message||'No se pudo leer la imagen.';}
 });
 save.addEventListener('click',async()=>{if(!selected||busy)return;busy=true;save.disabled=true;input.disabled=true;status.textContent='Preparando el CV…';try{await portraitPDF(selected);localStorage.setItem(PORTRAIT_KEY,selected);exportPDF.disabled=false;exportPhoto.disabled=false;status.textContent='Foto guardada. El perfil y las descargas del CV usarán esta imagen.';}catch(error){status.textContent=`No se guardó: ${error.message}`;}finally{busy=false;input.disabled=false;save.disabled=!selected;}});
 exportPDF.addEventListener('click',async()=>{exportPDF.disabled=true;try{downloadBlob(await portraitPDF(),'Mauricio-Araiza-CV.pdf');status.textContent='CV descargado con la foto guardada.';}catch(error){status.textContent=error.message;}finally{exportPDF.disabled=!readPortrait();}});
 exportPhoto.addEventListener('click',()=>{const source=readPortrait();if(source)downloadBlob(new Blob([portraitBytes(source)],{type:'image/jpeg'}),'mauricio-araiza.jpg');});
 c.append(label,input,preview,status,save,exportPDF,exportPhoto);
}
