# Get the base image of Node version 20
FROM node:20

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:jammy

# Set the work directory for the application
WORKDIR /app

# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH

# Get the needed libraries to run Playwright
RUN apt-get update && apt-get upgrade -y
RUN apt-get -y install libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libdrm-dev \
  libxkbcommon0\
  libxkbcommon-dev \
  libgbm1 \
  libgbm-dev \
  libpciaccess-dev \
  libasound-dev \
  libasound2 \
  libasound2-dev \
  libasound2-doc \
  libatspi2.0-0 \
  libxshmfence-dev \
  libnspr4 \
  libcups2 \
  libgtk-3-0 \
  libpango-1.0-0 \
  libcairo2 \
  libgdk-pixbuf2.0-0

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