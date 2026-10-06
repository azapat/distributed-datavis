FROM node:25-alpine

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
COPY __mocks__ ./__mocks__
COPY webpack.config.cjs jest.config.cjs /app/

# Expose the port Webpack will serve on
EXPOSE 8080

RUN npm run build

# Run Webpack Dev Server
CMD ["npx", "webpack-cli", "serve", "--mode", "production"]
