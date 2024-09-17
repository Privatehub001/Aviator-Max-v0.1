import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootreducer";
import {
    persistReducer,
    persistStore,
    PERSIST
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['appData','texture'],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [PERSIST],
        },
    })]
})

export default store;

export const persistor = persistStore(store);
