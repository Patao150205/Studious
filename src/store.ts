import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/usersSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});
