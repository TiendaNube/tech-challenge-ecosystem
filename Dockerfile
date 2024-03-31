FROM node:20.11.0

RUN mkdir -p /app

WORKDIR /app

ADD . .

RUN npm ci 

RUN npm run build


#Build image
FROM node:20.11.0-alpine as deployable

RUN mkdir -p /usr
WORKDIR /usr

COPY --from=0 /app/node_modules    /usr/node_modules
COPY --from=0 /app/dist            /usr/src

RUN ln -s /usr/src /usr/dist

ADD ["package.json", ".env", "./"]

EXPOSE 3000

CMD ["npm", "run", "start:prod"]