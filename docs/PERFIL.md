# Perfil y CV

El perfil del mundo se lee desde `src/profile.json`. El PDF usa los mismos datos a través de `scripts/build_cv.py`. Después de editar el contenido, regenera el PDF con Python y ReportLab (`python scripts/build_cv.py`) y ejecuta `npm run build`.

El PDF final está en `output/pdf/mauricio-araiza-cv.pdf`; el generador copia la misma versión a `public/cv/mauricio-araiza-cv.pdf` para que esté disponible en GitHub Pages y en el servidor local. Los botones Ver y Descargar CV están al inicio del perfil.

## Cambiar la fotografía

Desde la computadora del estudio, entra al panel y elige **Foto del perfil y CV**. Selecciona un JPG, PNG o WebP de hasta 5 MB y pulsa **Guardar foto y actualizar CV**. La imagen conserva sus proporciones y se reduce a un máximo de 640 píxeles para mantener ligero el almacenamiento.

El panel actual guarda la foto en este navegador. El perfil y sus botones Ver/Descargar CV usan esa imagen guardada. Puedes exportar la fotografía y el PDF desde el mismo panel. Esto no publica cambios automáticamente en GitHub Pages: otros visitantes siguen viendo los archivos de la versión publicada.

El generador produce también `public/cv/template.pdf` (sin foto) y `public/cv/portrait-box.json`. Deben publicarse junto con el sitio para generar las descargas personalizadas. La librería de PDF se carga solo cuando se necesita. Para actualizar la foto pública predeterminada, sustituye `public/images/mauricio-araiza.png` por una imagen PNG, regenera el CV y vuelve a compilar y publicar el sitio.

## Base editorial
Se consultaron `stdio/Views/Cv/cv.php`, `stdio/cv.html`, el catálogo actual y las descripciones del usuario sobre su trabajo en producción, resolución de problemas y jornadas de rodaje. Se reescribieron los textos para explicar capacidades y proceso sin superlativos ni métricas inventadas.

Se usa Desde 2014 para el trabajo independiente porque coincide con el relato de las dos versiones originales, aunque una cabecera dice 2019. Para XY se conserva solo 2011: las versiones difieren en el mes de finalización. Las colaboraciones se presentan como experiencia citada, sin implicar clientes actuales ni atribuir una misma función a todos los proyectos. La formación conserva nombres y años de las fuentes originales; conviene que Mauricio confirme su vigencia antes de enviar el CV como documento definitivo. No se añadieron niveles de idiomas, porcentajes de dominio, premios ni teléfono.
