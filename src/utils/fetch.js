//默认就是json数据请求

/**
 * 直接引用在本地不会被获取mocks下的数据，使用跟$.ajax一致
 * 通过两种方式调用，
 * 1. 一种是直接调用
 *      import fetch from '../utils/fetch';
 *      fetch('the/url',{});
 * 2. 一种是配合perform-action使用：
 *      import action from '../utils/perform-action';
 *      action('actionName',(fetch)=>{
 *
 *          fetch('the/url',{});
 *      });
 * */
function fetch(url,options={}){

    url = url instanceof Function ? url():url.indexOf('mock')!=-1 ? url:ENV.getAjaxUrl(url);
    return $.ajax($.extend(true,{
        dataType:'json',
        type:'GET'
    },options,{
        url:url,
        type:(url.indexOf('mock')!=-1||options.isDev) ? 'GET' : (options.type||'GET')
    } ) );
}

export default fetch;