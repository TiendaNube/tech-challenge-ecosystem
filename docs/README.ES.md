## Modelo de base de datos
![Diagrama de base de datos](images/database_diagram.png#center)
- En la tabla `transacciones` hay una clave externa `merchant_id` relacionada con la tabla `merchant` y el campo `id` que es su clave primaria. Esto significa que para poder ser insertado en la tabla de `transacciones`, debe haber un `comerciante` previamente registrado.
- En la tabla `pagos` hay dos claves externas `transaction_id` y `merchant_id`. El campo `transaction_id` está relacionado con la tabla `transactions` y su clave principal `id`. Por lo tanto, para insertar una "pagadera" primero debe insertar una "transacción".
- Se creó un "ÍNDICE ÚNICO" en la tabla "pagos" para el campo "transaction_id" para garantizar una relación 1x1 entre "pagos" y "transacción". En otras palabras, solo puede haber 1 `pagadero` por 1 `transacción`

## Arquitectura de microservicios
![Arquitectura de microservicios](images/arquitetura_payables.png#center)
- El cliente realiza una solicitud al `loadbalancer`
- `loadbalancer` utiliza la estrategia `roundrobin` para dirigir la solicitud a 1 de las API `pagables`
- Dependiendo del tipo de solicitud, la API `de pago` puede buscar información en el caché (Redis) y si no la encuentra busca en la base de datos (Postgres). Si es una solicitud por escrito, se accede directamente al banco.
- Si la solicitud API es para registrar una nueva `transacción` después de ser registrada en la base de datos API, publica un mensaje en una cola del servicio AMQP (RabbitMQ).
- El trabajador (consumidor AMQP) está conectado a la misma cola de servicio AMQP escuchando para ver si hay algún mensaje. Al recibir un nuevo mensaje que contiene "transaction_id", el trabajador busca la transacción en la base de datos y crea una nueva entidad "pagable" de acuerdo con las reglas del "esquema".

## repositorio mono
- Garantizar que la API y el trabajador utilicen las mismas reglas y esquemas relacionados con el mismo repositorio de código. Entonces comparten reglas y códigos.

## Variables de entorno

| Nombre | Descripción | Valores predeterminados |
| -------------------- | ------------------------------------------------ | -------------- |
| `DEPURACIÓN` | Activar o desactivar la opción de depuración | `Falso` |
| `MEDIO AMBIENTE` | Definir entorno de "producción" o "desarrollo" | `producción` |
| `LOG_LEVEL` | Establecer el nivel de registro (STR en mayúsculas) | `INFORMACIÓN` |
| `INSTALACIÓN` | Nombre del registrador | `pagadero` |
| `WEB_SERVER_PORT` | Número de puerto del servidor web. `Precaución:` Si cambia esto, el balanceador de carga fallará | `8101` |
| `WEB_SERVER_WORKERS` | Número de trabajadores del servidor web | `1` |
| `WEB_SERVER_HOST` | IP utilizada para enlazar con el servidor web | `'0.0.0.0'` |
| `REDIS_URI` | Cadena de conexión URI de Redis | `'redis://redis?decode_responses=True&max_connections=10'` |
| `POSTGRES_USER` | Usuario de Postgres para autenticación de base de datos | `Ninguno` |
| `POSTGRES_CONTRASEÑA` | Contraseña de Postgres para autenticación de base de datos | `Ninguno` |
| `POSTGRES_DB` | Nombre de la base de datos de Postgres | `pagable_db` |
| `POSTGRES_HOST` | Nombre de host o IP para la instancia de Postgres | `postgres` |
| `POSTGRES_PORT` | Número de puerto para la instancia de postgres | `5432` |
| `AMQP_URI` | URI para el servicio amqp | `amqp://invitado:invitado@rabbitmq/` |
| `AMQP_QUEUE` | Nombre de la cola en el servicio amqp | `transacciones` |

## Deshabilitar Swagger para implementación en producción
- Utilice un entorno `DEBUG` = `False`
- Utilizar un entorno `ENTORNO` = `producción`

## Enlaces de aplicaciones
- Arrogancia [docs](http://127.0.0.1:8181/docs)
- Arrogancia [redoc] (http://127.0.0.1:8181/redoc)
- Arrogancia [openapi.json](http://127.0.0.1:8181/openapi.json)
- Balanceador de carga HAProxy [ESTADO](http://127.0.0.1:8100/monitoring): requiere autenticación (Nombre de usuario: `nombre de usuario` | Contraseña: `contraseña`)
- RabbitMQ [Administración] (http://127.0.0.1:15672/): requiere autenticación (Nombre de usuario: `guest` | Contraseña: `guest`)


## Patrón de diseño
La arquitectura utilizada en el proyecto es una arquitectura basada en manejadores que pueden depender o no de solicitudes específicas según su tipo. Este patrón de comportamiento se llama COR (Cadena de Responsabilidad). Más en [Referencias](#referencias)
El trabajador y la API


## Referencias
- Interfaces de Python - [Python real](https://realpython.com/python-interface/)
- Patrones de diseño - Cadena de responsabilidad [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)

#PENDENCIA
   - Escribir pruebas para cubrir todas las funciones.
   - Implementar seguridad para llamar a puntos finales usando Bearer Token o X-API-Token