/*
* name: photowall.js
* version: v0.1.1
* update: 保留字this改为$this
* date: 2015-01-07
*/

define('photowall', function(require, exports, module) {
   var $ = require('jquery');

	return function(config){
		var opt={
			$this:'',
			items:'',
			height:200,
			border:10,
			class:'photo-row'
		};
		
		$.extend(opt, config ? config : {});
		var $this = opt.$this;

		doPhotoLayout();
		
		$(window).resize(function() {
			 doPhotoLayout();
		});	
		
		function getContainerWidth(){
			return $this.width()||"";
		}
		
		//判断浏览器宽度范围，相当于media-query
		function getStandardHeight(){
			var sHeight = 0;
			if(typeof(opt.height)=='number'){
				//传入数字
				sHeight = 	opt.height
			}else if(typeof(opt.height)=='object'){
				//传入数组
				var bWidth = getContainerWidth();
				if(bWidth <= 360){
					sHeight = 100;
				}
				else if(bWidth <= 400){
					sHeight = 140;
				}
				else if(bWidth <= 480){
					sHeight = 150;
				}
				else if(bWidth <= 550){
					sHeight = 160;
				}
				else if(bWidth <= 640){
					sHeight = 170;
				}
				else if(bWidth <= 740){
					sHeight = 180;
				}
				else if(bWidth <= 800){
					sHeight = 190;
				}
				else if(bWidth <= 960){
					sHeight = 210;
				}
				else if(bWidth <= 1500){
					sHeight = 230;
				}
				else if(bWidth <= 1920){
					sHeight = 250;
				}
				else if(bWidth <= 2200){
					sHeight = 270;
				}
				else if(bWidth <= 2400){
					sHeight = 280;
				}
				else if(bWidth <= 2880){
					sHeight = 300;		
				}
				else if(bWidth <= 3280){
					sHeight = 320;
				}
				else{
					sHeight = 340;
				}				
			}

			return sHeight;
		}
		//获取容器对象
		function getContainer(){
			var $container = $this;
			return $container;
		}
		var $imgItems;
		var index = 1;
		//得到所有imgItem单元
		function getItems(){
			if(typeof($imgItems)=="undefined"){
				var $container = getContainer();
				$imgItems = $container.find(opt.items);
			}
			return $imgItems;
		}
		//保存图片初始宽高
		var widths;
		var heights;
		function getWidths(){
			if(typeof(widths)=="undefined"){
				var $items = getItems();
				widths = new Array();
				$.each($items,function(key,val){
					var $imgs = $(this).find("img");
					widths[key] = $imgs.width();
				});
			}
			var tmpWidths = widths.slice();//不污染原数组
			return tmpWidths;
		}
		function getHeights(){
			if(typeof(heights)=="undefined"){
				var $items = getItems();
				heights = new Array();
				$.each($items,function(key,val){
					var $imgs = $(this).find("img");
					heights[key] = $imgs.height();
				});
			}
			var tmpHeights = heights.slice();//不污染原数组
			return tmpHeights;
		}
		//调整主函数
		function doPhotoLayout(){
			var sHeight = getStandardHeight();
			var bWidth = getContainerWidth();
			var $container = getContainer();
			var $items = getItems();
			var widthAry = getWidths()
			var heightAry = getHeights();
			var itemsLen = $items.length||0;
			var border = opt.border;//边框值
	
			if(itemsLen==0){
				$.error("没有图片");
			}else{
				//记录每个图片转化后的高度
				for(var i = 0; i < itemsLen ; i++){
					if(heightAry[i] != sHeight){
						widthAry[i] = Math.round(widthAry[i]*(sHeight/heightAry[i]));
						heightAry[i] = sHeight;
					}
				}
	
				//创建每行父容器，并寻找各自子节点
				$(opt.class).remove();//清除旧容器
				var rowWidth = 2*border;//记录每行宽度，初始为容器左右padding宽
				var i = 0,j = 0;
				var rowDivs = new Array();
				var rowSonsLen = new Array();
				while(i < itemsLen){
					var rowDiv = $("<div></div>");
					rowDiv.attr("class",opt.class);
					rowDiv.width(bWidth-border*2);
					rowSonsLen[j] = 0;
					for(i ; i < itemsLen ;i ++){
						rowWidth += widthAry[i]+2*border;
						rowDiv.append($items[i]);
						rowSonsLen[j] += 1;
						//装不下下一个图片则保存该行，然后继续下一行
						 if(i+1<itemsLen&&(rowWidth+widthAry[i+1]+2*border)>bWidth){
							rowDivs[j++] = rowDiv;
							rowWidth = 2*border;
							i++;
								break;
						}
						else if(i+1==itemsLen){
							rowDivs[j] = rowDiv;
						}
					}
				}
				var rowDivsLen = rowDivs.length;
			 //只有1行不做调整
					if(rowDivsLen>1){
						 //计算调整后差距
						 var rowTotalWidth = 0;
						 var restAry = new Array();
						 var j = 0;//记录宽度数组下标
						 var maxLen = 0;
						 var containerWidth = 0;
						 for(var i = 0 ; i < rowDivsLen ; i++){
							  var k = j;
							  containerWidth = bWidth - 2 * border;
							  rowTotalWidth = 0;
							  maxLen += rowSonsLen[i];
							  for(j ; j < maxLen ; j++){
									rowTotalWidth += widthAry[j];
									containerWidth -= 2 * border;
							  }
							  //比例=目标宽度/实际宽度=目标高度/实际高度
							  //var rate = parseFloat(containerWidth/rowTotalWidth);
							  var afterHeight = Math.round(parseFloat(sHeight*containerWidth/rowTotalWidth));
							  heightAry[i] = afterHeight;
							  restAry[i] = 2*border;
							  //算出高度列表后再更新宽度列表
							  for(k ; k < maxLen ; k++){
									widthAry[k] = Math.round(parseFloat(widthAry[k]*afterHeight/sHeight));
									restAry[i] += widthAry[k]+2*border;//调整后宽度
							  }
						 }
	
					//调整最后间距
					var gap = 0;//间距值
					var acIndex = 0;
					for (var i = 0; i < rowDivsLen; i++) {
						gap = bWidth - restAry[i];
						//小于容器宽度
						if(gap > 0){
							while(gap!=0){
								var j = 0;
								widthAry[acIndex+j] = widthAry[acIndex+j] + 1;
								gap--;
								j = (j + 1 + rowSonsLen[i]) % rowSonsLen[i];
							}
						}
						//大于容器宽度
						else if(gap < 0){
							while(gap!=0){
								var j = 0;
								widthAry[acIndex+j] = widthAry[acIndex+j] - 1;
								gap++;
								j = (j + 1 + rowSonsLen[i]) % rowSonsLen[i];
							}
						}
						acIndex += rowSonsLen[i];
					};			
				}
	
				//把宽度和高度列表赋予图片
				var i = 0 , j = 0;
				$.each($items,function(key,val){
					$(this).css({"width":widthAry[key],"height":heightAry[i],"margin":border});
					var $img = $(this).find("img");
					$img.css({"width":widthAry[key],"height":heightAry[i]});
					if(j<rowSonsLen[i]-1){
						j++;
					}
					else{
						i++;
						j=0;
					}
				});
	
				$container.css("padding","0 "+border+"px");
				$container.append(rowDivs);
	
				//有如下情况则舍弃一行
				//1）原始宽高比与转换后宽高比大于rate;
				//2）转换后宽度大于原始宽度1.5倍
				//3）转换后高度大于原始高度1.5倍
				var $lastImgs = $container.find("img");
				var rate=1;
				var heightRaw=0,heightNow=0,widthRaw=0,widthNow=0;
				$.each($lastImgs,function(key,val){
					heightRaw = parseFloat(heights[key]/widths[key]);
					heightNow = parseFloat($(this).height()/$(this).width());
					widthRaw = parseFloat(widths[key]/heights[key]);
					widthNow = parseFloat($(this).width()/$(this).height());
					if(Math.abs(heightRaw - heightNow)>rate||Math.abs(widthRaw - widthNow)>rate||heights[key]*1.5<$(this).height()||widths[key]*1.5<$(this).width()){
						$(this).parents(opt.class).css("display","none");
					}
				});
	
				//添加监听器
				$(window).scroll(function(){
					
					})
				
			}
		}
	}
})