# stage1 as builder
FROM node:22-alpine as builder
# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install
# Copy rest of the files
COPY . .
# Build the project
RUN npm run build