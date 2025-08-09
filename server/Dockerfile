# Use the official Node.js image from Docker Hub (choose version as needed)
FROM node:20

# Create and set working directory for the app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose port (default for many Node apps)
EXPOSE 7000

# Start the application
CMD ["node", "index.js"]
