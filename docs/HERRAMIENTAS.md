# Herramientas independientes

## Dos aplicaciones listas
- `public/tools/pokedex/`: Pokédex con búsqueda, lotes de 12, errores de red y tarjetas. Conserva la idea de la integración original con PokéAPI, sin dependencias PHP.
- `public/tools/404-linterna/`: demo de error 404 con linterna, compatible con puntero, control por botón y preferencia de movimiento reducido.

Cada carpeta contiene su propio HTML, CSS, JavaScript y README. Se puede copiar su contenido a un repositorio separado y publicarlo directamente como sitio estático. No hay rutas hacia archivos del proyecto principal. Los originales en stdio permanecen intactos. No se han creado repositorios ni publicado las demos en GitHub.

## Gestionar desde la computadora
El panel actual usa el editor local del easter egg. Incluye Agregar proyecto y Agregar herramienta, y permite editar las fichas de ambas categorías. Conserva el almacenamiento local ya configurado; exporta el catálogo y reemplaza public/catalogo.json para publicarlo. No ofrece sincronización automática con GitHub.

Para una herramienta registra nombre, participación, descripción, imagen, URL de la aplicación, repositorio GitHub opcional y apertura integrada o externa. El beat sheet permite editar su ficha conservando el cálculo incorporado. Las demos iniciales no muestran Ver código hasta que registres un repositorio real.

Dentro de stdio.mx la demo arranca al pulsar Probar herramienta, en un iframe con sandbox que permite scripts sin acceso al origen del panel, formularios, ventanas emergentes ni navegación del sitio principal. No todos los proveedores permiten incrustación; siempre hay un enlace para abrir en otra pestaña. Una aplicación que necesite cookies, almacenamiento propio o permisos adicionales debe configurarse como externa.

Para actualizar una demo independiente: cambia su repositorio y despliega su sitio. stdio.mx seguirá usando la misma URL registrada. Las copias locales se actualizan editando sus carpetas y recompilando stdio.mx con npm run build.
