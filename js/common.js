//<!--移动端版本兼容 -->
function mate() {
	var phoneW = parseInt(window.screen.width),
		phoneScale = phoneW / 640,
		ua = navigator.userAgent;
	if(/Android (\d+\.\d+)/.test(ua)) {
		var version = parseFloat(RegExp.$1);
		if(version > 2.3) {
			document.write('<meta name="viewport" content="width=640, initial-scale=' + phoneScale + ', minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', target-densitydpi=device-dpi">');
		} else {
			document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
		}
	} else {
		document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
	}
}
//移动端版本兼容 end