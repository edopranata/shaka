FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Install Quasar CLI globally
RUN npm install -g @quasar/cli

# Expose port
EXPOSE 9000

# Start development server
CMD ["quasar", "dev", "--host", "0.0.0.0", "--port", "9000"]
