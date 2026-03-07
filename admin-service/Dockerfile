FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# include root index.js alongside src
COPY . .
EXPOSE 3002
USER node
CMD ["node", "index.js"]