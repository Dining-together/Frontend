import React, {createContext} from 'react';

const UrlContext = createContext({
   url: "http://:8000"
});

const UrlProvider = ({children}) => {
    
    return (
        <UrlContext.Provider value={url}>
            {children}
        </UrlContext.Provider>
    );
};

export {UrlContext, UrlProvider};