# Use Debian-based Node.js image for better compatibility
FROM node:20-bullseye-slim as build

RUN npm install -g corepack \
    && corepack enable \
    && corepack prepare yarn@4.5.0 --activate

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
