export default (actionName,fn)=>{
    if(fn && fn instanceof Function){
        debugger;
        if(window.ENV && (ENV.dev == false || ENV.actionName ==actionName)){

            let getAjaxUrl = (url)=>{
              return url
            };

            if(ENV.dev){
                getAjaxUrl = (url)=>{
                    url = url.split('?');
                    return '/src/mocks'+url[0]+'.json'
                }
            }

            window.ENV.getAjaxUrl = getAjaxUrl;

            fn(getAjaxUrl);
        }
    }
}