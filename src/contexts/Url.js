import React, {createContext} from 'react';

const UrlContext = createContext({
    url: "http://192.168.219.109:8000",
    aurl: "http://192.168.219.109:8000",
    surl: "http://192.168.219.109:8000",
    curl: "http://192.168.219.109:53672",
});

const UrlProvider = ({children}) => {
    
    return (
        <UrlContext.Provider value={url}>
            {children}
        </UrlContext.Provider>
    );
};

export {UrlContext, UrlProvider};