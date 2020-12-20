FROM node

WORKDIR /app/front

COPY ./package.json .
RUN npm i
COPY . .

RUN npm run build
CMD ["npm", "start"]
