import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import artistsReducer from './features/artists/artistsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    artists: artistsReducer,
  },
});
