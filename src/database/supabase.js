// src/database/supabase.js
const { createClient } = require('@supabase/supabase-js');

// Usar SERVICE_KEY que tiene todos los permisos
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('🔌 Conectando a Supabase con Service Key...');
console.log('📡 URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Conectado a Supabase con permisos completos');

module.exports = supabase;