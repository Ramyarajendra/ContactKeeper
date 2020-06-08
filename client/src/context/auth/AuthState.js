import React, {useReducer} from 'react'
import AuthContext from './authContext'
import authReducer from './authReducer'
import Axios from 'axios'
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'
import setAuthToken from '../../utils/setAuthToken'

const AuthState = (props) => {
    const initialState = {
        token : localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error : null
    }
    const [state, dispatch] = useReducer(authReducer, initialState)

    //Load user
    const loadUser =async () => {
        //@ todo - load token into global headers
        if (localStorage.token) {
            setAuthToken(localStorage.token)
        }
        try {
            const res = await Axios.get('/api/auth')
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type:AUTH_ERROR
            })
        }
    }

    //Register user
    const register = async formData => {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await Axios.post('/api/users', formData, config)

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
            loadUser()
        } catch (error) {
            dispatch({
                type: REGISTER_FAIL,
                payload : error.response.data.msg
            })
        }
    }
    //Login user

    const login = async formData => {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await Axios.post('/api/auth', formData, config)

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            loadUser()
        } catch (error) {
            dispatch({
                type: LOGIN_FAIL,
                payload : error.response.data.msg
            })
        }
    }

    //Logout user

    const logout =() => dispatch({ type: LOGOUT})


    //Clear error

    const clearErrors =() => dispatch({ type: CLEAR_ERRORS})


    return (
        <AuthContext.Provider
         value = {{
             token: state.token,
             isAuthenticated: state.isAuthenticated,
             loading: state.loading,
             user: state.user,
             error: state.error,
             register,
             loadUser,
             login,
             logout,
             clearErrors

         }}
         >{props.children}
         </AuthContext.Provider>
    )
}

export default AuthState
