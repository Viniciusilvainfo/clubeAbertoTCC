const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('platform_admin'));

router.get('/stats', ctrl.getDashboardStats);
router.get('/report', ctrl.getFinancialReport);
router.get('/pending-transactions', ctrl.getPendingTransactions);
router.patch('/transactions/:id/validate', ctrl.validateTransaction);

module.exports = router;
