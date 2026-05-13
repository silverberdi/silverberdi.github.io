# Checklist de Implementación del Tema Coderon

## 1. Configuración Base
- [x] Cambiar `theme: minima` por tema personalizado en `_config.yml`
- [x] Agregar Google Fonts (Poppins + Roboto Mono)
- [x] Agregar Font Awesome 6.5.1 (en CSS existente)
- [x] Configurar SEO (Twitter Cards, OpenGraph)

## 2. Layouts (carpeta `_layouts/`)
- [x] Crear `default.html` - Layout base con header/footer
- [x] Crear `home.html` - Hero section + grid de posts
- [x] Crear `post.html` - Layout para artículos individuales
- [x] Crear `page.html` - Layout para páginas estáticas
- [x] Crear `tags.html` - Página de tags
- [x] Crear `archive.html` - Archivo de posts

## 3. Includes (carpeta `_includes/`)
- [x] Crear `header.html` - Header con navegación
- [x] Crear `footer.html` - Footer completo
- [ ] Crear `hero.html` - Hero section (incluido en home.html)
- [x] Crear `search.html` - Buscador de posts
- [x] Crear `sidebar.html` - Sidebar con widgets

## 4. Header
- [x] Logo con texto
- [x] Menú de navegación (con enlaces a Archive, Tags, About, Contact)
- [x] Toggle dark/light mode (con localStorage)
- [x] Buscador de posts (con overlay y fetch de search.json)
- [x] Menú hamburguesa responsive

## 5. Hero Section
- [x] Avatar circular
- [x] Título grande con Poppins
- [x] Subtítulo
- [x] Descripción
- [x] Botón con gradiente
- [x] Imagen destacada

## 6. Grid de Posts
- [x] Cards con imágenes
- [x] Tags con colores
- [x] Fechas en formato uppercase
- [x] Vista lista/grid toggle
- [ ] Efectos hover con scale (en CSS existente)
- [x] Lazy loading de imágenes

## 7. Footer
- [x] Información del blog
- [x] Redes sociales con iconos
- [x] Posts recientes
- [x] Navegación de páginas
- [x] Copyright

## 8. CSS
- [ ] Sistema de grid responsive (12 columnas) - en CSS existente
- [x] Modo oscuro completo con variables CSS (en CSS existente)
- [ ] Animaciones y efectos hover (en CSS existente)
- [ ] Estilos para: hero, articles, tags, search, pagination (en CSS existente)
- [ ] Responsive design (breakpoints: 1400px, 1024px, 768px, 576px) (en CSS existente)

## 9. JavaScript
- [ ] Reframe.js - Videos responsive (en scripts.js existente)
- [x] SimpleJekyllSearch - Búsqueda en vivo (conectado con search.json)
- [ ] LazyLoad - Carga diferida de imágenes (en scripts.js existente)
- [ ] Splide - Carrusel de logos (en scripts.js existente)
- [x] common.js - Toggle dark mode, menú, scroll to top, búsqueda, view toggle

## 10. Páginas Adicionales
- [x] about.md - Página About
- [x] contact.md - Página de contacto
- [ ] elements.md - Página de demostración de estilos
- [x] tags.md - Página de tags
- [x] archive.md - Página de archivo

## 11. SEO
- [x] Twitter Cards
- [x] Facebook OpenGraph
- [x] RSS feed link
- [x] Meta description

## 12. Extras
- [x] Botón "scroll to top"
- [ ] Overlay para imágenes (zoom)
- [ ] Copy button en bloques de código
- [ ] Tabla de contenidos en posts
- [x] Navegación entre posts (prev/next)
- [ ] Posts relacionados