# Servicios Técnicos — ejecución local

## Requisitos
- Python 3.10 o posterior
- Node.js y npm
- MySQL

## Base de datos
1. Inicia MySQL.
2. Ejecuta el script `database/tecnico.sql` una sola vez para crear las tablas. El script usa `IF NOT EXISTS` para conservar las tablas existentes.
3. Para instalaciones que no usen el usuario local predeterminado, define las variables de entorno `DB_HOST`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` antes de iniciar el backend.

> Las cuentas de demostración incluidas en el script usan contraseñas de ejemplo. Cámbialas antes de exponer la aplicación fuera de un entorno local. La autenticación actual es básica y debe reforzarse antes de un despliegue público.

## Backend
Desde la carpeta `backend`:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

La API queda en `http://127.0.0.1:5000`.

## Frontend
Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

Opcionalmente configura `VITE_API_URL` para apuntar a otra dirección de backend. Por defecto se usa `http://127.0.0.1:5000`.

## Funciones incluidas
- Inicio de sesión de demostración.
- CRUD de clientes.
- CRUD de técnicos.
- CRUD de servicios, relacionados con un cliente y un técnico, con estado y fecha de registro.

## Verificación recomendada
- Backend: inicia Flask y prueba `/`, `/api/login`, `/api/clientes`, `/api/tecnicos` y `/api/servicios`.
- Frontend: ejecuta `npm run build` y recorre las cuatro vistas.
- Verifica que no se pueda borrar un cliente o técnico relacionado con servicios; la base de datos aplica restricciones de clave foránea.
