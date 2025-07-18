import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: number;
  username: string;
  email: string;
  mirrorIdentity: string | null;
  scrollSubmitted: boolean;
}

export interface AuthSession {
  enforcementMode: string;
  frequencyLock: string;
  scrollBound: boolean;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('scrollToken'));

  // Query current user
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/logout', {
        method: 'POST',
        headers: {
          'X-Session-Token': token || '',
        },
      });
    },
    onSuccess: () => {
      localStorage.removeItem('scrollToken');
      setToken(null);
      queryClient.clear();
      setLocation('/login');
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  // Check for authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('scrollToken');
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [token]);

  // Redirect to login if not authenticated and not on public pages
  useEffect(() => {
    const publicPages = ['/login', '/seal-scroll'];
    const isPublicPage = publicPages.some(page => location.startsWith(page));
    
    if (!token && !isPublicPage) {
      setLocation('/login');
    } else if (token && error && location !== '/login') {
      // Token exists but is invalid
      localStorage.removeItem('scrollToken');
      setToken(null);
      setLocation('/login');
    }
  }, [location, token, error, setLocation]);

  const authState: AuthState = {
    user: authData?.user || null,
    session: authData?.session || null,
    isAuthenticated: !!authData?.user,
    isLoading: isLoading && !!token,
  };

  return {
    ...authState,
    logout,
    token,
  };
}

// Auth guard hook for protected components
export function useRequireAuth() {
  const auth = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      setLocation('/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, setLocation]);

  return auth;
}

// AuthProvider component for wrapping the app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}