import { createContext } from "react";



export interface ToastType {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  type?: "success" | "error" | "info";
  duration?: number;
}


export interface ToastContextType {
  toasts: ToastType[];
  addToast: (toast: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType>(null!);





