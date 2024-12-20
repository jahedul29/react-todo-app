import React, { createContext, useContext, useState, useMemo } from 'react';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTodos = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      refreshTrigger,
      refreshTodos,
    }),
    [refreshTrigger]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodoContext = () => useContext(TodoContext);
