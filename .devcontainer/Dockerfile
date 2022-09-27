ARG VARIANT="18-alpine"
FROM node:${VARIANT}

# Install apps
  RUN apk update
  RUN apk add git
  RUN npm install -g pnpm

# Build workspace
  ARG workspace
  WORKDIR "${workspace}"
