FROM node:20-alpine

# Set working directory
WORKDIR /app/

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY src ./src
COPY test ./test
COPY __tests__ ./__tests__
COPY webpack.config.js jest.config.js /app/

# Expose the port Webpack will serve on
EXPOSE 8080

# Run Webpack Dev Server
CMD ["npx", "webpack-cli", "serve", "--mode", "production"]
