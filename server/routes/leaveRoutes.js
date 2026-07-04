const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  cancelLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Employee routes
router.post('/', protect, applyLeave);
router.get('/my', protect, getMyLeaves);
router.delete('/:id', protect, cancelLeave);

// HR routing
router.get('/', protect, authorizeRoles('hr'), getAllLeaves);
router.put('/:id/approve', protect, authorizeRoles('hr'), approveLeave);
router.put('/:id/reject', protect, authorizeRoles('hr'), rejectLeave);

module.exports = router;
