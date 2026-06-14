const express = require('express');
const { getUsers, updateUserTier, deleteUser, getAdminStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/users', getUsers);
router.put('/users/tier', updateUserTier);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);

module.exports = router;
