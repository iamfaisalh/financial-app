import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
}

interface UserState {
  data: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: UserState = {
  data: null,
  isAuthenticated: false,
  loading: true,
};

// will be used to check if a user is logged in when the app loads
export const validateUserAuthThunk = createAsyncThunk("user/auth", async () => {
  try {
    const response = await api.get("/auth/validate");
    return {
      isAuthenticated: response.data.is_authenticated,
      user: response.data.user,
    };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.data = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.data = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(validateUserAuthThunk.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.data = action.payload.user;
      state.loading = false;
    });
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
