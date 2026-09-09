# SaludPública Sanare

Sistema de Gestión de Turnos para Centros de Salud Públicos.

## 🏥 Descripción del Proyecto

Sistema **fullstack completo** para resolver el caos de turnos médicos en centros públicos. Incluye:

- ✅ **Triaje Inteligente con IA** (Google Gemini) - Analiza síntomas y recomienda especialidad
- ✅ **Sistema de Reservas** - Gestión de turnos con médicos y especialidades
- ✅ **Panel de Administración** - Dashboard con estadísticas y métricas
- ✅ **Autenticación JWT** - Sistema completo de usuarios (Pacientes, Doctores, Admin)
- ✅ **API REST** - Backend completo con NestJS + Guards y Roles
- ✅ **Base de Datos** - PostgreSQL con Prisma ORM
- ✅ **Sistema de Notificaciones** - Bull + Redis para colas asíncronas
- ✅ **Emails Automáticos** - Confirmación y recordatorios de turnos (Nodemailer + Gmail)
- ✅ **Prevención de Race Conditions** - Transacciones atómicas para evitar turnos duplicados
- ✅ **Docker Compose** - PostgreSQL y Redis containerizados
- ✅ **Colección Postman** - Testing completo de todos los endpoints

## 📁 Estructura del Proyecto

```
SaludPúblicaConnect/
├── frontend/                 ← React + TypeScript + Vite
│   ├── components/           ← Componentes UI
│   │   ├── Navbar.tsx
│   │   ├── TriageChat.tsx
│   │   ├── BookingSystem.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/
│   │   ├── geminiService.ts  ← Integración Gemini AI
│   │   └── apiService.ts     ← Cliente API
│   ├── types.ts
│   ├── App.tsx
│   └── package.json
│
├── backend/                  ← NestJS + Prisma + Redis + Bull
│   ├── prisma/
│   │   ├── schema.prisma     ← Modelos de DB
│   │   └── seed.ts           ← Datos de prueba
│   ├── src/
│   │   ├── appointments/     ← Módulo de Turnos
│   │   ├── doctors/          ← Módulo de Médicos
│   │   ├── specialties/      ← Módulo de Especialidades
│   │   ├── notifications/    ← Procesador Bull
│   │   ├── common/prisma/    ← Servicio Prisma
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── docker-compose.yml        ← PostgreSQL + Redis + Redis Commander
└── README.md
```

## 🚀 Instalación y Ejecución

### 1. Levantar Servicios (PostgreSQL + Redis)

Desde la **raíz del proyecto**:

```bash
docker-compose up -d
```

Esto levantará:
- **PostgreSQL** en `localhost:5432`
- **Redis** en `localhost:6379`
- **Redis Commander** (UI) en `http://localhost:8081`

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar DB con datos de prueba (4 médicos, 5 especialidades, ~168 slots)
npm run prisma:seed

# Ejecutar servidor de desarrollo
npm run start:dev
```

El backend estará disponible en: **http://localhost:3001**

**Swagger docs:** http://localhost:3001/api

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# (OPCIONAL) Configurar API Key de Gemini
# Edita .env.local y agrega tu API key de https://makersuite.google.com/app/apikey
# VITE_GEMINI_API_KEY=tu_api_key_aqui

# Ejecutar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Lucide React** - Iconos
- **Recharts** - Gráficos
- **Google Gemini AI** - Triaje inteligente

### Backend
- **NestJS 10** - Framework backend
- **PostgreSQL** - Base de datos
- **Prisma** - ORM
- **Redis** - Cache y colas
- **Bull** - Sistema de colas
- **Swagger** - Documentación API
- **Docker** - Containerización

## ✅ Funcionalidades Implementadas

### Frontend
- ✅ Página de inicio con CTA
- ✅ Navegación entre secciones
- ✅ **Triaje con IA** - Gemini analiza síntomas y recomienda especialidad
- ✅ **Sistema de Reservas** - Flujo completo de reserva de turnos
- ✅ **Panel Admin** - Estadísticas, gráficos y tabla de turnos
- ✅ Diseño responsive
- ✅ Integración con backend API

### Backend
- ✅ **API REST completa** con endpoints CRUD
- ✅ **Base de datos PostgreSQL** con Prisma
- ✅ **Autenticación y Autorización:**
  - JWT con tokens de acceso
  - Roles: PATIENT, DOCTOR, ADMIN
  - Guards para proteger endpoints
- ✅ **4 módulos principales:**
  - Autenticación (`/auth`) - Register, Login, Profile
  - Especialidades (`/specialties`)
  - Médicos (`/doctors`) - CRUD + gestión de slots
  - Turnos (`/appointments`) - CRUD con validaciones
- ✅ **Sistema de Slots:**
  - Turnos de 20 minutos
  - Generación automática de horarios semanales
  - Deduplicación de slots
  - Validación de solapamientos
- ✅ **Prevención de turnos duplicados:**
  - Transacciones de Prisma para operaciones atómicas
  - Validación de disponibilidad en tiempo real
- ✅ **Sistema de notificaciones** con Bull + Redis
- ✅ **Emails automáticos** (Nodemailer + Gmail):
  - Confirmación de turnos
  - Recordatorios 24h antes
  - Cancelaciones
- ✅ **Validación de disponibilidad** de horarios
- ✅ **Cancelación de turnos** con liberación automática
- ✅ **Lista de espera** (notifica cuando se libera turno)
- ✅ **Documentación Swagger** auto-generada
- ✅ **Seed script** para datos de prueba

## 📚 Documentación

### API REST (Swagger)

Una vez levantado el backend, accede a:

```
http://localhost:3001/api
```

### Endpoints Principales

#### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión (retorna JWT)
- `GET /auth/profile` - Obtener perfil (requiere JWT)

#### Especialidades
- `GET /specialties` - Listar especialidades
- `GET /specialties/:id` - Obtener especialidad con médicos
- `POST /specialties` - Crear especialidad

#### Médicos
- `GET /doctors` - Listar médicos
- `GET /doctors?specialtyId=xxx` - Filtrar por especialidad
- `GET /doctors/:id` - Obtener médico con slots disponibles
- `GET /doctors/:id/available-slots?date=YYYY-MM-DD` - Slots disponibles por fecha
- `POST /doctors` - Crear médico (🔒 ADMIN)
- `PUT /doctors/:id` - Actualizar médico (🔒 ADMIN)
- `DELETE /doctors/:id` - Eliminar médico (🔒 ADMIN)
- `POST /doctors/:id/slots` - Crear slot manualmente (🔒 ADMIN)
- `POST /doctors/:id/slots/generate` - Generar slots automáticamente (🔒 ADMIN)
- `DELETE /doctors/:id/slots` - Eliminar todos los slots (🔒 ADMIN)
- `DELETE /doctors/:id/slots/duplicates` - Eliminar duplicados (🔒 ADMIN)

#### Turnos
- `GET /appointments` - Listar turnos (🔒 Autenticado)
- `GET /appointments/stats` - Estadísticas (🔒 ADMIN)
- `GET /appointments/:id` - Obtener turno (🔒 Autenticado)
- `POST /appointments` - Crear turno (🔒 PATIENT)
- `DELETE /appointments/:id` - Cancelar turno (🔒 Autenticado)

#### Turnos Públicos (sin autenticación)
- `GET /appointments-public/token/:token` - Ver turno por token
- `POST /appointments-public/cancel/:token` - Cancelar por token (desde email)

## 🔄 Sistema de Notificaciones

Implementado con **Bull + Redis + Nodemailer**. Tipos de jobs:

1. **appointment-confirmed** - ✅ Envía email de confirmación al paciente con detalles del turno
2. **appointment-reminder** - ✅ Envía recordatorio 24h antes del turno
3. **slot-available** - Notifica a lista de espera cuando se libera turno

### 📧 Emails Automáticos

Los emails se envían usando **Nodemailer con Gmail SMTP**. Configurar en `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password  # Generar en configuración de Google
EMAIL_FROM="SaludPública Connect <noreply@saludpublica.com>"
```

Tipos de emails:
- ✅ **Bienvenida** - Al registrarse
- ✅ **Confirmación de turno** - Con todos los detalles + botón cancelar
- ✅ **Recordatorio 24h antes** - Detalles del turno próximo
- ✅ **Cancelación** - Confirmación de cancelación

> **Nota SMS:** Para agregar SMS, integrar Twilio o Vonage en el procesador de notificaciones

## 🐳 Docker

### Ver logs

```bash
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Detener servicios

```bash
docker-compose down
```

### Resetear base de datos

```bash
docker-compose down -v
```

## 🗂️ Scripts Útiles

### Backend

```bash
npm run start:dev          # Servidor con hot-reload
npm run build              # Compilar para producción
npm run start:prod         # Ejecutar en producción
npm run prisma:studio      # UI para ver/editar DB (localhost:5555)
npm run prisma:migrate     # Ejecutar migraciones
npm run prisma:seed        # Poblar DB con datos de prueba
```

### Frontend

```bash
npm run dev               # Servidor desarrollo (puerto 3000)
npm run build             # Build para producción
npm run preview           # Preview del build
```

## 🔧 Variables de Entorno

### Backend (`.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saludpublica?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3002

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password  # Generar App Password en Google
EMAIL_FROM="SaludPública Connect <noreply@saludpublica.com>"
```

### Frontend (`.env.local`)

```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
VITE_API_URL=http://localhost:3001
```

## 📊 Herramientas de Monitoreo

### Prisma Studio
Interfaz gráfica para ver/editar datos de PostgreSQL:

```bash
cd backend
npm run prisma:studio
```

Abre en: `http://localhost:5555`

### Redis Commander
Interfaz gráfica para ver colas y cache de Redis:

```
http://localhost:8081
```

## 🧪 Testing con Postman

Incluye una colección completa de Postman: `SaludPublicaConnect.postman_collection.json`

**Importar en Postman:**
1. Abrir Postman
2. Import → Seleccionar el archivo `.json`
3. Configurar variables:
   - `baseUrl`: http://localhost:3001
   - `token`: (se obtiene del login)
   - `adminToken`: (se obtiene del login como admin)

**Módulos incluidos:**
- ✅ Auth (Register, Login, Profile)
- ✅ Specialties (CRUD)
- ✅ Doctors (CRUD + gestión slots)
- ✅ Appointments (CRUD + stats)
- ✅ Appointments Public (cancelación por token)

## 🎯 Próximos Pasos / Mejoras

- [x] Autenticación JWT para usuarios y administradores ✅
- [x] Sistema de roles y permisos ✅
- [x] Integración real con servicios de email ✅
- [x] Prevención de race conditions en reservas ✅
- [ ] Tests unitarios e integración (Jest, Supertest)
- [ ] Rate limiting en API
- [ ] Integración con SMS (Twilio)
- [ ] Historial médico de pacientes
- [ ] Exportar reportes (PDF, Excel)
- [ ] Notificaciones push en frontend
- [ ] Deploy en producción (AWS, Railway, Vercel)
- [ ] CI/CD con GitHub Actions
- [ ] Monitoreo con Sentry/DataDog
- [ ] Cache de queries frecuentes con Redis

## 📝 Notas Importantes

1. **Docker requerido:** PostgreSQL y Redis se levantan con Docker Compose
2. **API Key de Gemini:** Opcional para el triaje, el resto funciona sin ella
3. **Datos de prueba:** El seed crea 4 médicos con ~168 slots en los próximos 7 días
4. **CORS configurado:** Frontend (3000) puede consumir Backend (3001)
5. **Hot reload:** Tanto frontend como backend tienen hot reload en desarrollo

## 🚀 Arquitectura

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Frontend  │────────▶│   Backend    │────────▶│ PostgreSQL │
│ React+Vite  │         │   NestJS     │         │            │
│ Port 3000   │         │   Port 3001  │         │ Port 5432  │
└─────────────┘         └──────────────┘         └────────────┘
                              │
                              │
                              ▼
                        ┌──────────┐
                        │  Redis   │
                        │  Bull    │
                        │Port 6379 │
                        └──────────┘
```

## 📄 Licencia

Proyecto educativo/prototipo.

---

**🎉 Proyecto completamente funcional - Frontend + Backend + Database + Notificaciones**

Desarrollo usando React, NestJS, PostgreSQL, Redis y Bull.
Power By Carlos Chaparro-Actividad de aprendizaje laboratorio final Adso ficha 3139687 jornada mañana
# salud-publica-connect
