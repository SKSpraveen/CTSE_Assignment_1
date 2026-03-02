FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# copy application code, including the root index.js and src directory
COPY . .
EXPOSE 3001
USER node
# start using root index.js
CMD ["node", "index.js"]