const { mongoService } = require('../utils/db');

class AdminRepository {
  async getAdmins({ filter, sort, limit, skip }) {
    return await mongoService.dbClient
      .collection('Admin')
      .find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .toArray();
  }
  async countAdmins({ filter }) {
    return await mongoService.dbClient.collection('Admin').find(filter).count();
  }
  async getAdmin(name) {
    return await mongoService.dbClient.collection('Admin').findOne({ name });
  }
  async createAdmin(data) {
    return await mongoService.dbClient.collection('Admin').insertOne(data);
  }
  async updateAdmin(data) {
    return await mongoService.dbClient
      .collection('Admin')
      .updateOne({ isMain: true }, { $set: data });
  }
  async deleteAdmin(name) {
    return await mongoService.dbClient.collection('Admin').deleteOne({ name });
  }
}

module.exports = { adminRepository: new AdminRepository() };
