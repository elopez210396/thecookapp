# Configuración de Google Sheets

## 1. Crear el Spreadsheet

Crea un Google Sheet con 4 hojas (tabs), con estos encabezados exactos en la fila 1:

### Hoja "Usuarios"
| id | email | passwordHash | rol | nombre |
|----|-------|--------------|-----|--------|

- `rol`: uno de `Admin`, `Cocina`, `Domiciliario`
- `passwordHash`: hash bcrypt de la contraseña (usa `backend` con `npm run hash-password -- <password>` o genera manualmente)

### Hoja "Clientes"
| id | nombre | telefono | direccion |
|----|--------|----------|-----------|

### Hoja "Productos"
| id | nombre | cantidad | unidad | precio | requiereSabor |
|----|--------|----------|--------|--------|---------------|

- `cantidad`: texto, ej. `8` o `1/4`
- `unidad`: ej. `unidades`, `gr`, `lb`
- `precio`: número sin puntos ni símbolo de moneda, ej. `6000`
- `requiereSabor`: `TRUE` o `FALSE` — si es `TRUE`, al crear un pedido con este producto se habilita un campo para anotar el sabor elegido

### Hoja "Pedidos"
| id | cliente_id | cliente_nombre | items | tipo_entrega | direccion | nombre_entrega | fecha_creacion | fecha_entrega | estado | lleva_tarjeta | texto_tarjeta |
|----|-----------|---------------|-------|-------------|-----------|----------------------|-----------------|--------------|--------|--------------|-------|

- `items`: JSON string, ej: `[{"productoId":"p1","cantidad":2,"nombre":"Brownie"}]`
- `tipo_entrega`: `Domicilio` o `Local`
- `nombre_entrega`: nombre de a quién se le entrega, solo si es distinto del cliente (opcional)
- `estado`: `Pendiente`, `Listo`, `Entregado`, `Cancelado`
- `lleva_tarjeta`: `TRUE` o `FALSE`

**Importante**: `appendRow`/`updateRowById` escriben por posición de columna, no por nombre — el orden de estos encabezados en la fila 1 del Sheet tiene que coincidir exactamente con el array `HEADERS` de `backend/src/services/pedidos.ts`. Si se agrega o quita una columna en el Sheet, hay que actualizar ese array en el mismo orden.

## 2. Crear Service Account (Google Cloud)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea (o selecciona) un proyecto.
2. Habilita la **Google Sheets API** en "APIs & Services > Library".
3. Ve a "APIs & Services > Credentials" > "Create Credentials" > "Service Account".
4. Dale un nombre (ej. `the-cook-sheets`), crea la cuenta.
5. Entra a la cuenta creada > pestaña "Keys" > "Add Key" > "Create new key" > JSON. Descarga el archivo.
6. Del JSON descargado, copia:
   - `client_email` → variable `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `private_key` → variable `GOOGLE_SHEETS_PRIVATE_KEY` (mantén los `\n` literales o reemplázalos al leer el env var)

## 3. Compartir el Sheet con la Service Account

En el Google Sheet, click en "Compartir" y agrega el `client_email` de la service account con permiso de **Editor**.

## 4. Variables de entorno (backend/.env)

```
GOOGLE_SHEETS_ID=<id del spreadsheet, está en la URL>
GOOGLE_SHEETS_CLIENT_EMAIL=<client_email del JSON>
GOOGLE_SHEETS_PRIVATE_KEY="<private_key del JSON, con \n>"
JWT_SECRET=<una cadena aleatoria larga>
PORT=3001
```

## 5. Probar la conexión

Corre el backend (`npm run dev` dentro de `backend/`) y llama a `GET /health`. Si responde `{ ok: true }`, el server levantó correctamente. Luego prueba `POST /api/auth/login` con un usuario creado manualmente en la hoja "Usuarios".
