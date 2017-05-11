
// 模块根路径
seajs.root = '' ? '/' + '' : ''; 

// 插件设置
seajs.set = {
	base: {
		timeout: 1.5e4
	}
};

seajs.config({
	base: seajs.root + "/modules",
	paths: {
		"js" : "/flow-ui/js",
		"lib": "/flow-ui/lib"
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
