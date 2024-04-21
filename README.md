## Environments variables

| Name                 | Description                                      | Default Values |
| -------------------- | ------------------------------------------------ | -------------- |
| `DEBUG`              | Enable or desable debug option                   | `False`        |
| `ENVIRONMENT`        | Define environment `production` or `development` | `production`   |
| `LOG_LEVEL`          | Set the log level (STR in uppercase)             | `INFO`         |
| `FACILITY`           | Logger name                                      | `payable `     |
| `WEB_SERVER_PORT`    | Port number for web server. `Caution:` If change this, the loadbalancer will fail | `8001`         |
| `WEB_SERVER_WORKERS` | Number of web server workers                     | `1`            |
| `WEB_SERVER_HOST`    | Ip used to bind on web server                    | `'0.0.0.0'`    |
| `REDIS_URI`          | Redis URI connection string                      | `'redis://redis?decode_responses=True&max_connections=10'` |
| `POSTGRES_USER`      | Postgres user to auth on database                | `None`         |
| `POSTGRES_PASSWORD`  | Postgres password to auth on database            | `None`         |
| `POSTGRES_DB`        | Postgres database name                           | `payable_db`   |
| `POSTGRES_HOST`      | Hostname or IP for postgres instance             | `postgres`     |
| `POSTGRES_PORT`      | Port number for postgres instance                | `5432`         |

## Deactivate Swagger for production deployment
- Use env `DEBUG` = `False`
- Use env `ENVIRONMENT` = `production`

## Application links
- Swagger [docs](http://127.0.0.1:8081/docs)
- Swagger [redoc](http://127.0.0.1:8081/redoc)
- Swagger [openapi.json](http://127.0.0.1:8081/openapi.json)
- HAProxy loadbalancer [STATUS](http://127.0.0.1:8000/monitoring): require authentication (Username: username | Password: password)


## Design Pattern
A arquitetura utilizada no projeto é uma arquitetura baseada em handlers que podem ou não processar determinada requisição dependendo de seu tipo. Esse padrão comportamental é chamado de COR(Chain Of Responsability). Mais em [References](#references)


## References
- Python Interfaces - [Real Python](https://realpython.com/python-interface/)
- Design Patterns - Chain of Responsibility [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)