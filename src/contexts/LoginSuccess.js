import React,{createContext, useState} from 'react';

const LoginContext = createContext({
    success: false,
    allow: false,
    setSuccess: () => {},
    setAllow: () => {},
});

const LoginProvider = ({children}) => {
    const [success, setSuccess] = useState(false);
    const [allow, setAllow] = useState(false);

    const value = {
        success,
        setSuccess,
        allow,
        setAllow
    };

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
};

const {Consumer: LoginConsumer} = LoginContext;

export {LoginContext, LoginConsumer,LoginProvider};

