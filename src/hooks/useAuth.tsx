// Authentication disabled - mock user for development
const mockUser = {
  id: 'dev-admin-user',
  email: 'admin@dev.local',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const mockSession = {
  access_token: 'dev-token',
  refresh_token: 'dev-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser
};

export const useAuth = () => {
  return {
    user: mockUser as any,
    session: mockSession as any,
    loading: false,
    signUp: async (_email?: string, _password?: string, _operatorId?: string) => ({ error: null }),
    signIn: async (_email?: string, _password?: string) => ({ error: null }),
    signOut: async () => {},
    linkOperator: async (_operatorId?: string) => ({ error: null })
  };
};