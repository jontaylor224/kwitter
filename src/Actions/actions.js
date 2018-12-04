export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const REGISTER = "REGISTER";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

export const loginFailure = () => {
    return {
        type: LOGIN_FAILURE
    }
}

export const loginSuccess = (token) => {
    return {
        type: LOGIN_SUCCESS,
        payload: token
    }
};

// without default need samename in register
// redux thunk = middleware (like express stuff where mw got reqs to go through it. here, each action goes through there(diaspatching thigng called register from reg.js and returns function (once return = inner function; redux sees it wants action obj, so inject dispatch in))); function inside function; when have action creator, it will inject dispatch for you and get registation data
// sees value is action obj, not function, so pass dispatch value; could also just do the simple ones (returns action obj when returns obj likr the type:...), even with thunk but that isnt async
export const register = registerData => dispatch => {
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
        body: JSON.stringify({
            // cant just send reg js stuff; need to json it
            // typed as how api expects them
            // make sure pass these values  
            // username,
            // displayName,
            // password
            registerData
        })
    })
        // hydrates body; always need for api b/c always returns json; if not, it would  be parsed diff
        // .then(res => res.json()) // if immediately hydrate, it always assumes its correct, so ave to check
        .then(res => {
            // res.ok means it's in the 200 range; 
            if (!res.ok) {
                // throw from here, it goes to catch
                res.json().then(err => {
                    throw err;
                });
            }
            return res.json(); // this is an else basically 
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
        }).catch(err => {
            // dispatch here on fail
            dispatch({
                type: REGISTER_FAIL,
                result: "Failed to register" // get api err; usually user facing err
            })
        })
}