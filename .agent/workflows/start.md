---
description: Iniciar todos los servidores de Polyglot AI (backend y frontend)
---

# Iniciar Polyglot AI

Este workflow inicia el backend y frontend de la aplicación Polyglot AI para desarrollo.

## Pasos

// turbo-all
1. Iniciar el servidor backend (Express + SQLite):
```bash
cd server && node index.js
```

// turbo
2. Iniciar el servidor frontend (Vite + React):
```bash
npm run dev
```

## Resultado Esperado

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173 (o puerto alternativo si está en uso)

Ambos servidores deben estar corriendo para que la aplicación funcione correctamente.

## Notas

- El backend maneja la API, autenticación y base de datos SQLite
- El frontend sirve la aplicación React/Vite
- Ambos deben estar corriendo para que la app móvil (Capacitor) y web funcionen
