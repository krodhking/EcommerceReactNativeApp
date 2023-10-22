import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import UserReducer from "./redux/UserReducer";
import { getDefaultMiddleware } from '@reduxjs/toolkit';

export default configureStore({
    reducer:{
        cart:CartReducer,
        user:UserReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }),
})