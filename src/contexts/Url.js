import React, {createContext} from 'react';

const UrlContext = createContext({
    url: "http://49.50.167.119:8000",
    aurl: "http://49.50.167.119:8000",
    surl: "http://49.50.167.119:8000",
});

const UrlProvider = ({children}) => {
    
    return (
        <UrlContext.Provider value={url}>
            {children}
        </UrlContext.Provider>
    );
};

export {UrlContext, UrlProvider};