// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import permissionsSaga from './permissions/saga';
import rolesSaga from './roles/saga';
export default function* rootSaga(): any {
    yield all([authSaga(), layoutSaga(), permissionsSaga(), rolesSaga()]);
}
