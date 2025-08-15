import { React, createContext, useReducer } from 'react';





const CartContext = createContext(); 
const cartReducer = (state , action) => {
    switch (action.type) { 
        case 'remove': 
            return {
              
            }
    }
}

const initialState = [];
export default function cartProvider({children}){
    const [cartProducts, dispatch] = useReducer(cartReducer, initialState);
    const [cartData, setCartData] = useState([]);
    <CartContext value={(setCartData , cartData)}>{children}</CartContext>;
}



export const useCart = () => {
    return CartContext;
}

