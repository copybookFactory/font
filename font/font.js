var _config = {
	'Version' : '1.09',
	'downUrl' : 'http:\/\/57.23it.cc:81/fontapp/font/',
	'fontList' : [
		'方正启体繁体.ttf',
		'汉仪瘦金书繁.ttf',
		'汉仪中隶书繁.ttf',
		'苏新诗柳楷繁.ttf',
		'腾祥伯当行楷繁-200-28-0.ttf',
		'方正小篆体.ttf',
		'汉仪魏碑繁.ttf',
		'博洋行书7000.ttf',
		'博洋欧体3500.ttf',
		'博洋楷体7000.ttf',
		'博洋草书7000.ttf',
		'章草.ttf',
		'金文大篆.ttf',
		'方正黄草简体.ttf',
		'汉仪颜楷繁.ttf',
		'迷你繁褚楷.ttf',
		'张心启欧楷.ttf',
		'劉炳森隸書.ttf'
	]
};
serverCallBack(_config);

$(window).on('load', function(){
	var clientVersion = document.scripts[document.scripts.length - 1].src.match(/v=([\d\.]+)/)[1];
	if(clientVersion != "1.01" && clientVersion != _config.Version){
		$.confirm("检测到新版本，是否进行更行？", function(flg){
			if(flg) {
				$.setDownFile(_config.downUrl, "shufa.apk");
			}
		});
	}
});