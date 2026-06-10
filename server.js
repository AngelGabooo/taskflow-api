// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ==================== RUTAS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Registrar usuario
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    // Verificar si el usuario ya existe
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear usuario
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password, name }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      user: { id: data[0].id, email: data[0].email, name: data[0].name }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error || !data) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    if (data.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({
      user: { id: data.id, email: data.email, name: data.name }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description: description || '', user_id: userId, is_completed: false }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar tarea
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        title, 
        description, 
        is_completed: isCompleted,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar tarea
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
  console.log(`📝 API disponible en: http://localhost:${PORT}/api/health`);
});