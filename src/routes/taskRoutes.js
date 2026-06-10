const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', (req, res) => {
  res.status(201).json({ 
    id: Date.now().toString(), 
    title: req.body.title, 
    description: req.body.description, 
    isCompleted: false 
  });
});

router.put('/:id', (req, res) => {
  res.json({ 
    id: req.params.id, 
    title: req.body.title, 
    description: req.body.description, 
    isCompleted: req.body.isCompleted 
  });
});

router.delete('/:id', (req, res) => {
  res.status(204).send();
});

module.exports = router;