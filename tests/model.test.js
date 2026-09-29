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
