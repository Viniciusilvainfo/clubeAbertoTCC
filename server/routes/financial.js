const router = require('express').Router();
const ctrl = require('../controllers/financialController');
const { authenticate, optionalAuthenticate, requireRole } = require('../middleware/auth');

router.get('/categories', ctrl.listCategories);
router.get('/transactions', optionalAuthenticate, ctrl.listTransactions);
router.get('/transactions/:id', optionalAuthenticate, ctrl.getTransaction);
router.get('/compare', optionalAuthenticate, ctrl.compareClubs);
router.get('/monthly/:club_id/:fiscal_year', optionalAuthenticate, ctrl.getMonthlyBreakdown);
router.get('/category-breakdown/:club_id/:fiscal_year/:type', optionalAuthenticate, ctrl.getCategoryBreakdown);

router.post('/transactions', authenticate, requireRole('platform_admin', 'club_admin'), ctrl.createTransaction);
router.put('/transactions/:id', authenticate, requireRole('platform_admin', 'club_admin'), ctrl.updateTransaction);
router.delete('/transactions/:id', authenticate, requireRole('platform_admin', 'club_admin'), ctrl.deleteTransaction);

module.exports = router;
