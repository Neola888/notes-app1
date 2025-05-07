const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const total = await Note.countDocuments();
    const notes = await Note.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const hasMore = skip + notes.length < total;

    res.json({ notes, hasMore });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};


exports.createNote = async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save note', error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};
