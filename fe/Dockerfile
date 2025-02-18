FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .

# Set environment variables for hot reload
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_DEV_CACHE=false

# Expose the development server port
EXPOSE 3000

CMD ["npm", "run", "dev"]