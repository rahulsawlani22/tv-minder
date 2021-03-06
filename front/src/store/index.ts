import { Action, AnyAction, applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import { userReducer, UserState } from './user/reducers';
import { tvReducer, TvState } from './tv/reducers';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;
export type AppThunkPlainAction = () => void;

export type AppState = {
  user: UserState;
  tv: TvState;
};

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['user'],
};

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['hasLocalWarningToastBeenShown'],
};

const tvPersistConfig = {
  key: 'tv',
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  tv: persistReducer(tvPersistConfig, tvReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default (): {
  store: Store<{}, Action<any>> & {
    dispatch: unknown;
  };
  persistor: Persistor;
} => {
  const store = createStore(persistedReducer, composeWithDevTools(appliedMiddleware));
  const persistor = persistStore(store);

  return { store, persistor };
};
