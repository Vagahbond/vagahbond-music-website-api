FROM node:14-alpine as build

WORKDIR /usr/src/app

COPY ./package*.json ./ 

RUN npm i

COPY . .

RUN npm run prebuild

RUN npm run build

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/ ./



CMD ["npm", "run", "start:prod"]
