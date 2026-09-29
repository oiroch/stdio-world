# STDIO — Un mundo por resolver

Proyecto de Mauricio Araiza: portafolio, CV, herramientas utilizables y una
habitación interactiva en pixel art. Aprenderemos Git mientras lo desarrollamos.

## Versión actual: mundo para GitHub Pages

Abre `ABRIR-MUNDO.bat` y visita http://127.0.0.1:5173.
Phaser + Vite, mapa explorable y catálogo editable en `public/catalogo.json`.
La guía de ejecución, contenido y publicación está en [GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

## Archivo del primer prototipo

`stdio/` contiene el sitio PHP existente. Se conserva como punto de partida.
La primera versión Flask está en `app.py` y `web/`; el original PHP se conserva.

- PHP con MVC propio: `index.php`, `Controllers`, `Models`, `Views` y `Libraries/Core`.
- JavaScript y CSS en `Assets`; no se encontró una aplicación Java en la revisión.
- Calculadora de estructura de guion, Pokédex y exportaciones web de Unity.
- Contenido profesional, CV y tesis reutilizables.

Consulta [el diagnóstico y la ruta de trabajo](docs/INICIO.md).

## Primeros conceptos de Git

Un repositorio registra el historial; un commit guarda una versión local.
GitHub almacena una copia remota; publicar una web es un paso adicional.

Desde esta carpeta, una vez inicializado el repositorio:

```powershell
git status
git diff
git log --oneline
```

`git diff` no muestra el contenido de archivos nuevos sin seguimiento.
`git log` solo funciona cuando ya existe al menos un commit.
Revisaremos los archivos antes de preparar el primer commit.

## Archivos locales excluidos

La configuración PHP, registros, exportaciones Unity y un archivo RAR grande
están excluidos por `.gitignore`; no se han borrado ni tienen copia en Git.
Para reproducir el sitio original en otra máquina harán falta la configuración
local y las exportaciones si se desea ejecutar Unity. Prepararemos una plantilla
de configuración sin credenciales antes de distribuir esta versión.

No se ha configurado un remoto ni publicado contenido.


## Abrir la nueva versión

Haz doble clic en `INICIAR.bat` y abre http://127.0.0.1:5050.
Deja la ventana del servidor abierta. Para detenerlo, pulsa Ctrl+C.
Si ya hay un servidor en ese puerto, usa el existente.

Alternativa desde PowerShell, en la carpeta del proyecto:

```powershell
python -m pip install -r requirements.txt
python app.py
```

La entrada es un recorrido de seis capítulos con un set ilustrado que cambia al
hacer scroll. Las decisiones de producción ordenan el equipo; los controles de
ambiente y dirección de luz cambian la escena. Una consola esconde un universo
alternativo. Las herramientas y el CV se abren en ventanas dentro del sitio.

La calculadora conserva los porcentajes originales y valida páginas enteras de
1 a 10 000. La tesis depende del PDF de `stdio/Assets/docs`.
Las situaciones de producción son ejemplos ilustrativos, no casos históricos.
Los proyectos enlazados conservan los créditos del sitio original.
El contacto abre el correo del visitante; no hay envío de formularios ni cuentas.

El escenario se dibuja en canvas con código propio, sin motores, fuentes remotas,
video inicial ni descargas de imágenes. El scroll es nativo; no hay bloqueo por
niveles. En móvil el set permanece encima del capítulo. Los diálogos se pueden
cerrar con Escape y el sitio respeta la preferencia de movimiento reducido.
