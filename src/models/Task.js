// src/models/Task.js
const supabase = require('../database/supabase');

class Task {
  static async create({ title, description, userId }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, description, user_id: userId }])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      isCompleted: data.is_completed,
      createdAt: data.created_at
    };
  }

  static async findAllByUser(userId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, is_completed, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.is_completed,
      createdAt: task.created_at
    }));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, is_completed, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      isCompleted: data.is_completed,
      createdAt: data.created_at
    };
  }

  static async update(id, { title, description, isCompleted }) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        title, 
        description, 
        is_completed: isCompleted,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      isCompleted: data.is_completed,
      createdAt: data.created_at
    };
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  }

  static async findByUserAndId(userId, taskId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
}

module.exports = Task;