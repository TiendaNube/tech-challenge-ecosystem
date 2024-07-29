# Use a imagem oficial do Node 20 como base
FROM node:20-alpine

# Crie um diretório para a aplicação
WORKDIR /app

# Copie o arquivo package*.json para o diretório da aplicação
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código da aplicação para o diretório da aplicação
COPY . .

# Build the project (caso necessário)
RUN npm run build

# Exponha a porta 3002 para o host
EXPOSE 3002

# Execute o comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]