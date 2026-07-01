const router = require('express').Router();
const ctrl = require('../controllers/suggestionController');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, ctrl.createSuggestion);
router.get('/', authenticate, requireRole('platform_admin', 'club_admin'), ctrl.listSuggestions);
router.patch('/:id/review', authenticate, requireRole('platform_admin', 'club_admin'), ctrl.reviewSuggestion);
router.delete('/:id', authenticate, requireRole('platform_admin'), ctrl.deleteSuggestion);

module.exports = router;
