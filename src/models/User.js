// src/models/User.js
const supabase = require('../database/supabase');
const bcrypt = require('bcryptjs');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, name }])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return { id: data.id, email: data.email, name: data.name };
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;