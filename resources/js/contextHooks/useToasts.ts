
import { useContext } from "react"
import { ToastContext } from '@/context/ToastesContext';


export const useToasts = () => {
    const toasts = useContext(ToastContext) ; 
    if(!toasts) throw new Error("toasts context should e passed din the provider ") ; 
    return toasts
}