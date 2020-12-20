FROM node

WORKDIR /app/back

COPY ./packege.json .
RUN npm i
COPY . .

CMD ["npm", "start"]
