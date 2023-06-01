# Get the base image of Node version 20
FROM node:20

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:jammy

# Set the work directory for the application
WORKDIR /app

# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH

# Update and Upgrade
RUN apt-get update && apt-get upgrade -y

# Copy Project files to the app folder in Docker image
COPY package.json package-lock.json playwright.config.ts /app/
COPY apis/ /app/apis/
COPY pages/ /app/pages/
COPY utils/ /app/utils/
COPY tests/ /app/tests/

# Set CI environment variable
ENV CI=1

# Install dependencies
RUN npm ci

# Install Playwright Browsers
RUN npx playwright install --with-deps