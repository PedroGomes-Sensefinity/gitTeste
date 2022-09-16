FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci -qy
COPY . .
EXPOSE 8081
CMD ["npm", "start"]

# Image used for development