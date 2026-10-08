import Phaser from 'phaser';
import { zones, interactables, TILE, COLS, ROWS, SPAWN, blocked, findPath } from './model.js';

function terrain(){
 const c=document.createElement('canvas');c.width=COLS*TILE;c.height=ROWS*TILE;
 const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
 const t=(text,x,y,size=12,color='#cfbce9')=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.fillText(text,x,y);};
 let seed=39;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 r(0,0,c.width,c.height,'#101025');
 for(let i=0;i<600;i++){r(Math.floor(rand()*640),Math.floor(rand()*c.height),2,2,['#8a6fa7','#445479','#bba1d1'][i%3]);}
 // Plancher continu: le déplacement vertical révèle les ateliers successifs.
 r(57,48,526,c.height-80,'#34304c');
 for(let y=48;y<c.height-32;y+=32){for(let x=64;x<576;x+=32){r(x+1,y+1,30,30,(x/32+y/32)%2?'#423951':'#483d58');r(x+3,y+29,26,2,'#2e2a40');r(x+3,y+4,2,21,'#66516a30');}}
 r(62,48,4,c.height-80,'#9974c4');r(574,48,4,c.height-80,'#9974c4');
 for(let y=64;y<c.height-100;y+=96){r(58,y,7,24,'#d47aca');r(575,y+32,7,24,'#648ac7');}
 // Fenêtres sur le ciel de stdio.mx.
 r(64,30,512,46,'#22243c');r(64,28,512,5,'#9c87b4');
 for(let x=70;x<572;x+=64){r(x,37,54,29,'#4d396f');r(x+3,39,48,23,'#3b315d');r(x+8,49,2,2,'#f0d8ef');r(x+36,43,3,3,'#a593d0');r(x,65,54,4,'#6487b4');}
 t('stdio.mx',248,57,22,'#f4c7f4');
 // Passages entre pièces; les cloisons sont aussi présentes dans les collisions.
 for(const row of [13,28,44,60]){
  const y=row*32;
  for(const [x,w] of [[64,192],[384,192]]){r(x,y,w,32,'#22253c');r(x,y,w,5,'#8c789e');r(x,y+25,w,7,'#171d30');for(let xx=x+10;xx<x+w;xx+=40)r(xx,y+9,26,9,'#515374');}
  r(252,y,5,34,'#df8ed3');r(384,y,5,34,'#8ab5e9');
  r(260,y+2,120,28,'#817098');r(264,y+4,112,3,'#b5a0bf');r(264,y+12,112,3,'#b5a0bf');r(264,y+21,112,3,'#b5a0bf');
 }
 // Signalétique en espagnol, gravée au sol.
 [['01 / ESTUDIO',304],['02 / PRODUCCION',772],['03 / LABORATORIO',1260],['04 / HISTORIAS',1772],['05 / TU PROYECTO',2300]].forEach(([name,y])=>{r(233,y-17,179,38,'#352e4e');t(name,244,y,11,'#bfa1d3');t('v   SIGUE EXPLORANDO   v',241,y+14,8,'#89799e');});
 function cabinet(x,y,w=64,h=80){r(x+4,y+4,w,h,'#272a44');r(x,y,w,h,'#676781');r(x+3,y+3,w-6,5,'#9290a6');for(let yy=y+14;yy<y+h-12;yy+=24){r(x+5,yy,w-10,19,'#343653');r(x+12,yy+4,18,3,'#a6a0b1');r(x+w-15,yy+6,3,3,'#ce8bcc');}r(x,y+h-5,w,5,'#41435d');}
 function books(x,y){cabinet(x,y,64,83);for(let j=0;j<3;j++)for(let i=0;i<7;i++){r(x+7+i*7,y+15+j*24,5,16,['#8ba4c3','#c888b7','#69aab4','#d9b988'][i%4]);r(x+8+i*7,y+18+j*24,3,2,'#e3cfe3');}}
 function monitor(x,y,w=64,h=48){r(x+4,y+5,w,h,'#292940');r(x,y,w,h,'#73748d');r(x+4,y+4,w-8,h-10,'#171f38');r(x+7,y+7,w-14,h-17,'#356389');r(x+10,y+10,w-20,3,'#6ed5df');for(let i=0;i<3;i++)r(x+10,y+18+i*6,w*(.25+i*.1),2,i%2?'#d887ca':'#86b1cf');r(x+w/2-4,y+h,8,10,'#7c7c91');r(x+w/2-14,y+h+9,28,4,'#4c4e68');}
 function table(x,y,w,h){r(x+4,y+7,w,h,'#242438');r(x,y,w,h-12,'#9993aa');r(x+4,y+4,w-8,h-21,'#6c6986');r(x+2,y+h-17,w-4,5,'#b1a2b7');r(x+5,y+h-12,8,16,'#3b3d58');r(x+w-13,y+h-12,8,16,'#3b3d58');}
 function plant(x,y){r(x+3,y+24,26,24,'#745679');r(x,y+23,32,6,'#b17eab');r(x+13,y-3,5,30,'#526b81');r(x+1,y+1,17,15,'#7187a2');r(x+16,y-8,15,22,'#9aa1bc');r(x+5,y-8,10,12,'#677591');}
 function filmCamera(x,y){r(x+10,y+30,5,50,'#8791ac');r(x-4,y+71,14,4,'#6b7493');r(x+17,y+71,14,4,'#6b7493');r(x-9,y,45,29,'#384361');r(x-6,y+3,37,4,'#8994b2');r(x+37,y+8,12,17,'#7789a7');r(x+46,y+5,6,23,'#283752');r(x-6,y-13,17,16,'#535575');r(x+16,y-13,17,16,'#535575');r(x-3,y-10,10,10,'#252e48');r(x+19,y-10,10,10,'#252e48');}
 for(const z of zones){const x=z.x*32,y=z.y*32,w=z.w*32,h=z.h*32;
  if(z.id==='studio'){table(x,y+36,w,h-36);monitor(x+8,y+3,63,48);monitor(x+76,y+10,42,37);r(x+36,y+71,55,10,'#9693af');for(let i=0;i<8;i++)r(x+39+i*6,y+74,4,2,'#383950');r(x+3,y+70,18,17,'#c784bd');}
  if(z.id==='cinema'){r(x-4,y-4,w+8,h+4,'#474666');r(x,y,w,h-13,'#a78aac');r(x+7,y+7,w-14,h-27,'#151e38');const grad=g.createLinearGradient(x,y,x+w,y+h);grad.addColorStop(0,'#303d7e');grad.addColorStop(.5,'#9060af');grad.addColorStop(1,'#cb8dc7');g.fillStyle=grad;g.fillRect(x+13,y+13,w-26,h-40);for(let i=0;i<30;i++)r(x+16+rand()*(w-35),y+18+rand()*(h-50),2,2,'#e1cef1');t('TUS IDEAS',x+35,y+48,17,'#f1cdeb');t('EN PANTALLA',x+30,y+68,15,'#e2d2fa');r(x+16,y+h-13,8,13,'#53516e');r(x+w-24,y+h-13,8,13,'#53516e');}
  if(z.id==='lab'){table(x,y+47,w,h-47);monitor(x+6,y,83,63);cabinet(x+100,y,57,100);r(x+105,y+12,45,57,'#244961');for(let i=0;i<4;i++){r(x+108+i*10,y+17,6,41,'#3ab4d0');r(x+108+i*10,y+24,6,3,'#aaeff0');}r(x+10,y+91,73,12,'#a6a4bc');t('>_',x+27,y+32,22,'#86e6ea');}
  if(z.id==='library'){books(x,y);books(x+64,y);books(x+128,y);table(x+10,y+84,w-20,42);r(x+32,y+93,35,15,'#ded1d5');r(x+69,y+93,34,15,'#bdb2c9');r(x+66,y+94,3,16,'#665870');r(x+125,y+94,22,11,'#c28db6');}
  if(z.id==='contact'){table(x,y+43,w,h-43);monitor(x+33,y,126,80);t('HAGAMOS',x+60,y+35,13,'#a2dcf0');t('QUE SUCEDA',x+49,y+53,13,'#efa6dc');r(x+61,y+95,65,12,'#8d8bab');}
  r(x,y+h-3,w,3,z.color);
 }
 // Mobiliario secundario junto a las paredes.
 for(const [x,y] of [[85,103],[501,113],[90,580],[517,822],[85,1190],[520,1100],[86,1600],[523,1800],[92,2130],[520,2200]])plant(x,y);
 cabinet(454,91,85,112);r(461,110,71,52,'#2b3f69');for(let i=0;i<6;i++)r(466+i*10,118,5,32,'#57b8cf');
 books(74,342);cabinet(492,335,63,64);
 filmCamera(145,585);table(94,730,104,63);r(115,744,53,25,'#af79b9');
 monitor(428,1070,77,67);books(91,1477);filmCamera(470,1840);
 table(384,285,96,35);monitor(398,256,67,46);t('>_',416,283,18,'#86e6ea');
 // Alfombra de llegada.
 r(268,216,105,99,'#654a85');r(272,220,97,91,'#ac72b5');r(278,226,85,79,'#76528f');r(286,234,69,63,'#815e9b');t('✦',314,270,24,'#e8b0e6');
 return c;
}
function character(){const c=document.createElement('canvas');c.width=24;c.height=32;const g=c.getContext('2d');const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};r(3,27,19,4,'#3d5b4c60');r(6,22,5,7,'#3b5061');r(14,22,5,7,'#3b5061');r(4,28,7,3,'#2f4244');r(14,28,7,3,'#2f4244');r(5,12,15,12,'#a877dc');r(3,14,3,8,'#c89772');r(20,14,3,8,'#c89772');r(7,2,12,13,'#dfaf83');r(5,1,16,6,'#554638');r(5,6,4,5,'#554638');r(15,8,2,2,'#3d4037');r(5,15,6,9,'#ac6b4d');r(5,14,6,2,'#82543e');return c;}


export function startWorld(callbacks){
 return new Promise(resolve=>{
 let scene,player,tile=[...SPAWN],route=[],moving=false,target=null,held=null,pending=null,near=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
 const keyMap={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};
 function info(){near=interactables.find(z=>Math.abs(tile[0]-z.door[0])+Math.abs(tile[1]-z.door[1])<=1);callbacks.onPosition(tile);callbacks.onNear(near);}
 function go(id){const z=interactables.find(z=>z.id===id);if(!z)return;pending={to:z.door,id};}
 function destination(to,id=null){pending={to,id};}
 function enter(){if(near&&!callbacks.isModal())callbacks.onOpen(near.id);}
 function advance(delta){const to=[tile[0],Math.max(2,Math.min(73,tile[1]+delta))];if(blocked(...to)){to[0]=9;}destination(to);}
 const api={go,enter,advance,hold:(direction,on)=>{held=on?direction:null;},reset:()=>{scene.tweens.killTweensOf(player);moving=false;route=[];pending=null;target=null;tile=[...SPAWN];player.setPosition(tile[0]*TILE+16,tile[1]*TILE+16);scene.cameras.main.centerOn(player.x,player.y);info();}};
 class World extends Phaser.Scene{
 create(){
 scene=this;this.textures.addCanvas('room',terrain());this.textures.addCanvas('mauricio',character());
 this.add.image(0,0,'room').setOrigin(0);player=this.add.sprite(tile[0]*32+16,tile[1]*32+16,'mauricio').setOrigin(.5,.85).setScale(1.45).setDepth(5);
 const cam=this.cameras.main;cam.setBounds(0,0,COLS*TILE,ROWS*TILE);cam.startFollow(player,true,reduced?1:.12,reduced?1:.12);
 const resize=()=>{cam.setZoom(Math.max(1,Math.min(2,this.scale.width/500)));cam.centerOn(player.x,player.y);};resize();this.scale.on('resize',resize);
 let down=null;
 this.input.on('pointerdown',p=>{if(!callbacks.isModal())down={x:p.x,y:p.y};});
 this.input.on('pointerup',p=>{
 if(!down||callbacks.isModal())return;const dy=p.y-down.y,dx=p.x-down.x;down=null;
 if(Math.abs(dy)>30&&Math.abs(dy)>Math.abs(dx)){advance(dy<0?6:-6);return;}
 const point=cam.getWorldPoint(p.x,p.y),x=Math.floor(point.x/32),y=Math.floor(point.y/32);
 const z=interactables.find(z=>x>=z.x&&x<z.x+z.w&&y>=z.y&&y<z.y+z.h);if(z)go(z.id);else if(!blocked(x,y))destination([x,y]);
 });
 this.input.on('wheel',(_p,_o,_dx,dy)=>{if(!callbacks.isModal()&&Math.abs(dy)>2)advance(dy>0?6:-6);});
 const keydown=e=>{if(callbacks.isModal()||['INPUT','TEXTAREA','BUTTON','A'].includes(document.activeElement?.tagName))return;const dir=keyMap[e.key];if(dir){e.preventDefault();held=dir;pending={step:dir};}if(e.key.toLowerCase()==='e')enter();};
 const keyup=e=>{if(keyMap[e.key]===held)held=null;};
 const blur=()=>{held=null;};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',blur);
 this.events.once('shutdown',()=>{window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);});
 info();callbacks.onReady();resolve(api);
 }
 update(){
 const cam=this.cameras.main;callbacks.onView({x:cam.worldView.x,y:cam.worldView.y,zoom:cam.zoom,width:this.scale.width,height:this.scale.height});
 if(callbacks.isModal()){held=null;route=[];pending=null;target=null;return;}
 if(moving)return;
 if(pending){route=[];target=pending.id||null;if(pending.step){const [dx,dy]=directions[pending.step],next=[tile[0]+dx,tile[1]+dy];route=blocked(...next)?[]:[next];}else route=findPath(tile,pending.to);pending=null;}
 if(held){const [dx,dy]=directions[held],next=[tile[0]+dx,tile[1]+dy];target=null;route=blocked(...next)?[]:[next];}
 if(!route.length){if(target){const id=target;target=null;callbacks.onOpen(id);}return;}
 const next=route.shift();moving=true;player.setFlipX(next[0]<tile[0]);
 this.tweens.add({targets:player,x:next[0]*32+16,y:next[1]*32+16,duration:145,ease:'Linear',onComplete:()=>{tile=next;moving=false;info();}});
 }
 }
 new Phaser.Game({type:Phaser.CANVAS,parent:'game',backgroundColor:'#101025',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:document.querySelector('#game').clientWidth,height:document.querySelector('#game').clientHeight},scene:World,audio:{noAudio:true},input:{touch:{capture:true},mouse:{preventDefaultWheel:true}}});
 });
}
