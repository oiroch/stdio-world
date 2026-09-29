# Publicar el mundo de STDIO

La versión actual utiliza Phaser 3 y Vite 6. Todo lo que se publica es estático:
HTML, CSS, JavaScript, catálogo JSON y el PDF de la tesis. No necesita PHP,
Python, base de datos ni un servidor Flask. Node se usa para desarrollar y
compilar, no para atender a los visitantes.

## Verlo en tu computadora

Abre `ABRIR-MUNDO.bat` o ejecuta:

```powershell
npm ci
npm run dev
```

Visita http://127.0.0.1:5173. El prototipo Flask anterior sigue en `app.py` y `web/`.

## Añadir un proyecto o herramienta

Edita `public/catalogo.json`. Cada registro es una tarjeta que aparecerá en el
edificio elegido y en el catálogo. Usa un `id` único. Zonas disponibles:

| zone | Edificio |
| --- | --- |
| cinema | Cine de las ideas |
| studio | Estudio Mauricio |
| lab | Laboratorio |
| library | Casa de historias |
| contact | La siguiente aventura |

Ejemplo de un nuevo registro (separa los registros con comas):

```json
{
  "id": "mi-nueva-herramienta",
  "zone": "lab",
  "type": "Herramienta",
  "title": "Nombre de la herramienta",
  "description": "Qué resuelve y para quién la construí.",
  "role": "Desarrollo · Producción",
  "url": "https://ejemplo.com/herramienta",
  "action": "Abrir herramienta"
}
```

Para archivos dentro del proyecto usa una ruta como `./lecturas/archivo.pdf`
y guarda el archivo en `public/lecturas`. Las herramientas integradas usan
`tool` en vez de `url`: por ahora existen `beats` y `profile`. Integrar una
nueva herramienta dentro de la ventana requiere desarrollar su interfaz.
Una app Python/Flask puede enlazarse, pero necesita un alojamiento aparte.
Modificar el JSON es editar el catálogo, no subir archivos desde el navegador;
los cambios se publican con el siguiente despliegue.

## Verificar y compilar

```powershell
npm test
npm run build
npm run preview
```

La salida está en `dist/`. `base: './'` permite publicar tanto en la raíz de
un dominio como en `usuario.github.io/repositorio/`. Las pruebas verifican
las rutas a las puertas, colisiones, entradas de la calculadora y el catálogo.

## GitHub Pages

1. Crear o elegir el repositorio de GitHub y subir los archivos de esta versión.
2. En el repositorio, abrir **Settings → Pages**.
3. En **Source**, elegir **GitHub Actions**.
4. El flujo `.github/workflows/pages.yml` compila, prueba y publica `dist/`
   cuando se envían cambios a `main`. También permite ejecución manual.
5. La dirección final aparece en Pages y en el resultado del despliegue.

Se deben incluir `package-lock.json`, `package.json`, `vite.config.js`,
`index.html`, `src/`, `public/`, `tests/` y el workflow. No subir `node_modules/`
ni `dist/`. El sitio original `stdio/` no se copia al artefacto publicado.
El repositorio remoto todavía no está configurado en esta copia.

## Diseño y límites

- Mapa, edificios y personaje dibujados con código original. Sin recursos de Pokémon.
- Flechas/WASD, clic para caminar, rótulos de destinos y controles táctiles.
- Catálogo y búsqueda funcionan sin esperar a que se inicialice Phaser.
- Progreso de lugares explorados guardado localmente, sin cuentas ni analítica.
- Sonido opcional sintetizado tras una acción del visitante.
- El mapa incluye obstáculos para edificios, límites y lago. Vegetación decorativa.
- El modo noche es una variación visual. No hay combate ni inventario.
- La primera descarga del motor es mayor que la del prototipo canvas anterior;
  el motor se carga en un archivo separado y los dibujos no descargan imágenes.


## Mundo vertical (móvil primero)

La entrada abre directamente un estudio pixel art a pantalla completa. El mapa mide 640 × 2432 píxeles y la cámara sigue al personaje. Toca el suelo para caminar o un objeto principal para acercarte y abrir su contenido. Desliza hacia arriba para avanzar seis pasos; hacia abajo para regresar. En escritorio funcionan la rueda, las flechas y WASD. El botón inferior también permite avanzar y el inventario abre todo el contenido sin recorrer el mapa.

Las cinco habitaciones son estudio, proyección, laboratorio, archivo y siguiente aventura. Los objetos principales y los muros bloquean el paso. La decoración junto a las paredes es visual. Los gráficos se dibujan localmente en canvas, sin imágenes externas ni recursos de Pokémon. No hay pantalla de inicio que requiera pulsar Jugar. La primera carga aún necesita descargar Phaser; no se garantiza carga instantánea en redes lentas.
