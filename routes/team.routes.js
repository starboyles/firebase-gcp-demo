// Team management routes
const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

router.use(authenticateUser);
router.post('/', TeamController.createTeam);
router.post('/:teamId/members', TeamController.addTeamMember);

module.exports = router;