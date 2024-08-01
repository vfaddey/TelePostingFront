# Устанавливаем базовый образ
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY ../../../../etc/letsencrypt/live/leetpost.ru/fullchain.pem /etc/nginx/ssl/fullchain.pem
COPY ../../../../etc/letsencrypt/live/leetpost.ru/privkey.pem /etc/nginx/ssl/privkey.pem

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
