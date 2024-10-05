import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import themeSlice from "./reducers/theme";
import userSlice from "./reducers/user";
import stocksSlice from "./reducers/stocks";

// configure redux store
const store = configureStore({
  reducer: {
    theme: themeSlice,
    user: userSlice,
    stocks: stocksSlice,
  },
});

// Infer the RootState and AppDispatch types from the store itself
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// redux hook for updating data
export const useAppDispatch = () => useDispatch<AppDispatch>();

// redux hook for reading data
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
