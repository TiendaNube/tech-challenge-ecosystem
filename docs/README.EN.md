## Database model
![Database Diagram](images/database_diagram.png#center)
- In the `transactions` table there is a foreign key `merchant_id` related to the `merchant` table and the `id` field which is its primary key. This means that in order to be inserted into the `transactions` table, there must be a `merchant` previously registered.
- In the `payables` table there are two foreign keys `transaction_id` and `merchant_id`. The `transaction_id` field is related to the `transactions` table and its primary key `id`. Therefore, to insert a `payable` you must first insert a `transaction`.
- A `UNIQUE INDEX` was created in the `payables` table for the `transaction_id` field to guarantee a 1x1 relationship between `payable` and `transaction`. In other words, there can only be 1 `payable` for 1 `transaction`

## Microservices architecture
![Microservices architecture](images/arquitetura_payables.png#center)
- The client makes a request to `loadbalancer`
- `loadbalancer` uses the `roundrobin` strategy to direct the request to 1 of the `payable` APIs
- Depending on the type of request, the `payable` API can search for information in the cache (Redis) and if it doesn't find it, it searches the database (Postgres). If it is a writing request, it directly accesses the bank.
- If the API request is to register a new `transaction` after being recorded in the API database, it publishes a message in a queue of the AMQP service (RabbitMQ).
- The worker (AMQP consumer) is connected to the same AMQP service queue listening to see if there are any messages. When receiving a new message containing the `transaction_id`, the worker searches the database for the transaction and creates a new `payable` entity according to the `schema` rules.

## Mono repository
- To ensure that the API and worker use the same rules and schemas related to the same code repository. So they share rules and code.

## Environment variables

| Name | Description | Default values |
| -------------------- | ------------------------------------------------ | -------------- |
| `DEBUG` | Enable or disable debug option | `False` |
| `ENVIRONMENT` | Define `production` or `development` environment | `production` |
| `LOG_LEVEL` | Set the log level (STR in uppercase) | `INFO` |
| `INSTALLATION` | Registrar name | `payable` |
| `WEB_SERVER_PORT` | Web server port number. `Caution:` If you change this, the load balancer will fail | `8101` |
| `WEB_SERVER_WORKERS` | Number of web server workers | `1` |
| `WEB_SERVER_HOST` | IP used to link to the web server | `'0.0.0.0'` |
| `REDIS_URI` | Redis URI connection string | `'redis://redis?decode_responses=True&max_connections=10'` |
| `POSTGRES_USER` | Postgres user for database authentication | `None` |
| `POSTGRES_PASSWORD` | Postgres password for database authentication | `None` |
| `POSTGRES_DB` | Postgres database name | `payable_db` |
| `POSTGRES_HOST` | Hostname or IP for postgres instance | `postgres` |
| `POSTGRES_PORT` | Port number for postgres instance | `5432` |
| `AMQP_URI` | URI for amqp service | `amqp://guest:guest@rabbitmq/` |
| `AMQP_QUEUE` | Queue name in amqp service | `transactions` |

## Disable Swagger for production deployment
- Use a `DEBUG` env = `False`
- Use an environment `ENVIRONMENT` = `production`

## Application Links
- Swagger [docs](http://127.0.0.1:8181/docs)
- Arrogance [redoc](http://127.0.0.1:8181/redoc)
- Swagger [openapi.json](http://127.0.0.1:8181/openapi.json)
- HAProxy loadbalancer [STATUS](http://127.0.0.1:8100/monitoring): requires authentication (Username: `username` | Password: `password`)
- RabbitMQ [Management](http://127.0.0.1:15672/): requires authentication (Username: `guest` | Password: `guest`)


## Design pattern
The architecture used in the project is an architecture based on handlers that may or may not depend on specific requests depending on their type. This behavioral pattern is called COR (Chain Of Responsibility). More in [References](#references)
The worker and the API


## References
- Python Interfaces - [Real Python](https://realpython.com/python-interface/)
- Design Patterns - Chain of Responsibility [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)

# PENDENCY
   - Write tests to cover all features.
   - Implement security for calling endpoints using Bearer Token or X-API-Token