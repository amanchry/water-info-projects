import React from "react";

import { LoaderProvider } from "./LoaderContext";
import { AlertProvider } from "./AlertContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthProvider";
import GlobalProvider from "./GlobalProvider";

export default function wrapContexts({ children, session }) {
  return (
    <>
      <AuthProvider session={session}>
          <GlobalProvider>
            <LoaderProvider>
              <ToastProvider>
                <AlertProvider>

                    {children}

                </AlertProvider>
              </ToastProvider>
            </LoaderProvider>
          </GlobalProvider>
      </AuthProvider>
    </>
  );
}
