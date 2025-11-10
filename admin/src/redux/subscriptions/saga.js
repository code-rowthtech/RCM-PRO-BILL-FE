import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { SubscriptionsActionTypes } from './constants';
import { getSubscriptionsApi, createSubscriptionsApi, updateSubscriptionsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getSubscriptionsFunction(data) {
    try {
        yield put({
            type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_LOADING,
            payload: {},
        });
        const response = yield call(getSubscriptionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubscriptionsActionTypes.GET_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_ERROR,
            payload: error,
        });
    }
}
function* createSubscriptionsFunction(data) {
    try {
        yield put({
            type: SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_LOADING,
            payload: {},
        });
        const response = yield call(createSubscriptionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubscriptionsActionTypes.CREATE_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_ERROR,
            payload: error,
        });
    }
}
function* updateSubscriptionsFunction(data) {
    const requestType = JSON.parse(decryptMessage(data?.data?.key));
    try {
        yield put({
            type: SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_LOADING,
            payload: {},
        });
        const response = yield call(updateSubscriptionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            if (requestType?.type === 'toggle') {
                ToastHandle(`Subscription plan ${requestType?.isActive === false ? 'deactivated' : 'activated'} successfully.`, 'success');
            } else {
                ToastHandle(decryptedData?.message, 'success');
            }
            yield put({
                type: SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubscriptionsActionTypes.UPDATE_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetSubscriptions() {
    yield takeEvery(SubscriptionsActionTypes.GET_SUBSCRIPTIONS, getSubscriptionsFunction);
}
export function* watchCreateSubscriptions() {
    yield takeEvery(SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS, createSubscriptionsFunction);
}
export function* watchUpdateSubscriptions() {
    yield takeEvery(SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS, updateSubscriptionsFunction);
}



export function* watchresetState() {
    yield takeEvery(SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* subscriptionsSaga() {
    yield all([
        fork(watchGetSubscriptions),
        fork(watchresetState),
        fork(watchCreateSubscriptions),
        fork(watchUpdateSubscriptions)
    ]);
}
export default subscriptionsSaga;
