import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { blocked, findPath, zones, calculateBeats, validateCatalog, validURL, SPAWN } from '../src/model.js';

test('todas las puertas son accesibles desde la plaza sin cruzar mobiliario o muros',()=>{
  for(const zone of zones){
    const path=findPath(SPAWN,zone.door);assert.ok(path.length);
    assert.deepEqual(path.at(-1),zone.door);
    let previous=SPAWN;
    for(const point of path){assert.equal(blocked(...point),false);assert.equal(Math.abs(point[0]-previous[0])+Math.abs(point[1]-previous[1]),1);previous=point;}
  }
});
test('destinos bloqueados no generan ruta',()=>{assert.deepEqual(findPath(SPAWN,[4,3]),[]);assert.deepEqual(findPath(SPAWN,[-1,0]),[]);});
test('guía narrativa conserva resultados y rechaza entradas inválidas',()=>{
  const result=calculateBeats(120);assert.equal(result.length,15);assert.equal(result[8].start,60);assert.equal(result.at(-1).start,120);
  for(const n of [0,-1,1.5,NaN,Infinity,10001])assert.throws(()=>calculateBeats(n),RangeError);
});
test('catálogo real válido y completo',()=>{const data=JSON.parse(readFileSync('public/catalogo.json','utf8').replace(/^\uFEFF/,''));assert.ok(validateCatalog(data).length>0);});
test('enlaces ejecutables y duplicados se rechazan',()=>{
  assert.equal(validURL('javascript:alert(1)'),false);assert.equal(validURL('//example.com'),false);
  const duplicate={id:'a',title:'A',zone:'lab',tool:'beats'};assert.throws(()=>validateCatalog([duplicate,duplicate]));
  assert.throws(()=>validateCatalog([{id:'a',title:'A',zone:'lab',url:'javascript:alert(1)'}]));
});
import { linkDefaults, mergeProjects, validateProject } from '../src/admin-model.js';
import { computer } from '../src/model.js';
test('terminal accesible y con mobiliario sólido',()=>{assert.ok(findPath(SPAWN,computer.door).length);assert.equal(blocked(computer.x,computer.y),true);});
const project={id:'new-project',type:'Proyecto',zone:'cinema',title:'Nuevo',role:'Producción',description:'Una pieza',action:'Ver',url:'https://example.com',image:''};
test('proyectos nuevos y editados conservan el resto del catálogo',()=>{const base=JSON.parse(readFileSync('public/catalogo.json','utf8'));const added=mergeProjects(base,[project]);assert.equal(added.length,base.length+1);const edited=mergeProjects(added,[{...project,title:'Editado'}]);assert.equal(edited.length,added.length);assert.equal(edited.at(-1).title,'Editado');assert.deepEqual(edited[0],base[0]);assert.throws(()=>mergeProjects(base,[{...project,id:'estructura'}]));});
test('rechaza enlaces ejecutables, imágenes SVG y proyectos incompletos',()=>{for(const changes of [{url:'javascript:alert(1)'},{image:'data:image/svg+xml;base64,AAA='},{title:''},{image:27},{tool:'profile'}])assert.throws(()=>validateProject({...project,...changes}));assert.throws(()=>mergeProjects([],[project,project]));});
test('miniaturas solo para enlaces válidos de YouTube',()=>{assert.equal(linkDefaults('https://youtu.be/Bu0H6qt3RpE').image,'https://i.ytimg.com/vi/Bu0H6qt3RpE/hqdefault.jpg');assert.equal(linkDefaults('https://youtube.com.evil.test/watch?v=Bu0H6qt3RpE').image,'');assert.throws(()=>linkDefaults('javascript:alert(1)'));});

import {validateTool,appURL} from '../src/admin-model.js';
const demo={id:'demo',type:'Herramienta',zone:'lab',title:'Demo',description:'Ejemplo',role:'JavaScript',action:'Probar',url:'./tools/pokedex/index.html',repository:'https://github.com/example/demo',display:'embedded'};
test('herramientas y proyectos se administran sin sustituir otras categorías',()=>{assert.equal(validateTool(demo),demo);const entries=mergeProjects([project],[demo]);assert.equal(entries.length,2);assert.equal(mergeProjects(entries,[{...demo,title:'Editada'}])[1].title,'Editada');assert.throws(()=>mergeProjects([project],[{...demo,id:project.id}]));});
test('las demos rechazan rutas arbitrarias y repositorios falsos',()=>{for(const url of ['javascript:alert(1)','./tools/../index.html','//evil.example','./tools/%2e%2e/index.html','./index.html'])assert.equal(appURL(url),false);assert.throws(()=>validateTool({...demo,repository:'https://github.com.evil.test/a/b'}));assert.throws(()=>validateTool({...demo,display:'unknown'}));});
test('beat sheet conserva la lógica al editar su ficha',()=>{assert.equal(validateTool({...demo,id:'estructura',url:'',tool:'beats'}).tool,'beats');});

test('guardar y recargar el catálogo completo conserva el beat sheet original',()=>{const base=JSON.parse(readFileSync('public/catalogo.json','utf8'));const saved=mergeProjects(base,[demo]).filter(i=>['Proyecto','Herramienta'].includes(i.type));assert.equal(mergeProjects(base,JSON.parse(JSON.stringify(saved))).length,base.length+1);});
