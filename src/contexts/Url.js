import React, {createContext} from 'react';

const UrlContext = createContext({
   url: "http://192.168.0.19:8000",
   aurl: "http://192.168.0.19:8000",
});

const UrlProvider = ({children}) => {
    
    return (
        <UrlContext.Provider value={url}>
            {children}
        </UrlContext.Provider>
    );
};

export {UrlContext, UrlProvider};