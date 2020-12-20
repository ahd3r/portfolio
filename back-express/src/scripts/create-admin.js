const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const node_env = process.argv[2];

if (node_env === 'test') {
  dotenv.config({ path: '.test.env' });
} else if (node_env === 'dev') {
  dotenv.config({ path: '.dev.env' });
} else if (node_env === 'prod') {
  dotenv.config({ path: '.prod.env' });
}

const { mongoService } = require('../utils/db');
const { getNowTimestamp } = require('../utils/date');

const password = bcrypt.hashSync(process.env.ADMIN_PASS, 7);
const dataForAdmin = { password, created: getNowTimestamp(), name: 'Ander', isMain: true };

mongoService
  .conect(process.env.MONGO_URI)
  .then(() => {
    return mongoService.dbClient.collection('admins').deleteMany({});
  })
  .then(() => {
    return mongoService.dbClient.collection('admins').insertOne(dataForAdmin);
  })
  .then(() => {
    return mongoService.dbClient.collection('admins_history').insertOne(dataForAdmin);
  })
  .then(() => {
    console.log('Admin created!');
  })
  .catch((e) => {
    throw e;
  });
