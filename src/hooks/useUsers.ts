import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'gerente' | 'operador';
  last_sign_in_at: string | null;
  status: 'active' | 'inactive';
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        throw authError;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        throw profilesError;
      }

      const combinedUsers = authUsers.map(user => {
        const profile = profiles.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email || '',
          full_name: profile?.full_name || 'N/A',
          role: profile?.role || 'operador',
          last_sign_in_at: user.last_sign_in_at,
          status: profile?.status || 'inactive',
        };
      });

      setUsers(combinedUsers as User[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: Omit<User, 'id' | 'last_sign_in_at' | 'status'> & { password?: string }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true, // Auto-confirm email for simplicity
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Could not create user');

      const newUser = authData.user;

      const { error: profileError } = await supabase.from('profiles').insert({
        id: newUser.id,
        full_name: userData.full_name,
        role: userData.role,
        status: 'active',
      });

      if (profileError) throw profileError;

      // Refresh user list
      await fetchUsers();

      return { ...userData, id: newUser.id, last_sign_in_at: null, status: 'active' };

    } catch (err: any) {
      console.error("Error creating user:", err);
      throw new Error(err.message);
    }
  };


  return { users, loading, error, createUser };
}
