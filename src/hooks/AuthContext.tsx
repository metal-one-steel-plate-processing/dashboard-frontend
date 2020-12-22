import React, { createContext, useCallback, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

interface AuthState {
  token: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: {
    name: string;
  };
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: {
    name: string;
  };
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  filtersOptions(filtersSelected: Filters): void;
  filtersData: Filters;
}

interface Filters {
  filterFactories: [{ description: string }] | [];
  filterGroups: string[];
  filterMachines: string[];
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [filters, setFilters] = useState<Filters>({
    filterFactories: [],
    filterGroups: [],
    filterMachines: [],
  });
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Dashboard:token');
    const user = localStorage.getItem('@Dashboard:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@Dashboard:token', token);
      localStorage.setItem('@Dashboard:user', JSON.stringify(user));

      setData({ token, user });
    } catch (error) {
      toast.error('Authenticated failed, check your credentials');
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Dashboard:token');
    localStorage.removeItem('@Dashboard:user');

    setData({} as AuthState);
  }, []);

  const filtersOptions = useCallback((filtersSelected: Filters) => {
    setFilters({
      filterFactories: filtersSelected.filterFactories,
      filterGroups: filtersSelected.filterGroups,
      filterMachines: filtersSelected.filterMachines,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        filtersOptions,
        filtersData: filters,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
