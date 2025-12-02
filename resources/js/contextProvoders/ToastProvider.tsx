import { ToastContext, ToastType } from "@/context/ToastesContext";
import {  useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";




const ToastProvider = ({children}:{children : React.ReactNode}) => {
        const [toasts ,  setToasts] = useState<ToastType[]>([]);
        const toastContainerRef = useRef<HTMLDivElement|null>(null)
        const addToast: (toast: ToastType) => void = (toast: ToastType) => {
                const id = uuidv4();
                setToasts(prev => [...prev , {...toast , id}])

            // remove the toast after a delay 
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, toast.duration || 3000);
        };

        const removeToast: (id: string) => void = (id : string) => {
            
            setToasts(prev => prev.filter(t => t.id !== id));
           
        }

        return (
            <ToastContext.Provider value={{toasts ,  addToast , removeToast , toastContainerRef}}>
               {children}
            </ToastContext.Provider>
        )
}


 ;

export default ToastProvider