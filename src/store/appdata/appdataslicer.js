import { createSlice } from "@reduxjs/toolkit";
const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('aviatorState', serializedState);
    } catch (err) {
       
    }
};

const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('aviatorState');
        if (serializedState === null) {
            return undefined; 
        }
        return JSON.parse(serializedState);
    } catch (err) {
       
        return undefined;
    }
};
const persistedState = loadStateFromLocalStorage();

const initialState = persistedState || {
    userInfo: undefined,
    userId: undefined,
    isSignedIn: undefined,
    appDataErrorResp: undefined
};


export const appDataSlicer = createSlice({
    name: "aviatordata",
    initialState,
    reducers: {
        setUserInfoAct: (state, action) => {
            const data = action.payload;
            state.userInfo = action.payload;
            if (data.userId || data.userid) {
                state.userId = data.userId ? data.userId : data.userid;
                state.isSignedIn = true;
            }
            saveStateToLocalStorage(state);
        },
        setClearAppDataAct: (state) => {
            state.userInfo = undefined;
            state.userId = undefined;
            state.isSignedIn = false;
        },
        setAppDataErrorAct: (state, action) => {
            state.appDataErrorResp = action.payload;
        }
    }
});



export default appDataSlicer.reducer;
export const {  setUserInfoAct
    , setClearAppDataAct, setAppDataErrorAct } = appDataSlicer.actions;