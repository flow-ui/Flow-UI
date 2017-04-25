/**
 * api
 */
define(function(require, exports, module) {
	//开发模式
	var develop = true;
	// api管理
	var api = {
		publicApi: develop ? '/develop/publicApi' : '/product/publicApi'
	};
	
	module.exports = api;
});