FROM node:16 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

FROM nginx:1.23
COPY --from=build /app/dist/frontend /usr/share/nginx/html
