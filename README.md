# Sistema de Pagos

Prueba técnica backend: API RESTful con Node.js, PostgreSQL y microservicio Python para procesamiento de pagos.

## Arquitectura

```
Cliente (Postman) → API Node.js (Express) → PostgreSQL
                        ↓
              Microservicio Python (FastAPI)
                  80% approved / 20% rejected
```

## Requisitos

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

## Instalación y ejecución

### 1. Base de datos

```bash
psql -U postgres -c "CREATE DATABASE sistema_pagos;"
psql -U postgres -d sistema_pagos -f db/init.sql
```

### 2. Microservicio Python

```bash
cd service
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. API Node.js

```bash
cd api
cp .env.example .env      # editar DATABASE_URL si es necesario
npm install
npm run dev
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/users` | Crear usuario |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users/:id/cards` | Registrar tarjeta |
| POST | `/api/payments` | Crear pago |
| GET | `/api/users/:id/payments` | Historial de pagos |
| GET | `/api/users/:id/payments/stats` | Estadísticas de pagos |

### POST /api/users

```json
// Request
{ "nombre": "Juan Pérez", "email": "juan@example.com" }
// Response 201
{ "data": { "id": 1, "nombre": "Juan Pérez", "email": "juan@example.com", "created_at": "..." } }
// Response 400 — validación
{ "error": "nombre debe ser un texto, email debe ser un correo válido" }
// Response 409 — email duplicado
{ "error": "El email ya está registrado" }
```

### POST /api/users/:id/cards

```json
// Request
{ "numero": "4111111111111111", "titular": "Juan Pérez", "expiracion": "12/2028", "cvv": "123" }
// Response 201 (CVV y número no se almacenan; solo hash + últimos 4 dígitos)
{ "data": { "id": 1, "ultimos_digitos": "1111", "titular": "Juan Pérez", "expiracion": "12/2028" } }
// Response 400 — tarjeta vencida
{ "error": "La tarjeta ya está vencida" }
// Response 409 — tarjeta duplicada
{ "error": "La tarjeta ya está registrada para este usuario" }
```

### POST /api/payments

```json
// Request
{ "usuario_id": 1, "tarjeta_id": 1, "monto": 1500.50 }
// Response 201
{ "data": { "id": 1, "usuario_id": 1, "tarjeta_id": 1, "monto": 1500.50, "estado": "approved", "mensaje": "Pago procesado correctamente", "created_at": "..." } }
// Response 400 — tarjeta no pertenece al usuario
{ "error": "La tarjeta no pertenece al usuario" }
```

### GET /api/users/:id/payments

```json
// Response 200
{ "data": [ { "id": 1, "monto": 1500.50, "estado": "approved", "mensaje": "...", "created_at": "..." } ] }
// Response 404 — usuario no existe
{ "error": "Usuario no encontrado" }
```

### GET /api/users/:id

```json
// Response 200
{ "data": { "id": 1, "nombre": "Juan Pérez", "email": "juan@example.com", "created_at": "..." } }
// Response 404
{ "error": "Usuario no encontrado" }
```

### GET /api/users/:id/payments/stats

```json
// Response 200
{ "data": { "total_pagos": 10, "aprobados": 8, "rechazados": 2, "monto_total_aprobado": 12500.00, "monto_promedio": 1250.00 } }
// Response 404 — usuario no existe
{ "error": "Usuario no encontrado" }
```

## Colección de Postman

Importar `postman/collection.json` en Postman. Configurar variable `base_url` como `http://localhost:3000`.

Ejecutar en orden:
1. Crear Usuario
2. Obtener Usuario
3. Crear Tarjeta
4. Crear Pago
5. Listar Pagos del Usuario
6. Estadísticas de Pagos

## Criterios de evaluación cubiertos

- API REST con Node.js + Express
- PostgreSQL con 3 tablas, relaciones, índices
- Microservicio Python con FastAPI, 80/20 aleatorio
- Integración Node.js → Python con timeout y manejo de fallos
- Validación de entrada, errores semánticos, códigos HTTP correctos
- Sanitización de datos de tarjetas (hash, sin almacenar CVV)
- README con instrucciones claras
- Colección Postman con tests básicos
