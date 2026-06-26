# Relevamiento Funcional — SkillSwap

> **Stack tecnológico**: React 19 + Vite + TailwindCSS v4 + Supabase (PostgreSQL + Auth + Realtime)  
> **Backend**: Supabase (BaaS) con RLS (Row Level Security)  
> **Autenticación**: Supabase Auth (email/password + OAuth Google)  
> **Fecha del relevamiento**: 2026-06-22

---

## 1. Arquitectura General

```
src/
├── App.jsx                    # Router principal + ProtectedRoute + ErrorBoundary
├── main.jsx                   # Entry point
├── context/
│   └── AuthContext.jsx        # Estado global de sesión / roles
├── pages/                     # 9 páginas
├── components/layout/         # Navbar + Footer
└── utils/
    ├── supabase.js             # Cliente Supabase (singleton anti-deadlock)
    └── mockData.js             # Datos de prueba (NO se usa en producción)
```

### Tablas en Supabase detectadas (por consultas en código)

| Tabla | Descripción |
|---|---|
| `profiles` | Perfil extendido del usuario (name, city, surname, avatar_url, role, is_banned, time_credits) |
| `skills` | Habilidades publicadas (title, description, category, modality, level, availability, owner_id) |
| `requests` | Solicitudes de intercambio entre usuarios (sender_id, receiver_id, target_skill_id, message, status) |
| `classes` | Clases agendadas derivadas de requests aceptadas (teacher_id, student_id, date, time, status) |
| `messages` | Mensajes del chat vinculados a una request (request_id, sender_id, content) |
| `reviews` | Valoraciones post-clase (reviewer_id, reviewee_id, class_id, rating, comment) |
| `notifications` | Notificaciones en tiempo real (user_id, title, content, link, is_read) |

---

## 2. Roles del Sistema

| Rol | Descripción | Cómo se asigna |
|---|---|---|
| **Visitante** (sin sesión) | Puede explorar el catálogo y ver detalles de habilidades y perfiles públicos | Por defecto (sin login) |
| **user** | Usuario autenticado estándar | Por defecto al registrarse |
| **moderator** | Puede eliminar publicaciones de otros usuarios en el catálogo y en detalle de skill. Accede al Panel Admin para ver y gestionar usuarios (ban/unban), pero NO puede cambiar roles a admin | El admin lo asigna desde Panel Admin |
| **admin** | Acceso completo: todo lo del moderador + puede cambiar roles de usuarios (user ↔ moderator). Muestra "Modo Maestro Activado" | Debe asignarse directamente en la base de datos |

> **Nota de seguridad**: El rol se guarda en la columna `role` de la tabla `profiles`. La protección de rutas es solo client-side (no hay middleware de servidor). La ruta `/admin` solo verifica `user.role` en el frontend.

---

## 3. Rutas de la Aplicación

| Ruta | Componente | Acceso | Tipo |
|---|---|---|---|
| `/` | `Home` | Público | Pública |
| `/register` | `Register` | Público | Pública |
| `/login` | `Login` | Público | Pública |
| `/catalog` | `Catalog` | Público | Pública |
| `/skill/:id` | `SkillDetail` | Público | Pública (dinámica) |
| `/profile/:id` | `PublicProfile` | Público | Pública (dinámica) |
| `/dashboard` | `Dashboard` | Autenticado | Protegida |
| `/messages/:id` | `Messages` | Autenticado | Protegida (dinámica) |
| `/admin` | `AdminPanel` | Admin o Moderador | Protegida (rol) |
| `*` | — | — | Redirige a `/` |

---

## 4. Páginas y sus Funcionalidades

### 4.1 Home (`/`)
- Página de bienvenida con hero section
- Estadísticas decorativas hardcodeadas (+500 usuarios, etc.)
- CTA dinámico: si hay sesión → "Ir a mi Panel" y "Buscar nuevos intercambios"; si no → "Únete" y "Explorar habilidades"

### 4.2 Login (`/login`)
- Formulario de inicio de sesión con email y contraseña
- Login con Google OAuth (redirige a `/dashboard` tras autenticarse)
- Enlace a registro
- Manejo de errores inline

### 4.3 Register (`/register`)
- Formulario de registro (nombre, apellido, email, contraseña, ciudad, categoría de interés)
- Registro con Google OAuth
- La categoría de interés se registra en frontend pero **NO se guarda en la tabla `profiles`** (el campo `category` del formData no tiene correspondencia en la inserción a Supabase)
- Enlace a login

### 4.4 Catálogo (`/catalog`)
- Listado de todas las skills publicadas con rating promedio del propietario
- Filtro por texto (título/descripción)
- Filtro por categoría (desplegable)
- Panel de filtros avanzados (nivel, modalidad, ciudad del propietario)
- Botón "Limpiar filtros" visible solo si hay filtros activos
- Cada card navega a `/skill/:id`
- El nombre del propietario en cada card navega a `/profile/:id`
- **Para admin/moderador**: aparece botón de eliminar skill en cada card

### 4.5 Detalle de Habilidad (`/skill/:id`)
- Vista completa de la skill (título, categoría, descripción, modalidad, nivel, disponibilidad)
- Info del propietario con rating promedio (clickeable → `/profile/:id`)
- Sección de valoraciones de la comunidad (read-only, cargadas de `reviews`)
- **Si es propietario, admin o moderador**: botón "Borrar Habilidad" (elimina de la BD)
- **Si es otro usuario autenticado**: botón "Solicitar Intercambio" → abre modal
- **Modal de solicitud**: textarea con mensaje de propuesta → inserta en tabla `requests`
- Validación de `time_credits`: si el usuario tiene 0 créditos, no puede solicitar

### 4.6 Perfil Público (`/profile/:id`)
- Avatar (imagen o inicial), nombre, ciudad
- Contador de créditos de tiempo (`time_credits ?? 5`)
- Fecha de miembro
- Rating promedio y conteo de valoraciones
- Pestañas: "Habilidades que Ofrece" / "Valoraciones de la Comunidad"
- Skills del usuario (cards clicables → `/skill/:id`)
- Reviews recibidas con avatar del reviewer, estrellas y comentario

### 4.7 Dashboard (`/dashboard`) — *Protegida*

Panel principal del usuario. Tiene sidebar con navegación interna por pestañas:

**Sidebar:**
- Avatar del usuario (con soporte para URL de imagen)
- Nombre, email, ciudad
- Créditos de tiempo
- Botón "Publicar Habilidad" (abre modal)
- Botón ⚙️ Ajustes de Perfil (abre modal)

**Pestañas:**

| Pestaña | Funcionalidad |
|---|---|
| **Mis Habilidades** | Lista de skills propias (solo lectura en esta vista; se eliminan desde el detalle) |
| **Solicitudes Recibidas** | Solicitudes entrantes con estado (pendiente/aceptada/rechazada). Botones Aceptar/Rechazar. Si acepta → genera clases automáticamente y navega al chat |
| **Mis Solicitudes** | Solicitudes enviadas con estado. Si aceptada → botón para ir al chat |
| **Mis Intercambios** | Calendario mensual + detalle de clases por día |

**Sub-funcionalidades de "Mis Intercambios":**
- Calendario navegable (mes anterior/siguiente) con puntos indicadores (profesor=púrpura, alumno=verde)
- Al seleccionar día → panel lateral con clases del día
- Cada clase muestra: skill, rol (profesor/alumno), compañero, horario, estado (agendada/reprogramada/completada/cancelada)
- **Acciones por clase** (solo si no está cancelada/completada):
  - "Entrar al Aula Virtual" (link a Jit.si, solo para virtual/híbrido)
  - "Añadir a Google Calendar" (URL prefabricada)
  - "Marcar como Completada" → llama a RPC `complete_class`, transfiere 1 crédito, muestra modal de review
  - "Reprogramar" → abre modal con formulario de nueva fecha/hora, envía notificación al chat
  - "Cancelar" → cambia estado a 'cancelled', envía notificación al chat
- Si clase completada y aún no calificada (alumno) → botón "Dejar Calificación"

**Modales del Dashboard:**

| Modal | Campos |
|---|---|
| **Publicar Habilidad** | Título, Descripción, Categoría, Modalidad, Nivel, Disponibilidad (selector de calendario con horarios) |
| **Agendar Disponibilidad** | Calendario interactivo: selección de fecha, hora inicio, hora fin → genera lista de slots |
| **Ajustes de Perfil** | Avatar (8 predefinidos de DiceBear + URL custom), Nombre, Apellido, Ciudad (autocompletado con Nominatim/OpenStreetMap), Contraseña nueva + confirmación |
| **Reprogramar Clase** | Nueva fecha (date picker), nuevo horario (text input) |
| **Calificar Intercambio** | Rating 1-5 estrellas (con label dinámico), comentario opcional |

### 4.8 Mensajes (`/messages/:id`) — *Protegida*

- Chat en tiempo real vinculado a una `request` específica
- Header: nombre del otro usuario, habilidad de la solicitud, badge "Finalizado" si completada
- Muestra mensaje original de la solicitud como primer mensaje del hilo
- Lista de mensajes con diferenciación visual (propio/ajeno)
- Subscripción Realtime a Postgres INSERT en tabla `messages`
- Chime de audio al recibir mensajes de otros
- Input deshabilitado si el intercambio está `completed`
- Botón volver → `/dashboard`
- Optimistic update al enviar mensaje

### 4.9 Panel de Administración (`/admin`) — *Protegida (admin/moderador)*

- Tabla de todos los usuarios (excepto el propio admin)
- Columnas: Usuario (nombre + ID), Ubicación, Estado (Activo/Suspendido), Rol (dropdown), Acciones
- Botón "Suspender Cuenta" / "Levantar Suspensión" → actualiza `is_banned`
- Dropdown de rol → permite cambiar entre `user` y `moderator` (el rol `admin` NO aparece como opción)
- Badge "Modo Maestro Activado" visible solo para el rol `admin`
- Redirección a `/` si el usuario no tiene el rol requerido

---

## 5. Tabla de Funcionalidades por Módulo

| Módulo | Funcionalidad | Ruta | Rol | Estado |
|---|---|---|---|---|
| **Autenticación** | Registro con email/contraseña | `/register` | Visitante | ✅ Completo |
| **Autenticación** | Login con email/contraseña | `/login` | Visitante | ✅ Completo |
| **Autenticación** | Login / Registro con Google OAuth | `/login`, `/register` | Visitante | ✅ Completo |
| **Autenticación** | Logout | Navbar | user/admin/mod | ✅ Completo |
| **Autenticación** | Refresco automático de sesión (focus + timeout) | Global | Autenticado | ✅ Completo |
| **Autenticación** | Bloqueo de cuenta suspendida (`is_banned`) | Global | Sistema | ✅ Completo |
| **Autenticación** | Creación automática de perfil para usuarios OAuth | Sistema | Sistema | ✅ Completo |
| **Catálogo** | Listar todas las habilidades | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Filtro por texto (título/descripción) | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Filtro por categoría | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Filtros avanzados (nivel, modalidad, ciudad) | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Limpiar filtros | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Ver rating promedio del propietario en card | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Navegar al perfil del propietario desde card | `/catalog` | Todos | ✅ Completo |
| **Catálogo** | Eliminar skill (moderación) | `/catalog` | admin/mod | ✅ Completo |
| **Skills** | Ver detalle completo de habilidad | `/skill/:id` | Todos | ✅ Completo |
| **Skills** | Ver valoraciones del propietario en detalle | `/skill/:id` | Todos | ✅ Completo |
| **Skills** | Publicar nueva habilidad (modal) | `/dashboard` | user | ✅ Completo |
| **Skills** | Agendar disponibilidad con calendario interactivo | `/dashboard` | user | ✅ Completo |
| **Skills** | Eliminar propia habilidad | `/skill/:id` | user (propietario) | ✅ Completo |
| **Skills** | Eliminar habilidad ajena (moderación) | `/skill/:id` | admin/mod | ✅ Completo |
| **Skills** | Editar habilidad publicada | — | user | ❌ No implementado |
| **Intercambios** | Solicitar intercambio (modal con mensaje) | `/skill/:id` | user | ✅ Completo |
| **Intercambios** | Validación de créditos al solicitar | `/skill/:id` | user | ✅ Completo |
| **Intercambios** | Ver solicitudes recibidas | `/dashboard` | user | ✅ Completo |
| **Intercambios** | Aceptar solicitud de intercambio | `/dashboard` | user | ✅ Completo |
| **Intercambios** | Rechazar solicitud de intercambio | `/dashboard` | user | ✅ Completo |
| **Intercambios** | Ver solicitudes enviadas y su estado | `/dashboard` | user | ✅ Completo |
| **Intercambios** | Generación automática de clases al aceptar | Sistema | Sistema | ✅ Completo |
| **Clases** | Ver calendario de intercambios agendados | `/dashboard` | user | ✅ Completo |
| **Clases** | Ver detalle de clases por día | `/dashboard` | user | ✅ Completo |
| **Clases** | Marcar clase como completada (RPC) | `/dashboard` | user | ✅ Completo |
| **Clases** | Transferencia de crédito al completar clase | Sistema (RPC) | Sistema | ✅ Completo |
| **Clases** | Reprogramar clase (nueva fecha y hora) | `/dashboard` | user | ✅ Completo |
| **Clases** | Cancelar clase | `/dashboard` | user | ✅ Completo |
| **Clases** | Notificación al chat al reprogramar/cancelar | Sistema | Sistema | ✅ Completo |
| **Clases** | Entrar al Aula Virtual (Jit.si) | `/dashboard` | user | ✅ Completo |
| **Clases** | Añadir a Google Calendar | `/dashboard` | user | ✅ Completo |
| **Clases** | Exportar a archivo .ics (iCalendar) | Sistema (función disponible) | user | ⚠️ Función implementada, NO hay botón expuesto en UI |
| **Mensajes** | Chat en tiempo real entre dos usuarios | `/messages/:id` | user (participante) | ✅ Completo |
| **Mensajes** | Chime de audio al recibir mensaje | `/messages/:id` | user | ✅ Completo |
| **Mensajes** | Optimistic update al enviar | `/messages/:id` | user | ✅ Completo |
| **Mensajes** | Bloqueo de input si intercambio finalizado | `/messages/:id` | user | ✅ Completo |
| **Reseñas** | Calificar al profesor tras completar clase | `/dashboard` | user (alumno) | ✅ Completo |
| **Reseñas** | Ver reseñas en perfil público | `/profile/:id` | Todos | ✅ Completo |
| **Reseñas** | Ver reseñas en detalle de habilidad | `/skill/:id` | Todos | ✅ Completo |
| **Reseñas** | Rating promedio en catálogo y en perfil | `/catalog`, `/profile/:id` | Todos | ✅ Completo |
| **Perfil** | Ver perfil público de cualquier usuario | `/profile/:id` | Todos | ✅ Completo |
| **Perfil** | Editar perfil propio (nombre, apellido, ciudad) | `/dashboard` (modal) | user | ✅ Completo |
| **Perfil** | Cambiar avatar (8 predefinidos + URL custom) | `/dashboard` (modal) | user | ✅ Completo |
| **Perfil** | Cambiar contraseña | `/dashboard` (modal) | user | ✅ Completo |
| **Perfil** | Autocompletado de ciudad con Nominatim | `/dashboard` (modal) | user | ✅ Completo |
| **Perfil** | Ver créditos de tiempo | Navbar, Dashboard, Perfil público | Autenticado | ✅ Completo |
| **Notificaciones** | Campana de notificaciones en navbar | Navbar | Autenticado | ✅ Completo |
| **Notificaciones** | Notificaciones en tiempo real (Realtime) | Navbar | Autenticado | ✅ Completo |
| **Notificaciones** | Toast flotante al recibir notificación | Navbar | Autenticado | ✅ Completo |
| **Notificaciones** | Marcar todas como leídas | Navbar | Autenticado | ✅ Completo |
| **Notificaciones** | Navegar al link de la notificación | Navbar | Autenticado | ✅ Completo |
| **Admin** | Ver tabla de usuarios | `/admin` | admin/mod | ✅ Completo |
| **Admin** | Suspender/levantar suspensión de usuario | `/admin` | admin/mod | ✅ Completo |
| **Admin** | Cambiar rol de usuario (user ↔ moderator) | `/admin` | admin/mod | ✅ Completo |
| **Admin** | Acceso restringido por rol (redirección) | `/admin` | Sistema | ✅ Completo |
| **Admin** | Distinción visual "Modo Maestro" | `/admin` | admin | ✅ Completo |
| **Admin** | Eliminar usuario completamente | `/admin` | admin | ❌ No implementado |
| **Admin** | Ver skills publicadas desde panel admin | `/admin` | admin/mod | ❌ No implementado |
| **Admin** | Ver historial de clases desde panel admin | `/admin` | admin/mod | ❌ No implementado |
| **Home** | Landing page con hero y stats | `/` | Todos | ✅ Completo |
| **Navbar** | Menú responsive (desktop + hamburguesa móvil) | Global | Todos | ✅ Completo |
| **Navbar** | Mostrar créditos de tiempo | Global | Autenticado | ✅ Completo |
| **Footer** | Links a perfiles de desarrolladores | Global | Todos | ⚠️ Parcial (Ezequiel solo tiene GitHub, LinkedIn/Instagram/Portfolio comentados) |

---

## 6. Formularios del Sistema

| Formulario | Ubicación | Campos | Acción |
|---|---|---|---|
| **Registro** | `/register` | Nombre, Apellido, Email, Contraseña, Ciudad, Categoría de interés | `supabase.auth.signUp` + INSERT en `profiles` |
| **Login** | `/login` | Email, Contraseña | `supabase.auth.signInWithPassword` |
| **Publicar Habilidad** | Dashboard modal | Título, Descripción, Categoría, Modalidad, Nivel, Disponibilidad (sub-calendar) | INSERT en `skills` |
| **Agendar Disponibilidad** | Sub-modal del anterior | Calendario visual + Hora inicio + Hora fin (por slot) | Genera string formateado |
| **Solicitar Intercambio** | `/skill/:id` modal | Mensaje de propuesta (textarea) | INSERT en `requests` |
| **Reprogramar Clase** | Dashboard modal | Nueva Fecha (date), Nuevo Horario (text) | UPDATE en `classes` |
| **Calificar Intercambio** | Dashboard modal | Rating 1-5 (estrellas), Comentario (opcional) | INSERT en `reviews` |
| **Ajustes de Perfil** | Dashboard modal | Nombre, Apellido, Ciudad (autocomplete), Avatar (URL o predefinido), Contraseña nueva, Confirmación | UPDATE en `profiles`, opcional `supabase.auth.updateUser` |

---

## 7. Funcionalidades de Tiempo Real (Supabase Realtime)

| Canal | Evento | Efecto |
|---|---|---|
| `chat:{request_id}` | INSERT en `messages` | Actualiza lista de mensajes en chat + chime de audio |
| `public:notifications:user_id=eq.{id}` | INSERT en `notifications` | Actualiza campana + muestra toast + chime de notificación |

---

# Funcionalidades detectadas no documentadas

Las siguientes funcionalidades existen en el código pero no están documentadas en el README (que está vacío) ni mencionadas en comentarios de alto nivel:

1. **Sistema de Créditos de Tiempo**: La economía de la plataforma usa créditos (valor inicial: 5 por usuario). Se descuenta 1 al alumno y se suma 1 al profesor al completar una clase mediante la función RPC `complete_class`. Esto NO está documentado.

2. **Exportación ICS**: Existe la función `handleDownloadICS` completamente implementada en el Dashboard (genera un archivo `.ics` para calendarios como Apple Calendar y Outlook), pero **no hay ningún botón en la UI** que la invoque. Está "muerta" en el código.

3. **Aula Virtual Jit.si**: Cada clase virtual tiene una sala única generada automáticamente con el patrón `https://meet.jit.si/SkillSwap_Class_{class_id}`. No requiere instalación ni cuenta. No está documentado.

4. **Auto-creación de clases al aceptar solicitud**: Cuando un receptor acepta una solicitud, el sistema parsea la disponibilidad de la skill (`parseAvailabilityStringToSlots`) y crea múltiples registros en la tabla `classes` automáticamente. Este comportamiento no es evidente para el usuario.

5. **Notificaciones al chat por eventos del sistema**: Cuando se cancela o reprogramar una clase, se inserta automáticamente un mensaje en el chat de esa solicitud informando el cambio. Es un mecanismo de "notificación sistémica" dentro del chat.

6. **Mockdata.js no utilizado**: Existe `src/utils/mockData.js` con 4 habilidades de ejemplo, pero **no se importa en ningún componente**. Es un residuo del desarrollo inicial.

7. **Singleton anti-deadlock de Supabase**: La instancia de Supabase se guarda en `window._supabaseInstance` para evitar múltiples instancias durante el Hot Reload de Vite que causaban deadlocks de Web Locks del navegador. Es una solución no estándar pero necesaria.

8. **Timeout de carga de 2 segundos en AuthContext**: Si Supabase no responde en 2 segundos, la app fuerza el fin del estado `loading` para evitar pantalla negra. Está implementado como fallback silencioso.

9. **DiceBear Avatars**: Los 8 avatares predefinidos provienen de la API pública `api.dicebear.com/7.x/adventurer/svg` con seeds específicos. No se documenta que son imágenes generadas externamente.

10. **Autocompletado de ubicación con Nominatim (OSM)**: El campo de ciudad en Ajustes de Perfil usa la API gratuita de OpenStreetMap para sugerir ciudades. Sin API key, sujeto a rate limiting.

---

# Funcionalidades mencionadas en documentación pero no encontradas en código

> **Nota**: El archivo `README.md` del proyecto está **vacío** (solo contiene 11 bytes, probablemente un título). No existe documentación formal del proyecto.

Sin embargo, se detectaron **referencias en comentarios dentro del código** a elementos que no están completamente implementados:

1. **LinkedIn, Instagram y Portfolio de Ezequiel Marinzulich** (Footer.jsx, líneas 146–182): Están preparados con comentarios `/* ... */` pero sin URL real. Solo el GitHub está activo.

2. **Rol `admin` no asignable desde la UI**: El dropdown de roles en `/admin` solo permite `user` y `moderator`. No existe forma de promover a alguien a `admin` desde la interfaz. Debe hacerse directamente en la base de datos.

3. **Categoría de interés del registro**: El formulario de registro incluye un campo `category` ("Categoría de interés principal") que se valida como requerido, pero la función `register` en `AuthContext.jsx` **no lo incluye** en el INSERT a `profiles` (la tabla tampoco tiene esa columna en el SQL). El dato se pierde.

4. **Edición de habilidades publicadas**: Un usuario no puede editar una skill ya publicada (solo eliminarla). No hay formulario de edición ni ruta para ello.

5. **Eliminación de cuenta de usuario**: El admin puede suspender, pero no existe un mecanismo para eliminar cuentas permanentemente desde la UI.

6. **Paginación del catálogo**: La consulta de skills trae todos los registros sin límite ni paginación. A escala, esto puede causar problemas de rendimiento.

7. **Búsqueda de usuario por nombre en Admin Panel**: El panel muestra todos los usuarios en una tabla pero no tiene filtro/búsqueda. A escala sería problemático.

8. **Sistema de categoría de interés en perfil**: El dato capturado en registro (categoría de interés) no tiene uso en ninguna parte de la aplicación (ni en perfil, ni en recomendaciones, ni en filtros).
