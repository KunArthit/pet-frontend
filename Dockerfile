# Step 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Step 2: Nginx
FROM nginx:alpine

# ❗ ลบ default nginx html
RUN rm -rf /usr/share/nginx/html/*

# copy react build
COPY --from=builder /app/dist /usr/share/nginx/html

# copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]