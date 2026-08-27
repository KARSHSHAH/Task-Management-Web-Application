const Note = require('../models/Note');

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id }).sort('-createdAt');

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, color } = req.body;

    const note = await Note.create({
      title,
      content,
      color,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    // Check authorization: User can only update their own notes
    if (note.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this note');
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    // Check authorization: User can only delete their own notes
    if (note.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this note');
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
