# Backend - SaludPública Connect

Backend API REST con NestJS para el sistema de gestión de turnos médicos.

## 🛠️ Tecnologías

- **NestJS 10** - Framework backend
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM
- **Redis** - Cache y gestión de colas
- **Bull** - Sistema de colas para notificaciones
- **Swagger** - Documentación automática de API
- **TypeScript** - Lenguaje de programación

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma       ← Esquema de base de datos
│   └── seed.ts             ← Datos de prueba
├── src/
│   ├── appointments/       ← Módulo de Turnos
│   ├── doctors/            ← Módulo de Médicos
│   ├── specialties/        ← Módulo de Especialidades
│   ├── notifications/      ← Procesador de notificaciones (Bull)
│   ├── common/
│   │   └── prisma/         ← Servicio de Prisma
│   ├── app.module.ts       ← Módulo principal
│   └── main.ts             ← Entry point
├── .env                    ← Variables de entorno
├── docker-compose.yml      ← PostgreSQL + Redis
├── nest-cli.json           ← Config de NestJS
├── tsconfig.json           ← Config de TypeScript
└── package.json            ← Dependencias
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar servicios (PostgreSQL + Redis)

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto levantará:
- PostgreSQL en puerto `5432`
- Redis en puerto `6379`
- Redis Commander en puerto `8081` (UI para ver Redis)

### 3. Generar cliente de Prisma

```bash
npm run prisma:generate
```

### 4. Ejecutar migraciones

```bash
npm run prisma:migrate
```

### 5. Poblar base de datos con datos de prueba

```bash
npm run prisma:seed
```

Esto creará:
- 5 especialidades médicas
- 4 médicos
- ~168 slots disponibles (7 días × 6 horarios × 4 médicos)

### 6. Ejecutar servidor de desarrollo

```bash
npm run start:dev
```

El backend estará disponible en: `http://localhost:3001`

## 📚 Documentación de API (Swagger)

Una vez que el servidor esté corriendo, accede a:

```
http://localhost:3001/api
```

Aquí encontrarás toda la documentación interactiva de los endpoints.

## 🗄️ Modelos de Base de Datos

### Specialty (Especialidad)
```prisma
- id: UUID
- name: String (único)
- description: String?
- createdAt: DateTime
- updatedAt: DateTime
- doctors: Doctor[]
```

### Doctor (Médico)
```prisma
- id: UUID
- name: String
- specialtyId: String
- hospital: String
- email: String (único)
- phone: String?
- createdAt: DateTime
- updatedAt: DateTime
- appointments: Appointment[]
- availableSlots: AvailableSlot[]
```

### AvailableSlot (Horario Disponible)
```prisma
- id: UUID
- doctorId: String
- startTime: DateTime
- endTime: DateTime
- isBooked: Boolean (default: false)
- createdAt: DateTime
- updatedAt: DateTime
```

### Appointment (Turno)
```prisma
- id: UUID
- doctorId: String
- patientName: String
- patientEmail: String?
- patientPhone: String
- date: DateTime
- status: AppointmentStatus (PENDING | CONFIRMED | CANCELLED | COMPLETED)
- notes: String?
- createdAt: DateTime
- updatedAt: DateTime
```

### WaitingList (Lista de Espera)
```prisma
- id: UUID
- specialtyId: String
- patientName: String
- patientEmail: String?
- patientPhone: String
- createdAt: DateTime
- notified: Boolean (default: false)
```

## 🔌 Endpoints Principales

### Especialidades

- `GET /specialties` - Listar todas las especialidades
- `GET /specialties/:id` - Obtener una especialidad
- `POST /specialties` - Crear especialidad

### Médicos

- `GET /doctors` - Listar todos los médicos
- `GET /doctors?specialtyId=xxx` - Filtrar por especialidad
- `GET /doctors/:id` - Obtener un médico
- `POST /doctors` - Crear médico
- `POST /doctors/:id/slots` - Crear horario disponible

### Turnos

- `GET /appointments` - Listar todos los turnos
- `GET /appointments?status=CONFIRMED` - Filtrar por estado
- `GET /appointments/stats` - Obtener estadísticas
- `GET /appointments/:id` - Obtener un turno
- `POST /appointments` - Crear turno
- `DELETE /appointments/:id` - Cancelar turno

## 🔄 Sistema de Notificaciones (Bull + Redis)

El sistema usa colas de trabajo para procesar notificaciones de forma asíncrona:

### Tipos de Jobs:

1. **appointment-confirmed**
   - Se ejecuta al confirmar un turno
   - Envía notificación al paciente

2. **slot-available**
   - Se ejecuta al cancelar un turno
   - Notifica a la lista de espera

3. **daily-reminders**
   - Recordatorios diarios de turnos
   - (Puede configurarse con cron jobs)

Ver implementación en: [src/notifications/notifications.processor.ts](src/notifications/notifications.processor.ts)

## 🗂️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev           # Servidor con hot-reload
npm run start:debug         # Servidor con debugger

# Build
npm run build               # Compilar TypeScript

# Producción
npm run start:prod          # Servidor de producción

# Prisma
npm run prisma:generate     # Generar cliente Prisma
npm run prisma:migrate      # Ejecutar migraciones
npm run prisma:studio       # Abrir Prisma Studio (UI)
npm run prisma:seed         # Poblar DB con datos de prueba
```

## 🐳 Docker

### Ver logs de servicios

```bash
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Detener servicios

```bash
docker-compose down
```

### Eliminar volúmenes (resetear DB)

```bash
docker-compose down -v
```

## 🔧 Variables de Entorno

Archivo: `.env`

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saludpublica?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📊 Prisma Studio

Para visualizar y editar datos de la DB:

```bash
npm run prisma:studio
```

Se abrirá en: `http://localhost:5555`

## 🔍 Redis Commander

Para visualizar las colas y cache de Redis:

```
http://localhost:8081
```

## 🚀 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar rate limiting
- [ ] Integración con servicio de email (SendGrid, etc.)
- [ ] Integración con servicio de SMS (Twilio, etc.)
- [ ] Tests unitarios y e2e
- [ ] CI/CD pipeline
- [ ] Monitoreo y logging (Winston, Sentry)
- [ ] Cache de queries con Redis

## 📝 Notas

- Las notificaciones actualmente son simuladas (console.log)
- Para notificaciones reales, integrar servicios externos
- El sistema de lista de espera está implementado pero requiere interfaz en frontend
- Bull Dashboard puede agregarse para monitorear colas

---

**Desarrollado con NestJS + Prisma + Redis + Bull**
