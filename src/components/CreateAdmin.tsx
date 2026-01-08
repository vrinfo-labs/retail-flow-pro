
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// WARNING: This component uses hardcoded admin credentials and service role key for a one-time setup.
// It should be deleted immediately after the admin user is created.

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpta25zd2VqZ2RjYnNibWdjc2RlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzg3NDgwNCwiZXhwIjoyMDgzNDUwODA0fQ.x80VWhdF52lLKyoTBeNc7TJajjAvLCt7qfg3gL9-Aks';

const supabaseAdmin = supabase;
// Temporarily re-assign the admin client for this one-off operation

export function CreateAdmin() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'password123',
        email_confirm: true,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Could not create auth user');

      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: authData.user.id,
        full_name: 'Admin User',
        role: 'admin',
        status: 'active',
      });

      if (profileError) throw profileError;

      toast({
        title: 'Success!',
        description: 'Admin user "admin@example.com" created successfully.',
      });

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Error Creating Admin',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999, background: 'white', padding: '1rem', border: '1px solid black', borderRadius: '5px' }}>
      <h4>Temporary Admin Creator</h4>
      <p>Email: admin@example.com</p>
      <p>Password: password123</p>
      <Button onClick={handleCreateAdmin} disabled={loading}>
        {loading ? 'Creating...' : 'Create Admin User'}
      </Button>
      <p><small>This component should be deleted after use.</small></p>
    </div>
  );
}

// We need to re-create the client here because the original one is read-only.
import { createClient } from '@supabase/supabase-js';
