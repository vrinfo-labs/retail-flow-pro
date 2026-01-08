
import { supabase } from './integrations/supabase/client';

async function createAdminUser() {
  const adminEmail = 'test-admin@example.com';
  const adminPassword = 'password123';
  const adminFullName = 'Test Admin';
  const adminRole = 'admin';

  console.log('Starting admin user creation...');

  try {
    // 1. Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (authError) {
      // Check for "User already exists" error
      if (authError.message.includes("User already exists")) {
          console.log(`User with email ${adminEmail} already exists. Attempting to ensure admin role.`);
          // If user exists, find their ID and ensure they are admin.
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          const existingUser = users.find(u => u.email === adminEmail);

          if (listError || !existingUser) {
              throw new Error(`Failed to retrieve existing user: ${listError?.message || 'User not found'}`);
          }
          const userId = existingUser.id;

          // Update role
          const { error: roleError } = await supabase
              .from('user_roles')
              .update({ role: adminRole })
              .eq('user_id', userId);
          if (roleError) {
              throw new Error(`Failed to update role for existing user: ${roleError.message}`);
          }
          console.log(`Successfully ensured user ${adminEmail} has admin role.`);

          // Update profile
          const { error: profileError } = await supabase
              .from('profiles')
              .update({ full_name: adminFullName, status: 'active' }) // also ensure status is active
              .eq('id', userId);
          if (profileError) {
             // this is not fatal
             console.warn(`Could not update profile for existing user: ${profileError.message}`);
          }

          return; // Exit script
      }
      throw new Error(`Auth user creation failed: ${authError.message}`);
    }
    if (!authData.user) {
        throw new Error('Could not create user object');
    }

    const newUser = authData.user;
    console.log('Successfully created auth user:', newUser.id);

    // The 'handle_new_user' trigger has now fired.
    // It creates a profile and a user_role entry (with 'operador').
    // I need to UPDATE the profile and the role.

    // 2. Update profile with full name.
    console.log('Updating profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: adminFullName })
      .eq('id', newUser.id); // Let's assume profile PK is `id` and is FK to auth.users.id

    if (profileError) {
      // This might not be a fatal error, maybe log it and continue
      console.warn(`Could not update profile: ${profileError.message}. This might be due to schema mismatch (e.g., 'nome' vs 'full_name'). Continuing...`);
    } else {
        console.log('Successfully updated profile.');
    }

    // 3. Update the role in user_roles from 'operador' to 'admin'
    console.log('Updating user role...');
    const { data, error: roleError } = await supabase
      .from('user_roles')
      .update({ role: adminRole })
      .eq('user_id', newUser.id)
      .select(); // select to see if it found and updated a row

    if (roleError) {
      throw new Error(`Role update failed: ${roleError.message}`);
    }

    if (!data || data.length === 0) {
        console.warn("Could not find a role to update. Let's try inserting it.");
        const { error: roleInsertError } = await supabase
            .from('user_roles')
            .insert({ user_id: newUser.id, role: adminRole });
        if (roleInsertError) {
            throw new Error(`Role insertion failed: ${roleInsertError.message}`);
        }
    }

    console.log(`Successfully set user role to '${adminRole}'.`);
    console.log('Admin user creation script finished successfully!');
    console.log(`\n--- Credentials ---`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`-------------------`);


  } catch (error: any) {
    console.error('Error during admin user creation:', error.message);
    process.exit(1);
  }
}

createAdminUser();
