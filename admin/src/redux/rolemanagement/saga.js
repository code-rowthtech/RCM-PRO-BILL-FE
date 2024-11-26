import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { RoleManagementActionTypes } from './constants';
import { createUserRolesApi, getUserRolesApi, updateUserRolesApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createUserRolesFunction(data) {
    try {
        yield put({
            type: RoleManagementActionTypes.CREATE_USER_ROLE_LOADING,
            payload: {},
        });
        const response = yield call(createUserRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: RoleManagementActionTypes.CREATE_USER_ROLE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleManagementActionTypes.CREATE_USER_ROLE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: RoleManagementActionTypes.CREATE_USER_ROLE_ERROR,
            payload: error,
        });
    }
}

function* updateUserRolesFunction(data) {
    try {
        yield put({
            type: RoleManagementActionTypes.UPDATE_USER_ROLE_LOADING,
            payload: {},
        });
        const response = yield call(updateUserRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: RoleManagementActionTypes.UPDATE_USER_ROLE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleManagementActionTypes.UPDATE_USER_ROLE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: RoleManagementActionTypes.UPDATE_USER_ROLE_ERROR,
            payload: error,
        });
    }
}

function* getUserRolesFunction(data) {
    try {
        yield put({
            type: RoleManagementActionTypes.GET_USER_ROLE_LOADING,
            payload: {},
        });
        const response = yield call(getUserRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: RoleManagementActionTypes.GET_USER_ROLE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleManagementActionTypes.GET_USER_ROLE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: RoleManagementActionTypes.GET_USER_ROLE_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: RoleManagementActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchAddUserRoles() {
    yield takeEvery(RoleManagementActionTypes.CREATE_USER_ROLE, createUserRolesFunction);
}

export function* watchUpdateUserRoles() {
    yield takeEvery(RoleManagementActionTypes.UPDATE_USER_ROLE, updateUserRolesFunction);
}

export function* watchGetUserRoles() {
    yield takeEvery(RoleManagementActionTypes.GET_USER_ROLE, getUserRolesFunction);
}



export function* watchresetState() {
    yield takeEvery(RoleManagementActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* roleManagementSaga() {
    yield all([
        fork(watchAddUserRoles),
        fork(watchUpdateUserRoles),
        fork(watchGetUserRoles),
        fork(watchresetState)
    ]);
}
export default roleManagementSaga;
