const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

/**
 * POST /api/leaves
 * Submit a new leave request (Employees only)
 */
async function applyLeave(req, res, next) {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user._id;

    // 1. Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields (leaveType, startDate, endDate, reason) are required.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 2. Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date formats provided.'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date.'
      });
    }

    // Normalized to remove time components for overlap check
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // 3. Prevent overlapping pending or approved leave requests
    const overlappingRequest = await LeaveRequest.findOne({
      employee: employeeId,
      status: { $in: ['pending', 'approved'] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    if (overlappingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have an overlapping pending or approved leave request for this date range.'
      });
    }

    // 4. Create request
    const leaveRequest = new LeaveRequest({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason
    });

    await leaveRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leaveRequest
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/leaves/my
 * Fetch personal leave history for the logged-in employee
 */
async function getMyLeaves(req, res, next) {
  try {
    const employeeId = req.user._id;
    const { status } = req.query;

    const filter = { employee: employeeId };
    if (status) {
      filter.status = status;
    }

    const history = await LeaveRequest.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/leaves/:id
 * Cancel a pending leave request (Employee owners only)
 */
async function cancelLeave(req, res, next) {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const request = await LeaveRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // 1. Authorize owner
    if (request.employee.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not own this request'
      });
    }

    // 2. Validate state
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be cancelled.'
      });
    }

    await LeaveRequest.findByIdAndDelete(requestId);

    return res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully'
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/leaves (HR Only)
 * Review all employee leave applications
 */
async function getAllLeaves(req, res, next) {
  try {
    const { status, leaveType, employeeId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    if (employeeId) {
      const userDoc = await User.findOne({ employeeId: employeeId.trim() });
      if (!userDoc) {
        return res.status(200).json({
          success: true,
          data: []
        });
      }
      filter.employee = userDoc._id;
    }

    const requests = await LeaveRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'employee',
        select: 'employeeId email'
      });

    return res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/leaves/:id/approve (HR Only)
 * Approve a pending leave application
 */
async function approveLeave(req, res, next) {
  try {
    const requestId = req.params.id;
    const { reviewComment } = req.body;

    const request = await LeaveRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be reviewed.'
      });
    }

    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.reviewComment = reviewComment || '';

    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: request
    });

  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/leaves/:id/reject (HR Only)
 * Reject a pending leave application
 */
async function rejectLeave(req, res, next) {
  try {
    const requestId = req.params.id;
    const { reviewComment } = req.body;

    const request = await LeaveRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be reviewed.'
      });
    }

    request.status = 'rejected';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.reviewComment = reviewComment || '';

    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: request
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  applyLeave,
  getMyLeaves,
  cancelLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave
};
