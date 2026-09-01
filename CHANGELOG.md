# CHANGELOG

Todas las modificaciones importantes de **VJOX Ventas** serán documentadas en este archivo.

Este proyecto sigue una estrategia de versionado basada en **Semantic Versioning (MAJOR.MINOR.PATCH)**.

---

# [3.0.0] - 2026-07-31

## 🎉 Inicio de la etapa profesional del proyecto

Esta versión marca la transición de un proyecto personal a un producto de software preparado para evolucionar como plataforma SaaS.

### Added

- Archivo `LICENSE.md` con licencia propietaria.
- Aviso de Copyright en la aplicación.
- Documentación inicial del proyecto.
- Base para futuras políticas de seguridad y documentación técnica.

### Changed

- Eliminación definitiva de dependencias de `localStorage`.
- Migración consolidada a Supabase como almacenamiento principal.
- Limpieza general del código.
- Preparación de la arquitectura para múltiples usuarios.

### Security

- Inicio de la protección legal y documental del proyecto.
- Definición del modelo de software propietario.
- Organización del proyecto para futuras versiones comerciales.

---

# [2.0.0]

## 🚀 Rediseño y modernización

### Added

- Conversión a Progressive Web App (PWA).
- Instalación en dispositivos Android.
- Nuevo diseño visual.
- Integración con Supabase.
- Gestión de inventario desde la nube.
- Publicación automática en Facebook mediante Meta Graph API.
- Mejoras en la visualización de galerías.
- Optimización del flujo de publicación.

### Changed

- Rediseño completo de la interfaz, modal, navegacion entre galerias, etc.
- Mejor organización del código JavaScript.
- Optimización de carga de imágenes.

---

# [1.0.0]

## 🎉 Primera versión funcional

### Added

- Creación inicial de VJOX Ventas.
- Catálogo de productos.
- Integración con Cloudinary.
- Compartir productos mediante WhatsApp.
- Galerías públicas para clientes.
- Gestión básica de inventario.
- Primer despliegue mediante GitHub Pages.

---

# Próximas versiones

## v3.1.0

# [3.1.0] - En desarrollo

## 🚧 Reestructuración de la interfaz

### Added

- Se inició la separación de la aplicación en múltiples pantallas.
- Se creó `add-product.html` como vista independiente para el registro de productos.
- Se agregó un acceso directo desde el inventario para registrar nuevos productos.

### Changed

- `index.html` comenzó a enfocarse exclusivamente en la administración del inventario.
- Se inició la reorganización de la navegación para preparar una experiencia más cercana a una aplicación móvil.
- Se estableció la base para futuras vistas independientes (Estadísticas, Configuración y Más).

### Planned

- Regresar automáticamente al inventario después de guardar un producto.
- Incorporar navegación inferior entre pantallas.
- Implementar botón flotante para las acciones principales.

## v3.2.8 
📌 Separación de Inventario y Agregar Producto
- add-product.html
- add_product.js
- Nueva navegación entre vistas
- Refactorización de la arquitectura
-  UX/UI
- Buscador
- Botón flotante
- Responsive
- Dashboard
- add-tarjetas resumen y funcion
- Tarjeta V4, iconos en tarjeta

## [3.2.9] - 2026-08-03

### Added
- Menú lateral deslizante (Side Drawer).
- Overlay para bloquear la interfaz al abrir el menú.
- Apertura y cierre mediante botón.
- Cierre al hacer clic fuera del menú.
- Cierre con la tecla Escape.
- Bloqueo del scroll mientras el menú está abierto.

## v3.3.0   
- Sistema de autenticación.
- Registro de usuarios.
- Roles.
- Configuración inicial del negocio.

---

## VJOX v4.0.0  - 2026-09-01  ← ESTA

Nueva arquitectura multiusuario y sistema de autenticación.

Cambios principales:

- Implementación de Supabase Auth.
- Registro de nuevos usuarios.
- Inicio de sesión con correo y contraseña.
- Confirmación de correo electrónico.
- Cierre de sesión.
- Protección de vistas privadas mediante auth guard.

- Implementación inicial de arquitectura multiusuario.
- Cada producto ahora se relaciona con su propietario mediante user_id.
- Cada usuario visualiza únicamente su propio inventario.
- Cada usuario puede agregar sus propios productos.
- Galerías públicas separadas por usuario.
- Los enlaces de galería ahora identifican al propietario del catálogo.

- Configuración de Row Level Security (RLS) en Supabase.
- Políticas para creación, actualización y eliminación de productos por propietario.
- Lectura pública de productos para permitir las galerías compartidas.

- Creación de entorno de desarrollo independiente:
  - Supabase Production: vjox-ventas
  - Supabase Development: vjox-dev
- Separación del desarrollo multiusuario de la base de datos de producción.

- Corrección del esquema de products en DEV.
- user_id migrado a UUID.
- id configurado como Identity/autoincremental.
- Restauración de created_at automático.
- Corrección de permisos y grants para authenticated y anon.

- Implementación y organización del nuevo Design System de VJOX.
- Separación de estilos base, formularios, botones, tarjetas, variables y utilidades.
- Preparación de una base visual reutilizable para las nuevas vistas.

Estado actual:

✓ Registro funciona
✓ Confirmación de correo funciona
✓ Login funciona
✓ Logout funciona
✓ Auth Guard funciona
✓ Productos asociados por usuario
✓ Inventario independiente por usuario
✓ Alta de productos independiente por usuario
✓ Galería pública independiente por usuario

## [4.1.0] - 2026-09-01

### Perfiles y WhatsApp multiusuario

- Se agregó la configuración inicial del perfil del vendedor.
- Cada usuario puede registrar:
  - Nombre.
  - Nombre del negocio.
  - Número de WhatsApp.
- Se agregó la tabla `profiles` relacionada con el usuario autenticado mediante su UUID.
- Se implementaron políticas RLS para proteger los perfiles de usuario.
- Se agregó `public_profiles` para consultar únicamente la información necesaria del vendedor desde la galería pública.
- La galería ahora identifica al propietario mediante el parámetro `user` de la URL.
- El botón **"Me interesa este producto"** dejó de utilizar un número de WhatsApp fijo.
- El contacto de WhatsApp ahora se obtiene dinámicamente desde el perfil del propietario de la galería.
- Los números mexicanos de 10 dígitos se convierten automáticamente al formato internacional `52XXXXXXXXXX`.
- Se corrigió la navegación entre productos para conservar el `userId` del vendedor.

### Cloudinary multiusuario

- Se eliminó el uso de una carpeta fija para todas las imágenes de productos.
- Las imágenes ahora se organizan automáticamente por usuario utilizando su UUID.
- Nueva estructura de almacenamiento:

  `vjox/users/{userId}/products`

- La sesión del usuario ahora se valida antes de iniciar la carga de imágenes.
- `uploadImageToCloudinary()` recibe el `userId` para determinar dinámicamente la carpeta de destino.
- Se configuró Cloudinary para utilizar `asset_folder` durante la carga.
- La organización de imágenes queda preparada para facilitar la administración de archivos por usuario.

Pendiente para siguientes versiones:

- Integración de Facebook por usuario.
- Login con Google.
- Recuperación de contraseña.
- Configuración/edición de perfil.
- Métricas y estadísticas multiusuario.

## v4.2.0

Planeado

- Facebook por usuario.
- Configuración individual de páginas.
- Tokens independientes.

---

## v4.5.0

Planeado

- Dashboard.
- Reportes.
- Estadísticas.
- Inventario avanzado.

---

## v5.0.0

Planeado

- Sistema SaaS.
- Suscripciones.
- Pagos.
- Planes.
- Multiempresa.