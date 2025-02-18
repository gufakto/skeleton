"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for context state
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create a context with default values
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

// Create a provider component to wrap the app
export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to update loading state
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use loading state in any component
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
