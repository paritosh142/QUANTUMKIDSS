# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install pnpm dependencies
RUN npm install -g npm

RUN npm install -g @nestjs/cli

# Install package dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Command to run your application
CMD ["npm", "start"]