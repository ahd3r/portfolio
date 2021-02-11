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

const password = bcrypt.hashSync(process.env.ADMIN_PASS, 7);
const dataForAdmin = { password, name: 'Ander', isMain: true };

mongoService
  .conect()
  .then(() => {
    return mongoService.dbClient.collection('Admin').deleteMany({});
  })
  .then(() => {
    return mongoService.dbClient.collection('Admin').insertOne(dataForAdmin);
  })
  .then(() => {
    return mongoService.dbClient.collection('AdminHistory').insertOne(dataForAdmin);
  })
  .then(() => {
    console.log('Admin created!');
  })
  .then(() => {
    return mongoService.instanceClient.close();
  })
  .catch((e) => {
    throw e;
  });
