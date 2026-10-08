import { editPortrait } from './portrait.js';
import { linkDefaults, validateManaged } from './admin-model.js';

export function createAdmin({ show, node, getCatalog, saveProject, dialog }) {
  // Easter egg only: this is not an authentication boundary.
  let unlocked = false;
  function logout(){unlocked=false;}
  dialog.addEventListener('close', logout);
  function button(text, action) { const b = node('button', text); b.type = 'button'; b.addEventListener('click', action); return b; }
  function prompt(password = false) {
    const c = show('Terminal stdio.mx', 'COMPUTADORA / EASTER EGG');
    c.append(node('p', password ? 'Introduce la clave del easter egg para abrir el editor.' : 'Escribe un comando en la computadora.'));
    const form = node('form'), label = node('label', password ? 'Clave del easter egg' : 'Comando'), input = node('input');
    label.htmlFor = input.id = 'terminal-input'; input.type = password ? 'password' : 'text'; input.required = true; input.autocomplete = 'off'; input.spellcheck = false;
    const submit = node('button', 'Continuar'); submit.type = 'submit';
    const status = node('p'); status.setAttribute('role', 'status');
    form.append(label, input, submit, status); c.append(form); input.focus();
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!password) { if(input.value.trim().toLowerCase()==='admin')prompt(true);else status.textContent='Comando no reconocido.';return; }
      if(input.value==='MASTERKEY'){input.value='';unlocked=true;panel();}
      else{input.value='';status.textContent='Esa no es la clave del easter egg.';input.focus();}
    });
  }

  function panel(message = '') {
    if (!unlocked) return prompt();
    const c = show('Administrar inventario', 'STDIO.MX / INVENTARIO');
    c.append(node('p', 'Este es un editor local desbloqueado como easter egg. Guarda en este navegador; exporta el catálogo para conservarlo y publicarlo.', 'admin-notice'));
    const status = node('p', message); status.setAttribute('role', 'status'); c.append(status);
    const actions = node('div', undefined, 'admin-actions');
    actions.append(button('Foto del perfil y CV',()=>editPortrait({show,node})),button('+ Agregar proyecto', () => editor()), button('+ Agregar herramienta', () => editor(undefined,'Herramienta')), button('Exportar catálogo', () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(getCatalog(), null, 2)], { type: 'application/json' }));
      const a = node('a'); a.href = url; a.download = 'catalogo.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Catálogo exportado. Para publicarlo, reemplaza public/catalogo.json en el proyecto y despliega el sitio.';
    }), button('Bloquear editor', () => { logout(); prompt(); }));
    c.append(actions);
    const list = node('div', undefined, 'zone-items');
    for (const item of getCatalog().filter(i => ['Proyecto','Herramienta'].includes(i.type))) list.append(button(`${item.type} · Editar · ${item.title}`, () => editor(item)));
    c.append(list);
  }
  function editor(existing, type=existing?.type || 'Proyecto') {
    const isTool=type==='Herramienta', builtin=existing?.tool==='beats';
    if (!unlocked) return prompt();
    const c = show(`${existing?'Editar':'Agregar'} ${isTool?'herramienta':'proyecto'}`, isTool?'EDITOR / LABORATORIO':'EDITOR / SALA DE PROYECCIÓN');
    const form = node('form', undefined, 'admin-form'), fields = {};
    for (const [key, text, type] of [['url', isTool?'URL de la aplicación':'Enlace del proyecto', isTool?'text':'url'], ['title', 'Título', 'text'], ['role', 'Tu participación', 'text'], ['description', 'Descripción', 'textarea'], ['image', 'URL de imagen (opcional)', 'text'], ['action', 'Texto del botón', 'text']]) {
      const label = node('label', text), input = node(type === 'textarea' ? 'textarea' : 'input');
      if (type !== 'textarea') input.type = type;
      input.id = `project-${key}`; label.htmlFor = input.id; input.required = key !== 'image' && !(builtin&&key==='url');if(builtin&&key==='url')input.disabled=true; input.maxLength = key === 'image' ? 1500000 : 5000;
      input.value = existing?.[key] || (key === 'action' ? (isTool?'Probar herramienta':'Ver proyecto') : ''); fields[key] = input; form.append(label, input);
    }
    if(isTool){
      const label=node('label','Repositorio GitHub (opcional)'),input=node('input');input.type='url';input.id='tool-repository';label.htmlFor=input.id;input.value=existing?.repository||'';fields.repository=input;
      const modeLabel=node('label','Abrir la aplicación'),select=node('select');select.id='tool-display';modeLabel.htmlFor=select.id;
      for(const [value,text] of [['embedded','Dentro de stdio.mx'],['external','En otra pestaña']]){const option=node('option',text);option.value=value;select.append(option);}select.value=existing?.display||'embedded';fields.display=select;
      form.append(label,input,modeLabel,select,node('p',builtin?'Calculadora integrada: puedes editar su ficha; se conserva su funcionamiento.':'URL HTTPS de la demo publicada o ./tools/nombre/index.html para una demo incluida. El repositorio y la demo son enlaces distintos.'));
      if(builtin)select.disabled=true;
    }
    const status = node('p'); status.setAttribute('role', 'status');
    const preview = node('div', undefined, 'admin-preview');
    function refresh() {
      preview.replaceChildren();
      const value = fields.image.value.trim();
      if (/^(https:\/\/|data:image\/(png|jpeg|webp);base64,)/.test(value)) {
        const img = node('img'); img.src = value; img.alt = 'Vista previa de portada'; img.referrerPolicy = 'no-referrer'; img.onerror = () => { img.remove(); }; preview.append(img);
      }
      preview.append(node('strong', fields.title.value || 'Tu nuevo proyecto'), node('p', fields.role.value || 'Tu participación'));
    }
    const generate = button('Preparar tarjeta desde el enlace', () => {
      try { const defaults = linkDefaults(fields.url.value.trim()); if (!fields.title.value.trim()) fields.title.value = defaults.title; if (!fields.image.value.trim()) fields.image.value = defaults.image;
        status.textContent = defaults.image ? 'Miniatura de YouTube preparada. Escribe el título y tu participación.' : 'Tarjeta preparada. Completa los textos y elige una imagen.'; refresh();
      } catch (error) { status.textContent = error.message; }
    });
    if(!builtin)fields.url.after(generate);
    const uploadLabel = node('label', 'O subir portada (PNG, JPEG o WebP, hasta 1 MB)'), upload = node('input');
    upload.type = 'file'; upload.accept = 'image/png,image/jpeg,image/webp'; upload.id = 'project-file'; uploadLabel.htmlFor = upload.id;
    upload.addEventListener('change', async () => {
      const file = upload.files[0]; if (!file) return;
      if (file.size > 1000000 || !['image/png','image/jpeg','image/webp'].includes(file.type)) { status.textContent = 'Selecciona PNG, JPEG o WebP de hasta 1 MB.'; upload.value = ''; return; }
      const reader = new FileReader(); reader.onload = () => { fields.image.value = reader.result; refresh(); }; reader.onerror = () => { status.textContent = 'No se pudo leer la imagen.'; }; reader.readAsDataURL(file);
    });
    const submit = node('button', 'Guardar en inventario'); submit.type = 'submit';
    form.append(uploadLabel, upload, preview, status, submit, button('Volver sin guardar', () => panel()));
    form.addEventListener('input', refresh);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const values = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
        const item = validateManaged({ ...values, ...(builtin?{tool:'beats'}:{}), id: existing?.id || `entry-${crypto.randomUUID()}`, type, zone: isTool?'lab':'cinema' });
        submit.disabled=true;saveProject(item);panel('Ficha guardada en el inventario de este navegador.');
      } catch (error) { status.textContent = error.message; } finally {submit.disabled=false;}
    });
    c.append(form); refresh(); fields.url.focus();
  }
  return () => prompt();
}
