# Sistema de Inventario

Sistema de gestión de inventario desarrollado con arquitectura de microservicios, implementando Clean Architecture tanto en el backend como en el frontend.

## Arquitectura del Proyecto

### Backend (.NET 9)
- **Arquitectura**: Clean Architecture con microservicios
- **Comunicación entre microservicios**: gRPC
- **Exposición de datos al frontend**: REST API mediante Backend for Frontend (BFF)
- **Base de datos**: SQL Server
- **Infraestructura**: Docker y Docker Compose

### Frontend (Angular 20)
- **Arquitectura**: Clean Architecture
- **Estilos**: TailwindCSS y CSS puro (sin bibliotecas de componentes adicionales)

### Microservicios
1. **Product Service**: Gestión de productos
2. **Transaction Service**: Gestión de transacciones de inventario
3. **Inventory BFF (InventoryService)**: Backend for Frontend que expone APIs REST al cliente

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

## Características Técnicas

- **Clean Architecture**: Implementada tanto en backend como frontend para mejor mantenibilidad y testabilidad
- **Microservicios**: Separación de responsabilidades entre Product Service y Transaction Service
- **gRPC**: Comunicación eficiente entre microservicios
- **Backend for Frontend**: Capa que adapta y expone los datos de los microservicios al cliente
- **Containerización**: Infraestructura completamente dockerizada para fácil despliegue
- **Health Checks**: Verificación automática del estado de los servicios