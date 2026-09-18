# Build the static site, then serve it from a small runtime image.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY public ./public
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app

# `serve -s` rewrites unknown paths to index.html so legacy routes like
# /projects still load the app.
RUN npm install -g serve@14 && npm cache clean --force
COPY --from=build /app/build ./build

ENV NODE_ENV=production
EXPOSE 3001
USER node
CMD ["serve", "-s", "build", "-l", "3001"]
