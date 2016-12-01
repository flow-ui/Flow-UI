//开发模式
seajs.develop = true;
// 模块根路径
seajs.root = 'front-flow-ui'; 
// api管理
seajs.api = {
	test: seajs.develop ? '/develop' : '/product'
};
// 插件设置
seajs.set = {
	util: {
		timeout: 1.5e4
	}
};

seajs.config({
	base: "http://static-zt.oss-cn-qingdao.aliyuncs.com/modules",
	paths: {
		"js" : seajs.root + "/docs/js",
		"lib": seajs.root + "/docs/lib"
	},
	alias: {
		"audio"		     : "audio/audio",
		"copy"		     : "copy/ZeroClipboard",
		"flv"		     : "flv/flv",
		"hook"	 	     : "hook/hook",
		"jquery" 	     : "jquery/1/jquery",
		"validform"      : "validform/validform",
		"My97DatePicker" : "My97DatePicker/WdatePicker",
		"raty"		     : "raty/raty",
		"upload"         : "upload/upload",
		"makethumb"      : "upload/makethumb",
		"localResizeIMG" : "upload/localResizeIMG",
		"video"		     : "video/video",
		"webuploader"    : "webuploader/webuploader"
	},
    localcache:{
        timeout: 2e4
    }
});
