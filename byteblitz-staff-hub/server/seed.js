require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./config/supabase');

async function seed() {
  try {
    // Create admin user if one doesn't exist
    const adminEmail = 'admin@byteblitz.co.uk';
    const adminPass = 'admin123';
    const { data: existingAdmin, error: fetchErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPass, 10);
      const { data: admin, error } = await supabase
        .from('users')
        .insert({ name: 'Admin', email: adminEmail, password_hash: hashed, role: 'admin' })
        .select('*')
        .single();
      if (error) throw error;
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', existingAdmin.email);
    }

    // Insert sample resources if none exist
    const { data: resources } = await supabase.from('resources').select('id');
    if (!resources || resources.length === 0) {
      const sampleResources = [
        {
          category: 'Cold Call Scripts',
          title: 'Introductory Call Script',
          description: 'Template for first contact with potential clients.',
          url: 'https://example.com/cold-call-script.pdf',
        },
        {
          category: 'Email Templates',
          title: 'Follow Up Email',
          description: 'Simple follow‑up email to send after initial contact.',
          url: 'https://example.com/follow-up-email.pdf',
        },
        {
          category: 'Training',
          title: 'Onboarding Guide',
          description: 'PDF guide for new sales reps explaining processes and tools.',
          url: 'https://example.com/onboarding-guide.pdf',
        },
      ];
      for (const res of sampleResources) {
        await supabase.from('resources').insert(res);
      }
      console.log('Inserted sample resources');
    }

    // Insert announcement if none exist
    const { data: messages } = await supabase.from('messages').select('id');
    if (!messages || messages.length === 0) {
      await supabase.from('messages').insert({ content: 'Welcome to the ByteBlitz Staff Hub! This is your announcement board.' });
      console.log('Inserted welcome message');
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database', err);
    process.exit(1);
  }
}

seed();