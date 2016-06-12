# jquery-project-template

此项目用于快速搭建基于jquery类库或者zepto类库开发的前端项目。

## 目录规范

### src

- `action` 对应于每个页面的入口，所有执行操作都将在此入口处被执行，action中必须配合utils包下的perform-action使用，用于区分环境对url的替换

```js

	import action from '../utils/perform-action';
	/**
     * 这种方式可以引入cortex包，前提是先安装cortex依赖包
     */
    import hippo from '@cortex/hippo';
    
	//逻辑入口，类似main
	action('test',(fetch)=>{
		
		//逻辑
		fetch('/test?id=1',{
			success:(data)=>{
	
				//这里目前是获取的本地src/mocks下test.json的数据
				console.dir(data);
			}
		});
	});
```

- `config` 基本配置文件，后缀可以为js也可为json，这里可以配置需要单独打包的公共类库，可以配置一些类库的别名等。

- `lib` 存放一些通过bower安装的类库文件

- `mocks` 本地调试数据

- `resources` 资源文件，包括样式、html、图片

- `service`	页面中各个模块的逻辑，此目录下的文件命名应该按照java类命名规范 

- `template` 一些模板文件，某些页面中存在一些异步渲染模块，需要一个类似jsp方式的模板，通过传入数据得到最终html然后放入页面某一处。本脚手架依赖handlebars类库，语法可参考 http://handlebarsjs.com/

```js

	import loginTpl from '../template/login.html';
	
	let html = loginTpl({
	   title:'登陆',
	   content:'请登录',
	   footer:''
    });
    
    $('#login').html(html);
```

```html

	<!--login.html-->
	
	<div class="header">{{title}}</div>
    <div class="content" style="padding: 0 20px 0">
    
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
    </div>
    <div class="footer">
        <button class="success odal-success">确定</button>
        <button class="cancel modal-cancel">取消</button>
    </div>
```

- `utils` 工具类存放处

### dist

打包后生成的文件

## 使用

- 下载此项目至本地，修改项目名称和package.json里的信息；
- git remote rm origin
- git remote add origin {你的仓库地址}  例如：git remote add origin git@code.dianpingoa.com:pc-trade-f2e/apollo-template-static.git
- git fetch
- git pull origin master

## Command

```
	#打包	
	npm run build	
	#本地演示dev
	npm run dev
```

## 发布方式

点评内部通过dianpingoa中的ci方式发布，ci类型请选择 ** peon_static **

## 回滚

目前此发布方式的回滚功能还在开发，为了保险起见，每次通过分支进行合并开发发布。

## 引用

点评内部通过cortex方式在页面中引用dist下的文件，其他同学需根据自己的实际情况而定。

- cortex引入方式

```
	<cortex:css resource="/app/jquery-project-template/test.css" decorate="true"></cortex:css>
	<cortex:js resource="/app/jquery-project-template/jquery.js" decorate="true"></cortex:js>
	<cortex:js resource="/app/jquery-project-template/test.js" decorate="true"></cortex:js>
```

## 本地调试

在java项目.ftl中引入通过 npm run dev启动好的链接文件

```
	<script src="http://127.0.0.1:3005/dist/bundle.js"></script>
```
或通过配置判断环境引入不同环境的文件

```

	#if Request['isLocal'] >
    <script src="http://127.0.0.1:3005/dist/bundle.js"></script>
    <#else>
        <cortex:css resource="/app/jquery-project-template/test.css" decorate="true"></cortex:css>
		<cortex:js resource="/app/jquery-project-template/jquery.js" decorate="true"></cortex:js>
		<cortex:js resource="/app/jquery-project-template/test.js" decorate="true"></cortex:js>
        <@cortex.jsFramework/>
        <@cortex.facadesPlaceHolder/>
    </#if>
```

** 如果有sso，请将sso配置文件禁用掉，或者手动配置sso信息 **


