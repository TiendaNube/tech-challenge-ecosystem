#!/usr/bin/env bash

set -euo pipefail

# enable debug
# set -x

echo "configuring sqs"
echo "==================="

LOCALSTACK_HOST=localhost
AWS_REGION=us-east-1

create_dlq() {
    local DLQ_NAME_TO_CREATE=$1
    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566  --region ${AWS_REGION} sqs create-queue --queue-name ${DLQ_NAME_TO_CREATE}
}

create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    local DLQ_NAME=$2
    local DLQ_ARN="\\\"arn:aws:sqs:us-east-1:000000000000:${DLQ_NAME}\\\""
    local QUEUE_ATTRIBUTES='{ "RedrivePolicy": "{\"deadLetterTargetArn\":'"$DLQ_ARN"',\"maxReceiveCount\":\"1\"}"}'

    aws --endpoint-url=http://${LOCALSTACK_HOST}:4566  --region ${AWS_REGION} sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} \
        --attributes "$QUEUE_ATTRIBUTES"
}

create_dlq "transactions-dlq"
create_queue "transactions-queue" "transactions-dlq"