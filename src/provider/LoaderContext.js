'use client';
import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const useLoaderContext = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ setIsLoading }}>
      {isLoading && (
        <div className="loader_container">
          <div className="loader">
            <div className="loader_line"></div>
          </div>

        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
};
