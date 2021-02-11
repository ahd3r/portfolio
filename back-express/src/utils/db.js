const { MongoClient } = require('mongodb');

class MongoService {
  constructor() {
    this.instanceClient = null;
    this.dbClient = null;
  }
  async conect() {
    this.instanceClient = await MongoClient.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true
    });
    this.dbClient = this.instanceClient.db('portfolio');
  }
}

module.exports = { mongoService: new MongoService() };
