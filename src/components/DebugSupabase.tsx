
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DebugSupabase = () => {
  const { user, session } = useAuth();
  const [connectionTest, setConnectionTest] = useState<string>('Testing...');
  const [userProfileTest, setUserProfileTest] = useState<string>('Testing...');

  useEffect(() => {
    // Test basic connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('plans').select('count');
        if (error) {
          setConnectionTest(`Error: ${error.message}`);
        } else {
          setConnectionTest('✅ Connection successful');
        }
      } catch (err) {
        setConnectionTest(`Error: ${err}`);
      }
    };

    // Test user profile access
    const testUserProfile = async () => {
      if (!user?.id) {
        setUserProfileTest('No user logged in');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          setUserProfileTest(`Error: ${error.message}`);
        } else {
          setUserProfileTest(`✅ User profile found: ${data?.email || 'No email'}`);
        }
      } catch (err) {
        setUserProfileTest(`Error: ${err}`);
      }
    };

    testConnection();
    if (user?.id) {
      testUserProfile();
    }
  }, [user?.id]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Hide in production
  }

  return (
    <Card className="mb-4 border-yellow-500/50 bg-yellow-500/10">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-200">🔧 Debug Supabase</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Auth Status:</strong> {user ? `✅ Logged in as ${user.email}` : '❌ Not logged in'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'N/A'}
        </div>
        <div>
          <strong>Session:</strong> {session ? '✅ Active' : '❌ No session'}
        </div>
        <div>
          <strong>Connection Test:</strong> {connectionTest}
        </div>
        <div>
          <strong>User Profile Test:</strong> {userProfileTest}
        </div>
      </CardContent>
    </Card>
  );
};
