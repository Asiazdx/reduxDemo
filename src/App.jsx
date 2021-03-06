import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import route from './Config/Route';//路由配置
import store from'./Config/Store';
import 'normalize.css';//重置浏览器的默认样式
import 'flex.css';//flex布局
import './Style/style.less';//加载公共样式
import './Iconfont/iconfont.css';//字体图标


store.subscribe(function(){
	//console.log(store.getState())
});

render(
	<Provider store={store}>
		{route}
	</Provider>,
	document.body.appendChild(document.createElement('div'));
)