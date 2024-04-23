# Como Usar
## Antes de subir
### Dependências do sistema operacional
 - Docker desktop >= 4.28.0 Ou Docker compose >= 2.24.3 + Docker Engine >= 26.0.0
 - make é opicional
### Arquivo .env
 - Verifique se o arquivo `.env` consta na raiz do projeto, senão, será necessário criá-lo e confirurá-lo conforme a tabela de [variáveis de ambiente](#variáveis-de-ambiente)

## Subindo toda a arquitetura
```shell
# Subida observando os logs
docker compose up --build
```
```shell
# Subida em modo daemon, libera o terminal e não mostra os logs
docker compose up --build -d
```
ou
```shell
# Subida observando os logs
make start
```
```shell
# Subida em modo daemon, libera o terminal e não mostra os logs
make start-daemon
```

# Sobre
[[EN]](docs/README.EN.md)[[ES]](docs/README.ES.md)
## Modelo de banco de dados
![Database Diagram](docs/images/database_diagram.png#center)
- Na tabela `transactions` há uma chave estrangeira `merchant_id` relacionada a tabela `merchant` e ao campo `id` que é sua chave primária. Isso significa que para haver inserção na tabela `transactions` deve haver um `merchant` previamente cadastrado.
- Na tabela `payables` há duas chaves estrangeiras `transaction_id` e `merchant_id`. O campo `transaction_id` se relaciona com a tabela `transactions` e sua chave primária `id`. Assim, para inserir um `payable` deve antes inserir uma `transaction`.
- Foi criado um `UNIQUE INDEX` na tabela `payables` para o campo `transaction_id` para garantir a relação de 1x1 entre `payable` e `transaction`. Ou seja, só poderá haver 1 `payable` para 1 `transação`

## Arquitetura de microsserviços
![Microservices architecture](docs/images/arquitetura_payables.png#center)
- O cliente faz um request para o `loadbalancer`
- O `loadbalancer` usa a estratégia `roundrobin` para direcionar o request para 1 das API de `payable`
- Conforme o tipo de request a API de `payable` pode buscar a informação no cache (Redis) e se não encontrar, busca no banco de dados (Postgres). Se for um request de escrita, ele acessa diretamente o banco.
- Caso o request da API seja para cadastrar uma nova `transaction` após ser gravada no banco de dados a API publica uma mensagem numa fila do serviço de AMQP (RabbitMQ).
- O worker (AMQP consumer) fica conectado a mesma fila do servico AMQP escutando para saber se há alguma mensagem. Quando recebe uma nova mensagem contendo o `transaction_id`, o worker busca a transação no banco de dados e cria uma nova entidade de `payable` conforme as regras do `schema`.

## Mono repo
- Para garantir que a API e o worker usem as mesmas regras e Schemas eles compartilham o mesmo repositório de código. Assim eles compartilham regras e código.

## Variáveis de ambiente

| Name                 | Description                                      | Default Values |
| -------------------- | ------------------------------------------------ | -------------- |
| `DEBUG`              | Enable or desable debug option                   | `False`        |
| `ENVIRONMENT`        | Define environment `production` or `development` | `production`   |
| `LOG_LEVEL`          | Set the log level (STR in uppercase)             | `INFO`         |
| `FACILITY`           | Logger name                                      | `payable `     |
| `WEB_SERVER_PORT`    | Port number for web server. `Caution:` If change this, the loadbalancer will fail | `8101`         |
| `WEB_SERVER_WORKERS` | Number of web server workers                     | `1`            |
| `WEB_SERVER_HOST`    | Ip used to bind on web server                    | `'0.0.0.0'`    |
| `REDIS_URI`          | Redis URI connection string                      | `'redis://redis?decode_responses=True&max_connections=10'` |
| `POSTGRES_USER`      | Postgres user to auth on database                | `None`         |
| `POSTGRES_PASSWORD`  | Postgres password to auth on database            | `None`         |
| `POSTGRES_DB`        | Postgres database name                           | `payable_db`   |
| `POSTGRES_HOST`      | Hostname or IP for postgres instance             | `postgres`     |
| `POSTGRES_PORT`      | Port number for postgres instance                | `5432`         |
| `AMQP_URI`           | URI for amqp service                             | `amqp://guest:guest@rabbitmq/` |
| `AMQP_QUEUE`         | Queue name on amqp srvice                        | `transactions` |

## Desativando o Swagger para deploy em produção
- Use a env `DEBUG` = `False`
- Use a env `ENVIRONMENT` = `production`

## Links dessa aplicação
- Swagger [[docs]](http://127.0.0.1:8181/docs), [[redoc]](http://127.0.0.1:8181/redoc), [[openapi.json]](http://127.0.0.1:8181/openapi.json)
- HAProxy loadbalancer [STATUS](http://127.0.0.1:8100/monitoring): autenticação necessária (Username: `username` | Password: `password`)
- RabbitMQ [Management](http://127.0.0.1:15672/): autenticação necessária (Username: `guest` | Password: `guest`)


## Design Pattern
A arquitetura utilizada no projeto é uma arquitetura baseada em handlers que podem ou não processar determinada requisição dependendo de seu tipo. Esse padrão comportamental é chamado de COR(Chain Of Responsability). Mais em [References](#references)
O worker e a API 


## References
- Python Interfaces - [Real Python](https://realpython.com/python-interface/)
- Design Patterns - Chain of Responsibility [Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)

# TO DO
 - Escrever testes para cobrir todas as funcionalidades.
 - Implementar segurança para a chamada dos endpoints usando Bearer Token ou X-API-Token 
