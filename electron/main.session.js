/*  
        const filter = { urls: [`<all_urls>`] };
 
         session.defaultSession.webRequest.onBeforeSendHeaders(filter,
             (details, callback) => {
                 details.requestHeaders['shone-sing-lone'] = 'MyName';
                 callback({ cancel: false, requestHeaders: details.requestHeaders });
             });
 
         session.defaultSession.webRequest.onHeadersReceived(filter,
             (details, callback) => {
                 if (details.responseHeaders && details.responseHeaders['Set-Cookie']) {
                     for (let i = 0; i < details.responseHeaders['Set-Cookie'].length; i++) {
                         details.responseHeaders['Set-Cookie'][i] += ';SameSite=None;Secure';
                     }
                 }
                 callback({
                     responseHeaders: details.responseHeaders
                 });
             }); 
             */
