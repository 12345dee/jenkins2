FROM node:18-alpine


# Create app directory
WORKDIR /app


# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production


# Copy app source
COPY . .


EXPOSE 3000
CMD ["node", "server.js"]
