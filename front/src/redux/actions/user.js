import { SET_USER_DETAILS } from './actionTypes'

export const setUserDetails = userDetails => {
    return ({
        type: SET_USER_DETAILS,
        payload: userDetails
    })
}