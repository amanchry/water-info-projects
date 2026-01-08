"use client";
import React, { createContext, useContext, useState } from "react";
import * as Toast from "@radix-ui/react-toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info"); // "success" | "error" | "info"

  const showToast = (msg, variant = "info") => {
    setMessage(msg);
    setType(variant);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Radix Toast */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          duration={3000} // auto close in 3s
          className={`fixed bottom-5 right-5 w-[280px] rounded-lg px-4 py-3 shadow-lg text-white 
            ${
              type === "success"
                ? "bg-green-600"
                : type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
        >
          <Toast.Description className="mt-1 text-sm">{message}</Toast.Description>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-2 p-4" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};
