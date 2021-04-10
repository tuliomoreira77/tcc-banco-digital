FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY ./nginx-custom.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/wolf-bank /usr/share/nginx/html