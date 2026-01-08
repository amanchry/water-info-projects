"use client";
import React, { createContext, useContext, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  // Call this instead of confirm()
  const confirmAlert = (msg, onConfirmCallback) => {
    setMessage(msg);
    setOnConfirm(() => onConfirmCallback);
    setOpen(true);
  };

  return (
    <AlertContext.Provider value={{ confirmAlert }}>
      {children}

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              Confirm Action
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-600">
              {message}
            </AlertDialog.Description>

            <div className="mt-4 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <button className="rounded-md bg-gray-100 px-3 py-1.5 text-sm">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                  }}
                >
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </AlertContext.Provider>
  );
};
