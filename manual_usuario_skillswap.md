# Manual de Usuario — SkillSwap

**Plataforma de Intercambio Colaborativo de Habilidades**

---

> **Asignatura:** Análisis de Sistemas  
> **Institución:** [Nombre de la institución]  
> **Año académico:** 2026  
> **Autores:** Judith Dávalos · Ezequiel Marinzulich  
> **Versión del sistema:** 1.0.0  
> **Fecha de redacción:** Junio 2026

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Descripción General del Sistema](#2-descripción-general-del-sistema)
3. [Requisitos del Sistema](#3-requisitos-del-sistema)
4. [Roles y Permisos](#4-roles-y-permisos)
5. [Módulo 1 — Autenticación](#5-módulo-1--autenticación)
   - 5.1 [Registro de nuevo usuario](#51-registro-de-nuevo-usuario)
   - 5.2 [Inicio de sesión con email y contraseña](#52-inicio-de-sesión-con-email-y-contraseña)
   - 5.3 [Inicio de sesión con Google](#53-inicio-de-sesión-con-google)
   - 5.4 [Cierre de sesión](#54-cierre-de-sesión)
   - 5.5 [Mantenimiento automático de sesión](#55-mantenimiento-automático-de-sesión)
   - 5.6 [Acceso bloqueado por suspensión](#56-acceso-bloqueado-por-suspensión)
6. [Módulo 2 — Catálogo de Habilidades](#6-módulo-2--catálogo-de-habilidades)
   - 6.1 [Explorar habilidades disponibles](#61-explorar-habilidades-disponibles)
   - 6.2 [Buscar por palabra clave](#62-buscar-por-palabra-clave)
   - 6.3 [Filtrar por categoría](#63-filtrar-por-categoría)
   - 6.4 [Filtros avanzados](#64-filtros-avanzados)
   - 6.5 [Limpiar filtros](#65-limpiar-filtros)
7. [Módulo 3 — Gestión de Habilidades](#7-módulo-3--gestión-de-habilidades)
   - 7.1 [Ver detalle de una habilidad](#71-ver-detalle-de-una-habilidad)
   - 7.2 [Publicar una nueva habilidad](#72-publicar-una-nueva-habilidad)
   - 7.3 [Agendar disponibilidad horaria](#73-agendar-disponibilidad-horaria)
   - 7.4 [Eliminar propia habilidad](#74-eliminar-propia-habilidad)
   - 7.5 [Eliminar habilidad ajena (moderación)](#75-eliminar-habilidad-ajena-moderación)
8. [Módulo 4 — Solicitudes de Intercambio](#8-módulo-4--solicitudes-de-intercambio)
   - 8.1 [Enviar solicitud de intercambio](#81-enviar-solicitud-de-intercambio)
   - 8.2 [Ver solicitudes recibidas](#82-ver-solicitudes-recibidas)
   - 8.3 [Aceptar una solicitud](#83-aceptar-una-solicitud)
   - 8.4 [Rechazar una solicitud](#84-rechazar-una-solicitud)
   - 8.5 [Consultar solicitudes enviadas](#85-consultar-solicitudes-enviadas)
9. [Módulo 5 — Gestión de Clases](#9-módulo-5--gestión-de-clases)
   - 9.1 [Ver calendario de intercambios agendados](#91-ver-calendario-de-intercambios-agendados)
   - 9.2 [Consultar clases de un día](#92-consultar-clases-de-un-día)
   - 9.3 [Marcar clase como completada](#93-marcar-clase-como-completada)
   - 9.4 [Reprogramar una clase](#94-reprogramar-una-clase)
   - 9.5 [Cancelar una clase](#95-cancelar-una-clase)
   - 9.6 [Unirse al aula virtual](#96-unirse-al-aula-virtual)
   - 9.7 [Añadir clase a Google Calendar](#97-añadir-clase-a-google-calendar)
10. [Módulo 6 — Mensajes y Chat](#10-módulo-6--mensajes-y-chat)
    - 10.1 [Acceder al chat de un intercambio](#101-acceder-al-chat-de-un-intercambio)
    - 10.2 [Enviar mensaje](#102-enviar-mensaje)
    - 10.3 [Recibir mensajes en tiempo real](#103-recibir-mensajes-en-tiempo-real)
11. [Módulo 7 — Valoraciones](#11-módulo-7--valoraciones)
    - 11.1 [Calificar al profesor tras completar clase](#111-calificar-al-profesor-tras-completar-clase)
    - 11.2 [Ver valoraciones en perfil público](#112-ver-valoraciones-en-perfil-público)
    - 11.3 [Ver valoraciones en detalle de habilidad](#113-ver-valoraciones-en-detalle-de-habilidad)
12. [Módulo 8 — Perfil de Usuario](#12-módulo-8--perfil-de-usuario)
    - 12.1 [Ver perfil público](#121-ver-perfil-público)
    - 12.2 [Editar datos de perfil](#122-editar-datos-de-perfil)
    - 12.3 [Cambiar avatar](#123-cambiar-avatar)
    - 12.4 [Cambiar contraseña](#124-cambiar-contraseña)
    - 12.5 [Buscar ciudad con autocompletado](#125-buscar-ciudad-con-autocompletado)
13. [Módulo 9 — Notificaciones](#13-módulo-9--notificaciones)
    - 13.1 [Recibir notificación en tiempo real](#131-recibir-notificación-en-tiempo-real)
    - 13.2 [Ver listado de notificaciones](#132-ver-listado-de-notificaciones)
    - 13.3 [Marcar notificaciones como leídas](#133-marcar-notificaciones-como-leídas)
    - 13.4 [Navegar desde una notificación](#134-navegar-desde-una-notificación)
14. [Módulo 10 — Panel de Administración](#14-módulo-10--panel-de-administración)
    - 14.1 [Acceder al panel de administración](#141-acceder-al-panel-de-administración)
    - 14.2 [Suspender cuenta de usuario](#142-suspender-cuenta-de-usuario)
    - 14.3 [Levantar suspensión de usuario](#143-levantar-suspensión-de-usuario)
    - 14.4 [Cambiar rol de usuario](#144-cambiar-rol-de-usuario)
    - 14.5 [Eliminar habilidades desde el catálogo](#145-eliminar-habilidades-desde-el-catálogo)
15. [Sistema de Créditos de Tiempo](#15-sistema-de-créditos-de-tiempo)
16. [Glosario de Términos](#16-glosario-de-términos)
17. [Limitaciones Conocidas del Sistema](#17-limitaciones-conocidas-del-sistema)
18. [Apéndice — Estructura de la Base de Datos](#18-apéndice--estructura-de-la-base-de-datos)

---

## 1. Introducción

El presente documento constituye el **Manual de Usuario** de la plataforma **SkillSwap**, desarrollada como proyecto integrador en el marco de la asignatura Análisis de Sistemas. Su propósito es brindar una guía exhaustiva y detallada sobre el funcionamiento de cada módulo del sistema, destinada tanto a usuarios finales como a evaluadores técnicos.

SkillSwap es una plataforma web que permite a personas conectar entre sí para **intercambiar habilidades de forma gratuita y colaborativa**. El principio fundamental del sistema es que cualquier usuario puede ofrecer una habilidad que domina y, a cambio, solicitar que otro usuario le enseñe una habilidad diferente. Esta dinámica se regula internamente mediante un sistema de **créditos de tiempo**, que garantiza la equidad del intercambio sin intervención monetaria.

Este manual documenta exclusivamente las funcionalidades identificadas y verificadas en el código fuente de la aplicación. No se incluyen funcionalidades planificadas, especulativas o no implementadas.

---

## 2. Descripción General del Sistema

### 2.1 Denominación del sistema
**SkillSwap** — Plataforma de Intercambio Colaborativo de Habilidades

### 2.2 Tipo de sistema
Aplicación web de una sola página (*Single Page Application*, SPA) con backend como servicio (*Backend as a Service*, BaaS).

### 2.3 Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend framework | React | 19.x |
| Build tool | Vite | 8.x |
| Estilos | TailwindCSS | 4.x |
| Animaciones | Framer Motion | 12.x |
| Iconografía | Lucide React | 1.x |
| Enrutamiento cliente | React Router DOM | 7.x |
| Backend / Base de datos | Supabase (PostgreSQL) | 2.x |
| Autenticación | Supabase Auth | — |
| Tiempo real | Supabase Realtime | — |
| Videoconferencia | Jit.si (externo, sin cuenta) | — |
| Geocodificación | OpenStreetMap Nominatim (externo) | — |

### 2.4 Arquitectura de navegación

La aplicación opera bajo un modelo cliente-servidor. El navegador carga todos los componentes de interfaz una única vez; las transiciones entre secciones se realizan del lado del cliente sin recargas de página. La comunicación con la base de datos ocurre exclusivamente a través del cliente JavaScript de Supabase.

---

## 3. Requisitos del Sistema

### 3.1 Del lado del cliente (usuario final)

| Requisito | Detalle |
|---|---|
| Navegador web | Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ |
| Conexión a Internet | Requerida para todas las operaciones (el sistema no tiene modo offline) |
| Resolución mínima | 375 px de ancho (compatible con dispositivos móviles) |
| JavaScript | Habilitado (obligatorio; sin JavaScript la aplicación no funciona) |
| Cookies y almacenamiento local | Habilitados (necesarios para persistencia de sesión) |
| Audio (opcional) | Altavoces o auriculares para alertas sonoras de mensajes y notificaciones |

### 3.2 No se requiere

- Instalación de software adicional
- Cuenta en servicios externos (la autenticación con Google es opcional)
- Plugins o extensiones de navegador

---

## 4. Roles y Permisos

El sistema define cuatro niveles de acceso que determinan qué funcionalidades están disponibles para cada tipo de usuario:

| Rol | Descripción | Forma de obtención |
|---|---|---|
| **Visitante** | Usuarios no autenticados. Pueden explorar el catálogo, ver detalles de habilidades y perfiles públicos, pero no pueden interactuar con el sistema. | Por defecto al ingresar sin sesión |
| **Usuario** (`user`) | Usuarios registrados y autenticados. Acceden a todas las funcionalidades colaborativas: publicar habilidades, solicitar intercambios, usar el chat, gestionar clases y calificar. | Automático al registrarse o autenticarse con Google |
| **Moderador** (`moderator`) | Mismo acceso que el usuario más capacidad de eliminar publicaciones de otros usuarios y acceso al Panel de Administración para gestionar cuentas (suspender/levantar suspensión, cambiar rol entre `user` y `moderator`). | Asignado por un administrador desde el Panel de Administración |
| **Administrador** (`admin`) | Nivel máximo de acceso. Todo lo del moderador más la distinción visual "Modo Maestro Activado". En la práctica actual, la asignación del rol `admin` debe hacerse directamente en la base de datos. | Asignación directa en base de datos |

### 4.1 Tabla de permisos por funcionalidad

| Funcionalidad | Visitante | Usuario | Moderador | Admin |
|---|:---:|:---:|:---:|:---:|
| Ver catálogo y habilidades | ✓ | ✓ | ✓ | ✓ |
| Ver perfiles públicos | ✓ | ✓ | ✓ | ✓ |
| Ver valoraciones | ✓ | ✓ | ✓ | ✓ |
| Registrarse / Iniciar sesión | ✓ | — | — | — |
| Publicar habilidades | — | ✓ | ✓ | ✓ |
| Solicitar intercambios | — | ✓ | ✓ | ✓ |
| Gestionar clases y chat | — | ✓ | ✓ | ✓ |
| Calificar clases | — | ✓ (alumno) | ✓ | ✓ |
| Editar perfil propio | — | ✓ | ✓ | ✓ |
| Eliminar habilidades ajenas | — | — | ✓ | ✓ |
| Acceder al Panel Admin | — | — | ✓ | ✓ |
| Suspender/restituir cuentas | — | — | ✓ | ✓ |
| Cambiar roles de usuarios | — | — | ✓* | ✓ |

> \* El Moderador puede cambiar roles entre `user` y `moderator`, pero no puede asignar ni remover el rol `admin`.

---

## 5. Módulo 1 — Autenticación

### 5.1 Registro de nuevo usuario

**Objetivo**  
Permitir que un visitante cree una cuenta en el sistema para acceder a las funcionalidades colaborativas de la plataforma.

**Descripción**  
El formulario de registro recopila los datos básicos del usuario y crea simultáneamente una cuenta de autenticación en Supabase Auth y un registro en la tabla de perfiles. Todos los campos del formulario son obligatorios. Al completarse exitosamente, el usuario queda autenticado de forma inmediata y es redirigido al Panel de Control.

**Requisitos previos**  
- El visitante no debe tener sesión activa en el sistema.
- Disponer de una dirección de correo electrónico no registrada previamente.

**Procedimiento paso a paso**

1. Acceder a la dirección URL de la aplicación. Desde la página de inicio, hacer clic en el botón **"Únete a la comunidad"**. Alternativamente, hacer clic en **"Registrarse"** en la barra de navegación superior.  
   ![Pantalla de inicio - botón Únete a la comunidad](images/home-cta-registro.png)

2. El sistema mostrará el formulario de creación de cuenta.  
   ![Formulario de registro](images/register-formulario.png)

3. Completar el campo **Nombre** con el nombre de pila del usuario.

4. Completar el campo **Apellido** con el apellido del usuario.

5. Completar el campo **Correo electrónico** con una dirección válida y no registrada previamente en el sistema.

6. Completar el campo **Contraseña** con la contraseña deseada.

7. Completar el campo **Ciudad** con la ciudad de residencia.

8. Seleccionar una **Categoría de interés principal** del desplegable disponible. Las opciones son:
   - Tecnología e Informática
   - Idiomas
   - Arte y Diseño
   - Música
   - Deportes y Bienestar
   - Oficios
   - Otros

9. Hacer clic en el botón **"Registrarme"**.

**Resultado esperado**  
El sistema crea la cuenta de usuario, inicia sesión automáticamente y redirige al usuario al Panel de Control (`/dashboard`).

**Validaciones del formulario**

| Campo | Restricción |
|---|---|
| Nombre | Obligatorio, no puede estar vacío |
| Apellido | Obligatorio, no puede estar vacío |
| Correo electrónico | Obligatorio, debe tener formato de email válido |
| Contraseña | Obligatoria, no puede estar vacía |
| Ciudad | Obligatoria, no puede estar vacía |
| Categoría de interés | Obligatoria, debe seleccionar una opción del desplegable |

**Mensajes de error**

| Situación | Mensaje mostrado |
|---|---|
| Algún campo vacío | *"Por favor, completa todos los campos obligatorios."* |
| Correo ya registrado | *"Error al registrar usuario: [mensaje de Supabase]"* |
| Error de conexión | *"Error al registrar usuario: [detalle del error]"* |

**Observaciones**  
- El campo "Categoría de interés" es recopilado por la interfaz pero en la implementación actual no se almacena en el perfil del usuario en la base de datos. Su inclusión en el formulario está prevista para futuras versiones del sistema.
- El sistema no implementa verificación de correo electrónico. El usuario queda autenticado de inmediato tras el registro.
- Para iniciar sesión con Google, consultar la sección [5.3](#53-inicio-de-sesión-con-google).

---

### 5.2 Inicio de sesión con email y contraseña

**Objetivo**  
Permitir que un usuario registrado acceda a su cuenta mediante sus credenciales.

**Descripción**  
El formulario de inicio de sesión verifica las credenciales del usuario contra el servicio de autenticación de Supabase y, de ser válidas, carga el perfil extendido desde la tabla de perfiles y establece la sesión activa.

**Requisitos previos**  
- El usuario debe tener una cuenta previamente creada en el sistema.
- No debe existir una sesión activa.

**Procedimiento paso a paso**

1. Desde cualquier página de la aplicación, hacer clic en **"Iniciar Sesión"** en la barra de navegación, o en el botón **"Ingresar"** si se accede desde la pantalla de inicio.  
   ![Botón Iniciar Sesión en Navbar](images/navbar-login-link.png)

2. El sistema mostrará el formulario de inicio de sesión.  
   ![Formulario de inicio de sesión](images/login-formulario.png)

3. Completar el campo **Correo electrónico** con la dirección registrada.

4. Completar el campo **Contraseña** con la contraseña de la cuenta.

5. Hacer clic en el botón **"Ingresar"**.

**Resultado esperado**  
La sesión queda establecida y el usuario es redirigido al Panel de Control (`/dashboard`).

**Validaciones**

| Campo | Restricción |
|---|---|
| Correo electrónico | Obligatorio, no puede estar vacío |
| Contraseña | Obligatoria, no puede estar vacía |

**Mensajes de error**

| Situación | Mensaje mostrado |
|---|---|
| Algún campo vacío | *"Complete todos los campos obligatorios."* |
| Credenciales incorrectas | *"Email o contraseña incorrectos."* |

**Observaciones**  
- El sistema no ofrece funcionalidad de recuperación de contraseña mediante correo electrónico en la interfaz actual. La recuperación debe gestionarse directamente a través de Supabase si el administrador lo habilita.
- Si el usuario tiene la cuenta suspendida, será autenticado pero verá inmediatamente la pantalla de bloqueo (ver sección [5.6](#56-acceso-bloqueado-por-suspensión)).

---

### 5.3 Inicio de sesión con Google

**Objetivo**  
Ofrecer una vía de autenticación simplificada mediante la cuenta de Google del usuario, sin necesidad de crear credenciales específicas para SkillSwap.

**Descripción**  
Al elegir esta opción, el sistema delega el proceso de autenticación al proveedor OAuth de Google. Tras la autenticación exitosa, Supabase verifica si el usuario ya tiene un perfil en la plataforma. Si no lo tiene (primer acceso), crea automáticamente un perfil con el nombre proveniente de Google y la ciudad por defecto "No especificada".

**Requisitos previos**  
- El usuario debe disponer de una cuenta de Google activa.
- No debe existir una sesión activa en SkillSwap.

**Procedimiento paso a paso**

1. Acceder a la página de inicio de sesión (`/login`) o de registro (`/register`).

2. Hacer clic en el botón **"Google"** (botón blanco con el logo de Google), ubicado debajo del formulario principal.  
   ![Botón de autenticación con Google](images/login-google-button.png)

3. El navegador redirigirá a la pantalla de selección de cuenta de Google.

4. Seleccionar la cuenta de Google deseada e ingresar las credenciales si se solicitan.

5. Aprobar los permisos de acceso requeridos por la aplicación.

**Resultado esperado**  
El usuario es redirigido de vuelta a la aplicación, en la ruta `/dashboard`, con la sesión activa.

**Validaciones**  
No aplican validaciones del lado de SkillSwap; Google gestiona la verificación de identidad.

**Mensajes de error**

| Situación | Mensaje mostrado |
|---|---|
| Error en el proceso OAuth | *"Error al iniciar sesión con Google."* (en `/login`) |
| Error en registro OAuth | *"Error al registrarse con Google."* (en `/register`) |

**Observaciones**  
- El perfil creado automáticamente para usuarios de Google utilizará el nombre completo provisto por Google. La ciudad quedará como "No especificada" y deberá actualizarse desde los Ajustes de Perfil (ver sección [12.2](#122-editar-datos-de-perfil)).
- Si el usuario ya registró una cuenta con el mismo correo mediante email/contraseña, el comportamiento depende de la configuración del proyecto en Supabase.

---

### 5.4 Cierre de sesión

**Objetivo**  
Finalizar la sesión activa del usuario de forma segura.

**Descripción**  
Al cerrar sesión, el sistema invalida el token de autenticación en Supabase y limpia el estado de usuario en la aplicación, redirigiendo al visitante a la página de inicio.

**Requisitos previos**  
- Debe existir una sesión activa.

**Procedimiento paso a paso**

1. Hacer clic en el botón **"Salir"** ubicado en la parte derecha de la barra de navegación.  
   ![Botón Salir en la barra de navegación](images/navbar-logout.png)

2. En dispositivos móviles, abrir el menú hamburguesa (☰) y seleccionar **"Salir"**.

**Resultado esperado**  
La sesión es cerrada y el usuario es redirigido a la página de inicio (`/`). La barra de navegación mostrará nuevamente las opciones para visitantes ("Iniciar Sesión" y "Registrarse").

**Mensajes de error**  
No aplican.

**Observaciones**  
La acción es inmediata y no solicita confirmación.

---

### 5.5 Mantenimiento automático de sesión

**Objetivo**  
Preservar la sesión activa del usuario sin interrupciones ante cambios de pestaña o periodos de inactividad.

**Descripción**  
El sistema implementa dos mecanismos automáticos de mantenimiento de sesión que operan en segundo plano sin intervención del usuario:

- **Escucha de eventos de autenticación**: El sistema se suscribe al canal `onAuthStateChange` de Supabase para detectar cambios de estado de sesión en tiempo real.
- **Refresco al enfocar la pestaña**: Al volver a la pestaña del navegador, el sistema verifica si el token de autenticación está próximo a vencer (menos de 5 minutos). De ser así, lo refresca automáticamente.

**Resultado esperado**  
El usuario permanece autenticado durante toda su sesión de trabajo sin necesidad de reiniciar sesión manualmente.

**Observaciones**  
- Si el servicio de Supabase no responde en un plazo de 2 segundos durante la carga inicial, el sistema continúa el renderizado de la aplicación sin sesión activa, evitando que la pantalla quede bloqueada.
- El token de sesión se almacena localmente en el navegador bajo la clave `skillswap-auth`.

---

### 5.6 Acceso bloqueado por suspensión

**Objetivo**  
Impedir que usuarios suspendidos por un administrador puedan interactuar con la plataforma.

**Descripción**  
Si un usuario con cuenta suspendida intenta iniciar sesión, el sistema autentica correctamente al usuario pero, al cargar el perfil, detecta el campo `is_banned = true` y muestra una pantalla de bloqueo que impide el acceso a cualquier funcionalidad de la aplicación.

**Resultado esperado**  
El usuario ve una pantalla con el mensaje **"Cuenta Suspendida"** y la leyenda: *"Tu cuenta ha sido suspendida por un administrador debido a infracciones de los términos de servicio."* Solo se ofrece el botón **"Cerrar Sesión"**.

![Pantalla de cuenta suspendida](images/cuenta-suspendida.png)

**Observaciones**  
- La suspensión puede ser levantada por un administrador o moderador desde el Panel de Administración (ver sección [14.3](#143-levantar-suspensión-de-usuario)).
- Mientras la cuenta está suspendida, no es posible acceder a ninguna sección de la aplicación.

---

## 6. Módulo 2 — Catálogo de Habilidades

### 6.1 Explorar habilidades disponibles

**Objetivo**  
Permitir a cualquier visitante o usuario descubrir las habilidades publicadas por la comunidad.

**Descripción**  
El catálogo presenta en formato de cuadrícula todas las habilidades publicadas activamente en la plataforma. Cada tarjeta (*card*) muestra el título de la habilidad, su categoría, nivel, descripción resumida, el nombre del propietario, su ciudad, la modalidad de enseñanza y el rating promedio del propietario (si tiene valoraciones). Al hacer clic en una tarjeta, se accede al detalle completo de la habilidad.

**Requisitos previos**  
No aplican. El catálogo es de acceso público.

**Procedimiento paso a paso**

1. Hacer clic en **"Explorar"** en la barra de navegación, o en **"Explorar habilidades"** en la página de inicio.  
   El sistema redirigirá a `/catalog`.  
   ![Catálogo de habilidades - vista general](images/catalog-grid.png)

2. Desplazarse verticalmente por la cuadrícula para explorar las habilidades disponibles.

3. Observar en cada tarjeta:
   - **Badge de categoría** (en tono violeta)
   - **Badge de nivel** (en tono rosa): Básico / Intermedio / Avanzado
   - **Título** de la habilidad
   - **Descripción** resumida (máximo 3 líneas)
   - **Nombre del propietario** (con enlace al perfil público)
   - **Ciudad** del propietario
   - **Modalidad**: virtual, presencial o híbrido
   - **Rating promedio** en estrellas (⭐) o badge "Nuevo" si no tiene valoraciones

4. Para acceder al detalle, hacer clic en cualquier zona de la tarjeta.

**Resultado esperado**  
Se carga la página de detalle de la habilidad seleccionada (`/skill/:id`).

**Mensajes del sistema**

| Situación | Mensaje |
|---|---|
| Cargando datos | *"Cargando habilidades..."* (texto animado con pulso) |
| Sin resultados | *"No hay habilidades que coincidan con tu búsqueda."* |

**Observaciones**  
- El catálogo carga todas las habilidades disponibles en una única consulta, sin paginación. Ante un volumen muy alto de publicaciones, el tiempo de carga puede incrementarse.
- Los usuarios con rol administrador o moderador verán un icono de papelera (🗑️) en la esquina superior derecha de cada tarjeta, que permite eliminar la publicación.

---

### 6.2 Buscar por palabra clave

**Objetivo**  
Localizar habilidades específicas mediante búsqueda textual sobre el título y la descripción.

**Descripción**  
El campo de búsqueda aplica un filtro en tiempo real sobre los datos ya cargados en el navegador. No genera una nueva consulta al servidor.

**Requisitos previos**  
Estar en la página del catálogo (`/catalog`).

**Procedimiento paso a paso**

1. En la parte superior del catálogo, localizar el campo de búsqueda con el ícono de lupa 🔍.  
   ![Campo de búsqueda en catálogo](images/catalog-search.png)

2. Escribir la palabra o frase a buscar.  
   El sistema actualiza la cuadrícula de forma inmediata mientras se escribe.

**Resultado esperado**  
Solo se muestran las tarjetas cuyo título o descripción contengan el texto ingresado (sin distinción de mayúsculas y minúsculas).

**Observaciones**  
- La búsqueda es local (client-side). No realiza una nueva consulta a la base de datos.
- Para limpiar la búsqueda, borrar el texto del campo o usar el botón "Limpiar" si hay otros filtros activos.

---

### 6.3 Filtrar por categoría

**Objetivo**  
Acotar el listado de habilidades a una categoría temática específica.

**Descripción**  
Un selector desplegable permite filtrar las habilidades por su categoría principal. Las categorías disponibles reflejan las registradas en el sistema al momento de publicar una habilidad.

**Requisitos previos**  
Estar en la página del catálogo (`/catalog`).

**Procedimiento paso a paso**

1. Localizar el desplegable con ícono de filtro (🔽), junto al campo de búsqueda.  
   ![Desplegable de categorías](images/catalog-category-filter.png)

2. Seleccionar una de las categorías disponibles:
   - Todas las categorías *(muestra todo)*
   - Tecnología
   - Idiomas
   - Arte y Diseño
   - Música
   - Deportes
   - Oficios
   - Otros

**Resultado esperado**  
Solo se muestran habilidades de la categoría seleccionada. El filtro puede combinarse con la búsqueda por texto.

---

### 6.4 Filtros avanzados

**Objetivo**  
Refinar los resultados del catálogo mediante criterios adicionales de nivel, modalidad y ubicación geográfica del propietario.

**Descripción**  
El panel de filtros avanzados se despliega al pulsar el botón **"Filtros"** y ofrece tres criterios adicionales que pueden combinarse entre sí y con los filtros básicos.

**Requisitos previos**  
Estar en la página del catálogo (`/catalog`).

**Procedimiento paso a paso**

1. Hacer clic en el botón **"Filtros"** (ícono de controles deslizantes ⚙️) ubicado junto al selector de categorías.  
   El panel se desplegará con animación.  
   ![Panel de filtros avanzados](images/catalog-advanced-filters.png)

2. Seleccionar el **Nivel** deseado:
   - Todos los niveles
   - Básico
   - Intermedio
   - Avanzado

3. Seleccionar la **Modalidad** deseada:
   - Todas las modalidades
   - Virtual
   - Presencial
   - Híbrido

4. Escribir una **Ubicación (Ciudad)** para filtrar por la ciudad del propietario de la habilidad. El filtro aplica coincidencia parcial (no requiere nombre exacto).

**Resultado esperado**  
La cuadrícula muestra solo las habilidades que cumplen simultáneamente todos los criterios activos.

**Observaciones**  
- Los filtros básicos (búsqueda + categoría) y avanzados (nivel + modalidad + ciudad) son acumulativos: todos se aplican al mismo tiempo.
- El botón **"Filtros"** se resalta en color violeta cuando el panel está abierto.

---

### 6.5 Limpiar filtros

**Objetivo**  
Restablecer todos los filtros activos y volver a mostrar el catálogo completo.

**Descripción**  
Un botón de limpieza aparece automáticamente en la interfaz cuando hay al menos un filtro activo. Al pulsarlo, todos los criterios de filtrado se restablecen simultáneamente.

**Requisitos previos**  
Debe haber al menos un filtro activo en el catálogo.

**Procedimiento paso a paso**

1. Verificar que el botón **"Limpiar"** (con ícono ✕) esté visible junto a los controles de filtrado.  
   ![Botón limpiar filtros](images/catalog-clear-filters.png)

2. Hacer clic en **"Limpiar"**.

**Resultado esperado**  
Todos los campos de filtrado quedan vacíos y el catálogo muestra nuevamente todas las habilidades disponibles.

---

## 7. Módulo 3 — Gestión de Habilidades

### 7.1 Ver detalle de una habilidad

**Objetivo**  
Acceder a la información completa de una habilidad para evaluarla antes de solicitar un intercambio.

**Descripción**  
La página de detalle presenta todos los atributos de la habilidad, información del propietario con su rating, las condiciones del intercambio y las valoraciones de la comunidad sobre el propietario.

**Requisitos previos**  
No aplican. La página es pública.

**Procedimiento paso a paso**

1. Desde el catálogo, hacer clic en la tarjeta de la habilidad deseada.  
   La URL cambia a `/skill/:id`.  
   ![Detalle de habilidad](images/skill-detail.png)

2. Revisar la información disponible:
   - **Categoría** de la habilidad (badge superior)
   - **Título** completo
   - **Propietario**: nombre + avatar + ciudad + rating (clic navega al perfil)
   - **Descripción** completa
   - **Detalles del intercambio**: Modalidad, Nivel, Disponibilidad
   - **Valoraciones de la Comunidad**: reseñas previas recibidas por el propietario

**Resultado esperado**  
El usuario dispone de toda la información necesaria para decidir si solicitar el intercambio.

**Observaciones**  
- Si la habilidad no existe o fue eliminada, el sistema muestra el mensaje *"Habilidad no encontrada"* con un botón para volver al catálogo.
- El botón disponible en la columna derecha varía según el rol y la relación del usuario con la habilidad (ver secciones [7.4](#74-eliminar-propia-habilidad), [7.5](#75-eliminar-habilidad-ajena-moderación) y [8.1](#81-enviar-solicitud-de-intercambio)).

---

### 7.2 Publicar una nueva habilidad

**Objetivo**  
Ofrecer a la comunidad una habilidad que el usuario desea enseñar, para que otros usuarios puedan solicitar un intercambio.

**Descripción**  
El formulario de publicación permite al usuario describir su habilidad e indicar cuándo está disponible para enseñarla. La disponibilidad se configura mediante un selector de calendario interactivo (ver sección [7.3](#73-agendar-disponibilidad-horaria)).

**Requisitos previos**  
- El usuario debe tener sesión activa.

**Procedimiento paso a paso**

1. Acceder al Panel de Control (`/dashboard`).

2. Hacer clic en el botón **"Publicar Habilidad"** (visible en el panel lateral izquierdo o en el área principal cuando no hay habilidades publicadas).  
   Se abrirá un modal superpuesto.  
   ![Modal de publicación de habilidad](images/dashboard-publish-modal.png)

3. Completar el campo **Título de la habilidad** (ej. "Clases de Guitarra Acústica").

4. Completar el campo **Descripción** (cuadro de texto grande): explicar qué se ofrece, metodología, requisitos previos del alumno, etc.

5. Seleccionar la **Categoría** en el desplegable correspondiente.

6. Seleccionar la **Modalidad** (Virtual / Presencial / Híbrido).

7. Seleccionar el **Nivel** de la habilidad (Básico / Intermedio / Avanzado).

8. Hacer clic en el campo **Disponibilidad** para abrir el selector de calendario y agendar los días y horarios disponibles (ver sección [7.3](#73-agendar-disponibilidad-horaria)). Este campo es **obligatorio**.

9. Hacer clic en **"Publicar Habilidad"** para confirmar.

**Resultado esperado**  
La habilidad queda publicada en el catálogo y aparece en la pestaña "Mis Habilidades" del Panel de Control.

**Validaciones**

| Campo | Restricción |
|---|---|
| Título | Obligatorio |
| Descripción | Obligatoria |
| Categoría | Obligatoria |
| Modalidad | Obligatoria |
| Nivel | Obligatorio (debe seleccionar una opción) |
| Disponibilidad | Obligatoria (debe tener al menos un slot agendado) |

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Sin disponibilidad configurada | *"Por favor, agenda al menos una fecha y horario de disponibilidad."* |
| Error de base de datos | *"Error al publicar la habilidad"* |

**Observaciones**  
- No existe funcionalidad de edición de habilidades ya publicadas. Si se requiere modificar una habilidad, se debe eliminar y volver a publicarla.

---

### 7.3 Agendar disponibilidad horaria

**Objetivo**  
Indicar en qué fechas y rangos horarios el usuario estará disponible para impartir la habilidad publicada.

**Descripción**  
El selector de disponibilidad es un calendario interactivo que permite al usuario elegir múltiples fechas y definir uno o varios rangos horarios por fecha. La información se almacena como un string formateado que luego es utilizado para la generación automática de clases al aceptarse una solicitud.

**Requisitos previos**  
El modal de publicación de habilidad debe estar abierto.

**Procedimiento paso a paso**

1. En el modal de publicación, hacer clic en el campo **"Agendar disponibilidad..."**.  
   Se abre un nuevo modal con el calendario.  
   ![Modal de agendar disponibilidad](images/dashboard-calendar-modal.png)

2. Navegar entre meses usando las flechas **← →** ubicadas junto al nombre del mes.

3. Hacer clic en el día deseado. Solo se pueden seleccionar días **iguales o posteriores a hoy** (los días pasados aparecen atenuados e inactivos).

4. En el panel derecho, se mostrarán los controles de horario para el día seleccionado:
   - Seleccionar la **Hora de Inicio** (campo tipo `time`)
   - Seleccionar la **Hora de Fin** (campo tipo `time`)

5. Hacer clic en **"Añadir Horario"** para registrar el slot.

6. Repetir los pasos 3 a 5 para cada combinación de fecha y horario deseada.

7. Los slots agendados aparecen en la lista inferior del panel derecho, con opción de eliminación individual (ícono 🗑️).

8. Al finalizar, hacer clic en **"Confirmar Disponibilidad"**.  
   El modal de calendario se cierra y el campo de disponibilidad en el formulario principal queda actualizado.

**Resultado esperado**  
El campo "Disponibilidad" en el formulario de publicación muestra las fechas y horarios configurados en formato legible (ej. "22 jun (09:00-11:00), 25 jun (14:00-17:00)").

**Validaciones**

| Regla | Descripción |
|---|---|
| No se permiten fechas pasadas | Los días anteriores a hoy están deshabilitados |
| Hora fin > Hora inicio | Si la hora de fin es igual o anterior a la hora de inicio, se muestra una alerta |

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Hora fin ≤ Hora inicio | *"La hora de fin debe ser posterior a la hora de inicio"* |

**Observaciones**  
- Los días con al menos un slot agendado se marcan con un punto violeta parpadeante en el calendario.
- Los slots se ordenan cronológicamente en la lista de resumen.

---

### 7.4 Eliminar propia habilidad

**Objetivo**  
Retirar del catálogo una habilidad publicada por el propio usuario.

**Descripción**  
El propietario de una habilidad puede eliminarla tanto desde la página de detalle como (indirectamente, al ser redirigido) desde el Panel de Control. La eliminación es permanente e inmediata.

**Requisitos previos**  
- El usuario debe ser propietario de la habilidad.
- Sesión activa.

**Procedimiento paso a paso**

1. Navegar al detalle de la habilidad a eliminar (`/skill/:id`).

2. En la columna derecha, hacer clic en el botón **"Borrar Habilidad"** (ícono de alerta ⚠️ en color rojo).  
   ![Botón Borrar Habilidad](images/skill-detail-delete-button.png)

3. El navegador mostrará un diálogo de confirmación: *"¿Estás seguro de que deseas borrar esta habilidad? Esta acción no se puede deshacer."*

4. Confirmar haciendo clic en **Aceptar**.

**Resultado esperado**  
La habilidad es eliminada de la base de datos. El usuario es redirigido al Panel de Control (`/dashboard`).

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error en la eliminación | *"Hubo un error al borrar la habilidad."* |

**Observaciones**  
- La eliminación es permanente. No existe papelera de reciclaje ni opción de recuperación.
- Durante el proceso de eliminación, el botón muestra el texto *"Borrando..."* y queda deshabilitado para evitar doble envío.

---

### 7.5 Eliminar habilidad ajena (moderación)

**Objetivo**  
Permitir a administradores y moderadores retirar del sistema publicaciones que incumplan las normas de la comunidad.

**Descripción**  
Los usuarios con rol `admin` o `moderator` visualizan controles adicionales de eliminación sobre habilidades ajenas, tanto en el catálogo como en la página de detalle.

**Requisitos previos**  
- Sesión activa con rol `admin` o `moderator`.

**Desde el catálogo:**

1. Localizar la tarjeta de la habilidad a eliminar.
2. Hacer clic en el ícono 🗑️ ubicado en la esquina superior derecha de la tarjeta.  
   ![Botón moderación en catálogo](images/catalog-mod-delete.png)
3. Confirmar en el diálogo: *"¿Estás seguro de que deseas borrar esta publicación? Como moderador esta acción es permanente."*

**Desde el detalle de habilidad:**

1. Navegar a `/skill/:id`.
2. Hacer clic en **"Borrar Habilidad"** (aparece para admin/mod incluso en habilidades ajenas).
3. Confirmar en el diálogo de confirmación.

**Resultado esperado**  
- Desde el catálogo: la tarjeta desaparece del listado.
- Desde el detalle: el usuario es redirigido al catálogo.

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error en eliminación (catálogo) | *"Error al borrar la publicación."* |
| Error en eliminación (detalle) | *"Hubo un error al borrar la habilidad."* |

---

## 8. Módulo 4 — Solicitudes de Intercambio

### 8.1 Enviar solicitud de intercambio

**Objetivo**  
Proponer a otro usuario un intercambio de habilidades, ofreciendo a cambio los propios conocimientos.

**Descripción**  
El usuario interesado en una habilidad envía una solicitud al propietario junto con un mensaje que describe qué habilidad ofrece a cambio. El sistema verifica que el solicitante tenga créditos de tiempo disponibles antes de permitir la acción.

**Requisitos previos**  
- Sesión activa.
- El usuario no debe ser el propietario de la habilidad.
- El usuario debe tener al menos 1 crédito de tiempo disponible.

**Procedimiento paso a paso**

1. Desde el detalle de la habilidad (`/skill/:id`), hacer clic en el botón **"Solicitar Intercambio"** (columna derecha).  
   Si el usuario no tiene sesión, será redirigido al login.  
   ![Botón Solicitar Intercambio](images/skill-detail-request-button.png)

2. Se abrirá un modal con el formulario de propuesta.  
   ![Modal Proponer Intercambio](images/skill-detail-request-modal.png)

3. En el área de texto, escribir un mensaje dirigido al propietario. Se recomienda:
   - Presentarse brevemente.
   - Indicar qué habilidad se ofrece a cambio.
   - Detallar la disponibilidad propia.

4. Hacer clic en **"Confirmar Envío"**.

**Resultado esperado**  
La solicitud queda registrada con estado **pendiente** (*pending*). Se muestra brevemente el ícono de éxito (✓ verde) y el usuario es redirigido al catálogo en 2 segundos.

**Validaciones**

| Regla | Descripción |
|---|---|
| Créditos suficientes | Si `time_credits = 0`, se bloquea la apertura del modal |
| Mensaje no vacío | El campo de texto es obligatorio para habilitar el botón de confirmación |

**Mensajes de error / sistema**

| Situación | Mensaje |
|---|---|
| Sin créditos disponibles | *"No tienes suficientes créditos de tiempo. Por favor, ofrece e imparte una clase para ganar créditos y poder solicitar intercambios."* |
| Error al enviar | *"Hubo un error al enviar la solicitud."* |
| Envío exitoso | Ícono ✓ verde + *"¡Solicitud Enviada! El usuario recibirá tu propuesta pronto."* |

**Observaciones**  
- Durante el envío, el botón muestra *"Enviando..."* y queda deshabilitado.
- El propietario recibirá una notificación en tiempo real con la solicitud.

---

### 8.2 Ver solicitudes recibidas

**Objetivo**  
Consultar las solicitudes de intercambio que otros usuarios han enviado sobre habilidades propias.

**Descripción**  
La pestaña "Solicitudes Recibidas" del Panel de Control lista todas las solicitudes entrantes con el estado actual de cada una y el mensaje de propuesta del solicitante.

**Requisitos previos**  
- Sesión activa.
- Tener al menos una habilidad publicada.

**Procedimiento paso a paso**

1. Acceder al Panel de Control (`/dashboard`).
2. En el menú lateral izquierdo, hacer clic en **"Solicitudes Recibidas"**.  
   Si hay solicitudes pendientes, se mostrará un badge rojo con la cantidad.  
   ![Pestaña Solicitudes Recibidas](images/dashboard-requests-in.png)

3. Revisar la lista. Cada solicitud muestra:
   - Nombre del solicitante
   - Habilidad solicitada (nombre)
   - Mensaje de propuesta del solicitante

**Resultado esperado**  
Vista de todas las solicitudes recibidas con estado visual diferenciado (pendiente, aceptada, rechazada).

---

### 8.3 Aceptar una solicitud

**Objetivo**  
Confirmar la disponibilidad para enseñar la habilidad y dar inicio al intercambio con el solicitante.

**Descripción**  
Al aceptar una solicitud, el sistema realiza tres acciones de forma automática: actualiza el estado de la solicitud a "aceptada", genera las clases correspondientes en base a la disponibilidad definida en la habilidad, y redirige a la pantalla de chat con el solicitante.

**Requisitos previos**  
- El usuario debe ser el receptor de la solicitud.
- La solicitud debe estar en estado **pendiente**.

**Procedimiento paso a paso**

1. En la pestaña "Solicitudes Recibidas", localizar la solicitud en estado **pendiente**.

2. Hacer clic en el botón verde **"✓ Aceptar"**.  
   ![Botones de acción en solicitud](images/dashboard-request-actions.png)

3. El sistema actualiza el estado y redirige automáticamente al chat de ese intercambio.

**Resultado esperado**  
- Estado de la solicitud → **aceptada**.
- Clases generadas automáticamente según la disponibilidad de la habilidad.
- Navegación inmediata al chat de la solicitud (`/messages/:id`).

**Observaciones**  
- La generación de clases depende de los slots de disponibilidad configurados en la habilidad. Si no se configuró disponibilidad, no se generarán clases automáticamente, pero el chat sí estará disponible.
- Una vez aceptada o rechazada, la solicitud no puede volver al estado pendiente.

---

### 8.4 Rechazar una solicitud

**Objetivo**  
Declinar una propuesta de intercambio sin necesidad de justificación.

**Requisitos previos**  
- El usuario debe ser el receptor de la solicitud.
- La solicitud debe estar en estado **pendiente**.

**Procedimiento paso a paso**

1. En la pestaña "Solicitudes Recibidas", localizar la solicitud pendiente.
2. Hacer clic en el botón rojo con ícono **✕ (Rechazar)**.

**Resultado esperado**  
El estado de la solicitud cambia a **rechazada**. La tarjeta de la solicitud muestra el badge rojo "Rechazada". No se genera ningún chat ni clase.

---

### 8.5 Consultar solicitudes enviadas

**Objetivo**  
Hacer seguimiento del estado de las solicitudes de intercambio enviadas a otros usuarios.

**Procedimiento paso a paso**

1. En el Panel de Control, hacer clic en **"Mis Solicitudes"** en el menú lateral.  
   ![Pestaña Mis Solicitudes](images/dashboard-requests-out.png)

2. Revisar el listado. Cada solicitud muestra:
   - Nombre del receptor
   - Habilidad solicitada
   - Mensaje enviado (en formato cursiva)
   - Estado actual: **Pendiente** (amarillo) / **Aceptada** (verde) / **Rechazada** (rojo)

3. Si una solicitud fue aceptada, aparecerá el botón 💬 para ir al chat del intercambio.

**Resultado esperado**  
Vista actualizada del estado de todas las solicitudes enviadas por el usuario.

---

## 9. Módulo 5 — Gestión de Clases

### 9.1 Ver calendario de intercambios agendados

**Objetivo**  
Visualizar de forma gráfica y organizada todas las clases agendadas del usuario en el tiempo.

**Descripción**  
La pestaña "Mis Intercambios" del Panel de Control muestra un calendario mensual navegable donde cada día con clases programadas se indica mediante puntos de color: **violeta** para clases en las que el usuario actúa como profesor, **verde** para clases en las que actúa como alumno.

**Requisitos previos**  
- Sesión activa.
- Tener al menos un intercambio aceptado con clases generadas.

**Procedimiento paso a paso**

1. En el Panel de Control, hacer clic en **"Mis Intercambios"** en el menú lateral.  
   ![Calendario de intercambios](images/dashboard-exchanges-calendar.png)

2. Navegar entre meses con las flechas **‹** y **›** en la esquina superior del calendario.

3. Identificar los días marcados:
   - **Punto violeta**: el usuario tiene clase como **profesor** ese día
   - **Punto verde**: el usuario tiene clase como **alumno** ese día
   - **Punto gris**: clase cancelada (sin clases activas ese día)
   - **Sin punto**: sin clases ese día

4. El día actual aparece resaltado con un borde violeta.

**Leyenda del calendario**  
![Leyenda del calendario](images/calendar-legend.png)

---

### 9.2 Consultar clases de un día

**Objetivo**  
Ver el detalle de todas las clases programadas en una fecha específica y acceder a las acciones disponibles para cada una.

**Procedimiento paso a paso**

1. En el calendario de la pestaña "Mis Intercambios", hacer clic sobre el día deseado.  
   El día queda resaltado en violeta oscuro.

2. En el panel lateral derecho aparecerán todas las clases de ese día.  
   ![Detalle de clases por día](images/dashboard-day-detail.png)

3. Para cada clase se muestra:
   - **Título de la habilidad**
   - **Rol**: "Clase por dar (Profesor)" o "Clase por recibir (Alumno)"
   - **Estado**: Agendada / Reprogramada / Completada / Cancelada
   - **Nombre del compañero**
   - **Horario** (rango, ej. "14:00 - 16:00")
   - **Acciones disponibles** según estado

**Resultado esperado**  
Panel lateral con detalle completo de las clases del día seleccionado.

---

### 9.3 Marcar clase como completada

**Objetivo**  
Registrar que una clase se impartió correctamente, activar la transferencia de crédito de tiempo y habilitar la posibilidad de dejar una valoración.

**Descripción**  
Al marcar una clase como completada, el sistema invoca la función `complete_class` en la base de datos, que transfiere 1 crédito de tiempo del alumno al profesor. Si quien confirma la completitud es el alumno, el sistema abre automáticamente el modal de valoración.

**Requisitos previos**  
- La clase debe estar en estado activo (agendada o reprogramada).
- Sesión activa.

**Procedimiento paso a paso**

1. En el panel de detalle del día, localizar la clase a completar.

2. Hacer clic en el botón verde **"Marcar como Completada"**.  
   ![Botón marcar como completada](images/class-complete-button.png)

3. El navegador mostrará un diálogo de confirmación: *"¿Estás seguro de que deseas marcar esta clase como finalizada? Esto transferirá 1 crédito de tiempo del alumno al profesor."*

4. Confirmar con **Aceptar**.

**Resultado esperado**  
- El estado de la clase cambia a **completada** (badge verde).
- 1 crédito de tiempo es debitado del alumno y acreditado al profesor.
- El contador de créditos en la barra de navegación se actualiza automáticamente.
- Si el usuario es el alumno, se abre el modal de valoración (ver sección [11.1](#111-calificar-al-profesor-tras-completar-clase)).

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error en RPC | *"Hubo un error al completar la clase: [detalle]"* |

**Observaciones**  
- Cualquiera de los dos participantes (profesor o alumno) puede marcar la clase como completada.
- Una clase marcada como completada no puede ser revertida a estado activo desde la interfaz.

---

### 9.4 Reprogramar una clase

**Objetivo**  
Modificar la fecha y el horario de una clase agendada, notificando al compañero del cambio a través del chat.

**Requisitos previos**  
- La clase debe estar en estado activo (agendada o reprogramada).

**Procedimiento paso a paso**

1. En el panel de detalle del día, hacer clic en el botón amarillo **"Reprogramar"**.  
   Se abre un modal de reprogramación.  
   ![Modal de reprogramación](images/class-reschedule-modal.png)

2. En el campo **"Nueva Fecha"**, seleccionar la nueva fecha mediante el selector de fecha. Solo se permiten fechas iguales o posteriores a hoy.

3. En el campo **"Nuevo Horario (Rango)"**, ingresar el nuevo rango horario en formato libre (ej. `14:00 - 16:00`).

4. Hacer clic en **"Confirmar Cambio"**.

**Resultado esperado**  
- El estado de la clase cambia a **reprogramada** (badge amarillo).
- Se envía automáticamente un mensaje al chat del intercambio con el texto: *"[Nombre del usuario] ha reprogramado la clase del día [fecha anterior] para el día [nueva fecha] en el horario [nuevo horario]."*

**Validaciones**

| Regla | Descripción |
|---|---|
| Fecha mínima | No puede seleccionarse una fecha anterior a hoy |

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Fecha pasada ingresada | *"No puedes reprogramar una clase para una fecha anterior a hoy."* |
| Error en base de datos | *"Hubo un error al reprogramar la clase."* |

---

### 9.5 Cancelar una clase

**Objetivo**  
Anular una clase agendada e informar al compañero a través del chat.

**Requisitos previos**  
- La clase debe estar en estado activo.

**Procedimiento paso a paso**

1. En el panel de detalle del día, hacer clic en el botón rojo **"Cancelar"**.

2. Confirmar en el diálogo: *"¿Estás seguro de que deseas cancelar esta clase?"*

**Resultado esperado**  
- El estado de la clase cambia a **cancelada** (badge rojo).
- Se envía automáticamente un mensaje al chat: *"[Nombre del usuario] ha cancelado la clase del día [fecha]."*
- El indicador del día en el calendario cambia al punto gris.

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error en base de datos | *"Hubo un error al cancelar la clase."* |

---

### 9.6 Unirse al aula virtual

**Objetivo**  
Acceder a la sala de videoconferencia asociada a una clase con modalidad virtual o híbrida.

**Descripción**  
El sistema genera automáticamente una sala de videoconferencia única por clase utilizando la plataforma Jit.si, que es gratuita y no requiere registro. La URL de la sala sigue el patrón `meet.jit.si/SkillSwap_Class_{id_de_la_clase}`.

**Requisitos previos**  
- La clase debe ser de modalidad **virtual** o **híbrido**.
- La clase debe estar en estado activo (no cancelada ni completada).

**Procedimiento paso a paso**

1. En el panel de detalle del día, localizar la clase virtual o híbrida.
2. Hacer clic en el botón **"Entrar al Aula Virtual"** (degradado violeta-rosa).  
   ![Botón Aula Virtual](images/class-virtual-room-button.png)
3. El navegador abrirá la sala de Jit.si en una nueva pestaña.

**Resultado esperado**  
Sala de videoconferencia abierta. Ambos participantes (profesor y alumno) deben ingresar a la misma URL para unirse a la videollamada.

**Observaciones**  
- No se requiere cuenta ni instalación de aplicaciones. Jit.si funciona directamente en el navegador.
- La sala es única para cada clase y no está protegida con contraseña. Cualquier persona con el enlace puede ingresar.
- Las clases presenciales no muestran este botón.

---

### 9.7 Añadir clase a Google Calendar

**Objetivo**  
Registrar una clase en el calendario personal de Google del usuario para recibir recordatorios automáticos.

**Requisitos previos**  
- Cuenta de Google activa (del usuario, no de la plataforma).
- La clase debe estar en estado activo.

**Procedimiento paso a paso**

1. En el panel de detalle del día, localizar la clase a agendar.
2. Hacer clic en el botón azul **"Añadir a Google Calendar"**.  
   ![Botón Google Calendar](images/class-google-calendar-button.png)
3. El navegador abrirá Google Calendar en una nueva pestaña con los datos de la clase pre-completados (título, fecha, hora, descripción y ubicación/link del aula virtual).
4. Confirmar la creación del evento en Google Calendar.

**Resultado esperado**  
El evento queda registrado en el calendario de Google del usuario con los datos de la clase.

**Observaciones**  
- Esta acción requiere que el usuario esté conectado a su cuenta de Google en el mismo navegador.
- La ubicación del evento será el enlace a Jit.si para clases virtuales o híbridas, y el texto "Presencial" para clases presenciales.

---

## 10. Módulo 6 — Mensajes y Chat

### 10.1 Acceder al chat de un intercambio

**Objetivo**  
Abrir el canal de comunicación directa con el compañero de intercambio.

**Descripción**  
El chat está vinculado a una solicitud de intercambio específica y está disponible únicamente para los dos participantes de esa solicitud. Cada chat es independiente por intercambio.

**Requisitos previos**  
- La solicitud debe haber sido aceptada.
- Sesión activa.
- El usuario debe ser participante del intercambio.

**Procedimiento paso a paso**

**Opción A — Desde Solicitudes Recibidas:**
Al aceptar una solicitud, el sistema redirige automáticamente al chat.

**Opción B — Desde Solicitudes Recibidas/Enviadas:**
1. En el Panel de Control, ir a "Solicitudes Recibidas" o "Mis Solicitudes".
2. Localizar una solicitud con estado "Aceptada".
3. Hacer clic en el botón 💬 (ícono de chat).

**Opción C — Desde Notificaciones:**
Hacer clic en una notificación relacionada con el intercambio (si contiene enlace).

**Resultado esperado**  
El sistema navega a `/messages/:id` y carga el historial completo de mensajes del intercambio.  
![Chat de intercambio](images/messages-chat.png)

**Mensajes del sistema**

| Situación | Mensaje |
|---|---|
| Cargando | *"Cargando chat..."* |
| Solicitud no encontrada | Redirige al Dashboard automáticamente |

---

### 10.2 Enviar mensaje

**Objetivo**  
Comunicarse con el compañero de intercambio durante el proceso de coordinación y enseñanza.

**Descripción**  
El campo de mensaje se ubica en la parte inferior del chat. Al enviar, el mensaje aparece instantáneamente del lado derecho (propio) mediante actualización optimista, sin necesidad de esperar la confirmación del servidor.

**Requisitos previos**  
- El intercambio no debe estar en estado **completado**.

**Procedimiento paso a paso**

1. En la pantalla de chat, hacer clic en el campo de texto *"Escribe un mensaje..."*.
2. Escribir el mensaje deseado.
3. Presionar **Enter** o hacer clic en el botón de enviar (ícono de avión de papel ✈️).  
   ![Campo de entrada de mensajes](images/messages-input.png)

**Resultado esperado**  
El mensaje aparece inmediatamente en el área del chat, alineado a la derecha, con la hora de envío. El receptor lo recibirá en tiempo real.

**Validaciones**

| Regla | Descripción |
|---|---|
| Mensaje no vacío | El botón de envío está deshabilitado si el campo está vacío |
| Intercambio activo | El campo está deshabilitado si el estado es `completed` |

**Observaciones**  
- El primer elemento visible en el chat es el mensaje original de la solicitud de intercambio (en cursiva), con el encabezado "Mensaje de solicitud original".
- Si el envío falla a nivel de servidor, el mensaje optimista es eliminado automáticamente.

---

### 10.3 Recibir mensajes en tiempo real

**Objetivo**  
Recibir los mensajes del compañero de intercambio sin necesidad de recargar la página.

**Descripción**  
El chat se suscribe a cambios en la base de datos mediante Supabase Realtime. Cuando el compañero envía un mensaje, este aparece automáticamente en la pantalla.

**Resultado esperado**  
- El mensaje del compañero aparece alineado a la izquierda en el chat, con la hora de envío.
- Suena un tono de notificación suave (chime) al recibir un mensaje del compañero.
- El scroll desciende automáticamente al nuevo mensaje.

**Observaciones**  
- Si el estado del intercambio es `completed`, el placeholder del campo de texto cambia a *"Intercambio finalizado..."* y no es posible enviar nuevos mensajes.
- Mensajes de sistema (reprogramación o cancelación de clase) aparecen en el historial como mensajes normales, enviados en nombre del usuario que realizó la acción.

---

## 11. Módulo 7 — Valoraciones

### 11.1 Calificar al profesor tras completar clase

**Objetivo**  
Proporcionar retroalimentación sobre la experiencia de enseñanza recibida, contribuyendo a la reputación del profesor en la comunidad.

**Descripción**  
El modal de valoración se presenta automáticamente al alumno cuando marca (o cuando el sistema detecta) que una clase ha sido completada. También puede accederse desde el panel de detalle del día si la clase está completada y no ha sido calificada aún.

**Requisitos previos**  
- La clase debe estar en estado **completado**.
- El usuario debe ser el **alumno** de la clase.
- La clase no debe tener una valoración previa de este usuario.

**Procedimiento paso a paso**

1. El modal aparece automáticamente tras marcar la clase como completada.  
   Alternativamente, en el detalle del día, hacer clic en **"Dejar Calificación"**.  
   ![Modal de calificación](images/review-modal.png)

2. Seleccionar la calificación haciendo clic en una de las 5 estrellas:
   - ★ Muy insatisfecho
   - ★★ Insatisfecho
   - ★★★ Aceptable
   - ★★★★ Muy bueno
   - ★★★★★ ¡Excelente experiencia!

3. Opcionalmente, escribir un **comentario** en el campo de texto (no es obligatorio).

4. Hacer clic en **"Enviar Calificación"** para guardar, o **"Omitir"** para cerrar sin valorar.

**Resultado esperado**  
La valoración queda registrada y es visible en el perfil público del profesor y en el detalle de sus habilidades.

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error al guardar | *"Hubo un error al guardar la calificación: [detalle]"* |
| Guardado exitoso | *"¡Gracias por calificar la clase!"* |

---

### 11.2 Ver valoraciones en perfil público

**Objetivo**  
Consultar las reseñas que la comunidad ha dejado sobre un usuario específico.

**Procedimiento paso a paso**

1. Acceder al perfil público del usuario (`/profile/:id`), ya sea desde el catálogo o desde el detalle de una habilidad.
2. Hacer clic en la pestaña **"Valoraciones de la Comunidad (N)"**.  
   ![Pestaña de valoraciones en perfil](images/profile-reviews-tab.png)
3. Leer las reseñas listadas, que incluyen: avatar y nombre del reviewer, calificación en estrellas, comentario y fecha.

**Resultado esperado**  
Listado de todas las valoraciones recibidas, ordenadas de más reciente a más antigua. Si no hay valoraciones, se muestra el mensaje: *"Este mentor no cuenta con valoraciones recibidas todavía."*

---

### 11.3 Ver valoraciones en detalle de habilidad

**Objetivo**  
Consultar la reputación del propietario directamente desde la página de la habilidad, sin salir de la vista actual.

**Procedimiento paso a paso**

1. Acceder al detalle de una habilidad (`/skill/:id`).
2. Desplazarse hacia abajo hasta la sección **"Valoraciones de la Comunidad"**, debajo de la descripción.

**Resultado esperado**  
Las valoraciones del propietario de la habilidad aparecen en tarjetas con: avatar, nombre del reviewer, estrellas y comentario.

---

## 12. Módulo 8 — Perfil de Usuario

### 12.1 Ver perfil público

**Objetivo**  
Conocer el historial, habilidades y reputación de cualquier usuario de la plataforma.

**Descripción**  
El perfil público es accesible por cualquier visitante o usuario autenticado. Muestra datos personales del usuario, sus habilidades publicadas y las valoraciones que ha recibido.

**Procedimiento paso a paso**

1. Desde cualquier tarjeta de habilidad en el catálogo, hacer clic en el nombre del propietario.  
   Alternativamente, desde el detalle de una habilidad, hacer clic en el nombre del propietario.  
   La URL cambia a `/profile/:id`.  
   ![Perfil público](images/public-profile.png)

2. El perfil muestra:
   - **Avatar** (imagen o inicial del nombre)
   - **Nombre completo** y **ciudad**
   - **Créditos de tiempo** actuales del usuario
   - **Fecha de registro** (mes y año)
   - **Rating promedio** y número de valoraciones
   - Pestaña **"Habilidades que Ofrece"**: lista de skills publicadas
   - Pestaña **"Valoraciones de la Comunidad"**: reseñas recibidas

**Mensajes del sistema**

| Situación | Mensaje |
|---|---|
| Cargando | *"Cargando perfil..."* |
| Perfil no encontrado | *"Perfil no encontrado"* + botón volver al catálogo |

---

### 12.2 Editar datos de perfil

**Objetivo**  
Actualizar la información personal del propio perfil: nombre, apellido y ciudad de residencia.

**Requisitos previos**  
- Sesión activa.

**Procedimiento paso a paso**

1. En el Panel de Control (`/dashboard`), hacer clic en el ícono ⚙️ (engranaje) ubicado en la esquina superior derecha del panel de perfil lateral.  
   Se abrirá el modal **"Ajustes de Perfil"**.  
   ![Modal de ajustes de perfil](images/settings-modal.png)

2. Modificar el campo **"Nombre"** si es necesario.

3. Modificar el campo **"Apellido"** si es necesario (es opcional).

4. Modificar el campo **"Ubicación"** (ver sección [12.5](#125-buscar-ciudad-con-autocompletado)).

5. Hacer clic en **"Guardar Ajustes"**.

**Resultado esperado**  
Los datos del perfil quedan actualizados. La barra lateral del Panel de Control refleja inmediatamente los cambios.

**Validaciones**

| Campo | Restricción |
|---|---|
| Nombre | Obligatorio |
| Ubicación | Obligatoria |

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error al guardar | *"Hubo un error al guardar los ajustes."* |
| Éxito | *"Perfil actualizado con éxito"* |

---

### 12.3 Cambiar avatar

**Objetivo**  
Personalizar la imagen de perfil visible en toda la plataforma.

**Descripción**  
El sistema ofrece dos métodos para cambiar el avatar: seleccionar uno de los 8 avatares artísticos predefinidos, o ingresar manualmente la URL de una imagen externa.

**Procedimiento paso a paso**

1. Abrir el modal **"Ajustes de Perfil"** (ver sección [12.2](#122-editar-datos-de-perfil)).
2. En la sección **"Foto de Perfil"**:  
   ![Sección de avatares](images/settings-avatar-picker.png)

   **Opción A — Avatar predefinido:**
   - En la cuadrícula de 8 avatares artísticos, hacer clic en el avatar deseado. Quedará resaltado con un borde violeta.

   **Opción B — URL personalizada:**
   - En el campo de texto inferior, pegar la URL de una imagen accesible públicamente (ej. desde Unsplash o Imgur).
   - La previsualización se actualizará inmediatamente.

3. Hacer clic en **"Guardar Ajustes"**.

**Resultado esperado**  
El avatar aparece actualizado en el Panel de Control, en el perfil público y en los mensajes de chat.

---

### 12.4 Cambiar contraseña

**Objetivo**  
Actualizar la contraseña de acceso a la cuenta.

**Requisitos previos**  
- El usuario debe haberse registrado con email y contraseña (los usuarios de Google gestionan su contraseña directamente en Google).

**Procedimiento paso a paso**

1. Abrir el modal **"Ajustes de Perfil"**.
2. Desplazarse a la sección **"Cambiar Contraseña"**.  
   ![Sección cambiar contraseña](images/settings-password.png)
3. Completar el campo **"Nueva Contraseña"**.
4. Repetir la contraseña en **"Confirmar Nueva Contraseña"**.
5. Hacer clic en **"Guardar Ajustes"**.

**Validaciones**

| Regla | Descripción |
|---|---|
| Contraseñas coinciden | Ambos campos deben tener exactamente el mismo valor |
| Campo vacío | Si ambos campos quedan vacíos, la contraseña NO se modifica |

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Contraseñas no coinciden | *"Las contraseñas no coinciden"* |

**Observaciones**  
- Si no se desea cambiar la contraseña, dejar ambos campos vacíos. La contraseña actual se mantiene.

---

### 12.5 Buscar ciudad con autocompletado

**Objetivo**  
Ingresar la ciudad de residencia con asistencia de búsqueda automática para garantizar un formato consistente.

**Descripción**  
El campo de ubicación en los Ajustes de Perfil incorpora autocompletado mediante la API de geocodificación Nominatim de OpenStreetMap.

**Procedimiento paso a paso**

1. En el modal de Ajustes de Perfil, localizar el campo **"Ubicación (Ciudad y País)"**.
2. Comenzar a escribir el nombre de la ciudad (se requieren al menos 3 caracteres para activar la búsqueda).  
   Aparecerá el indicador *"Buscando..."* mientras se procesa la consulta.
3. Seleccionar la opción correcta de la lista desplegable de sugerencias (ej. "Buenos Aires, Argentina").  
   ![Autocompletado de ciudad](images/settings-location-autocomplete.png)

**Resultado esperado**  
El campo de ubicación queda completado con el nombre normalizado de la ciudad y país seleccionados.

**Observaciones**  
- La búsqueda consume la API pública de OpenStreetMap sin clave de API, sujeta a límites de tasa de consultas.
- Si la ciudad deseada no aparece en las sugerencias, es posible escribirla manualmente en el campo.

---

## 13. Módulo 9 — Notificaciones

### 13.1 Recibir notificación en tiempo real

**Objetivo**  
Mantener al usuario informado sobre eventos relevantes (nuevas solicitudes, mensajes, cambios de clase) sin necesidad de recargar la página.

**Descripción**  
El sistema envía notificaciones en tiempo real mediante Supabase Realtime. Al llegar una nueva notificación, se producen tres eventos simultáneos:
1. El badge rojo del ícono de campana se actualiza con el nuevo conteo.
2. Aparece un toast (tarjeta flotante) en la esquina inferior derecha de la pantalla.
3. Se reproduce un chime (tono de dos notas) de notificación.

**Resultado esperado**  
![Toast de notificación](images/notification-toast.png)  
El toast permanece visible durante 4 segundos y luego desaparece automáticamente.

---

### 13.2 Ver listado de notificaciones

**Objetivo**  
Consultar el historial de notificaciones recientes.

**Procedimiento paso a paso**

1. En la barra de navegación, hacer clic en el ícono de campana 🔔.  
   Si hay notificaciones no leídas, aparece un punto rojo parpadeante sobre el ícono.  
   ![Panel de notificaciones](images/notifications-panel.png)

2. Se despliega un panel con las últimas 10 notificaciones, mostrando para cada una:
   - **Título** (en negrita si no fue leída)
   - **Contenido** (descripción breve)
   - **Hora** de llegada

3. Para cerrar el panel, hacer clic fuera del mismo.

---

### 13.3 Marcar notificaciones como leídas

**Objetivo**  
Eliminar el indicador visual de notificaciones pendientes.

**Procedimiento paso a paso**

1. Abrir el panel de notificaciones (hacer clic en 🔔).
2. Hacer clic en el botón **"Marcar leídas"** en la esquina superior del panel.

**Resultado esperado**  
Todos los textos en negrita pasan a texto normal. El punto rojo sobre el ícono desaparece.

**Observaciones**  
El botón solo es visible si hay al menos una notificación no leída.

---

### 13.4 Navegar desde una notificación

**Objetivo**  
Acceder directamente al contexto de la notificación (ej. el chat de un intercambio) con un clic.

**Procedimiento paso a paso**

1. Abrir el panel de notificaciones o hacer clic directamente en el toast flotante.
2. Hacer clic sobre la notificación deseada.

**Resultado esperado**  
- La notificación es marcada como leída.
- El panel se cierra.
- El sistema navega a la ruta indicada en el campo `link` de la notificación (usualmente el chat de un intercambio).

---

## 14. Módulo 10 — Panel de Administración

### 14.1 Acceder al panel de administración

**Objetivo**  
Ingresar al Panel de Administración para gestionar usuarios de la plataforma.

**Requisitos previos**  
- Sesión activa con rol **administrador** (`admin`) o **moderador** (`moderator`).

**Procedimiento paso a paso**

1. En la barra de navegación, hacer clic en el enlace **"Panel Admin"** (visible en color rojo solo para admin y moderadores).  
   ![Enlace Panel Admin en Navbar](images/navbar-admin-link.png)

2. El sistema carga la lista de todos los usuarios registrados (excepto el propio administrador).  
   ![Panel de administración](images/admin-panel.png)

3. Para el rol `admin`, se muestra el badge **"Modo Maestro Activado"** junto al título del panel.

**Resultado esperado**  
Tabla con todos los usuarios de la plataforma, ordenada por fecha de registro descendente.

**Columnas de la tabla:**
- **Usuario**: avatar (inicial) + nombre + ID parcial
- **Ubicación**: ciudad registrada
- **Estado**: badge "Activo" (verde) o "Suspendido" (rojo)
- **Rol**: selector desplegable
- **Acciones**: botones de gestión

**Mensajes del sistema**

| Situación | Mensaje |
|---|---|
| Cargando | *"Cargando usuarios..."* |
| Sin otros usuarios | *"No hay otros usuarios en la plataforma."* |
| Usuario sin rol admin/mod | Redirección automática a la página de inicio |

---

### 14.2 Suspender cuenta de usuario

**Objetivo**  
Bloquear el acceso a la plataforma de un usuario que incumpla los términos de servicio.

**Requisitos previos**  
- Sesión activa con rol admin o moderator.
- El usuario objetivo debe tener estado **Activo**.

**Procedimiento paso a paso**

1. En la tabla del Panel de Administración, localizar al usuario.
2. En la columna "Acciones", hacer clic en **"Suspender Cuenta"** (botón rojo semitransparente).  
   ![Botón suspender cuenta](images/admin-suspend-button.png)
3. Confirmar en el diálogo: *"¿Estás seguro de que quieres SUSPENDER a este usuario? Perderá acceso a la plataforma."*

**Resultado esperado**  
- El badge de estado del usuario cambia a **"Suspendido"** (rojo).
- El avatar del usuario en la tabla cambia a fondo rojo.
- La próxima vez que el usuario intente acceder, verá la pantalla de cuenta suspendida.

**Mensajes de error**

| Situación | Mensaje |
|---|---|
| Error en base de datos | *"Error al cambiar el estado del usuario"* |

---

### 14.3 Levantar suspensión de usuario

**Objetivo**  
Restituir el acceso a la plataforma de un usuario previamente suspendido.

**Requisitos previos**  
- Sesión activa con rol admin o moderator.
- El usuario objetivo debe tener estado **Suspendido**.

**Procedimiento paso a paso**

1. Localizar al usuario suspendido en la tabla (badge rojo "Suspendido").
2. Hacer clic en **"Levantar Suspensión"** (botón gris).
3. Confirmar: *"¿Quieres levantar la suspensión a este usuario?"*

**Resultado esperado**  
El badge cambia a **"Activo"** (verde). El usuario puede volver a iniciar sesión normalmente.

---

### 14.4 Cambiar rol de usuario

**Objetivo**  
Asignar o remover el rol de moderador a un usuario para ampliar o reducir sus permisos en la plataforma.

**Requisitos previos**  
- Sesión activa con rol admin o moderator.

**Procedimiento paso a paso**

1. En la tabla del Panel de Administración, localizar al usuario.
2. En la columna **"Rol"**, hacer clic en el selector desplegable y seleccionar:
   - `User`: usuario estándar
   - `Moderator`: usuario con permisos de moderación  
   ![Selector de rol](images/admin-role-selector.png)
3. El sistema solicita confirmación: *"¿Estás seguro de que quieres cambiar el rol de este usuario a [ROL]?"*
4. Confirmar.

**Resultado esperado**  
El dropdown muestra el nuevo rol. El usuario tendrá los permisos correspondientes la próxima vez que cargue la aplicación.

**Observaciones**  
- El rol `admin` no puede ser asignado desde la interfaz. Solo es posible hacerlo directamente en la base de datos.
- Un moderador puede cambiar roles entre `user` y `moderator`, pero no puede promover a nadie a `admin` ni degradar a otro moderador si él mismo tiene rol `moderator`.

---

### 14.5 Eliminar habilidades desde el catálogo

**Objetivo**  
Retirar publicaciones inapropiadas del catálogo desde la vista de moderación.

> Para el procedimiento completo, ver la sección [7.5 — Eliminar habilidad ajena (moderación)](#75-eliminar-habilidad-ajena-moderación).

**Observaciones**  
El Panel de Administración no ofrece una vista interna de habilidades. La moderación de publicaciones se realiza directamente desde el Catálogo (`/catalog`) o desde el detalle de la habilidad (`/skill/:id`).

---

## 15. Sistema de Créditos de Tiempo

Los créditos de tiempo son la unidad de valor que regula los intercambios en la plataforma. Su propósito es garantizar la equidad: quien recibe enseñanza "paga" con un crédito al docente.

### Reglas del sistema

| Evento | Efecto en créditos |
|---|---|
| Registro de nuevo usuario | Se asignan **5 créditos** por defecto |
| Usuario de Google (primer acceso) | Se asignan **5 créditos** por defecto |
| Clase marcada como **completada** | El **alumno pierde 1 crédito**. El **profesor gana 1 crédito** |
| Intentar solicitar intercambio con 0 créditos | Solicitud bloqueada con mensaje de alerta |

### Visualización de créditos

Los créditos actuales del usuario se muestran en tres lugares simultáneamente:

1. **Barra de navegación** (ícono de reloj 🕐): accesible desde cualquier página.
2. **Panel lateral del Dashboard**: en la tarjeta de perfil.
3. **Perfil público de cualquier usuario**: en la sección de estadísticas.

### Observaciones

- La transferencia de créditos es ejecutada por una función almacenada (*stored procedure*) en la base de datos denominada `complete_class`. Este mecanismo garantiza que la operación sea atómica e indivisible.
- No existe interfaz para comprar, transferir manualmente o ajustar créditos fuera de los mecanismos descritos.

---

## 16. Glosario de Términos

| Término | Definición |
|---|---|
| **Habilidad** (*Skill*) | Conocimiento o destreza que un usuario ofrece enseñar a la comunidad. Posee título, descripción, categoría, nivel, modalidad y disponibilidad. |
| **Intercambio** | El proceso completo desde la solicitud hasta la finalización de una o más clases entre dos usuarios. |
| **Solicitud** (*Request*) | Propuesta enviada por un usuario interesado en aprender una habilidad a su propietario, acompañada de un mensaje de presentación y oferta. |
| **Clase** (*Class*) | Sesión de enseñanza específica generada automáticamente al aceptarse una solicitud. Tiene fecha, horario, rol (profesor/alumno) y estado. |
| **Crédito de tiempo** | Unidad de valor de la plataforma. Se consume al recibir una clase y se obtiene al impartirla. |
| **Propietario** (*Owner*) | Usuario que publicó una habilidad. En el contexto de una clase, cumple el rol de **profesor**. |
| **Solicitante** (*Sender*) | Usuario que envía una solicitud de intercambio. En el contexto de una clase, cumple el rol de **alumno**. |
| **Modalidad** | Formato de la clase: **Virtual** (videoconferencia), **Presencial** (encuentro físico), **Híbrido** (combinación). |
| **Rating** | Calificación promedio de 1 a 5 estrellas que un usuario ha recibido en sus clases impartidas. |
| **Toast** | Notificación visual flotante de vida corta que aparece en una esquina de la pantalla. |
| **RPC** | *Remote Procedure Call*: función almacenada en la base de datos que se invoca desde el cliente (ej. `complete_class`). |
| **RLS** | *Row Level Security*: políticas de seguridad a nivel de fila en PostgreSQL/Supabase que restringen qué datos puede ver o modificar cada usuario. |
| **BaaS** | *Backend as a Service*: modelo donde el backend (autenticación, base de datos, almacenamiento) es provisto por un servicio externo (Supabase). |
| **OAuth** | Protocolo de autorización que permite autenticarse usando una cuenta de tercero (ej. Google) sin compartir la contraseña. |
| **Jit.si** | Plataforma de videoconferencia de código abierto, gratuita y sin registro, utilizada para las clases virtuales. |
| **Nominatim** | API de geocodificación de OpenStreetMap utilizada para el autocompletado de ciudades en los ajustes de perfil. |
| **Realtime** | Funcionalidad de Supabase que notifica al cliente de cambios en la base de datos en tiempo real mediante WebSockets. |

---

## 17. Limitaciones Conocidas del Sistema

Las siguientes limitaciones han sido identificadas en el análisis del código fuente de la versión actual:

| # | Limitación | Módulo afectado | Impacto |
|---|---|---|---|
| L-01 | No existe funcionalidad de **edición de habilidades** publicadas. Para modificar, se debe eliminar y volver a publicar. | Habilidades | Medio |
| L-02 | No existe funcionalidad de **recuperación de contraseña** por correo electrónico desde la interfaz. | Autenticación | Medio |
| L-03 | El campo **"Categoría de interés"** del formulario de registro es requerido pero no se almacena en la base de datos ni tiene uso posterior en el sistema. | Autenticación | Bajo |
| L-04 | El **rol `admin`** no puede ser asignado desde la interfaz de usuario. Requiere acceso directo a la base de datos. | Administración | Medio |
| L-05 | No existe **paginación en el catálogo**. A mayor volumen de publicaciones, mayor tiempo de carga inicial. | Catálogo | Alto (a escala) |
| L-06 | El **Panel de Administración no tiene buscador** de usuarios. A gran escala, la gestión se vuelve dificultosa. | Administración | Medio (a escala) |
| L-07 | No existe funcionalidad de **eliminación permanente de cuentas** de usuario desde la interfaz. | Administración | Bajo |
| L-08 | El **aula virtual (Jit.si)** no está protegida con contraseña. Cualquier persona con el enlace puede unirse. | Clases | Bajo |
| L-09 | La función de **exportación a archivo .ics** (iCalendar) está implementada en el código pero no expuesta en la interfaz de usuario. | Clases | Bajo |
| L-10 | El **autocompletado de ciudad** utiliza la API pública de OpenStreetMap sin autenticación, sujeta a límites de uso. | Perfil | Bajo |

---

## 18. Apéndice — Estructura de la Base de Datos

El siguiente esquema resume las tablas principales detectadas en el código fuente. Este apéndice tiene carácter informativo para la comprensión del sistema.

```
profiles
├── id          UUID (FK → auth.users)
├── name        TEXT
├── surname     TEXT
├── city        TEXT
├── avatar_url  TEXT
├── role        TEXT ('user' | 'moderator' | 'admin')
├── is_banned   BOOLEAN
├── time_credits INTEGER (default: 5)
└── created_at  TIMESTAMP

skills
├── id           UUID
├── title        TEXT
├── description  TEXT
├── category     TEXT
├── modality     TEXT ('virtual' | 'presencial' | 'hibrido')
├── level        TEXT ('Básico' | 'Intermedio' | 'Avanzado')
├── availability TEXT
├── owner_id     UUID (FK → profiles)
└── created_at   TIMESTAMP

requests
├── id              UUID
├── sender_id       UUID (FK → profiles)
├── receiver_id     UUID (FK → profiles)
├── target_skill_id UUID (FK → skills)
├── message         TEXT
├── status          TEXT ('pending' | 'accepted' | 'rejected')
└── created_at      TIMESTAMP

classes
├── id          UUID
├── request_id  UUID (FK → requests)
├── teacher_id  UUID (FK → profiles)
├── student_id  UUID (FK → profiles)
├── date        DATE
├── time        TEXT
├── status      TEXT ('scheduled' | 'rescheduled' | 'completed' | 'cancelled')
└── created_at  TIMESTAMP

messages
├── id          UUID
├── request_id  UUID (FK → requests)
├── sender_id   UUID (FK → profiles)
├── content     TEXT
└── created_at  TIMESTAMP

reviews
├── id           UUID
├── class_id     UUID (FK → classes)
├── reviewer_id  UUID (FK → profiles)
├── reviewee_id  UUID (FK → profiles)
├── rating       INTEGER (1–5)
├── comment      TEXT (opcional)
└── created_at   TIMESTAMP

notifications
├── id         UUID
├── user_id    UUID (FK → profiles)
├── title      TEXT
├── content    TEXT
├── link       TEXT (opcional)
├── is_read    BOOLEAN
└── created_at TIMESTAMP
```

---

*Fin del Manual de Usuario — SkillSwap v1.0.0*  
*Documento generado mediante análisis estático del código fuente. Versión 1.0 — Junio 2026.*
