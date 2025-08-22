# NTT Data Frontend Exercise
Este proyecto es una solución al ejercicio técnico de frontend propuesto por NTT Data en 2025. El objetivo principal es demostrar habilidades en Angular, buenas prácticas de desarrollo y arquitectura limpia (Clean Architecture).

## Descripción
La aplicación permite gestionar productos, incluyendo funcionalidades como listado, búsqueda, creación, edición y eliminación. Se ha implementado siguiendo los principios de Clean Architecture, separando claramente las capas de dominio, aplicación, infraestructura y presentación para facilitar la escalabilidad y el mantenimiento.  
Además, se utilizó **@angular-architects/module-federation** para que el módulo principal pueda ser consumido como un **microfrontend**, facilitando su integración en arquitecturas de múltiples aplicaciones.

## Logros Alcanzados
- El proyecto utiliza Angular y RxJS según lo requerido.
- Integración con **@angular-architects/module-federation** para exponer el módulo como microfrontend.
- Se simula un retraso en las APIs para pruebas de UX como el uso de Skeleton Screens.
- Lazy loading en la carga de las imágenes, con imagen por defecto para links caídos o erróneos.
- Debounce en la búsqueda de productos para evitar requests innecesarias al servidor.
- Debounce en la validación del ID al crear un nuevo producto, optimizando la experiencia y el rendimiento.
- Aplicación completamente responsiva gracias al uso de media queries, Flexbox y CSS Grid.
- Sistema sencillo de notificaciones para mostrar mensajes de error o éxito.
- Todas las funcionalidades requeridas desde la F1 hasta la F6 completadas.

## Estructura del Proyecto
- **Domain:** Entidades, repositorios y objetos de valor.
- **Application:** Casos de uso y servicios.
- **Infrastructure:** Implementaciones de repositorios, mapeadores y DTOs.
- **Presentation:** Componentes, páginas y rutas de la interfaz de usuario.

## Ejercicio Técnico
El ejercicio está basado en el documento "Ejercicio Técnico Frontend - Angular - 2024.pdf" proporcionado por NTT Data, que detalla los requisitos funcionales y técnicos para la solución.

## Cómo ejecutar el proyecto
1. Instala las dependencias:
    ```sh
    npm install
    ```
2. Inicia la aplicación:
    ```sh
    npm start
    ```

## Autor
Solución desarrollada por Ronny García para el desafío técnico de NTT Data.
