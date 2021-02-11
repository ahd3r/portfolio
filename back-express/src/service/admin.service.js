const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const { adminRepository } = require('../repository/admin.repository');
const { adminHistoryRepository } = require('../repository/adminHistory.repository');
const { NotFoundError, ValidatorError } = require('../utils/errors');
const { getNowTimestamp } = require('../utils/date');

class AdminService {
  async authAdmin(username, password) {
    const admin = await this.getAdmin(username);
    if (
      (admin.password && !password) ||
      (admin.password && !bcrypt.compareSync(password, admin.password))
    ) {
      throw new ValidatorError('Wrong password', 'password');
    }
    return jwt.sign({ name: username }, process.env.SECRET, { expiresIn: '2h' });
  }
  async getAdmin(name) {
    const admin = await adminRepository.getAdmin(name);
    if (!admin) {
      throw new NotFoundError('Admin with this name does not exist');
    }
    return admin;
  }
  async getAdmins({ filter = {}, sort = { _id: -1 }, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    return await adminRepository.getAdmins({ filter, sort, limit, skip });
  }
  async getAdminsHistory({ sort = { _id: -1 }, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    return await adminHistoryRepository.getHistory({ sort, limit, skip });
  }
  async getAdminsHistoryCount({ limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const total = await adminHistoryRepository.getHistoryCount();
    return { limit, skip, total };
  }
  async countAdmins({ filter = {}, limit = 10, page = 1 }) {
    const skip = (page - 1) * limit;
    const total = await adminRepository.countAdmins({ filter });
    return { limit, skip, total };
  }
  async createAdmin() {
    const adminData = { created: getNowTimestamp(), name: uuid() };
    const createdAdmin = await adminRepository.createAdmin(adminData);
    await adminHistoryRepository.createHistory(adminData);
    return createdAdmin.ops[0];
  }
  async updateAdmin(data) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password);
    }
    await adminRepository.updateAdmin(data);
    const [updatedAdmin] = await this.getAdmins({ filter: { isMain: true } });
    return updatedAdmin;
  }
  async deleteAdmin(name) {
    const adminToDelete = await this.getAdmin(name);
    if (adminToDelete.isMain) {
      throw new ValidatorError('Main admin can not be deleted');
    }
    await adminRepository.deleteAdmin(name);
    return adminToDelete._id;
  }
}

module.exports = { adminService: new AdminService() };
