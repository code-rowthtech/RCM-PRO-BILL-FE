import { EmailChangeActionTypres } from "./constants"


const GENERATE_OTP_INITIAL_STATE = {
    data: [],
    loading: false
}

const VERIFY_OTP_INITIAL_STATE = {
    data: [],
    loading: false
}

const NEW_EMAIL_INITIAL_STATE = {
    data: [],
    loading: false
}

export const generateOtpReducer = (state = GENERATE_OTP_INITIAL_STATE, action) => {
    switch (action.type) {
        case EmailChangeActionTypres.GENERATE_OTP_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case EmailChangeActionTypres.GENERATE_OTP_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.GENERATE_OTP_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.GENERATE_OTP_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const verifyOtpReducer = (state = VERIFY_OTP_INITIAL_STATE, action) => {
    switch (action.type) {
        case EmailChangeActionTypres.VERIFY_OTP_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case EmailChangeActionTypres.VERIFY_OTP_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.VERIFY_OTP_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.VERIFY_OTP_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const newEmailReducer = (state = NEW_EMAIL_INITIAL_STATE, action) => {
    switch (action.type) {
        case EmailChangeActionTypres.NEW_EMAIL_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case EmailChangeActionTypres.NEW_EMAIL_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.NEW_EMAIL_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case EmailChangeActionTypres.NEW_EMAIL_RESET:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


