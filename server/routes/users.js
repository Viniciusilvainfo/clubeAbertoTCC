const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

router.delete('/me', authenticate, ctrl.deleteCurrentUser);

router.use(authenticate, requireRole('platform_admin'));

router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUser);
router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;
