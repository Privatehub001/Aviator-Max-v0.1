import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  landtexture: [],
  runtexture: [],
  jumptexture:[],
};

const textureSlice = createSlice({
  name: 'texture',
  initialState,
  reducers: {
      setruntexture: (state, action) => {
        state.runtexture = action.payload;
      },
      setjumptexture: (state, action) => {
        state.jumptexture = action.payload;
      },
      setlandtexture:(state,action)=>{
        state.landtexture = action.payload;
      }
  },
});

export default textureSlice.reducer;