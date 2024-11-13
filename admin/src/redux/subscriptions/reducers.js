import { SubscriptionsActionTypes } from "./constants"


const GET_SUBSCRIPTIONS_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_SUBSCRIPTIONS_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_SUBSCRIPTIONS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getSubscriptionsReducer = (state = GET_SUBSCRIPTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


export const createSubscriptionsReducer = (state = CREATE_SUBSCRIPTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.CREATE_SUBSCRIPTIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


export const updateSubscriptionsReducer = (state = UPDATE_SUBSCRIPTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.UPDATE_SUBSCRIPTIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


