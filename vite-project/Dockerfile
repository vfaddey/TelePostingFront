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

COPY path/to/your/certificates/fullchain.pem /etc/nginx/ssl/leetpost.ru/fullchain.pem
COPY path/to/your/certificates/privkey.pem /etc/nginx/ssl/leetpost.ru/privkey.pem

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
