import { RoleManagementActionTypes } from "./constants"


const CREATE_USER_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createUserRolesReducer = (state = CREATE_USER_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case RoleManagementActionTypes.CREATE_USER_ROLE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RoleManagementActionTypes.CREATE_USER_ROLE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RoleManagementActionTypes.CREATE_USER_ROLE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RoleManagementActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


