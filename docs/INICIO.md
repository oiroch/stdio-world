# Punto de partida — 26 de septiembre de 2026

## Objetivo acordado

Crear una experiencia personal que reúna CV, proyectos audiovisuales,
herramientas funcionales y una habitación pixel art con objetos interactivos y
secretos. El contenido también tendrá navegación convencional.

## Inventario observado

La copia inicial contiene 197 archivos, aproximadamente 521 MiB.

| Elemento | Ubicación | Uso posible |
| --- | --- | --- |
| Entrada y rutas MVC | `stdio/index.php`, `stdio/Libraries/Core/Load.php` | Referencia para preservar rutas |
| Presentación y trabajos | `stdio/Views/Stdio`, `stdio/Views/Works` | Contenido del portafolio |
| CV | `stdio/Views/Cv`, `stdio/cv.html` | Revisar duplicación y elegir versión |
| Calculadora narrativa | `stdio/Views/Estructura`, `stdio/Assets/js/BS/bc.js` | Primera herramienta a integrar |
| Pokédex | `stdio/Views/Poke`, `stdio/Assets/js/Poke/script.js` | Experimento existente; no es una habitación jugable |
| Unity | `stdio/Pc`, `stdio/Movil` | Evaluar compatibilidad y distribución |
| Tesis | `stdio/Assets/docs` | Biblioteca creativa |
| Contacto | `stdio/Models/contactModel.php` | Migrar envío de correo con validación |

## Hallazgos iniciales

- El lenguaje del navegador es JavaScript; el servidor usa PHP y PDO/MySQL.
- `.htaccess` enruta solicitudes a `index.php`: el original depende de reglas
  de Apache o de un enrutamiento equivalente para ejecutarse localmente.
- `Config/Config.php` contiene campos de conexión y una URL base; se excluye
  del seguimiento, sin modificar su contenido.
- La calculadora tiene lógica JavaScript y referencias a sus elementos en la
  vista. La causa del fallo observado en producción sigue sin determinarse;
  no se presupone que falte el controlador del botón.
- La Pokédex solicita 151 elementos secuencialmente y no contiene un mundo
  jugable. Podemos reutilizar lo aprendido de sus interacciones, no tratarla
  como el motor de la habitación.
- El formulario de correo utiliza directamente datos POST; debe revisarse
  la validación antes de reutilizarlo en la nueva aplicación.
- Hay un RAR de unos 225 MiB y un archivo Unity de unos 209 MiB. Los builds
  de Unity y ese RAR quedan fuera del seguimiento inicial; siguen en disco.

## Arquitectura propuesta, pendiente de concretar

Flask para páginas y herramientas Python; JavaScript para la habitación y
utilidades del navegador. Código en GitHub. El alojamiento deberá ejecutar
Python si se adopta Flask: GitHub Pages por sí solo no lo ejecuta.

Preservar el original y desarrollar la nueva aplicación en una carpeta aparte
permite comparar ambas versiones y trasladar funcionalidades por etapas.
No convertir automáticamente toda herramienta JavaScript a Python.

## Entregas

1. Preparar repositorio local y revisar qué archivos entrarán en el primer commit.
2. Preparar configuración reproducible y una forma de ejecutar el original.
3. Crear la base Flask, preservando contenido y rutas útiles.
4. Integrar y verificar la calculadora de guion, incluyendo entradas inválidas.
5. Construir habitación con movimiento, colisiones, interacción y acceso móvil.
6. Conectar computadora, televisión y librero con herramientas, reel y textos.
7. Revisar contenido, accesibilidad, rendimiento y publicación.

## Verificación realizada y límites

Se inspeccionaron archivos, estructura, lógica de la calculadora, Pokédex,
enrutamiento y flujo de contacto. Python y Git están disponibles en la terminal;
PHP no se encontró en PATH. No se ejecutó PHP, no se conectó a MySQL y no se
envió correo. No se ha validado la ejecución de los builds Unity.
