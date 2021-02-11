const { mongoService } = require('../utils/db');

class AdminHistoryRepository {
  async getHistory({ sort, limit, skip }) {
    return await mongoService.dbClient
      .collection('AdminHistory')
      .find({})
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .toArray();
  }
  async getHistoryCount() {
    return await mongoService.dbClient.collection('AdminHistory').find({}).count();
  }
  async createHistory(data) {
    return await mongoService.dbClient.collection('AdminHistory').insertOne(data);
  }
}

module.exports = { adminHistoryRepository: new AdminHistoryRepository() };
