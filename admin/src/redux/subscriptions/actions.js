// @flow
import { SubscriptionsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS,
    data
});

export const createSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS,
    data
});

export const updateSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE,

});