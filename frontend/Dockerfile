FROM node:latest

# Set working directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY . .

RUN corepack enable && yarn install

RUN yarn global add @quasar/cli

# # Install Quasar CLI globally
# RUN npm install -g @quasar/cli

EXPOSE 9000

CMD ["yarn", "quasar", "dev", "--host", "0.0.0.0", "--port", "9000"]
