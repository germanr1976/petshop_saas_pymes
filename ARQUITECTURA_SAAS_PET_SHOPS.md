# Proyecto: Plataforma SaaS de Gestión y Comercio Electrónico para Pet Shops

## Objetivo

Convertir el sistema actual en una plataforma **SaaS multi-tenant** para Pet Shops, reemplazando el sistema de escritorio por una solución 100% online.

Cada Pet Shop debe tener sus propios productos, clientes, ventas, pedidos, stock, usuarios y configuración, sin mezclar datos con otros comercios.

## Funcionalidades principales

### Tienda online
- Catálogo de productos.
- Categorías.
- Ficha de producto.
- Carrito.
- Checkout.
- Registro/login de clientes.
- Historial y estado de pedidos.

### Panel administrativo
- Dashboard.
- ABM de productos y categorías.
- Precios e imágenes.
- Control de stock.
- Movimientos de stock.
- Ventas realizadas en el local.
- Pedidos online.
- Clientes.
- Usuarios y roles.
- Reportes básicos.
- Auditoría de acciones importantes.

### Roles iniciales
- `SUPER_ADMIN`: administra la plataforma y los Pet Shops.
- `ADMIN`: administra un Pet Shop.
- `VENDEDOR`: ventas locales, pedidos y consulta de stock.
- `CLIENTE`: compra desde la tienda online.

## Arquitectura

Proponer una arquitectura moderna y escalable:

- Frontend: Next.js + React + TypeScript + Tailwind CSS.
- Backend/API: Node.js + TypeScript (o arquitectura integrada en Next.js si resulta más conveniente).
- ORM: Prisma.
- Base de datos: PostgreSQL en la nube, nunca local.
- Imágenes: almacenamiento cloud, no guardar archivos dentro de PostgreSQL.
- Autenticación y autorización mediante roles.
- Arquitectura multi-tenant desde el comienzo.

### Multi-tenancy

Toda entidad perteneciente a un Pet Shop debe estar relacionada con su `tenantId`.

Ejemplo:

`Tenant -> Products -> Orders -> Customers -> Sales -> StockMovements -> Users`

Un Pet Shop nunca debe poder consultar ni modificar información de otro Pet Shop.

## Stock

Debe existir un stock central compartido entre:

- Ventas realizadas en el local.
- Ventas realizadas desde la tienda online.

Cada modificación debe generar un `StockMovement` con usuario, fecha, cantidad, tipo y motivo.

## Reglas importantes

- No crear una base de datos local.
- No continuar con funcionalidades de veterinaria, turnos o historias clínicas.
- No duplicar el stock entre tienda física y tienda online.
- Diseñar primero la arquitectura y el modelo de datos antes de desarrollar funcionalidades grandes.
- Mantener código limpio, modular, tipado y escalable.
- No romper funcionalidades existentes sin analizar antes su reutilización.
- Preparar el sistema para incorporar nuevos Pet Shops en el futuro.

## Primer objetivo de desarrollo

Antes de programar el e-commerce completo:

1. Analizar el código existente.
2. Proponer la estructura definitiva del proyecto.
3. Diseñar el modelo de datos Prisma/PostgreSQL.
4. Diseñar la estrategia multi-tenant.
5. Definir autenticación y roles.
6. Crear la base de la arquitectura.
7. Luego desarrollar primero el panel administrativo, productos, categorías y stock.

**Importante:** trabajar como un proyecto SaaS profesional desde el inicio, priorizando seguridad, separación de datos entre tenants, escalabilidad y mantenibilidad.
