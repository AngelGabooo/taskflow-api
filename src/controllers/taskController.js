// src/controllers/taskController.js
const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAllByUser(req.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }
    
    const task = await Task.create({
      title,
      description: description || '',
      userId: req.userId
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    
    const existingTask = await Task.findByUserAndId(req.userId, id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    const updatedTask = await Task.update(id, {
      title: title || existingTask.title,
      description: description !== undefined ? description : existingTask.description,
      isCompleted: isCompleted !== undefined ? isCompleted : existingTask.is_completed
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingTask = await Task.findByUserAndId(req.userId, id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    await Task.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };