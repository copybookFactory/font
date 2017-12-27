$.extend({
	'version' : $.getVersionName(),
	'data' : {
		'fontList' : {
			"田英章繁体" : ["田英章繁体.ttf", 256, 0, 0]
		},
		'cfg' : {
			'ow': 256, 'zoom' : 1, 'canvasColor': '', 'gridColor' : '', 'color' : '', 'order' : '',
			'fontClass' : '', 'grid' : '', 'outline' : '', 'fill' : '', 'txt' : '', 'row' : '', 'columns' : ''
		},
		'sevCfg' : {},
		'appFontPath' : null,
		'appFontList' : null
	},
	'reText' : function(txt, sl, hl) {
		var r = [], max = sl * hl;
		var txt = txt.replace(/[\x00-\xff\s，。]/g, "");
		txt = (txt + Array(max).join("\u3000")).substr(0, max).split("");
		if($.data.cfg.order == 'rt') txt = txt.reverse();
		for(var i = 0; i < txt.length; i ++){
			if($.data.cfg.order == 'rt'){
				for(var j = 0; j < sl; j ++) {
					r[j] = !r[j] ? [] : r[j];
					if((i + j + 1) % sl == 0) r[j].push(txt[i]);
				}
			} else {
				var j = parseInt(i / hl);
				r[j] = !r[j] ? [] : r[j];
				r[j].push(txt[i]);
			}
		}
		return r;
	},
	'drawDashLine' : function(ctx, x1, y1, x2, y2, dashLength){
    	var dashLen = dashLength || 6;
    	xpos = x2 - x1,
    	ypos = y2 - y1,
    	numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
    	ctx.beginPath();
    	for(var i = 0; i<numDashes; i++){
    		if(i % 2 === 0){
    			ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
    		}else{
    			ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i);
    		}
    	}
    	ctx.stroke();
    },
    'setText' : function() {
    	var cfg = $.data.cfg;
    	var sl = cfg.row || 4;
    	var hl = cfg.columns || 7;
    	var o = $('canvas').get(0);
    	cfg.cw = cfg.ow * cfg.zoom;
    	o.width = hl * cfg.cw + 24;
    	o.height = sl * cfg.cw + 24;
    	var rt = $.reText(cfg.txt, sl, hl);
    	var ctx = o.getContext('2d');

    	ctx.beginPath();
    	ctx.fillStyle = cfg.canvasColor;
    	ctx.fillRect(0, 0, o.width, o.height);
    	ctx.stroke();

    	if(cfg.grid == "true") {
    		ctx.beginPath();
    		ctx.strokeStyle = cfg.gridColor;
    		ctx.lineWidth = 8;
    		ctx.rect(0, 0, o.width, o.height);
    		ctx.stroke();
    		ctx.beginPath();
    		ctx.lineWidth = 1;
    		ctx.rect(12, 12, o.width - 24, o.height - 24);
    		ctx.stroke();
    	}

    	ctx.fillStyle    = cfg.color;
    	ctx.lineWidth	 = 1;
    	var fontCfg		 = $.data.fontList[cfg.fontClass];
    	ctx.font         = fontCfg[1] * cfg.zoom + "px " + cfg.fontClass + "," + cfg.backClass;
    	ctx.textBaseline = 'top';
    	for(var i = 0; i < rt.length; i ++) {
    		for(var j = 0; j < rt[i].length; j ++) {
    			if(cfg.grid == "true") {
    				ctx.beginPath();
    				ctx.strokeStyle = cfg.gridColor;
    				ctx.lineWidth = 1;
    				ctx.rect(cfg.cw * j + 12,  cfg.cw * i + 12, cfg.cw, cfg.cw);
    				ctx.stroke();
    				ctx.lineWidth = 1;
    				$.drawDashLine(ctx, cfg.cw * j + 12, cfg.cw * i + 12, cfg.cw * (j + 1) + 12, cfg.cw * (i + 1) + 12);
    				$.drawDashLine(ctx, cfg.cw * j + 12, cfg.cw * (i + 1) + 12, cfg.cw * (j + 1) + 12, cfg.cw * i + 12);
    				$.drawDashLine(ctx, cfg.cw * j + 12, cfg.cw * i +  12 + cfg.cw / 2, cfg.cw * (j + 1) + 12, cfg.cw * i +  12 + cfg.cw / 2);
    				$.drawDashLine(ctx, cfg.cw * j + 12 + cfg.cw / 2, cfg.cw * i + 12, cfg.cw * (j + 1) + 12 - cfg.cw / 2, cfg.cw * (i + 1) + 12);
    			}
    			ctx.beginPath();
    			if(cfg.outline == "true"){
    				ctx.strokeStyle = cfg.color;
    				ctx.strokeText(rt[i][j], cfg.cw * j +  fontCfg[2] * cfg.zoom + 12, cfg.cw * i + fontCfg[3] * cfg.zoom + 12);
    			}
    			if(cfg.fill == "true"){
    				ctx.fillText(rt[i][j], cfg.cw * j +  fontCfg[2] * cfg.zoom + 12, cfg.cw * i + fontCfg[3] * cfg.zoom + 12);
    			}
    			ctx.stroke();
    		}
    	}
    },
    'loadFont' : function() {
		var newStyle = document.createElement('style');
		var re = [];
		$("#fontClass").empty();
		$("#backClass").empty();
		$('#load').empty();
		for(var i in $.data.fontList) {
			$('#fontClass').get(0).options.add(new Option(i, i));
			$('#backClass').get(0).options.add(new Option(i, i));
			$('#load').append("<label style='font-family:" + i + ";'>字</label>");
		}
		$('head').append(newStyle);
	},
	'fontList' : function(root, str) {
		if(str) {
			var arr = str.split(",");
			for(var i = 0; i < arr.length; i ++) {
				var ri = arr[i].split(/-|\./);
				 $.data.fontList[ri[0]] = ["file://" + root + arr[i], (ri[1] * 1) || 220, (ri[2] || 18) * 1, (ri[3] || 18) * 1];
			}
		}
		$.loadFont();
	},
    'setDownFile' : function(downUrl, fileName, cls) {
    	$.showDemo();
    },
    'delDownFont' : function(fontName) {
    	$.showDemo();
    },
    'makeImage' : function() {
    	$.autoAppVal();
		$.setText();
	},
    'downImage' : 	function() {
    	$.showDemo();
	},
    'serverCallBack' : function(rs) {
    	var r = rs || $.data.sevCfg;
    	$.data.sevCfg = r;
    	var re = [];
    	re.push("<ol>");
    	for(var i = 0; i < r.fontList.length; i ++) {
    		var fName = r.fontList[i].replace(/[-\.].+/, '');
    		var dBut = "<a href='javascript:$.setDownFile(\"" + r.downUrl + "\", \"" + r.fontList[i] + "\", \"font\");' class='but'>下载</a>";
    		if($.data.fontList[fName]) dBut = "<a href='javascript:$.delDownFont(\"" + r.fontList[i] + "\");' class='but del'>删除</a>"
    		re.push("<dd>" + fName + dBut + "</dd>");
    	}
    	re.push("</ol>");
    	$('#t2').html(re.join(""));
    },
    'keyBack' : function() {
    	var prev = $('.t:visible').data('prev');
     	if($("#loading").is(':visible')){
     		return false;
     	} else if($(".dialog").is(':visible')){
     		$(".dialog").remove();
     	} else if(prev) {
     		$.Show(prev);
     	} else if(!$('#t1').is(':visible')) {
     		$.Show('#t1');
         }
     }
});
$('input[type=text],input[type=number]').focus(function(){this.select();});
$('#row,#columns').keyup(function() {this.value = this.value.replace(/[^\d]/g, "");});
$(document).on('keydown', function(e){
	if (e.keyCode == 13){
		if($('#t1').is(':visible')){
			$('#enter').focus();
			$.makeImage();
		}
	}
});
(function(){
	$.Loading("正在载入字体资源...");
	if(location.search != "") {
		$.appData('txt') = decodeURIComponent($.getUrlParam(null, 'txt'));
		$.appData('row') = $.getUrlParam(null, 'row');
		$.appData('columns') = $.getUrlParam(null, 'columns');
	}
	$.fontList($.data.appFontPath, $.data.appFontList);
	$('#version').html($.version);
})();
$(window).on('load', function(){
	$.closeLoading();
	$.autoAppVal('get');
	$.makeImage();
	$('#canvasColor,#gridColor,#color').next().css('backgroundColor', function(){
		return $(this).prev().val();
	}).click(function(){
    	return $.colorSel($(this).prev());
    });
    $('#zoom').next().text(function(){
    	return $(this).prev().val();
    }).click(function(){
		return $.zoomSel($(this).prev());
	});
	$('#grid,#outline,#fill').next().each(function(){
		if($(this).prev().val() == "true"){
			$(this).html('&#xe6c4;').addClass('ck');
		} else {
			$(this).html('&#xe6c3;').removeClass('ck');
		}
	}).click(function(){
		if($(this).prev().val() == "true") {
			$(this).prev().val("false");
			$(this).html('&#xe6c3;').removeClass('ck');
		} else {
			$(this).prev().val("true");
			$(this).html('&#xe6c4;').addClass('ck');
		}
	});
});
$('#menuBut').click(function(evant) {
	$('#menu').toggle();
	event.stopPropagation();
});

$('body').click(function() {$('#menu').css('display', 'none');});

function serverCallBack(rs) {return $.serverCallBack(rs);}