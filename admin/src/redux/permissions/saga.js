import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PermissionsActionTypes } from './constants';
import { createPermissionsApi, getPermissionsApi, deletePermissionsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */




function* addPermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.CREATE_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(createPermissionsApi, data);
        console.log(response, "response")
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        // console.log(decryptedData, 'decryptedData')
        if (response.status === 201) {
            // ToastHandle('Permission created successfully', 'success')
            yield put({
                type: PermissionsActionTypes.CREATE_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.CREATE_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        console.log(error, 'errrrrrrr')
        yield put({
            type: PermissionsActionTypes.CREATE_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}
function* getPermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.GET_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(getPermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: PermissionsActionTypes.GET_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.GET_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log(error, 'error in getPermissions')
        yield put({
            type: PermissionsActionTypes.GET_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}

function* deletePermissionsFunction(data) {
    console.log(data, 'sattaaaat')
    try {
        yield put({
            type: PermissionsActionTypes.DELETE_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(deletePermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PermissionsActionTypes.DELETE_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.DELETE_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        console.log(error, 'error in getPermissions')
        yield put({
            type: PermissionsActionTypes.DELETE_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}



export function* watchpermissionsDataCreate() {
    yield takeEvery(PermissionsActionTypes.CREATE_PERMISSIONS, addPermissionsFunction);
}
export function* watchpermissionsDataGet() {
    yield takeEvery(PermissionsActionTypes.GET_PERMISSIONS, getPermissionsFunction);
}
export function* watchpermissionsDataDelete() {
    yield takeEvery(PermissionsActionTypes.DELETE_PERMISSIONS, deletePermissionsFunction);
}

function* permissionsSaga() {
    yield all([
        fork(watchpermissionsDataCreate),
        fork(watchpermissionsDataGet),
        fork(watchpermissionsDataDelete),
    ]);
}
export default permissionsSaga;
