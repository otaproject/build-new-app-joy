export type UserRole = 'admin' | 'operator';

// Authentication disabled - always return admin role
export const useRole = () => {
  return {
    profile: { id: 'dev-user', operator_id: null, role: 'admin' as UserRole },
    role: 'admin' as UserRole,
    isAdmin: true,
    isOperator: false,
    loading: false,
    error: null,
    updateRole: async () => ({ error: null })
  };
};