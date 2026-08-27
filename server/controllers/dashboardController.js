const Task = require('../models/Task');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    let matchStage = {};

    // Role-based filtering
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      matchStage.$or = [
        { assignedTo: req.user._id }, 
        { createdBy: req.user._id }
      ];
    }

    const now = new Date();

    // Using MongoDB Aggregation Pipeline for single-query high performance
    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $facet: {
          total: [{ $count: "count" }],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          priorityCounts: [
            { $group: { _id: "$priority", count: { $sum: 1 } } }
          ],
          overdue: [
            { 
              $match: { 
                dueDate: { $lt: now }, 
                status: { $ne: 'Completed' } 
              } 
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    // Format the aggregation result to a simple, flat object for the frontend
    const result = stats[0];
    const formatCount = (arr) => arr.length > 0 ? arr[0].count : 0;

    const formattedStats = {
      totalTasks: formatCount(result.total),
      completedTasks: result.statusCounts.find(s => s._id === 'Completed')?.count || 0,
      inProgressTasks: result.statusCounts.find(s => s._id === 'In Progress')?.count || 0,
      pendingTasks: result.statusCounts.find(s => s._id === 'Todo')?.count || 0,
      highPriorityTasks: 
        (result.priorityCounts.find(p => p._id === 'High')?.count || 0) + 
        (result.priorityCounts.find(p => p._id === 'Urgent')?.count || 0),
      overdueTasks: formatCount(result.overdue)
    };

    res.json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
