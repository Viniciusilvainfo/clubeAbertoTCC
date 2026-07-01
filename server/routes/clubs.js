const router = require('express').Router();
const ctrl = require('../controllers/clubController');
const { authenticate, optionalAuthenticate, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');

const upload = multer({
	storage: multer.diskStorage({
		destination: path.join(__dirname, '..', 'uploads'),
		filename: (req, file, cb) => {
			const ext = path.extname(file.originalname).toLowerCase() || '.png';
			cb(null, `${Date.now()}-${randomUUID()}${ext}`);
		},
	}),
});

router.get('/', ctrl.listClubs);
router.get('/:id', ctrl.getClub);
router.get('/:id/summary', optionalAuthenticate, ctrl.getClubSummary);
router.get('/:id/years', optionalAuthenticate, ctrl.getClubYears);

router.post('/', authenticate, requireRole('platform_admin'), upload.single('logo'), ctrl.createClub);
router.put('/:id', authenticate, requireRole('platform_admin', 'club_admin'), upload.single('logo'), ctrl.updateClub);

router.delete('/:id', authenticate, requireRole('platform_admin'), ctrl.deleteClub);

module.exports = router;
