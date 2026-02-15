# 🌸 Mimas Iconic - Salón de Manicura

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)
[![Made with Love](https://img.shields.io/badge/Made%20with-♥-E8C4C4)](https://github.com/tuusuario/mimas-iconic)

> Manicura natural y elegante en Valencia. Diseños delicados personalizados sin exagerar.

[Ver Demo](https://tuusuario.github.io/mimas-iconic) | [Reportar Bug](https://github.com/tuusuario/mimas-iconic/issues) | [Solicitar Función](https://github.com/tuusuario/mimas-iconic/issues)

![Mimas Iconic Preview](screenshots/preview.png)

## ✨ Características

### 🎨 Diseño
- **Mobile-First Responsive Design** - Optimizado primero para móviles
- **Natural Cute Glam Aesthetic** - Paleta de colores elegante y femenina
- **Animaciones Suaves** - Transiciones y efectos profesionales
- **Accesibilidad WCAG 2.1 AA** - Navegación por teclado, ARIA labels, alto contraste

### 📅 Sistema de Reservas Integrado
- **Calendario Visual Interactivo** - Selección intuitiva de fecha y hora
- **Selección de Servicios** - Natural & Clean, Cute Detail, Soft Glam
- **Gestión de Horarios** - Horario de negocio configurable (Lun-Vie 10-20h, Sáb 10-14h)
- **Formulario Multi-paso** - 4 pasos con validación
- **Confirmación por Email** - Integración con EmailOctopus

### 📱 Progressive Web App (PWA)
- **Instalable** - Añadir a pantalla de inicio como app nativa
- **Funcionalidad Offline** - Caché inteligente con Service Worker
- **Sincronización en Background** - Envío de reservas cuando vuelve la conexión
- **Push Notifications** - Recordatorios de citas (opcional)
- **Shortcuts** - Accesos rápidos a Reservar, Galería, Servicios

### 🚀 Performance
- **Lighthouse Score 95+** - Performance, SEO, Accesibilidad, Best Practices
- **Imágenes Optimizadas** - Lazy loading, responsive images, WebP
- **Code Splitting** - CSS y JS separados por funcionalidad
- **CDN Ready** - Preparado para deployment en Netlify, Vercel, GitHub Pages

### 🔧 Integraciones
- **EmailOctopus** - Newsletter y gestión de reservas por email
- **WhatsApp** - Botón directo de contacto
- **Instagram** - Integración de perfil social
- **Google Analytics** - Tracking de conversiones (opcional)

## 📸 Screenshots

<details>
<summary>Ver screenshots</summary>

### Desktop
![Desktop Home](screenshots/desktop-home.png)
![Desktop Booking](screenshots/desktop-booking.png)

### Mobile
![Mobile Home](screenshots/mobile-home.png)
![Mobile Booking](screenshots/mobile-booking.png)

</details>

## 🚀 Inicio Rápido

### Pre-requisitos

- Navegador web moderno
- Servidor web local (Live Server, Python HTTP Server, etc.)
- Cuenta en [EmailOctopus](https://emailoctopus.com) (para reservas y newsletter)

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tuusuario/mimas-iconic.git
cd mimas-iconic
```

2. **Configura EmailOctopus**

Edita `booking.js` líneas 10-11:
```javascript
const EMAILOCTOPUS_API_KEY = 'tu_api_key_aqui';
const EMAILOCTOPUS_LIST_ID = 'tu_list_id_aqui';
```

También edita `script.js` líneas 282-283 para el newsletter.

3. **Inicia un servidor local**

Con Python:
```bash
python -m http.server 8000
```

Con Node.js:
```bash
npx http-server
```

Con Live Server (VS Code):
- Instala la extensión Live Server
- Click derecho en `index.html` → "Open with Live Server"

4. **Abre en el navegador**
```
http://localhost:8000
```

## ⚙️ Configuración

### Horarios de Negocio

Edita `booking.js` líneas 14-24:

```javascript
const BUSINESS_HOURS = {
    start: "10:00",     // Hora de apertura
    end: "20:00",       // Hora de cierre
    closedDays: [0],    // 0 = Domingo cerrado
    specialHours: {
        6: { start: "10:00", end: "14:00" } // Sábado horario especial
    },
    slotInterval: 30    // Intervalos de 30 minutos
};
```

### Servicios

Para modificar servicios, edita `reservar.html` líneas 92-130.

### Colores y Estilos

Variables CSS en `styles.css` líneas 16-24:

```css
:root {
    --cream: #FAF7F4;
    --rose-dust: #E8C4C4;
    --mauve: #B99BA4;
    --charcoal: #3D3836;
    /* ... */
}
```

## 📁 Estructura del Proyecto

```
mimas-iconic/
├── index.html              # Página principal
├── reservar.html           # Sistema de reservas
├── offline.html            # Página sin conexión (PWA)
├── styles.css              # Estilos principales
├── booking.css             # Estilos del sistema de reservas
├── script.js               # JavaScript principal
├── booking.js              # JavaScript del sistema de reservas
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # Web App Manifest (PWA)
├── politica-privacidad.html
├── politica-cookies.html
├── aviso-legal.html
├── politica-cancelacion.html
├── icons/                  # Iconos para PWA (72x72 a 512x512)
│   ├── icon-72x72.png
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── screenshots/            # Screenshots para README y PWA
│   ├── desktop-home.png
│   └── mobile-home.png
└── README.md
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Cream | `#FAF7F4` | Fondo principal |
| Cream Dark | `#F5F0EB` | Fondo secundario |
| Rose Dust | `#E8C4C4` | Botones primarios, acentos |
| Rose Soft | `#F4DDD6` | Degradados, fondos suaves |
| Mauve | `#B99BA4` | Botones secundarios |
| Mauve Dark | `#9A7F87` | Texto de acento |
| Charcoal | `#3D3836` | Texto principal |
| Charcoal Light | `#5D5856` | Texto secundario |

## 📝 Páginas Legales

El sitio incluye todas las páginas legales necesarias para un negocio europeo conforme GDPR:

- ✅ **Política de Privacidad** - Cumplimiento GDPR
- ✅ **Política de Cookies** - Banner de consentimiento
- ✅ **Aviso Legal** - Información de la empresa
- ✅ **Política de Cancelación** - Términos de reservas

## 🚢 Deployment

### GitHub Pages

1. Ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Save

Tu sitio estará en: `https://tuusuario.github.io/mimas-iconic`

### Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🔧 Mantenimiento

### Actualizar Caché de PWA

Cuando hagas cambios importantes, actualiza la versión en `sw.js`:

```javascript
const CACHE_NAME = 'mimas-iconic-v2'; // Incrementa la versión
```

### Añadir Nuevo Servicio

1. Añade el HTML en `reservar.html`
2. Añade la opción en el selector de servicios
3. Actualiza precios y duraciones

### Testing

- **Accesibilidad**: [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- **Performance**: Lighthouse en Chrome DevTools (F12)
- **SEO**: [Google Search Console](https://search.google.com/search-console)
- **PWA**: Lighthouse PWA Audit

## 🐛 Problemas Comunes

<details>
<summary><strong>El banner de cookies no aparece</strong></summary>

Limpia localStorage:
1. F12 → Application → Local Storage
2. Elimina la key `cookies-accepted`
3. Recarga la página

O presiona `Ctrl + Shift + D` para limpiar todo el storage.
</details>

<details>
<summary><strong>Las reservas no se envían</strong></summary>

Verifica que hayas configurado:
1. `EMAILOCTOPUS_API_KEY` en `booking.js`
2. `EMAILOCTOPUS_LIST_ID` en `booking.js`
3. El webhook URL para notificaciones (línea 456 de `booking.js`)
</details>

<details>
<summary><strong>La PWA no se instala</strong></summary>

Verifica:
1. Que estés usando HTTPS (o localhost)
2. Que `manifest.json` esté correctamente enlazado en `index.html`
3. Que existan los iconos en la carpeta `/icons`
4. Que el Service Worker se haya registrado correctamente (ver consola)
</details>

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- **HTML**: Usa semantic HTML5
- **CSS**: Sigue la metodología BEM cuando sea posible
- **JavaScript**: ES6+, usa `const`/`let`, evita `var`
- **Commits**: Usa [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👏 Créditos

- **Diseño y Desarrollo**: Tu Nombre / Mimas Iconic
- **Fuentes**: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) y [Poppins](https://fonts.google.com/specimen/Poppins) de Google Fonts
- **Imágenes**: [Unsplash](https://unsplash.com) (sustituir con fotos reales)
- **Iconos**: Custom SVG icons

## 📞 Contacto

- **Web**: [mimassalondeunas.com](https://mimassalondeunas.com)
- **Instagram**: [@mimas.iconic](https://instagram.com/mimas.iconic)
- **Email**: info@mimassalondeunas.com
- **Teléfono**: +34 612 345 678
- **Dirección**: Calle Example, 123, Valencia, España

## 🗺️ Roadmap

- [ ] Integración con Google Calendar
- [ ] Sistema de cupones de descuento
- [ ] Programa de fidelización
- [ ] Blog de cuidado de uñas para SEO
- [ ] Multi-idioma (valenciano/catalán)
- [ ] Dark mode (opcional)
- [ ] Galería con filtros por tipo de diseño
- [ ] Testimonios con fotos de clientas

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

Hecho con 💅 y ♥ por [Tu Nombre](https://github.com/tuusuario)