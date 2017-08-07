import merged from 'obj-merged';
import * as config from './Config/Config';

const {target}=config;
const Tool={};

/**
* 发送ajax请求和服务其交互
*@param{object}mySetting配置ajax配置
*/
Tool.ajax=function(mySetting){
	var setting={
		url:window.location.pathname,//默认ajax请求地址
		async:true,//true，默认设置为异步请求，false是同步请求
		type:'GET',//请求的方式
		data:{},//发送给服务器的数据
		dataType:'json',
		success:function(text){},
		error:function(){}
	};
	var aData=[];//存储数据
	var sData='';//拼接数据
	//属性覆盖
	for(var attr in setting.data){
		aData.push(attr+'='+filter(setting.data[attr]));
	}
	sData=aData.join('&');
	setting.type=setting.type.toUpperCase();

	var xhr=new XMLHttpRequest();
	try{
		if(setting.type=='GET'){
			sData=setting.url+'?'+sData;
			xhr.open(setting.type,sData+'&'+new Date().getTime(),setting.async);
			xhr.send();
		}else{//post方式请求
			xhr.open(setting.type,setting.url,setting.async);
			xhr.setRequestHeader('Content-type',"application/x-www-form-urlencoded");
			xhr.send(sData);
		}
	}catch(e){
		retrun httpEnd();
	}

	if(setting.async){
		xhr.addEventListener('readystatechange',httpEnd,false);
	}else{
		httpEnd();
	}

	function httpEnd(){
		if(xhr.readyState==4){
			var head=xhr.getAllResponseHeaders();
			var response=xhr.responseText;
			//将服务器返回的数据转换成json
			if(/application\/json/.test(head)||setting.dataType==='json'&&/^(\{|\[)(\s\S])*?(\]|\})$/.test(response)){
				response=JSON.parse(response);
			}
			if(xhr.status==200){
				setting.success(response,setting,xhr);
			}else{
				setting.error(setting,xhr);
			}
		}
	}
	xhr.end=function(){
		xhr.removeEventListener('readystatechange',httpEnd,false);
	}

	function filter(str){//特殊字符
		str+='';//隐式转换
		str=str.replace(/%/g,'%25');
		str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/\=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
	}
	return xhr;
};

/**
* 封装ajax post请求
*@param {string} pathname 服务器请求地址
*@param {object} data 发送给服务器的数据
*@param {function} success 请求成功执行方法
*@param {function} error 请求失败
*/	
Tool.post=function(pathname,data,success,error){
	var setting={
		url:target+pathname,
		type:'POST',
		data:data,
		success:success||function(){},
		error:error||function(){}
	};
	return Tool.ajax(setting)
}

/**
*封装ajax get 请求
*@param {string} pathname
*@param {object} data 
*@param {function} sucess
*@param {function} error
*/
Tool.get=function(pathname,data,sucess,error){
	var setting={
		url:target+pathname,
		type:'GET',
		data:data,
		sucess:sucess||function(){},
		error:error||function(){}
	};
	return Tool.ajax(setting);

}

/**
*格式化时间
*@param {any} t
*@returns
*/
Tool.formatDate=function(str){
	var data=new Date(str);
	var time=new Date().getTime()-data.getTime();//现在的时间-传入时间=相差时间（单位=毫秒）
	if(time<0){
		return '';
	}else if(time/1000<60){
		return '刚刚';
	}else if((time/60000)<60){
		return parseInt((time/60000))+'分钟前';
	}else if((time/3600000)<24){
		return parseInt(time/3600000)+"小时前"
	} else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前';
    } else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前';
    } else {
        return parseInt(time / 31536000000) + '年前';
    }
}

/**
*本地数据存数或读取
*@param{any} key
*@param{any} value
*@returns
*/
Tool.location=function(key,value){
	if(arguments.length==1){
		return localStorage.getItem(key);
	}else {
		retrun localStorage.setItem(key,value);
	}

}

/**
*删除本地存储
*@param{any} key
*@returns
*/
Tool.removeLocalItem=function(key){
	if(key){
		return localStorage.removeItem(key);
	}else{
		return localStorage.removeItem();
	}
}

export {Tool,merged,config}