const Command = require('../models/Command');

exports.getAllCommands = async (req, res) => {
  try {
    const commands = await Command.find({ user: req.user.userId });
    res.json(commands);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching commands' });
  }
};

exports.createCommand = async (req, res) => {
  try {
    const { title, command, category } = req.body;

    const newCommand = new Command({
      title,
      command,
      category,
      user: req.user.userId
    });

    await newCommand.save();
    res.status(201).json(newCommand);
  } catch (err) {
    res.status(500).json({ message: 'Error creating command' });
  }
};

exports.getCommandsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const commands = await Command.find({
      user: req.user.userId,
      category
    });
    res.json(commands);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching commands' });
  }
};

exports.deleteCommand = async (req, res) => {
  try {
    const { id } = req.params;
    const command = await Command.findOneAndDelete({
      _id: id,
      user: req.user.userId
    });

    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }

    res.json({ message: 'Command deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting command' });
  }
};