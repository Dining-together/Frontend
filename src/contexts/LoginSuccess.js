import React,{createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginContext = createContext({
    success: false,
    allow: false,
    mode: null,
    doc: false,
    token: null,
    autoLogin: false,
    setSuccess: () => {},
    setAllow: () => {},
    setMode: () => {},
    setDoc: () => {},
    setToken: () => {},
    setAutoLogin: () => {},
});

const LoginProvider = ({children}) => {
    const [success, setSuccess] = useState(false);
    const [allow, setAllow] = useState(false);
    const [mode, setMode] = useState(null);
    const [doc, setDoc] = useState(false);
    const [token, setToken] = useState(null);
    const [autoLogin, setAutoLogin] = useState(false);

    const value = {
        success, //로그인 성공 여부
        setSuccess,
        allow, // 위치 권한 허용 여부
        setAllow,
        mode, // 사용자 or 업체
        setMode,
        doc, // 업체 서류 등록 여부
        setDoc,
        token, 
        setToken,
        autoLogin,
        setAutoLogin,
    };

    const setData = (token, autoLogin,allow,mode,doc) => {
        let data = {
            token: token,
            autoLogin: autoLogin,
            allow: allow,
            mode: mode,
            doc: doc,
        };
        AsyncStorage.setItem('user_infomation', JSON.stringify(data));
        console.log(data);
    };

    useEffect(() => {
        setData(token, autoLogin, allow, mode, doc);
    },[token, autoLogin, allow, mode, doc]);

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
};

const {Consumer: LoginConsumer} = LoginContext;

export {LoginContext, LoginConsumer,LoginProvider};

