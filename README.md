# 📦 Sistema de Inventario

Sistema de gestión de inventario desarrollado como **prueba técnica full stack**.  
El objetivo es demostrar experiencia en **arquitectura de microservicios**, **Clean Architecture**, integración **Dockerizada** y un frontend moderno con **Angular + TailwindCSS**.

Incluye:
- Backend en **.NET 9** con microservicios independientes
- Comunicación entre servicios vía **gRPC**
- **Backend for Frontend (BFF)** que expone APIs REST
- Frontend en **Angular 20 + TailwindCSS**
- SQL Server dockerizado con inicialización automática

---

## 📸 Capturas de pantalla

### Modulo Producto
#### Inicio
![Inicio](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/inicio.png)

#### Tabla producto
![Tabla producto](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/productos.png)

#### Crear producto
![Crear producto](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/crear_producto.png)

#### Editar producto
![Editar producto](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/editar_producto.png)

#### Eliminar producto
![Eliminar producto](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/eliminar_producto.png)

### Modulo Transacción

#### Tabla transacción
![Tabla transacción](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/transacciones.png)

#### Crear transacción
![Crear transacción](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/crear_transaccion.png)

#### Editar transacción
![Editar transacción](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/editar_transaccion.png)

#### Eliminar transacción
![Eliminar transacción](https://raw.githubusercontent.com/R00rss//challenge-full-stack-netby/main/assets/eliminar_transaccion.png)

## 🎯 Enfoque de la solución

Este proyecto busca demostrar:
- Aplicación de **Clean Architecture** en frontend y backend.
- Separación de dominios con **microservicios desacoplados**.
- Comunicación eficiente mediante **gRPC**.
- Implementación de **Backend for Frontend** para facilitar la integración cliente-servidor.
- Infraestructura completamente **dockerizada** lista para despliegue en cualquier entorno.


## Requisitos

Para ejecutar el proyecto en un entorno local, necesitas tener instalado:

### Para el Backend
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Para el Frontend
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm (incluido con Node.js)

## Estructura del Proyecto

```
├── backend/
│   ├── ProductService/
│   ├── TransactionService/
│   ├── InventoryBFF/
│   └── docker-compose.yml
├── frontend/
├── db/
│   ├── product/
│   │   └── init.sql
│   └── transaction/
│       └── init.sql
├── docker-compose.yml
└── README.md
```

## Ejecución del Backend

El backend utiliza Docker Compose para orquestar toda la infraestructura, incluyendo:
- Bases de datos SQL Server (Product y Transaction)
- Inicialización automática de bases de datos
- Microservicios (Product Service, Transaction Service)
- Backend for Frontend (Inventory BFF)

### Pasos para ejecutar el backend:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/R00rss/challenge-full-stack-netby
   cd challenge-full-stack-netby
   ```

2. **Configurar variables de entorno**:
   Crear un archivo `.env` en la raíz del proyecto con:
   ```
   SA_PASSWORD=MyStrongPass123!
   ASPNETCORE_ENVIRONMENT=Development
   ```

3. **Ejecutar con Docker Compose**:
   ```bash
   docker-compose up -d
   ```

4. **Verificar que los servicios estén ejecutándose**:
   ```bash
   docker-compose ps -a
   ```

### URLs de los servicios:
- **Inventory BFF**: http://localhost:8080
- **Product Service**: http://localhost:5001
- **Transaction Service**: http://localhost:5002
- **Base de datos Products**: localhost:1433
- **Base de datos Transactions**: localhost:1434

### Detener los servicios:
```bash
docker-compose down
```

### Detener y eliminar volúmenes (reset completo):
```bash
docker-compose down -v --rmi all --remove-orphans
```

## Ejecución del Frontend

El frontend está desarrollado con Clean Architecture y utiliza TailwindCSS para los estilos.

### Pasos para ejecutar el frontend:

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run start
   ```

4. **Acceder a la aplicación**:
   Abrir el navegador en: http://localhost:4200 (o el puerto que se indique en la consola)

## Base de Datos

Los scripts SQL para la creación e inicialización de las bases de datos se encuentran en:
- `db/product/init.sql`: Script de inicialización para la base de datos de productos
- `db/transaction/init.sql`: Script de inicialización para la base de datos de transacciones

Estas bases de datos se crean e inicializan automáticamente cuando se ejecuta `docker-compose up -d`.

## Tecnologías Utilizadas

### Backend
- .NET Core 9
- Entity Framework Core
- MediatR
- FluentValidation
- gRPC
- SQL Server
- Docker
- Docker Compose

### Frontend
- Angular 20
- TailwindCSS
- CSS puro