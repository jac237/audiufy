import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topArtists: [],
  selectedArtists: [],
  searchResults: [],
};

const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {
    setTopArtists: (state, action) => {
      console.log('setTopArtists:', action);
      state.topArtists = action.payload.topArtists;
    },
    setClearResults: (state, action) => {
      console.log('setClearResults:', action);
      state.searchResults = [];
    },
    setAddResult: (state, action) => {
      console.log('setAddResult:', action);
      state.searchResults = [...state.searchResults, action.payload];
    },
    setSelectedArtists: (state, action) => {
      console.log('setSelectedArtists:', action);
      state.selectedArtists = action.payload;
    },
  },
});

export const {
  setTopArtists,
  setClearResults,
  setAddResult,
  setSelectedArtists,
} = artistsSlice.actions;

export const selectTopArtists = (state) => state.artists.topArtists;
export const selectSelectedArtists = (state) => state.artists.selectedArtists;
export const selectSearchResults = (state) => state.artists.searchResults;

export default artistsSlice.reducer;
