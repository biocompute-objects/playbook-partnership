FROM node:latest as node_devtools_installed
WORKDIR /app
COPY . .
RUN find /app -type f -a \! \( -name "package.json" -o -name "package-lock.json" \) | xargs rm -f
RUN npm i

FROM node:latest as minimal_app_built
COPY --from=node_devtools_installed /app .
COPY . .
RUN find /app -type f -a \( -name "requirements.txt" \) | xargs rm -f
RUN npm run codegen:components
RUN npm run build

FROM node:latest as app
RUN set -x \
  && apt-get -y update \
  && apt-get -y install \
    python3-dev \
    python3-pip
COPY . .
RUN find /app -type f -a \! \( -name "requirements.txt" \) | xargs rm -f
COPY --from=node_devtools_installed /app .
RUN set -x \
  && npm run codegen:requirements \
  && pip install -r requirements.txt

COPY --from=minimal_app_built /app .
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "start"]