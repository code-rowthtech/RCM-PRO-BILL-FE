import { RolesActionTypes } from "./constants"

const CREATE_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}


export const createRolesReducer = (state = CREATE_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case RolesActionTypes.CREATE_ROLES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RolesActionTypes.CREATE_ROLES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.CREATE_ROLES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}
