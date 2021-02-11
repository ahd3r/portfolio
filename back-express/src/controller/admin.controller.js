const { adminService } = require('../service/admin.service');

class AdminController {
  async authAdmin(req, res, next) {
    try {
      res.body = { token: await adminService.authAdmin(req.body.user, req.body.password) };
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async getAdmins(req, res, next) {
    try {
      if (req.url === '/admin/main') {
        const [admin] = await adminService.getAdmins({
          filter: { isMain: true },
          sort: req.sort,
          page: req.page,
          limit: req.limit
        });
        res.body = admin;
      } else {
        res.body = await adminService.getAdmins({
          filter: req.filter,
          sort: req.sort,
          page: req.page,
          limit: req.limit
        });
        res.pagination = await adminService.countAdmins({
          filter: req.filter,
          page: req.page,
          limit: req.limit
        });
        res.pagination.inPage = res.body.length;
      }
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async getAdminsHistory(req, res, next) {
    try {
      res.body = await adminService.getAdminsHistory({
        sort: req.sort,
        page: req.page,
        limit: req.limit
      });
      res.pagination = await adminService.getAdminsHistoryCount({
        page: req.page,
        limit: req.limit
      });
      res.pagination.inPage = res.body.length;
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async createAdmin(req, res, next) {
    try {
      res.body = await adminService.createAdmin();
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async updateAdmin(req, res, next) {
    try {
      res.body = await adminService.updateAdmin(req.body);
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async deleteAdmin(req, res, next) {
    try {
      res.body = await adminService.deleteAdmin(req.params.name);
      return next();
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = { adminController: new AdminController() };
