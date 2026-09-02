# Arquitectura SaaS Pet Shops

## Fecha
2026-09-01

## Estructura aplicada
- Frontend: App Router en src/app
- Backend: API routes en src/app/api
- Lógica de negocio: src/services
- Utilidades/seguridad: src/lib
- Tipos: src/types
- Base de datos: Prisma + schema en prisma/schema.prisma

## Principios
- Multi-tenancy obligatorio por tenantId
- Separación clara entre UI, negocio y datos
- Roles: SUPER_ADMIN, ADMIN, VENDEDOR, CLIENTE
- Stock centralizado con movimientos de stock
- Servicios y endpoints deben validar tenant y permisos

## Capa creada
- auth service
- tenant service
- product service
- stock service
- category service
- user service
- API routes de login, productos y stock

## Rutas clave
- POST /api/auth/login
- GET /api/products
- POST /api/products
- GET /api/stock
- POST /api/stock

## Notas
- La versión instalada del CLI de Prisma en este proyecto no expone generate/db push como comandos clásicos; la estructura base quedó creada igual y el proyecto quedó preparado para continuar en la arquitectura correcta.
- El schema sigue siendo el punto central para el dominio del negocio.
