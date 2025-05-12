# Cash Tracker

![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?logo=expo\&logoColor=white) ![React Native](https://img.shields.io/badge/React%20Native-TypeScript-blue?logo=react) ![SQLite](https://img.shields.io/badge/SQLite-offline-important) ![CI](https://img.shields.io/github/actions/workflow/status/TAVI0/cash-tracker/ci.yml?label=CI)

> **Estado**: *MVP en desarrollo*. La API embebida y la sincronización en la nube aún están en fase experimental.

Aplicación **offline‑first** para registrar gastos e ingresos de forma rápida en tu dispositivo móvil. Construida con **Expo + React Native (TypeScript)** y **SQLite (WatermelonDB)** para almacenamiento local, permite seguir tu presupuesto sin conexión y sincronizar los respaldos cuando haya internet.

---

## ✨ Características

* 📲 **Registro instantáneo** de gastos/ingresos con categoría, monto, fecha y notas.
* 🏷️ **Categorías** personalizables (crear, editar, eliminar) con icono y color.
* 📊 **Gráficos** mensuales de flujo de caja y distribución por categoría.
* 🔍 **Búsqueda y filtro** por texto, rango de fechas y categoría.
* 🌐 **Sincronización opcional** con un backend embebido (Spring Boot) que se ejecuta dentro de la app y sube backups cifrados cuando detecta conexión.
* 🛡️ **Cifrado local** (AES) de la base de datos para proteger tu información.
* ☁️ **Backup en la nube** a tu cuenta de Google Drive (WIP).

---

## 📂 Estructura del proyecto

```
cash-tracker
├── app/                # rutas y pantallas (Expo Router)
├── components/         # UI compartidos (Button, Card, Chart...)
├── hooks/              # lógica reutilizable (useTransactions, useSync)
├── constants/          # estilos, colores, tipografías
├── assets/             # íconos y fuentes
├── scripts/            # utilidades CLI (migraciones, seed)
├── app.json            # metadata Expo
├── eas.json            # config EAS build / submit
└── package.json        # dependencias y scripts npm
```

---

## 🛠️ Requisitos

| Herramienta            | Versión recomendada   |
| ---------------------- | --------------------- |
| Node.js                | ≥ 20.x                |
| npm / pnpm             | ≥ 10.x                |
| Expo CLI               | ≥ 7.x                 |
| EAS CLI                | (para builds nativas) |
| Android Studio / Xcode | (para emuladores)     |

---

## 🚀 Puesta en marcha rápida

```bash
# 1. Clona el repo y entra al directorio
$ git clone https://github.com/TAVI0/cash-tracker.git
$ cd cash-tracker

# 2. Instala dependencias
$ npm install   # o pnpm install

# 3. Arranca en modo desarrollo
$ npx expo start
```

En el panel de Expo selecciona:

* **a** para emulador Android
* **i** para simulador iOS
* Escanea el QR con **Expo Go** en tu dispositivo físico

### Variables de entorno

Duplica `.env.example` → `.env` y define las claves necesarias:

```bash
DB_ENCRYPTION_KEY=my-super-secret
BACKUP_URL=https://mi-servidor.com/api/backup  # opcional
```

---

## 🧩 Arquitectura

| Capa                 | Descripción                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| **UI**               | React Native + Expo Router, Tailwind RN                                                               |
| **Estado**           | Zustand para store global + TanStack Query para caché/sync                                            |
| **BBDD local**       | SQLite vía WatermelonDB; migraciones automáticas                                                      |
| **Backend embebido** | Microservicio Spring Boot (Java 17) expuesto en 127.0.0.1:9090 cuando se inicia la app (experimental) |
| **Sync**             | Estrategia *push‑pull* con colas; conflicto resuelto cliente‑ganador                                  |

---

