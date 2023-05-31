###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine as development
WORKDIR /app

###################
# BUILD FOR PRODUCTION
###################
FROM development as build
# Install app dependencies
COPY . .
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=PRODUCTION
RUN npm install
RUN npm run build
RUN npm prune --production
USER node

###################
# BUILD FOR PRODUCTION
###################
FROM development as production

COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/.env /app/.env
COPY --chown=node:node --from=build /app/ecosystem.config.js /app/ecosystem.config.js
COPY --chown=node:node --from=build /app/package.json /app/package.json

CMD ["node", "dist/main.js"]
EXPOSE 3000
USER node
