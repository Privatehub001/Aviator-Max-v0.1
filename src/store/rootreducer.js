import { combineReducers } from "@reduxjs/toolkit";
import aviatordata from "./appdata/appdataslicer";
import texture from './appdata/textureslier';
const rootReducer = combineReducers({
    aviatordata,
    texture
});

export default rootReducer;