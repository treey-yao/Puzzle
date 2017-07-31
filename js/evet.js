var picbox = document.getElementById('picbox');
var pic = document.querySelectorAll('.pic');

var mask = document.getElementById('mask');

//开始按钮
var go = document.getElementById('go');

//定时。用于扩展
var times = document.getElementById('times');

var dx, //记录触发拖拽的水平状态发生改变时的位置；
	dy, //记录触发拖拽的垂直状态发生改变时的位置；
	newLeft,
	newtop,
	startTime, //开始时间
	endTime; //结束时间

var time = 0
var t

//拼图模块的高和宽
var picWidth = pic[0].offsetWidth;
var picHeight = pic[0].offsetHeight;

//图片的高和宽
var picboxWidth = picbox.offsetWidth;
var picboxHeight = picbox.offsetHeight;

//开始
go.addEventListener('touchstart', function() {
	time = 0
	//开始计时
	timedCount();

	for(var i = 0; i < pic.length; i++) {
		//设置显示拼图，游戏开始
		pic[i].style.display = "block";
	}

	//背景为白色
	picbox.style.background = "#fff";

	for(var i = 0; i < 20; i++) { //随机打乱
		var a = Math.floor(Math.random() * 9);
		var b = Math.floor(Math.random() * 9);
		if(a != b) {
			random(a, b);
		}
	}
	//	去掉遮罩
	mask.style.display = "none";

	//绑定模块的移动事件
	move();
});

//----------方法----------
//随机打乱
function random(a, b) {
	//随机打乱函数，其中交换部分，可以提取出来封装

	//随机获取两 拼图小模块 a b
	var aEle = pic[a];
	var bEle = pic[b];

	//将a模块的left 赋给 b模块的left
	//将b模块的left 赋给 a模块的left
	var _left;
	_left = aEle.style.left;
	aEle.style.left = bEle.style.left;
	bEle.style.left = _left;

	//将a模块的top 赋给 b模块的top
	//将b模块的top 赋给 a模块的top
	var _top;
	_top = aEle.style.top;
	aEle.style.top = bEle.style.top;
	bEle.style.top = _top;

	//		//将a模块的class 赋给 b模块的class
	//		//将b模块的class 赋给 a模块的class
	//		var _class; 
	//		_class = aEle.getAttribute("class");
	//		aEle.setAttribute("class", bEle.getAttribute("class"));
	//		bEle.setAttribute("class", _class);

	//将a模块的data-index 赋给 b模块的data-index
	//将b模块的data-index 赋给 a模块的data-index
	var _index;
	_index = aEle.getAttribute("data-index");
	aEle.setAttribute("data-index", bEle.getAttribute("data-index"));
	bEle.setAttribute("data-index", _index);
}

//拖动模块
function move() {
	//循环绑定
	for(var i = 0; i < pic.length; i++) {

		//绑定触摸事件- 当手指触摸屏幕时候触发
		pic[i].addEventListener('touchstart', function(e) {

			this.style.zIndex = 100; //设置拖拽元素的z-index值，使其在最上面。
			dx = e.targetTouches[0].pageX - this.offsetLeft; //记录触发拖拽的水平状态发生改变时的位置
			dy = e.targetTouches[0].pageY - this.offsetTop; //记录触发拖拽的垂直状态发生改变时的位置
			this.startX = this.offsetLeft; //记录当前初始状态水平发生改变时的位置
			//offsetTop等取得的值与this.style.left获取的值区别在于前者不带px,后者带px
			this.startY = this.offsetTop;
			this.style.transition = 'none';

		});
		//绑定触摸事件- 当手指在屏幕上滑动的时候连续地触发
		pic[i].addEventListener('touchmove', function(e) {

			newLeft = e.targetTouches[0].pageX - dx; //记录拖拽的水平状态发生改变时的位置

			newtop = e.targetTouches[0].pageY - dy;

			if(newLeft <= -picWidth / 2) { //限制边界代码块，拖拽区域不能超出边界的一半

				newLeft = -picWidth / 2;

			} else if(newLeft >= (picboxWidth - picWidth / 2)) {

				newLeft = (picboxWidth - picWidth / 2);

			}

			if(newtop <= -picHeight / 2) {

				newtop = -picWidth / 2;

			} else if(newtop >= (picboxHeight - picHeight / 2)) {

				newtop = (picboxHeight - picHeight / 2);

			}

			this.style.left = newLeft + 'px';

			this.style.top = newtop + 'px'; //设置目标元素的left,top

		});

		//绑定触摸事件- 当手指从屏幕上离开的时候触发
		pic[i].addEventListener('touchend', function(e) {

			this.style.zIndex = 0;

			this.style.transition = 'all 0.5s ease 0s'; //添加css3动画效果

			this.endX = e.changedTouches[0].pageX - dx;

			this.endY = e.changedTouches[0].pageY - dy; //记录滑动结束时的位置，与进入元素对比，判断与谁交换

			var obj = change(e.target, this.endX, this.endY); //调用交换函数

			if(obj == e.target) { //如果交换函数返回的是自己

				obj.style.left = this.startX + 'px';

				obj.style.top = this.startY + 'px';

			} else { //否则

				var _left = obj.style.left;

				obj.style.left = this.startX + 'px';

				this.style.left = _left;

				var _top = obj.style.top;

				obj.style.top = this.startY + 'px';

				this.style.top = _top;

				var _index = obj.getAttribute('data-index');

				obj.setAttribute('data-index', this.getAttribute('data-index'));

				this.setAttribute('data-index', _index); //交换函数部分，可提取

				//当系统停止跟踪触摸的时候触发
				setTimeout(transitionEndFn, 500)
			}
		});
	}
}

//交互模块，判断拖动元素的位置是不是进入到目标原始1/2，这里采用绝对值得方式
function change(obj, x, y) {
	for(var i = 0; i < pic.length; i++) { //还必须判断是不是当前原素本身。将自己排除在外
		if(Math.abs(pic[i].offsetLeft - x) <= picWidth / 2 && Math.abs(pic[i].offsetTop - y) <= picHeight / 2 && pic[i] != obj) {
			return pic[i];
		}
	}
	return obj; //返回当前
}

//判断成功标准
function isSuccess() {
	var str = ''
	//循环生成 index字符串
	for(var i = 0; i < pic.length; i++) {
		str += pic[i].getAttribute('data-index');
	}

	if(str == '123456789') {
		return true;
	}
	return false;
}

//判读是否成功
function transitionEndFn() {
	if(isSuccess()) {
		console.log('成功了！');
		alert("成功了！");
		//	添加遮罩 不让再次拖动
		mask.style.display = "block";
		stopCount();
	}
}

//开始计时
function timedCount() {
	times.innerText = time
	time = time + 1
	t = setTimeout("timedCount()", 1000)
}

//停止计时
function stopCount() {
	clearTimeout(t);
}