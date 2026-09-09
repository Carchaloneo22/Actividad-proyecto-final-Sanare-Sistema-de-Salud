# 🚀 Guía de Inicio Rápido - SaludPública Connect

## ⚡ 3 Pasos para Ejecutar el Proyecto

### Paso 1: Levantar Base de Datos y Redis

Desde la raíz del proyecto:

```bash
docker-compose up -d
```

✅ Esto levantará PostgreSQL, Redis y Redis Commander

### Paso 2: Configurar y Ejecutar Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

✅ Backend corriendo en http://localhost:3001

✅ Swagger docs en http://localhost:3001/api

### Paso 3: Ejecutar Frontend

Abre otra terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend corriendo en http://localhost:3000

---

## 🎉 ¡Listo!

Ya podés probar el sistema:

1. **Página de Inicio**: http://localhost:3000
2. **Triaje con IA**: Describe síntomas y Gemini recomendará especialidad
3. **Reservar Turno**: Elegí médico, fecha y hora
4. **Panel Admin**: Ver estadísticas y gráficos de turnos

---

## 📊 Herramientas de Monitoreo

- **Swagger API**: http://localhost:3001/api
- **Prisma Studio**: `cd backend && npm run prisma:studio` → http://localhost:5555
- **Redis Commander**: http://localhost:8081

---

## 🛑 Detener Todo

```bash
# Detener Docker
docker-compose down

# Los servidores frontend/backend se detienen con Ctrl+C
```

---

## ⚠️ Solución de Problemas

### Error: "Port already in use"

```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3001  # En Windows
lsof -i :3001                # En Mac/Linux

# Cambiar puerto en .env (backend) o vite.config.ts (frontend)
```

### Error: "Database connection failed"

```bash
# Verificar que Docker esté corriendo
docker ps

# Reiniciar contenedores
docker-compose restart
```

### Frontend no conecta con Backend

1. Verificar que backend esté corriendo en puerto 3001
2. Revisar que `VITE_API_URL` en `frontend/.env.local` sea `http://localhost:3001`
3. Reiniciar el servidor frontend

---

## 📝 Datos de Prueba

El `prisma:seed` crea:

- **5 Especialidades**: Medicina General, Cardiología, Pediatría, Dermatología, Traumatología
- **4 Médicos**: Dr. Juan Pérez, Dra. María González, Dr. Carlos Ramírez, Dra. Ana Martínez
- **~168 Slots**: 6 turnos diarios por médico durante 7 días (9-11am, 2-4pm)

---

## 🔑 API Key de Gemini (Opcional)

Para que el triaje con IA funcione:

1. Obtén tu API key gratis: https://makersuite.google.com/app/apikey
2. Edita `frontend/.env.local`:
   ```
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Reinicia el servidor frontend

Si no tienes API key, el triaje mostrará un mensaje de demo pero el resto funciona igual.

---

**¿Problemas?** Revisa el [README.md](README.md) completo o abre un issue.
