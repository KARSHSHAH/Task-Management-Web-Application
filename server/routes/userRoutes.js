const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Admin'), getUsers);

router.route('/:id')
  .delete(protect, authorize('Admin'), deleteUser)
  .put(protect, authorize('Admin'), updateUserRole);

module.exports = router;
