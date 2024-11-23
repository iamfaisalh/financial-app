import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Stock {
  symbol: string;
  company_name: string;
  company_name_upper: string;
}

export interface StockData {
  id: string;
  symbol: string;
  company_name: string;
  industry: string;
  sector: string;
}

export interface UserStock {
  id: string;
  user_id: string;
  stock_id: string;
  quantity: number;
  stock: StockData;
  website: string;
}

export interface Transaction {
  id: string;
  stock_id: string;
  transaction_type: "buy" | "sell";
  quantity: number;
  cost_per_share: number;
  total_cost: number;
  created_at: string;
  stock: StockData;
}

interface StocksState {
  data: Stock[];
  didLoad: boolean;
}

const initialState: StocksState = {
  data: [],
  didLoad: false,
};

// will be used to initialize the list of available stocks when the user is authenticated
export const initializeStocksThunk = createAsyncThunk(
  "stocks/init",
  async () => {
    try {
      const response = await fetch("/data/stocks.json");
      const data: Stock[] = await response.json();

      return { data };
    } catch (error) {
      return { data: [] } as { data: Stock[] };
    }
  }
);

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(initializeStocksThunk.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.didLoad = true;
    });
  },
});

export default stocksSlice.reducer;
