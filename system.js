var sys = {
	'getVersionName' : function(){
		try {
			return window.control.getVersionName();
		} catch(e) {
			return "1.11";
		}
	},
	'showDemo' : function() {
		$.confirm("演示版不支持该功能，是否下载app体验完整功能？", function(flag){
				if(flag){location.href = "font/shufa.apk";}
		});
	},
	'showShare' : function(Str) {
		$.showDemo();
	},
	'openQQGroup' : function(){
		$.showDemo();
	},
	'OpenUrl' : function(Url) {
		$.showDemo();
	},
	'Toast' : function(Str) {
		$.showDemo();
	},
	'autoAppVal' : function(mode) {
		$('input[type=text],input[type=number],input[type=hidden]').each(function() {
			if(mode == "get") {
				if($.appData(this.id)){
					this.value = $.appData(this.id);
				}
			} else {
				$.appData(this.id, this.value);
			}
			$.data.cfg[this.id] = this.value;
		});
		$('input[type=checkbox]').each(function(){
			if(mode == "get") {
				if($.appData(this.id)){
					$(this).prop('checked', $.appData(this.id) == "true" ? true : false);
				}
			} else {
				$.appData(this.id, $(this).prop('checked') ? "true" : "false");
			}
			$.data.cfg[this.id] = $(this).prop('checked');
		});
		$('select').each(function() {
			if(mode == "get") {
				if($.appData(this.id)) {
					$(this).find('option[value=' + $.appData(this.id) + ']').attr("selected", true);
				}
			} else {
				$.appData(this.id, this.value);
			}
			$.data.cfg[this.id] = this.value;
		});
	},
	'appData' : function(key, val) {
		if(val) localStorage.setItem(key, val);
		else return localStorage.getItem(key);
	},
	'clear' : function(){
		$.confirm("此操作将还原所有设置，确定要执行吗？", function(flag){
			if(flag) {
				localStorage.clear();
				$.autoAppVal();
				$.Toast('操作完成');
			}
		});
	},
	'Show' : function(o) {
		$('.t').filter(function(i){
			if(i == $(o).index()){
				$('#send a').eq(i).addClass('ck');
				$('#head').html($(this).data('title') || '字帖工厂');
			} else {
				$('#send a').eq(i).removeClass('ck');
			}
			return $(this).css('display') != "none";
		}).hide();
		$(o).show();
	},
	'Loading' : function(str) {
		$('#dialog').show();
		var loading = $('#loading');
		loading.html(str).show();
		loading.css({
			"marginLeft": - loading.outerWidth() / 2,
			"marginTop" : - loading.outerHeight() / 2
		});
	},
	'closeLoading' : function() {
		$('#dialog').hide();
		$('#loading').hide();
	},
	'getUrlParam' : function(data, key){
		data = data || location.search
		var url = decodeURIComponent(data);
		var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)");
		var r = url.substr(1).match(reg);
		if ( r !=  null) return unescape(r[2]); return "";
	},
	'alert' : function (obj, callback) {
		var content = obj.content || obj || "",
			btnText = obj.btnText || "确定",
			boxClass = obj.boxClass || "",
			alertHtml = '\
				<div class="dialog '+ boxClass +'">\
					<div class="dialog-box">\
						<div class="dialog-detail">' + content + '</div>\
						<div class="dialog-opera">\
							<a href="javascript:void(0);" class="dialog-btn dialog-btn-close">' + btnText +  '</a>\
						</div>\
					</div>\
					<div class="dialog-overlay"></div>\
				</div>';
		$(".dialog").remove();
		$("body").append(alertHtml);
		$(".dialog-box").css('marginTop', -($(".dialog-box").outerHeight() / 2 + 30));
		var dialog = $(".dialog"),
			btnClose = $(".dialog-btn-close");
		btnClose.on("click", function () {
			dialog.remove();
			if (callback) {
				callback();
			}
		});
	},
	'confirm' : function (obj, callback) {
		var content = obj.content || obj || "",
			okText = obj.okText || "确定",
			cancelText = obj.cancelText || "取消",
			boxClass = obj.boxClass || "",
			confirmHtml = '\
				<div class="dialog '+ boxClass +'">\
					<div class="dialog-box">\
						<div class="dialog-detail">' + content + '</div>\
						<div class="dialog-opera">\
							<a href="javascript:void(0);" class="dialog-btn dialog-btn-cancel">' + cancelText + '</a>\
							<a href="javascript:void(0);" class="dialog-btn dialog-btn-ok">' + okText + '</a>\
						</div>\
					</div>\
					<div class="dialog-overlay"></div>\
				</div>';
		$(".dialog").remove();
		$("body").append(confirmHtml);
		$(".dialog-box").css('marginTop', -($(".dialog-box").outerHeight() / 2 + 30));
		var dialog = $(".dialog"),
			btnOk = $(".dialog-btn-ok"),
			btnCancel = $(".dialog-btn-cancel"),
			flag = true,
			oprea = function () {
				dialog.remove();
				if (callback) {
					callback(flag);
				}
			};
		btnOk.on("click", function () {
			flag = true;
			oprea();
		});
		btnCancel.on("click", function () {
			flag = false;
			oprea();
		});
	},
	'prompt' : function (obj, callback) {
		var content = obj.content || obj || "",
			boxClass = obj.boxClass || "",
			delay = obj.delay || 2000,
			msgHtml = '<div class="prompt ' + boxClass + '">' + content + '</div>';
		$(".prompt").remove();
		$("body").append(msgHtml);
		var prompt = $(".prompt");
		prompt.css("marginLeft", - prompt.width() / 2);
		setTimeout(function () {
			prompt.css({ "opacity": 0});
			setTimeout(function () {
				prompt.remove();
				if (callback) {
					callback();
				}
			}, 500);
		}, delay);
	},
    'Rgb2Hex' : function(n){
    	var n = n.split(","), re = [];
    	for(var i = 0; i < n.length; i ++){
    		re.push(Number(n[i]).toString(16).Zero(2));
    	}
    	return "#" + re.join('');
    },
    'Hex2Rgb' : function(clr) {
		var clr = clr.replace('#', ''), re = [];
		clr.replace(/(\w{2})/g, function(a, b) {
			re.push(parseInt(b, 16));
		});
		return re;
    },
    'OnSelect' : function(o, cls){
    	var ow = $(o).parent().width() - 25;
    	o.on('touchstart', function(event){
    		var touch = event.touches[0];
    		var sx = Number(touch.pageX) - o.position().left;
    		$(document).on('touchmove', function(event){
    		    var touch = event.touches[0];
    			o.css('left', function(){
    				var sl = Number(touch.pageX) - sx;
    				sl = (255 / ow) * sl;
    				sl = sl < 0 ? 0 : sl > 255 ? 255 : sl;
    				if(cls == 'color'){
    					o.attr('title', parseInt(sl));
    				} else if(cls == 'zoom') {
    					o.attr('title', (sl / 255 * 5).toFixed(2));
    				}
    				return (sl * (ow / 255)) + "px";
    			});
    			$.ShowWrite(null, cls);
    			return false;
    		}).on('touchend', function(){
    			$(this).unbind('touchmove');
    		});
    	});
    },
    'lastSelColor' : '',
    'ShowWrite' : function(clr, cls){
    	if(cls == "color") {
			if(clr) {
				$.lastSelColor = clr;
				var re = $.Hex2Rgb(clr);
				var ow = $('#R').width() - 25;
				$('#R div').attr('title', re[0]).css('left', re[0] * (ow / 255));
				$('#G div').attr('title', re[1]).css('left', re[1] * (ow / 255));
				$('#B div').attr('title', re[2]).css('left', re[2] * (ow / 255));
			}
			var RGB = $('#R div').attr('title') + "," + $('#G div').attr('title') + "," + $('#B div').attr('title');
			$.lastSelColor = $.Rgb2Hex(RGB);
			$('#colorWrite').css('backgroundColor', $.lastSelColor);
			$('#colorCode').css({'color': $.lastSelColor, 'borderColor' : $.lastSelColor});
			$('#colorCode').html($.Rgb2Hex(RGB) + "<br />RGB(" + RGB + ")");
		} else if(cls == "zoom") {
			if(clr) {
            	$.lastSelColor = clr;
            	var ow = $('#Z').width() - 25;
            	$('#Z div').attr('title', clr).css('left', clr * (ow / 255) / 5 * 255);
            }
            $.lastSelColor = $('#Z div').attr('title');
            $('#zoomCode label').html($.lastSelColor);
		}
    },
    'colorSel' : function(o){
    	$.confirm($('#ColorHtml').text(), function(flag) {
    		if(flag){
    			o.val($.lastSelColor).next().css('backgroundColor', $.lastSelColor);
    		}
    	});
    	$.OnSelect($('#R div'), 'color');
        $.OnSelect($('#G div'), 'color');
        $.OnSelect($('#B div'), 'color');
        $.ShowWrite(o.val(), 'color');
    },
    'zoomSel' : function(o){
    	$.confirm($('#ZoomHtml').text(), function(flag) {
			if(flag){
				o.val($.lastSelColor).next().text($.lastSelColor);
			}
		});
		$.OnSelect($('#Z div'), 'zoom');
		$.ShowWrite(o.val(), 'zoom');
    },
    'zoomSet' : function(n) {
    	$.lastSelColor = ($.lastSelColor * 1 + n).toFixed(2);
    	if($.lastSelColor < 0) $.lastSelColor = 0;
    	if($.lastSelColor > 5) $.lastSelColor = 5;
		$('#Z div').attr('title', $.lastSelColor);
		$.ShowWrite($.lastSelColor, 'zoom');
    }
};
String.prototype.Zero = function(n){
	return (new Array(n + 1).join("0") + this).substr(this.length, n);
}
$.extend(sys);