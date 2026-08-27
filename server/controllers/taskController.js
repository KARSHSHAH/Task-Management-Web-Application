const Task = require('../models/Task');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status, assignedTo } = req.body;

    // Users can only assign tasks to themselves unless they are managers/admins
    let finalAssignee = req.user._id;
    
    if ((req.user.role === 'Manager' || req.user.role === 'Admin') && assignedTo) {
      finalAssignee = assignedTo;
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo: finalAssignee,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { keyword, status, priority, sort, page, limit } = req.query;

    // 1. Build Base Query (Role-based access)
    let filter = {};
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      filter.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    // 2. Search (by title)
    if (keyword) {
      filter.title = {
        $regex: keyword,
        $options: 'i', // case-insensitive
      };
    }

    // 3. Filters (Status, Priority)
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter);

    // 4. Sorting
    if (sort) {
      // sort can be passed as 'dueDate,-priority' (ascending dueDate, descending priority)
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // default sort
    }

    // 5. Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    
    query = query.skip(startIndex).limit(limitNum);

    // Populate user references
    query = query.populate('assignedTo', 'name email').populate('createdBy', 'name');

    // Execute query
    const tasks = await query;

    // Get total document count for pagination info
    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization: Admin/Manager can view any. User can only view their own
    if (
      req.user.role === 'User' && 
      task.assignedTo._id.toString() !== req.user._id.toString() &&
      task.createdBy._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this task');
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization
    if (
      req.user.role === 'User' && 
      task.assignedTo.toString() !== req.user._id.toString() &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name').populate('createdBy', 'name');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization: User can only delete if they created it
    if (
      req.user.role === 'User' && 
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
