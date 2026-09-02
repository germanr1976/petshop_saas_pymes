# Arquitectura SaaS Pet Shops

## Fecha

2026-09-01

## Objetivo

Transformar el sistema actual en una plataforma SaaS 100% online para la gestión y comercio electrónico de múltiples Pet Shops.

Cada Pet Shop funcionará como un tenant independiente y sus datos nunca podrán mezclarse con los de otros tenants.

## Estructura

- Frontend: Next.js App Router en `src/app`
- Backend/API: API Routes en `src/app/api`
- Lógica de negocio: `src/services`
- Utilidades y seguridad: `src/lib`
- Tipos: `src/types`
- Base de datos: PostgreSQL + Prisma
- Schema: `prisma/schema.prisma`

## Multi-tenancy

La entidad principal es `Tenant`.

Toda entidad perteneciente a un Pet Shop debe estar relacionada con `tenantId`.

Entidades principales:

- Tenant
- User
- Product
- Category
- Customer
- Order
- OrderItem
- Sale
- SaleItem
- StockMovement
- Payment

Un tenant nunca puede acceder, modificar o eliminar datos pertenecientes a otro tenant.

El `tenantId` no debe confiarse al cliente. Debe obtenerse desde la sesión/autenticación del usuario cuando corresponda.

## Roles

- `SUPER_ADMIN`: administra toda la plataforma SaaS.
- `ADMIN`: administra un Pet Shop.
- `VENDEDOR`: gestiona ventas locales, pedidos y consulta de stock.
- `CLIENTE`: utiliza la tienda online y gestiona sus pedidos.

## Principios

- Multi-tenancy obligatorio.
- Separación entre UI, lógica de negocio y acceso a datos.
- Validación de autenticación y autorización.
- Validación de tenant en servicios y endpoints.
- No mezclar datos entre tenants.
- Código modular, tipado y escalable.
- No almacenar la base de datos localmente.
- No almacenar imágenes directamente en PostgreSQL.

## Stock

Debe existir un stock centralizado por tenant.

El mismo stock se utiliza para:

- Ventas realizadas en el local.
- Pedidos realizados desde la tienda online.

Toda modificación de stock debe generar un `StockMovement`.

Cada movimiento debe registrar como mínimo:

- tenantId
- producto
- cantidad
- tipo
- motivo
- usuario
- fecha

## Servicios creados

- auth service
- tenant service
- product service
- stock service
- category service
- user service

## API inicial

- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `GET /api/stock`
- `POST /api/stock`

## Próximas áreas

1. Modelo completo Prisma/PostgreSQL.
2. Autenticación y autorización.
3. Gestión de tenants.
4. Productos y categorías.
5. Stock y movimientos.
6. Ventas locales.
7. Clientes.
8. Carrito.
9. Pedidos online.
10. Pagos.
11. Dashboard y reportes.
12. Configuración del Pet Shop.

## Prisma

Antes de ejecutar comandos de Prisma, verificar la versión instalada y la configuración actual de `prisma.config.ts`.

No asumir comandos o configuraciones pertenecientes a versiones anteriores de Prisma.

## Seguridad

- Nunca confiar en un `tenantId` enviado directamente por el cliente.
- Validar autenticación en endpoints protegidos.
- Validar permisos según rol.
- Filtrar todas las operaciones de negocio por tenant.
- Utilizar hashing seguro para contraseñas.
- No exponer secretos en el frontend.
- Validar y sanitizar datos recibidos por las API.

## Regla para el desarrollo

Antes de crear nuevas funcionalidades importantes, analizar primero la arquitectura existente y mantener la separación entre:

UI → API → Services → Prisma → PostgreSQL

No implementar funcionalidades de veterinaria, turnos, historias clínicas ni gestión médica de animales.

El objetivo del proyecto es exclusivamente:

**Plataforma SaaS de gestión y comercio electrónico para Pet Shops.**