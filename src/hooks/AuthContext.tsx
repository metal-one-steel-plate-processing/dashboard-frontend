import React, { createContext, useCallback, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

interface AuthState {
  token: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: {
    name: string;
    id: string;
  };
}

interface SignInCredentials {
  email: string;
  password: string;
  timezone: string;
}

interface AuthContextData {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: {
    name: string;
    id: string;
  };
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  setFilterFactories(factoriesSelected: string[]): void;
  FactoriesSelected: string[];
  setFilterGroups(groupsSelected: string[]): void;
  GroupsSelected: string[];
  setFilterMachines(machinesSelected: FilterMachines[]): void;
  MachinesSelected: FilterMachines[];
}

interface FilterMachines {
  id: string;
  name: string;
  description: string;
  group: string;
  factory: string;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [FactoriesSelected, setFactoriesSelected] = useState<string[]>([]);
  const [GroupsSelected, setGroupsSelected] = useState<string[]>([]);
  const [MachinesSelected, setMachinesSelected] = useState<FilterMachines[]>(
    [],
  );
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Dashboard:token');
    const user = localStorage.getItem('@Dashboard:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('sessions', {
        email,
        password,
        timezone: MyTimezone,
      });

      const { token, user } = response.data;

      localStorage.setItem('@Dashboard:token', token);
      localStorage.setItem('@Dashboard:user', JSON.stringify(user));

      setData({ token, user });
    } catch (error) {
      toast.error('Authenticated failed, check your credentials');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Dashboard:token');
    localStorage.removeItem('@Dashboard:user');

    setData({} as AuthState);
  }, []);

  const setFilterFactories = useCallback(filterFactories => {
    setFactoriesSelected(filterFactories);
  }, []);

  const setFilterGroups = useCallback(filterGroups => {
    setGroupsSelected(filterGroups);
  }, []);

  const setFilterMachines = useCallback(filterMachines => {
    // console.log(filterMachines);
    setMachinesSelected(filterMachines);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        setFilterFactories,
        FactoriesSelected,
        setFilterGroups,
        GroupsSelected,
        setFilterMachines,
        MachinesSelected,
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
