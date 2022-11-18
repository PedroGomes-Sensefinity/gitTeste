import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { call, put, takeLatest } from "redux-saga/effects";
import { getUser, logout } from '../../../services/authService';
import permissionService, { Permissions } from "../../../services/permissionService";
import { getUserByToken } from "./authService";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  SetPermissions: "permissions/set",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  SetUser: "[Set User] Action",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  permissions: {}
};

export const reducer = persistReducer(
  { storage, key: "sense-ui-admin-auth", whitelist: ["authToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;

        return { authToken, user: undefined };
      }
      case actionTypes.SetPermissions: {
        const { permissions } = action.payload
        return { ...state, permissions }
      }

      case actionTypes.Logout: {
        logout();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const user = getUser();
        return { ...state, user };
      }

      case actionTypes.SetUser: {
        const { user } = action.payload;
        return { ...state, user };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: (authToken) => ({ type: actionTypes.Login, payload: { authToken } }),
  register: (authToken) => ({
    type: actionTypes.Register,
    payload: { authToken },
  }),
  userPermissions: (permissions) => ({ type: actionTypes.SetPermissions, payload: { permissions } }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: (user) => ({
    type: actionTypes.UserRequested,
    payload: { user },
  }),
  fulfillUser: (user) => ({ type: actionTypes.UserLoaded, payload: { user } }),
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    console.log('on login saga')
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    console.log('on user register')
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    console.log('on user requested')
    const { data: user } = yield getUserByToken();
    const permissions = yield call(permissionService.getUserPermissions)
    yield put(actions.userPermissions(permissions))
    yield put(actions.fulfillUser(user));
  });

  yield takeLatest(actionTypes.UserLoaded, function* UserLoaded() {
    try {
      const permArray = yield call(permissionService.getUserPermissions)
      const permissions = Permissions(permArray)
      yield put(actions.userPermissions(permissions))
    } catch (e) {
      yield put(actions.userPermissions({}))
    }
  });
}
