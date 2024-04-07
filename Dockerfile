FROM node:21.7.1 as build
WORKDIR /app
COPY tsconfig.json tsconfig.build.json package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:21.7.1-alpine3.19 as deploy
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist

CMD [ "npm", "run", "start:prod" ]