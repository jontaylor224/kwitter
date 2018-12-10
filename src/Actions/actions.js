import {push} from "connected-react-router";
export const LOGIN = "LOGIN";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const REGISTER = "REGISTER";
export const REGISTER_FAILURE = "REGISTER_FAILURE";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const GET_MESSAGES = "GET_MESSAGES";
export const ADD_MESS = "ADD_TEXT";
export const GET_USER ="GET_USER"
export const GET_USER_SUCCESS ="GET_USER_SUCCESS"
export const GET_USER_FAILURE ="GET_USER_FAILURE"
export const UPDATE_USER ="UPDATE_USER"
export const UPDATE_USER_SUCCESS ="UPDATE_USER_SUCCESS"
export const UPDATE_USER_FAILURE ="UPDATE_USER_FAILURE"


export const routeForRegister = {
    REGISTER_SUCCESS: '/profile',
    REGISTER_FAILURE: '/register',
};

export const login = loginData => dispatch => {
    dispatch({type: LOGIN});
    fetch("https://kwitter-api.herokuapp.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (!response.ok) {
                response.json().then(err => {
                    throw err;
                });
            }
            return response.json();
        })
        .then(data => {
            // right now, we dont have an api thing to catch this stuff, so doing this will send it to the catch
            if(data.success === false) {
                throw ""
            }
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    token: data.token,
                    id: data.id
                },
                login: data,
                result: "Successful Login!" 
            })
            dispatch(push("/profile"))
            dispatch(
                getUserInfo(data.id)
            )
        })
        .catch(err => {
            dispatch({
                type: LOGIN_FAILURE,
                result: "Failed to login"
            })
        })
}
export const getUserInfo = (userId) => dispatch => {
    dispatch({type: GET_USER,})
    fetch(`https://kwitter-api.herokuapp.com/users/${userId}`)
    .then(response =>{
        if(!response.ok) {
            response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    })
    .then(data =>{
        dispatch({type: GET_USER_SUCCESS, data: data.user})

    })
    .catch(err => {
        dispatch({type: GET_USER_FAILURE, err})
    })
}


// without default need samename in register
// redux thunk = middleware (like express stuff where mw got reqs to go through it. here, each action goes through there(diaspatching thigng called register from reg.js and returns function (once return = inner function; redux sees it wants action obj, so inject dispatch in))); function inside function; when have action creator, it will inject dispatch for you and get registation data
// sees value is action obj, not function, so pass dispatch value; could also just do the simple ones (returns action obj when returns obj likr the type:...), even with thunk but that isnt async
export const register = (registerData, history) => dispatch => {
    // dispatch b4 fetch b/c have comp that wants to render loading spinner or something about waitingo n api req
    dispatch({
        type: REGISTER
    })
    // set method to post b/c not defautl get 
    // if cant communicate, it will throw; else it wont know when to throw or not; fetch doesnt know
    fetch("https://kwitter-api.herokuapp.com/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            // cant just send reg js stuff; need to json it
            // typed as how api expects them
            // make sure pass these values  
            // username,
            // displayName,
            // password
            registerData
        )
    })
        // hydrates body; always need for api b/c always returns json; if not, it would  be parsed diff
        // .then(response => response.json()) // if immediately hydrate, it always assumes its correct, so ave to check
        .then(response => {
            // response.ok means it's in the 200 range; 
            if (!response.ok) {
                // throw from here, it goes to catch
                response.json().then(err => {
                    throw err;
                });
            }
            return response.json(); // this is an else basically 
        })
        .then(data => {
            // data looks like w/e we got for resposne in api/psotman 
            // success already has values in state
            // no setstate cause not in comp
            // do dispatch on success
            dispatch({
                type: REGISTER_SUCCESS,
                // add on extra data,  which is reuslt back from api (which is the username and displayname that you get back)
                register: data,
                result: "Successfully Registered!" // could make a <div>{this.props.result}</div> to display; reducer might use this value to put some  update
            })
            dispatch(push("/profile"))
        })
        .catch(err => {
            // dispatch here on fail
            dispatch({
                type: REGISTER_FAILURE,
                result: `Failed to register.` // get api err; usually user facing err; get the errors.message and display that username isnt unique
            })
        })
}
export const updateUser=userData => dispatch => {
    dispatch({type: UPDATE_USER});
    fetch("https://kwitter-api.herokuapp.com/users", {
        method: "PATCH",
        headers: {
         //   "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response =>{
        if(!response.ok) {
            response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    })
    .then(data =>{
        dispatch({type: UPDATE_USER_SUCCESS, data: data.user})
        dispatch(push("/profile"))
    })
    .catch(err => {
        dispatch({type: UPDATE_USER_FAILURE, err})
    })
}
