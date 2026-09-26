# STDIO — Resolviendo ideas

Proyecto de Mauricio Araiza: portafolio, CV, herramientas utilizables y una
habitación interactiva en pixel art. Aprenderemos Git mientras lo desarrollamos.

## Estado inicial

`stdio/` contiene el sitio PHP existente. Se conserva como punto de partida.
La nueva aplicación y la migración a Flask todavía no se han implementado.

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
