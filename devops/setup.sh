#!/bin/bash

# Instala dependências necessárias
apt-get update && apt-get install -y curl jq

# Esperar até que o RabbitMQ esteja disponível
while ! curl -s http://rabbitmq:15672/api/overview; do sleep 1; done

# Criar a fila DLQ
curl -i -u userRabbitmq:oq3TdgCyDb7qyKB -H 'content-type:application/json' \
-XPUT -d '{"vhost":"/", "name":"tech-challenge-ecosystem-dlq", "durable":true}' \
http://rabbitmq:15672/api/queues/%2f/tech-challenge-ecosystem-dlq

# Criar a fila principal com a DLQ associada
curl -i -u userRabbitmq:oq3TdgCyDb7qyKB -H 'content-type:application/json' \
-XPUT -d '{"vhost":"/", "name":"tech-challenge-ecosystem", "durable":true, "arguments":{"x-dead-letter-exchange":"", "x-dead-letter-routing-key":"tech-challenge-ecosystem-dlq"}}' \
http://rabbitmq:15672/api/queues/%2f/tech-challenge-ecosystem

echo 'Setup complete'
