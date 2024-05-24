FROM node:22

WORKDIR /app

COPY package*.json ./

# Adding retry logic for npm install
RUN npm install || npm install || npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
