import fetch from './fetch';

export default (actionName,fn)=>{
    if(fn && fn instanceof Function){

        if(typeof(window.ENV)=='undefined'||
            (
                window.ENV &&
                (typeof(ENV.dev)=='undefined'
                    ||ENV.dev == false ||
                    ENV.actionName ==actionName
                )
            )
        ){

            let getAjaxUrl = (url)=>{
              return url
            };

            let isDev = false;

            if(typeof(ENV)!='undefined' && ENV.dev){
                isDev = true;
                getAjaxUrl = (url)=>{
                    url = url.split('?');
                    return '/src/mocks'+url[0]+'.json'
                }
            }
            if(window.ENV){
                window.ENV.getAjaxUrl = getAjaxUrl;
            }else{
                window.ENV = {
                    getAjaxUrl:getAjaxUrl
                };
            }

            $(function(){

                fn((url,options)=>{
                    options.isDev = isDev;
                    return fetch(getAjaxUrl(url),options);
                },getAjaxUrl);
            });

        }
    }
}