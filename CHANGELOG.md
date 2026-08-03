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

## v3.2.8   ← ESTA
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

## v3.3.0   ← ESTA
Planeado

- Sistema de autenticación.
- Registro de usuarios.
- Roles.
- Configuración inicial del negocio.

---

## v3.4.0

Planeado

- Facebook por usuario.
- Configuración individual de páginas.
- Tokens independientes.

---

## v3.5.0

Planeado

- Dashboard.
- Reportes.
- Estadísticas.
- Inventario avanzado.

---

## v4.0.0

Planeado

- Sistema SaaS.
- Suscripciones.
- Pagos.
- Planes.
- Multiempresa.