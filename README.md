# Nuvemshop Tech Challenge

## Summary
This system consists of a backend service that enables creating transactions and payable for mechants that are in Nuvemshop ecosystem. A whole description of its features can be found [here](https://github.com/TiendaNube/tech-challenge-ecosystem/blob/main/README.md) (available in portuguese), but, in summary, there are:
- One endpoint to create a transaction
- One endpoint to consult payables
- One consumer of a queue and its DLQ that creates payables from transactions


## Architecture
This system architecture is based on Hexagonal Architecture, consisting of four layers: api, core, data and messaging, detailed below:
- api: responsible for handling HTTP specificities (such as body parsing and query parameters) and validation of input models. 
- core: responsible for business rules and communication with other layers
- data: responsible for database specificities (such as queries and entities)
- messaging: responsible for consuming and producing messages of queues

Apart from core, no other layers (api, data, messaging) can communicate with each other, they only call core methods and classes to perform their features. These layers have to transform their models into core's models beforing calling its features, and, then, core makes the communication with the other specific layers.

## How to run

### Techonologies
- Language: Node with Typescript
- Main Framework: NestJs
- Database: Postgres (version 15.6)
- ORM: TypeORM
- Auxiliary technologies: Docker, AWS CLI, prettier, lint

### Requirements
- Node (version 18.19.0 or above)
- AWS CLI
- Docker
- yarn

### Running Locally
**Step 1: Running external dependencies**
There's a docker that runs external dependencies: postgres database and AWS SQS queues. 
From the root of the project:
```bash
cd infrastructure/local

docker compose up
```

**Step 2: Installing node dependencies**
From the root of the project
```bash
cd tech-challenge-ecosystem

yarn 
```

**Step 3: Create .env file**
.env file contains some environment variables and secrets. In the folder `:root/tech-challenge-ecosystem`, create a file named `.env` with the following content:

```bash
TRANSACTIONS_QUEUE_NAME="transactions-queue"
TRANSACTIONS_QUEUE_URL="http://localhost:4566/000000000000/transactions-queue"
TRANSACTIONS_DLQ_NAME="transactions-dlq"
TRANSACTIONS_DLQ_URL="http://localhost:4566/000000000000/transactions-dlq"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="SECRET_ACCESS_KEY"
DB_HOST="localhost"
DB_PORT=5432
DB_USERNAME="postgres"
DB_PASSWORD="r00t"
DB_DATABASE="tech-challenge-ecosystem-db"
```

**Step 4: Run the system**
From the root of the project
```bash
cd tech-challenge-ecosystem

yarn start:dev
```

### Running Tests
From the root of the project:
```bash
cd tech-challenge-ecosystem

yarn test

# for coverage
yarn test:cov
```
## Evidences of functionality

### PUT /transaction: Endpoint to create a transaction
Calling the endpoint:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/9fe558ed-6f1a-426e-b14d-beb212d35205/Untitled.png?id=6db2cd03-ac05-4aa1-999e-86770c6c047c&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=F7vbDzD6QHOPqGGdJ5a4RmidF4BPThyTguATJylbJ80&downloadName=Untitled.png">

Result: 
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/93bbd2b6-46d4-42cc-8a73-d2521d9458c5/Untitled.png?id=9d05ad73-b67b-4a13-a33e-65d5d9693835&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=rQqCHSgXlPNYVdQvxFo0Ikd0lrwgMPV0huxSmxUO9w8&downloadName=Untitled.png">

Query of transactions in database:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/af1e2641-dc7a-46b7-ada6-0387a0e05897/Untitled.png?id=567f93f3-59a2-47b4-8e75-59e4ce80e1e2&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=oPpVzLEif9j40pulp_INKQv8bw5JgSkbpeSLyv8qu08&downloadName=Untitled.png">

Query of payables in database:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/fdb82340-4d84-4fe4-8593-bf8baeeb3f44/Untitled.png?id=8d7ac0e3-af59-49a8-9515-22970ccd02d0&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=AAehs3S1mgZsIqKOCixtUYUwmXtvTd57aLHYS5csAwg&downloadName=Untitled.png">

### GET /payable/summary: Endpoint to consult summary of payable

Calling endpoint and its result:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/b196e41a-1119-49f6-b523-320a746d587a/Untitled.png?id=f2d0d872-9902-4c23-838e-fcddc3bc4405&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=zF3exXOeNlXIAoi8lWlHtY8ifeDeSmOg8PVbZVPloJs&downloadName=Untitled.png">

### Summary for a lot of transactions
In order to validate the solution scalability, I inserted more than 190.000 transactions for a single merchant and tried to validate how long the endpoint would take to summarize it. 

It took an avarage of 1.9 seconds, as can be seen here:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/8f8cfaeb-d00b-4ca5-98b0-bca15ee4f10a/Untitled.png?id=48731839-43bb-4356-98b2-33734059bb25&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=Wceo_ykXwADPyR4g9wWu4-Xl2qyc-6w1rG2qzRTINqc&downloadName=Untitled.png">

As proof of the quantity of transactions, there is a log that shows it:
<img src="https://file.notion.so/f/f/7451e142-34c1-4c05-a315-913ea742a90b/248a08b6-f461-458a-87b9-653b7df0f250/Untitled.png?id=795695a5-32a2-401b-91ab-56c39811c4d6&table=block&spaceId=7451e142-34c1-4c05-a315-913ea742a90b&expirationTimestamp=1717351200000&signature=KeE3zatvr8x0W1xyYHK2GsLdQyI5pS9ufag_vwfdv_A&downloadName=Untitled.png">

### Tests coverage
Tests coverage fot this system is above 76%
```
-----------------------------------------------|---------|----------|---------|---------|-------------------
File                                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------------------|---------|----------|---------|---------|-------------------
All files                                      |   76.99 |    81.81 |   77.14 |    77.5 |                   
 src                                           |       0 |      100 |       0 |       0 |                   
  main.ts                                      |       0 |      100 |       0 |       0 | 1-16              
 src/api/controller                            |     100 |      100 |     100 |     100 |                   
  payable.controller.ts                        |     100 |      100 |     100 |     100 |                   
  transaction.controller.ts                    |     100 |      100 |     100 |     100 |                   
 src/api/controller/test/fixtures              |     100 |      100 |     100 |     100 |                   
  card.dto.fixture.ts                          |     100 |      100 |     100 |     100 |                   
  payable.service.fixture.ts                   |     100 |      100 |     100 |     100 |                   
  summarized.payable.fixture.ts                |     100 |      100 |     100 |     100 |                   
  transaction.dto.fixture.ts                   |     100 |      100 |     100 |     100 |                   
  transaction.service.fixture.ts               |     100 |      100 |     100 |     100 |                   
 src/api/models                                |   94.87 |       50 |   83.33 |   94.87 |                   
  card.dto.ts                                  |     100 |      100 |     100 |     100 |                   
  payable.summary.dto.ts                       |   91.66 |       50 |     100 |   91.66 | 18                
  payable.summary.filter.dto.ts                |     100 |      100 |     100 |     100 |                   
  transaction.dto.ts                           |   91.66 |      100 |      50 |   91.66 | 20                
 src/core/business/payable                     |     100 |      100 |     100 |     100 |                   
  payable.from.transaction.business.ts         |     100 |      100 |     100 |     100 |                   
  summarize.payables.business.ts               |     100 |      100 |     100 |     100 |                   
 src/core/business/test/fixture                |     100 |      100 |     100 |     100 |                   
  payable.from.transaction.business.fixture.ts |     100 |      100 |     100 |     100 |                   
  summarize.payable.business.fixture.ts        |     100 |      100 |     100 |     100 |                   
 src/core/contracts/data                       |     100 |      100 |     100 |     100 |                   
  payable.datasource.ts                        |     100 |      100 |     100 |     100 |                   
  transaction.datasource.ts                    |     100 |      100 |     100 |     100 |                   
 src/core/contracts/data/fixtures              |     100 |      100 |     100 |     100 |                   
  payable.datasource.fixture.ts                |     100 |      100 |     100 |     100 |                   
  transaction.datasource.fixture.ts            |     100 |      100 |     100 |     100 |                   
 src/core/contracts/messaging                  |     100 |      100 |     100 |     100 |                   
  transaction.message.producer.ts              |     100 |      100 |     100 |     100 |                   
 src/core/contracts/messaging/fixture          |     100 |      100 |     100 |     100 |                   
  transaction.message.producer.fixture.ts      |     100 |      100 |     100 |     100 |                   
 src/core/models                               |     100 |      100 |     100 |     100 |                   
  card.ts                                      |     100 |      100 |     100 |     100 |                   
  payable.ts                                   |     100 |      100 |     100 |     100 |                   
  summarized.payables.ts                       |     100 |      100 |     100 |     100 |                   
  transaction.ts                               |     100 |      100 |     100 |     100 |                   
 src/core/models/test/fixtures                 |     100 |      100 |     100 |     100 |                   
  card.fixture.ts                              |     100 |      100 |     100 |     100 |                   
  payable.fixture.ts                           |     100 |      100 |     100 |     100 |                   
  transaction.fixture.ts                       |     100 |      100 |     100 |     100 |                   
 src/core/services/payable                     |     100 |      100 |     100 |     100 |                   
  payable.service.ts                           |     100 |      100 |     100 |     100 |                   
 src/core/services/transaction                 |     100 |      100 |     100 |     100 |                   
  transaction.service.ts                       |     100 |      100 |     100 |     100 |                   
 src/data/entities                             |    92.3 |    66.66 |      50 |   94.91 |                   
  base.entity.ts                               |     100 |      100 |     100 |     100 |                   
  payable.entity.ts                            |   89.65 |    66.66 |      50 |    92.3 | 28,59             
  transaction.entity.ts                        |   93.54 |      100 |      50 |   96.42 | 36                
 src/data/entities/fixtures                    |   96.29 |        0 |     100 |   96.29 |                   
  payable.entity.fixture.ts                    |   92.85 |        0 |     100 |   92.85 | 18                
  transaction.entity.fixture.ts                |     100 |      100 |     100 |     100 |                   
 src/data/repository                           |     100 |      100 |     100 |     100 |                   
  payable.repository.ts                        |     100 |      100 |     100 |     100 |                   
  transaction.repository.ts                    |     100 |      100 |     100 |     100 |                   
 src/data/repository/test/fixtures             |     100 |      100 |     100 |     100 |                   
  payable.typeorm.repository.fixture.ts        |     100 |      100 |     100 |     100 |                   
  transaction.typeorm.repository.fixture.ts    |     100 |      100 |     100 |     100 |                   
 src/messaging/sqs/consumer/transaction        |       0 |      100 |       0 |       0 |                   
  trasaction.dlq.consumer.ts                   |       0 |      100 |       0 |       0 | 1-44              
  trasaction.queue.consumer.ts                 |       0 |      100 |       0 |       0 | 1-44              
 src/messaging/sqs/models                      |       0 |      100 |       0 |       0 |                   
  card.message.dto.ts                          |       0 |      100 |       0 |       0 | 1-18              
  transaction.message.dto.ts                   |       0 |      100 |       0 |       0 | 1-35              
 src/messaging/sqs/transaction                 |       0 |      100 |       0 |       0 |                   
  transaction.message.producer.ts              |       0 |      100 |       0 |       0 | 1-30              
 src/messaging/validators                      |       0 |        0 |       0 |       0 |                   
  validateAndTransform.ts                      |       0 |        0 |       0 |       0 | 1-16              
-----------------------------------------------|---------|----------|---------|---------|-------------------
```