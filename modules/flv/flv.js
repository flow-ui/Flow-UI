/*
 * name: flv.js
 * version: v0.0.2
 * update: 修复路径带参数时无法匹配bug
 * date: 2015-09-25
 */
define('flv', function(require, exports, module) {
	var $ = require('jquery'),
		flvPlayer = require.resolve('./vcastr.swf').slice(0, -3),
		regExt = /(.*)\.([^.?]+)\??[^.?]*$/,
		def = {
			src: '',
			width: 480,
			height: 320,
			auto: false,
			loop: false,
			ctrl: true,
			logo: null,
			id: null
		};

	module.exports = function(config) {
		var opt, extend, src, html;
		if (typeof(config) === 'object') {
			opt = $.extend({}, def, config);
		} else {
			opt = def;
			opt.src = config;
		};
		extend = regExt.exec(opt.src)[2];
		src = regExt.exec(opt.src)[1];
		switch (extend) {
			case 'flv':
				html = '<embed width="' + opt.width + '" height="' + opt.height + '" src="' + flvPlayer +
					'" base="'+require.resolve('./')+'" '+ (opt.id ? ('id="'+opt.id+'"') : '') +' FlashVars="'+'xml='+
				'{vcastr}'+
					'{channel}'+
						'{item}'+
							'{source}'+opt.src+'{/source}'+
							'{duration}{/duration}'+
							'{title}{/title}'+
						'{/item}'+
					'{/channel}'+
					'{config}'+
						'{controlPanelBgColor}0x333333{/controlPanelBgColor}'+
						'{controlPanelMode}'+(opt.ctrl ? 'normal' : 'float')+'{/controlPanelMode}'+
						'{isAutoPlay}'+(opt.auto ? 'true' : 'false')+'{/isAutoPlay}'+
						'{isRepeat}'+(opt.loop ? 'true' : 'false')+'{/isRepeat}'+
						'{scaleMode}showAll{/scaleMode}'+
						'{isLoadBegin}true{/isLoadBegin}'+
						'{contralPanelAlpha}1{/contralPanelAlpha}'+
					'{/config}'+
					'{plugIns}'+
					(opt.logo ? '{logoPlugIn}{url}logoPlugIn.swf{/url}{logoText}'+opt.logo+
						'{/logoText}{logoTextAlpha}0.75{/logoTextAlpha}{logoTextFontSize}18{/logoTextFontSize}{logoTextColor}0xffffff{/logoTextColor}'+
							'{textMargin}20 20 auto auto{/textMargin}{/logoPlugIn}' : '') +
					'{/plugIns}'+
				'{/vcastr}" wmode="transparent" quality="high" allowFullScreen="true" type="application/x-shockwave-flash"></embed>'

				break;
			case 'swf':
				html = '<embed width="' + opt.width + '" height="' + opt.height + '" src="' + opt.src +
					'" wmode="transparent" quality="high" type="application/x-shockwave-flash"></embed>'

				break;
		}
		return html;
	}
})