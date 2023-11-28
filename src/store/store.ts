import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { filtersApi } from './services/filtersApi';
import managerSlice from './managerSlice';
import filtersSlice from './filtersSlice';

export const store = configureStore({
    reducer: {
        [filtersApi.reducerPath]: filtersApi.reducer,
        manager: managerSlice,
        filters: filtersSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }).concat(filtersApi.middleware),
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;