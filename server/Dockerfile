FROM node:14-alpine

ENV USER DEV

ENV SERVICE_NAME=ui-admin-web \
    SERVICE_DESC='Administration User Interface' \
    SERVICE_TAGS='local,local-test,sens8,sensefinity-cloud,ui-admin,admin-ui' \
    SERVICE_CHECK_ENDPOINT="/" \
    SERVICE_CHECK_INTERVAL=10s \
    SERVICE_CHECK_TIMEOUT=2s \
    SERVICE_REST_AUTH_TYPE=Basic \
    SERVICE_REST_ALLOW_CORS_ORIGIN=http://localhost:8080 \
    SERVICE_APP_REST_API_URL=http://api-data:50050/ \
    SERVICE_APP_REST_API_VERSION=2 \
    NODE_ENV=dev \
    SERVICE_APP_REST_API_FOOTER_COPYRIGHT='Sensefinity Assets management' \
    PORT=8081

WORKDIR /app

COPY package*.json ./
RUN npm ci -qy

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
