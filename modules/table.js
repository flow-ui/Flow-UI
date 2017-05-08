/*
 * name: table.js
 * version: v1.6.0
 * update: add detailFormater()/detailClear()
 * date: 2017-05-05
 */
define('table', function(require, exports, module) {
	"use strict";
	require('dropdown');
	var $ = window.$ || require('jquery'),
		base = require('base'),
		def = {
			el: null,
			data: null,
			column: null, // title,key,render,width,align,hook,ellipsis,editable,sort,filters,validateMethod,
			striped: false,
			bordered: false,
			condensed: false,
			hover: false,
			width: 0,
			height: 0,
			index: false,
			multi: false,
			noDataText: "暂无数据",
			noFilterText: '暂无筛选结果',
			highlight: false,
			page: null,
			onSelect: null, // index, row, [all]
			onReady: null
		},
		Table = function(config) {
			var opt = $.extend({}, def, config || {}),
				$this = $(opt.el).eq(0),
				changes = {
					add: [],
					update: [],
					delete: []
				},
				ajaxParam;
			if (!$this.length) {
				return null;
			}

			if (isNaN(parseFloat(opt.width)) || !parseFloat(opt.width)) {
				opt.width = $this.width();
			}
			if (isNaN(parseFloat(opt.height)) || !parseFloat(opt.height)) {
				opt.height = $this.height();
			}
			if (!parseFloat(opt.height)) {
				opt.height = 'auto';
			}
			//索引列
			if (opt.index) {
				$.each(opt.column, function(i, e) {
					if (e.type && e.type === 'index') {
						opt.column.splice(i, 1);
						return false;
					}
				});
				opt.column.unshift({
					type: 'index',
					width: 60,
					align: 'center',
					fixed: opt.index === 'fixed'
				});
			}
			//勾选列
			if (opt.multi) {
				$.each(opt.column, function(i, e) {
					if (e.type && e.type === 'selection') {
						opt.column.splice(i, 1);
						return false;
					}
				});
				opt.column.unshift({
					type: 'selection',
					width: 60,
					align: 'center',
					fixed: opt.multi === 'fixed'
				});
			}
			var indexKey = 'index-' + base.getUUID();
			//交互控件过滤
			var controlParser = function($dom, clone) {
				var $target = $dom;
				if (clone) {
					$target = $dom.clone(true);
				}
				$target.find('[name]').removeAttr('name');
				return $target;
			};
			//生成单元格
			var getTd = function(rowIndex, rowData, col) {
				var tdStyler;
				var isDirty;
				var oriValue = opt.oData[rowData[indexKey]][col.key];
				var thisColClass = ['row' + rowIndex + '-' + (col.key || '')];
				//数据脏检查
				if (rowData[col.key] !== void(0) && (oriValue !== rowData[col.key])) {
					//console.log(oriValue, rowData[col.key]);
					isDirty = true;
				}
				switch (col.align) {
					case 'center':
						thisColClass.push('tc');
						break;
					case 'right':
						thisColClass.push('tr');
						break;
					default:
						thisColClass.push('tl');
				}
				if (col.hook && col.hook.split) {
					thisColClass.push(col.hook);
				}
				if (isDirty) {
					thisColClass.push('table-cell-dirty');
				}
				if (col.editable) {
					thisColClass.push('table-cell-editable');
				}
				if (typeof col.styler === 'function') {
					tdStyler = col.styler(rowData[col.key]) || '';
				}
				var thisColTag = '<td class="' + thisColClass.join(' ') + '"' + (tdStyler ? (' style="' + tdStyler + '"') : '') + '><div class="table-cell">';
				switch (col.type) {
					case 'index':
						thisColTag += ((parseInt(rowIndex) + 1) + '</td>');
						break;
					case 'selection':
						thisColTag += '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-input"></label></td>';
						break;
					default:
						var thisTagCont;
						var renderTagId = 'renderTagId-' + base.getUUID();
						var tdEntity = {
							set: function(key, newValue) {
								if (key && key.split) {
									var newRowData = base.deepcopy(rowData);
									newRowData[key] = newValue;
									var targetCol;
									$.each(opt.column, function(i, e) {
										if (e.key === key) {
											targetCol = e;
											return false;
										}
									});
									if (targetCol) {
										var targetTd = getTd(rowIndex, newRowData, targetCol);
										var fixedTable = $this.find('.table-fixed tbody');
										var fixTdIndex = $this.find('.row' + rowIndex + '-' + key).index();
										$this.find('.row' + rowIndex + '-' + key).replaceWith(inject(targetTd));
										if (fixedTable.length) {
											var fixedTd = controlParser($this.find('.row' + rowIndex + '-' + key), true).html();
											fixedTable.children('tr[data-index="' + rowIndex + '"]').children('td').eq(fixTdIndex).html(fixedTd);
										}
									}
									return newRowData;
								}
							},
							toggle: function(key, newValue) {
								if (this['backup-' + key] === void 0) {
									this['backup-' + key] = opt.oData[rowData[indexKey]][key];
									if (this['backup-' + key] !== void 0 && (this['backup-' + key] !== newValue)) {
										this.set(key, newValue);
									}
								} else {
									this.set(key, this['backup-' + key]);
									delete this['backup-' + key];
								}
							},
							get: function(full) {
								if (full) {
									return rowData;
								} else {
									return rowData[col.key];
								}
							},
							edit: function($dom) {
								var editCb;
								if (isEditing) {
									return null;
								}
								if (col.key === void(0)) {
									return null;
								}
								if (typeof $dom === 'function') {
									editCb = $dom;
									$dom = null;
								}
								if (!$dom || !$dom.length) {
									$dom = $this.find('.row' + rowIndex + '-' + (col.key || ''));
								}
								if ($dom.length) {
									isEditing = true;
									//使api得以操作不可编辑单元格
									$dom.addClass('table-cell-editable');
									var that = this;
									var oldValue = opt.oData[rowData[indexKey]][col.key];
									var nowText = this.get();
									var inputHTML;
									if (typeof oldValue === 'number') {
										inputHTML = '<input type="number" class="form-control table-cell-editer" value="' + nowText + '" >';
									} else {
										inputHTML = '<textarea class="form-control table-cell-editer">' + nowText + '</textarea>';
									}
									var $input = $(inputHTML).on('blur', function(e) {
										var newValue = $(this).val();
										if (typeof oldValue === 'number') {
											newValue = parseFloat(newValue);
										}
										var isValid = true;
										if (typeof col.validateMethod === 'function') {
											isValid = col.validateMethod(newValue);
										}
										if (!isValid) {
											return e.preventDefault();
										}
										var newRow = that.set(col.key, newValue);
										isEditing = false;
										if (oldValue !== void(0) && (oldValue !== newValue)) {
											var updateObject;
											$.each(changes.update, function(i, u) {
												if (u.index === rowData[indexKey]) {
													updateObject = {
														arrayIndex: i
													};
													return false;
												}
											});
											if (updateObject !== void 0) {
												changes.update[updateObject.arrayIndex].row = newRow;
											} else {
												changes.update.push({
													index: rowData[indexKey],
													row: newRow,
													origin: opt.rowData[rowData[indexKey]]
												});
											}

											if (typeof col.editable === 'function') {
												col.editable(rowData[indexKey], col.key, newValue);
											}
											if (typeof editCb === 'function') {
												editCb(rowData[indexKey], col.key, newValue);
											}
										}
									});
									$dom.append($input);
									$input.focus();
								} else {
									console.warn('entity.edit()找不到当前TD单元格！', $dom);
								}
							}
						};
						opt.renderCollection = opt.renderCollection || [];
						if (typeof col.render === 'function') {
							try {
								opt.renderCollection.push({
									id: renderTagId,
									el: col.ellipsis ? $('<div class="el" style="width:' + (col.thisColWidth - 36) + 'px"></div>').append(col.render(rowData[col.key], rowData, rowIndex, tdEntity)) : col.render(rowData[col.key], rowData, rowIndex, tdEntity),
									entity: tdEntity
								});
							} catch (e) {
								console.warn(col.key + ' => render() run error：', e.message);
							}
							thisTagCont = '<div id="' + renderTagId + '"></div>';
						} else {
							opt.renderCollection.push({
								id: renderTagId,
								el: (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]),
								entity: tdEntity
							});
							thisTagCont = '<div id="' + renderTagId + '"></div>';
							//thisTagCont = (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]);
						}
						thisColTag += (thisTagCont + '</div></td>');
				}
				return thisColTag;
			};
			//生成表格主体
			var getBody = function(tData, opt) {
				var tbodyCont = '';
				$.each(tData, function(rowIndex, rowData) {
					var tdcont = '';
					if (rowData.split) {
						tdcont += ('<td>' + rowData + '</td>');
					} else if ($.isPlainObject(rowData)) {
						if(rowData[indexKey]){
							rowIndex = rowData[indexKey];
						}
						$.each(opt.column, function(colIndex, colData) {
							tdcont += getTd(rowIndex, rowData, colData);
						});
					}
					var thisdata = '<tr data-index="' + rowData[indexKey] + '">';
					thisdata += tdcont;
					thisdata += '</tr>';
					tbodyCont += thisdata;
				});
				return tbodyCont;
			};
			//排序方法
			var sortBy = function(key, method, methodThirdArgument) {
				var sortKey = [],
					sortData = [];
				$.each(opt.oData, function(i, e) {
					sortKey.push(e[key]);
				});
				if (!sortKey.length) {
					return console.warn('sortBy():can`t find property ' + key + ' from data');
				}
				if (typeof method === 'function') {
					sortKey.sort(function(a, b) {
						return method(a, b, methodThirdArgument);
					});
				} else {
					sortKey.sort();
					if (methodThirdArgument === 'desc') {
						sortKey.reverse();
					}
				}
				$.each(sortKey, function(i, k) {
					$.each(opt.oData, function(i, obj) {
						if (obj[key] === k) {
							sortData.push(obj);
						}
					});
				});
				return sortData;
			};
			var render = function(tData, opt, part) {
				if (!$.isArray(tData) || !$.isArray(opt.column) || !opt.column.length) {
					return console.warn('table: data or column配置有误！');
				}
				var colgroup = '<colgroup>';
				var theadCont = '<thead><tr>';
				var totalWidth = opt.width;
				var totalWidthCopy = totalWidth;
				var tableWidth = 0;
				var otherParts = opt.column.length;
				//收集注入元素
				opt.renderCollection = opt.renderCollection || [];
				var fixedIndex, fixedWidth = 0;
				$.each(opt.column, function(i, col) {
					//预计算列宽
					col.width = isNaN(parseFloat(col.width)) ? 0 : parseFloat(col.width);
					if (col.width) {
						totalWidthCopy -= col.width;
						otherParts -= 1;
					}
					//fixed列位置
					if (col.fixed) {
						fixedIndex = i;
					}
				});
				var otherPartsCopy = otherParts;
				var totalWidthCopy2 = Math.max(totalWidthCopy, 0);
				opt.fixedIndex = fixedIndex;
				$.each(opt.column, function(i, col) {
					var thisColWidth = col.width;
					var thisColClass = [];
					if (!thisColWidth) {
						if (totalWidthCopy2 && otherPartsCopy === 1) {
							thisColWidth = Math.max(totalWidthCopy2, 60 + (col.sort || $.isArray(col.filters) ? 40 : 0));
						} else {
							thisColWidth = Math.max(Math.floor(totalWidthCopy / otherParts), 60 + (col.sort || $.isArray(col.filters) ? 40 : 0));
							if (totalWidthCopy2 > thisColWidth) {
								totalWidthCopy2 -= thisColWidth;
							}
						}
						otherPartsCopy--;
					}
					if (fixedIndex !== void(0) && fixedIndex >= i) {
						fixedWidth += thisColWidth;
					}

					tableWidth += thisColWidth;
					switch (col.align) {
						case 'center':
							thisColClass.push('tc');
							break;
						case 'right':
							thisColClass.push('tr');
							break;
						default:
							thisColClass.push('tl');
					}
					col.thisColWidth = thisColWidth;
					var thisColTag = '<th' + (' class="' + thisColClass.join(' ') + '">');
					colgroup += ('<col width="' + thisColWidth + '"></col>');
					switch (col.type) {
						case 'index':
							theadCont += (thisColTag + '#</th>');
							break;
						case 'selection':
							theadCont += (thisColTag + '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-all"></label></th>');
							break;
						default:
							var thisTagCont = '<div class="table-cell">';
							if (col.sort || $.isArray(col.filters)) {
								var renderTagId = 'sortTagId-' + base.getUUID();
								var $el = $('<div></div>');
								//排序
								if (col.sort) {
									$el.append($('<span class="table-sort"><i class="ion table-sort-up">&#xe618;</i><i class="ion table-sort-down">&#xe612;</i></span>')
										.on('click', '.ion', function() {
											var sortData,
												command = '';
											if ($(this).hasClass('on')) {
												$(this).removeClass('on');
											} else {
												$(this).addClass('on').siblings('.on').removeClass('on');
												if ($(this).hasClass('table-sort-up')) {
													command = 'asc';
												} else if ($(this).hasClass('table-sort-down')) {
													command = 'desc';
												}
											}
											if (typeof col.sort.handle === 'function') {
												return col.sort.handle(col.key, command);
											}
											if (command) {
												sortData = sortBy(col.key, col.sort.mehtod, command);
											} else {
												sortData = opt.oData;
											}

											if (opt.page && opt.page.pageSize) {
												opt.holdStatus = true;
												generate(sortData, opt, 'body');
											} else {
												render(sortData, opt, 'body');
											}
										}));
								}
								//筛选
								if ($.isArray(col.filters)) {
									var dropData = [];
									$.each(col.filters, function(i, thisFilter) {
										if (thisFilter.label && thisFilter.label.split) {
											dropData.push({
												item: thisFilter.label,
												methodIndex: i
											});
										}
									});
									$el.append($('<span class="table-filter"><i class="ion">&#xeabf;</i></span>').dropdown({
										items: dropData,
										trigger: 'click',
										onclick: function(item, isCurrent) {
											if (isCurrent) {
												return null;
											}
											var filterData;
											if (typeof col.filters[item.methodIndex].handle === 'function') {
												return col.filters[item.methodIndex].handle();
											} else if (typeof col.filters[item.methodIndex].mehtod === 'function') {
												filterData = $.map(opt.oData, function(val, i) {
													if (col.filters[item.methodIndex].mehtod(val[col.key])) {
														return val;
													}
												});
											}
											if (!filterData.length) {
												filterData = [opt.noFilterText];
											}
											opt.holdStatus = true;
											return generate(filterData, opt, 'body');
										}
									}));
								}
								opt.renderCollection.push({
									id: renderTagId,
									el: $el.children('span').unwrap()
								});
								thisTagCont += (col.title || "#") + '<textarea style="display:none" id="' + renderTagId + '"></textarea>';
							} else {
								thisTagCont += (col.title || "#");
							}
							theadCont += (thisColTag + thisTagCont + '</div></th>');
					}
				});
				var tbody = '<div class="table-body" style="width:' + tableWidth + 'px">';
				var html = '<div class="table-wrapper' + (tableWidth > totalWidth ? ' table-scroll-x' : '') + '" style="width:' + opt.width + 'px">';
				var thead = '<div class="table-header" style="width:' + tableWidth + 'px"><table class="table">';
				theadCont += '</tr></thead>';
				colgroup += '</colgroup>';
				thead += colgroup;
				thead += theadCont;
				thead += '</table></div>';
				if (!tData.length) {
					if (part === 'placehold') {
						//首次ajax加载
					} else {
						tbody += ('<div class="p">' + opt.noDataText + '</div>');
					}
				} else {
					var tbodyCont = getBody(tData, opt);
					if (part === 'body') {
						//body局部更新
						var tbodyUpdate = inject(tbodyCont);
						if (opt.fixedIndex !== void(0)) {
							//移除交互控件name
							var tbodyUpdateFixed = tbodyUpdate.clone(true);
							tbodyUpdateFixed.each(function(row, tr) {
								$(tr).find('td').each(function(i, td) {
									if (i > opt.fixedIndex) {
										controlParser($(td)).attr('class', 'tofixed');
									}
								});
							});
							tbodyUpdate.each(function(row, tr) {
								$(tr).find('td').each(function(i, td) {
									if (i <= opt.fixedIndex) {
										controlParser($(td)).attr('class', 'tofixed');
									}
								});
							});
							$this.find('.table-fixed .table-body tbody').html(tbodyUpdateFixed);
						}
						$this.data('data', tData).find('.table-wrapper>.table-body tbody').html(tbodyUpdate);
						return syncStatus();
					}
					tbody += '<table class="table' + (opt.hover ? ' table-hover' : '') + (opt.condensed ? ' table-condensed' : '') + (opt.bordered ? ' table-bordered' : '') + (opt.striped ? ' table-striped' : '') + '" style="width:' + tableWidth + 'px">';
					tbody += colgroup;
					tbody += ('<tbody>' + tbodyCont + '</tbody>');
					tbody += '</table>';
				}
				tbody += '</div>';
				html += thead;
				html += tbody;

				if (tData.length && fixedWidth) {
					var tfixed = '';
					tfixed = '<div class="table-fixed" style="width:' + fixedWidth + 'px">';
					tfixed += thead;
					tfixed += tbody;
					tfixed += '</div>';
					html += tfixed;
				}
				html += '</div>';
				return $this.data('data', tData).css({
					width: opt.width,
					height: opt.height
				}).html(inject(html, true));
			};
			var inject = function(html, isInit) {
				var tableObj = $(html);
				var $fixed = tableObj.children('.table-fixed');
				if (isInit) {
					//初始化高度
					if (opt.height && !isNaN(parseFloat(opt.height))) {
						var trueHeight;
						tableObj.height(opt.height);
						trueHeight = tableObj.height();
						tableObj.find('.table-body').height(trueHeight - 43);
					}
					//初始化滚动同步
					if ($fixed.length) {
						tableObj.on('scroll', function(e) {
							$fixed.css('left', $(this).scrollLeft());
						}).children('.table-body').on('scroll', function() {
							$fixed.children('.table-body').scrollTop($(this).scrollTop());
						});
						if (opt.hover) {
							tableObj.children('.table-body').on('mouseenter', 'tr[data-index]', function() {
								$fixed.find('.table-body tr[data-index="' + $(this).data('index') + '"]').addClass('table-tr-hover');
							}).on('mouseleave', 'tr[data-index]', function() {
								$fixed.find('.table-body tr[data-index="' + $(this).data('index') + '"]').removeClass('table-tr-hover');
							});
							$fixed.children('.table-body').on('mouseenter', 'tr[data-index]', function() {
								tableObj.find('.table-body tr[data-index="' + $(this).data('index') + '"]').addClass('table-tr-hover');
							}).on('mouseleave', 'tr', function() {
								tableObj.find('.table-body tr[data-index="' + $(this).data('index') + '"]').removeClass('table-tr-hover');
							});
						}
					}
				}
				//注入二次渲染元素
				$.each(opt.renderCollection, function(i, renderObj) {
					if (renderObj.entity) {
						tableObj.find('#' + renderObj.id).parents('td').data('entity', renderObj.entity);
					}
					tableObj.find('#' + renderObj.id).replaceWith(renderObj.el);
				});
				delete opt.renderCollection;

				if (opt.fixedIndex !== void(0) && $fixed.length) {
					//移除交互控件name
					$fixed.find('.table-body tr[data-index]').each(function(row, tr) {
						$(tr).find('td').each(function(i, td) {
							if (i > opt.fixedIndex) {
								controlParser($(td)).attr('class', 'tofixed');
							}
						});
					});
					tableObj.children('.table-body').find('tr[data-index]').each(function(row, tr) {
						$(tr).find('td').each(function(i, td) {
							if (i <= opt.fixedIndex) {
								controlParser($(td)).attr('class', 'tofixed');
							}
						});
					});
				}
				return tableObj;
			};
			//收集选中项
			var multiCollection = [];
			//同步勾选状态
			var syncStatus = function() {
				$this.find('.table-body').each(function(tindex, table) {
					$(table).find('tr[data-index]').each(function(i, tr) {
						var isIn = false;
						$.each(multiCollection, function(i, choosen) {
							if ($(tr).data('index') === choosen[indexKey]) {
								isIn = true;
								return false;
							}
						});
						$(tr).find('.table-choose-input').prop('checked', isIn);
						if (opt.highlight) {
							if (isIn) {
								$(tr).addClass('table-highlight');
							} else {
								$(tr).removeClass('table-highlight');
							}
						}
					});
				});
				if (opt.multi) {
					var isAllCheck = true;
					$.each($this.data('data'), function(si, row) {
						var isMatch;
						$.each(multiCollection, function(ri, select) {
							if (select[indexKey] === row[indexKey]) {
								isMatch = true;
								return false;
							}
						});
						if (!isMatch) {
							isAllCheck = false;
							return false;
						}
					});
					$this.find('.table-header .table-choose-all').prop('checked', isAllCheck);
				}
			};
			var selectRow = function(index, isSelect) {
				if (index === void 0) {
					return null;
				}
				if (index >= opt.oData.length) {
					return console.warn('selectRow(): index 超出当前数据范围！');
				}
				var row = opt.oData[index][indexKey];
				if (opt.multi) {
					var alreadyIn;
					$.each(multiCollection, function(i, c) {
						if (c[indexKey] === row) {
							if (isSelect) {
								alreadyIn = true;
								return false;
							} else {
								multiCollection.splice(i, 1);
								return false;
							}
						}
					});
					if (isSelect && !alreadyIn) {
						multiCollection.push(opt.oData[row]);
					}
					if (typeof opt.onSelect === 'function') {
						opt.onSelect(row, opt.oData[row], multiCollection, isSelect);
					}
				} else {
					if (multiCollection.length && (row === multiCollection[0][indexKey])) {
						multiCollection = [];
					} else {
						multiCollection = [opt.oData[row]];
						if (typeof opt.onSelect === 'function') {
							opt.onSelect(row, opt.oData[row], multiCollection);
						}
					}
				}
				syncStatus();
			};
			var selectAll = function(flag) {
				if (flag === false || (flag !== true && multiCollection.length === $this.data('data').length)) {
					multiCollection = [];
				} else {
					multiCollection = base.deepcopy($this.data('data'));
				}
				if (typeof opt.onSelect === 'function') {
					opt.onSelect('all', null, multiCollection);
				}
				syncStatus();
			};
			var isEditing; //编辑状态锁
			var tPager; //page对象
			var generate = function(data, opt, part) {
				var tData = base.deepcopy(data);
				isEditing = false;
				//生成索引
				$.each(tData, function(rowIndex, rowData) {
					if (!part || rowData[indexKey] === void 0) {
						rowData[indexKey] = parseInt(rowIndex);
					}
				});
				//备份原始数据
				if (opt.holdStatus) {
					delete opt.holdStatus;
				} else {
					opt.oData = tData;
					multiCollection = [];
				}
				if (opt.page && opt.page.pageSize && part !== 'placehold') {
					//数据分页
					var tDataGroup = [];
					var pageTemp = [];
					var showNum = Math.min(opt.page.pageSize, tData.length);
					$.each(tData, function(i, e) {
						if (i % showNum === 0) {
							if (pageTemp.length) {
								tDataGroup.push(base.deepcopy(pageTemp));
								pageTemp = [];
							}
						}
						pageTemp.push(e);
					});
					if (pageTemp.length) {
						tDataGroup.push(base.deepcopy(pageTemp));
						pageTemp = null;
					}

					tData = tDataGroup[0];
					require.async('page', function(Page) {
						var pageEl;
						if (opt.page.el && $(opt.page.el).length) {
							pageEl = $(opt.page.el);
						} else if (!$('#' + indexKey).length) {
							pageEl = $('<div id="' + indexKey + '"></div>');
							$this.after(pageEl);
						} else {
							pageEl = $('#' + indexKey);
						}
						tPager = Page({
							el: pageEl,
							total: tDataGroup.length,
							onChange: function(pagenumber) {
								tData = tDataGroup[pagenumber - 1];
								render(tData, opt, 'body');
								if (typeof opt.page.onChange === 'function') {
									opt.page.onChange(pagenumber);
								}
							}
						});
					});
				}

				render(tData, opt, part);

				if (part !== 'placehold' && !$this.data('table-events')) {
					$this.data('table-events', true);
					//绑定事件
					$this.on('click', 'td.table-cell-editable', function(e) {
						e.stopPropagation();
						var entity = $(this).data('entity');
						entity.edit($(this));
					}).on('click', '.table-choose-input', function(e) {
						e.stopPropagation();
						selectRow($(this).parents('tr[data-index]').data('index'), $(this).prop('checked'));
					});
					if (opt.multi) {
						$this.on('click', '.table-choose-all', selectAll);
					} else {
						$this.on('click', '.table-body tr', function() {
							selectRow($(this).data('index'));
						});
					}
					if (typeof opt.onReady === 'function') {
						opt.onReady(opt.ajaxRes);
						delete opt.ajaxRes;
					}
				}
			};
			var loadData = function(set, part) {
				require.async('spin', function() {
					var loading = $this.spin({
						icon: '&#xe66e;'
					});
					$.ajax({
						type: set.method || 'get',
						url: set.url,
						dataType: 'json',
						data: set.data || {},
						success: function(res) {
							var ajaxData;
							loading.hide();
							if (typeof set.dataParser === 'function') {
								ajaxData = set.dataParser(res);
							} else {
								ajaxData = res;
							}
							if ($.isArray(ajaxData)) {
								opt.rowData = ajaxData;
							} else {
								return console.warn('Table(): ajax/dataParser必须返回Array格式！');
							}
							opt.ajaxRes = res;
							generate(opt.rowData, opt, part);
						}
					});
				});
			};

			if ($.isArray(opt.data)) {
				opt.rowData = opt.data;
				generate(opt.rowData, opt);
			} else if (opt.load && opt.load.url && opt.load.url.split) {
				if (!$this.height()) {
					$this.height($this.height() || opt.height || 200);
				}
				generate([], opt, 'placehold');
				loadData(opt.load);
			} else {
				return console.warn('Table(): 无可用数据源！');
			}

			return {
				data: function(data) {
					if ($.isArray(data) && data.length) {
						generate(data, opt);
					} else {
						return opt.oData;
					}
				},
				load: function(set) {
					if (set && set.url && set.url.split) {
						loadData(set, 'body');
					}
				},
				column: function(column) {
					if (column && $.isArray(column)) {
						opt.column = column;
						render(opt.oData, opt);
					} else {
						return opt.column;
					}
				},
				getPager: function() {
					return tPager;
				},
				size: function(sizeConf) {
					if ($.isPlainObject(sizeConf)) {
						opt.width = sizeConf.width || opt.width;
						opt.height = sizeConf.height || opt.height;
						if (opt.page && opt.page.pageSize) {
							opt.holdStatus = true;
							generate(opt.oData, opt);
						} else {
							render(opt.oData, opt);
						}
					} else {
						return {
							width: opt.width,
							height: opt.height
						};
					}
				},
				reload: function() {
					if (opt.load && opt.load.url && opt.load.url.split) {
						loadData(opt.load);
					} else {
						generate(opt.rowData, opt);
					}
				},
				getRows: function() {
					return $this.data('data');
				},
				getSelected: function() {
					return multiCollection;
				},
				scrollTo: function(index) {
					if (index === void 0 || index >= $this.data('data').length) {
						index = $this.data('data').length - 1;
					}
					var sth = $this.find('.table-wrapper>.table-body').find('tr[data-index]').eq(index - 1).offset().top - $this.find('.table-wrapper>.table-body').offset().top;
					$this.find('.table-wrapper>.table-body').scrollTop(sth);
				},
				highlightRow: function(index) {
					if (index === void 0) {
						return null;
					}
					if (index >= opt.oData.length) {
						return console.warn('highlightRow(): index 超出当前数据范围！');
					}
					$this.find('.table-body').each(function(i, e) {
						$(e).find('tr[data-index="'+index+'"]').addClass('table-highlight');
					});
				},
				selectAll: function() {
					return selectAll(true);
				},
				unselectAll: function() {
					return selectAll(false);
				},
				selectRow: function(index) {
					return selectRow(index, true);
				},
				unselectRow: function(index) {
					return selectRow(index, false);
				},
				getEntity: function(index, key) {
					if (index === void 0 || !key) {
						return console.warn('getEntity(): 参数不完整！');
					}
					if (index >= opt.oData.length) {
						return console.warn('getEntity(): index 超出当前数据范围！');
					}
					var $td = $this.find('.row' + index + '-' + key);
					if (!$td.length) {
						return console.warn('getEntity(): 无法获取指定单元格');
					}
					return $td.data('entity');
				},
				updateRow: function(index, row) {
					var cData = base.deepcopy(opt.oData);
					if (index >= cData.length) {
						return console.warn('updateRow(): index 超出当前数据范围！');
					}
					var oRow = cData[index];
					var newRow = $.extend({}, oRow, row || {});
					cData[newRow[indexKey]] = newRow;
					changes.update.push({
						index: newRow[indexKey],
						row: newRow,
						origin: opt.rowData[newRow[indexKey]]
					});
					return generate(cData, opt);
				},
				appendRow: function(row) {
					if ($.isPlainObject(row)) {
						var cData = base.deepcopy(opt.oData);
						row[indexKey] = cData.length;
						cData.push(row);
						changes.add.push({
							index: cData.length,
							row: row
						});
						return generate(cData, opt);
					}
				},
				insertRow: function(start, row) {
					if (typeof start === 'number' && $.isPlainObject(row)) {
						var cData = base.deepcopy(opt.oData);
						if (start >= cData.length) {
							return this.appendRow(row);
						}
						cData.splice(start, 0, row);
						for (var i = start; i < cData.length; i++) {
							cData[i][indexKey] = i;
						}
						changes.add.push({
							index: start,
							row: row
						});
						return generate(cData, opt);
					}
				},
				deleteRow: function(index) {
					if (index >= opt.oData.length) {
						return console.warn('deleteRow(): index 超出当前数据范围！');
					}
					var cData = base.deepcopy(opt.oData);
					var delRow = cData.splice(index, 1);
					for (var i = index; i < cData.length; i++) {
						cData[i][indexKey] = i;
					}
					changes.delete.push({
						index: index,
						row: delRow[0]
					});
					return generate(cData, opt);
				},
				getChanges: function(type) {
					return changes[type] || changes;
				},
				sort: function(key, method) {
					if (key && key.split) {
						var sortedData = sortBy(key, method);
						if (opt.page && opt.page.pageSize) {
							opt.holdStatus = true;
							generate(sortedData, opt, 'body');
						} else {
							render(sortedData, opt, 'body');
						}
					}
				},
				detailFormater: function(index, render){
					if (index===void(0) || (index >= opt.oData.length)) {
						return console.warn('detailFormater(): 缺少参数或 index 超出当前数据范围！');
					}
					if(typeof render === 'function'){
						var appendDetail = render();
						var currentTr = $this.find('tr[data-index="'+index+'"]');
						if(currentTr.length){
							var newTR;
							if(currentTr.data('detail')){
								newTR = currentTr.data('detail');
							}else{
								newTR = $('<tr><td style="border-top:0" colspan="'+opt.column.length+'"><div class="table-cell"></div></td></tr>');
								currentTr.after(newTR);
								currentTr.data('detail', newTR);
							}
							newTR.find('.table-cell').html(appendDetail);
						}
					}
				},
				detailClear: function(index){
					if (index===void(0) || (index >= opt.oData.length)) {
						return console.warn('detailClear(): 缺少参数或 index 超出当前数据范围！');
					}
					var currentTr = $this.find('tr[data-index="'+index+'"]');
					if(currentTr.length && currentTr.data('detail')){
						var newTR = currentTr.data('detail');
						currentTr.data('detail', null);
						newTR.remove();
					}
				}
			};
		};

	$.fn.table = function(config) {
		return Table($.extend(config || {}, {
			el: this
		}));
	};
	module.exports = Table;
});