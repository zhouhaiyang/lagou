/**
 * Created by Administrator on 2016/8/30.
 */
/**
 * 菜单的显示与隐藏。
 */

function  Navgation(parent,children1,children2) {
    var _this = this;
    this.parent = parent;
    this.oDiv =  children1;
    this.oDiv2 = children2;
      this.parent.onmouseenter =function (){
          utils.addClass(_this.oDiv,"current");
          utils.addClass(_this.oDiv2,"display");
      }
    this.parent.onmouseleave =function (){
        utils.removeClass(_this.oDiv,"current");
        utils.removeClass(_this.oDiv2,"display");
    }
}
/*---------选项卡-------------*/
(function () {
    var tab = utils.getByClass("tab")[0];
    var tabBox = utils.getByClass("tab-box");
    var aLi = tab.getElementsByTagName("li");
    for(var i=0;i<aLi.length;i++){
        aLi[i].index=i;
        aLi[i].onclick =function () {
            for(var i =0 ;i<aLi.length;i++) {
                utils.removeClass(aLi[i],"current-tab");
                tabBox[i].style.display="none";
            }
            utils.addClass(aLi[this.index], "current-tab");
            tabBox[this.index].style.display = "block";
        }
    }

    /*-----------------------------穿墙效果=-------------------*/
    //需求：当鼠标移入oDiv的时候，求出从哪个方向进入
    var oDiv=utils.getByClass("cross")[0];
    var aDiv = oDiv.getElementsByTagName("div");
    for(var j=0; j<aDiv.length; j++){
        move({
            ele:aDiv[j],
            time:200
        })
    }
    function hoverDir(obj,e){
        //想用公式Math.atan2(y,x);
        var r=obj.offsetWidth/2;
        var x=utils.offset(obj).left+r- e.pageX;
        var y=utils.offset(obj).top+r- e.pageY;
        //弧度转角度公式：180*i/Math.PI;
        return  Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;//核心

        /*
         * 1.首先通过Math.atan2(y,x)求出弧度
         * 2.弧度转角度 180*i/Math.PI  -180~180
         * 3.都+180 =》 0~360之间
         * 4.都除以90度，并且四舍五入  （0 4） 1 2 3
         * 5.%4；正好求出4边；
         * */
    }

    function move(opt){
        var oDiv=opt.ele;
        var effect=opt.effect||0;
        var time=opt.time||300;
        var oSpan=oDiv.getElementsByTagName('span')[0];
        /*
         * 关于onmouseover的问题：两种解决办法
         * 1）懒办法 ： onmouseenter;
         * 2)让关联元素不执行代码；
         * */
        oDiv.onmouseover=function(e){
            e=e||window.event;//事件对象的兼容处理；
            var oTo= e.fromElement||relatedTarget;//里面的关联元素
            if(this.contains(oTo)) return;
            var n=hoverDir(this,e);//通过hoverDir这个函数，可以返回一个数值，这个数值直接决定我们从哪个方向移入；
            switch (n){
                case 0://当我鼠标从右边移入,span应该快速的到达 left:113px top:0;
                    utils.css(oSpan,{left:113,top:0});
                    break;
                case 1://当鼠标从下边移入，span应该快速到达 left:0 top:113
                    utils.css(oSpan,{left:0,top:113});
                    break;
                case 2://从左边移入
                    utils.css(oSpan,{left:-113,top:0});
                    break;
                default ://3 ：从上边移入
                    utils.css(oSpan,{left:0,top:-113});
                    break;
            }
            animate(oSpan,{left:0,top:0},time,effect)
        };
        oDiv.onmouseleave=function(e){
            e=e||window.event;
            var oTo= e.toElement||relatedTarget;
            if(this.contains(oTo)) return;
            var n=hoverDir(this,e); //n是为了拿到我们从哪个方向出去
            switch (n){
                case 0:
                    animate(oSpan,{left:113,top:0},time,effect);
                    break;
                case 1:
                    animate(oSpan,{left:0,top:113},time,effect);
                    break;
                case 2:
                    animate(oSpan,{left:-113,top:0},time,effect);
                    break;
                default : //default代表3
                    animate(oSpan,{left:0,top:-113},time,effect);
                    break;
            }


        }
    }

    /*------------------------------穿墙效果--------------------------------*/



})()
/*-------------------------------轮播图-----------------------------------*/
var divBanner = utils.getByClass("home-banner")[0];
var ulBanner = utils.getByClass("ul")[0];
var bannerDiv = ulBanner.parentNode.getElementsByTagName("div")[0];
var bDEM = bannerDiv.getElementsByTagName("em")[0];
var bDUL = bannerDiv.getElementsByTagName("li");
var aI = bannerDiv.getElementsByTagName("i");
var step = 0;
aI[0].style.zIndex=-999;
  clearInterval(timer)
   var timer =  setInterval(autoMove,4000);
function autoMove() {
     if(step>=2){
         animate(ulBanner,{top:0},150)
         step=-1;
     }
    step++;
    animate(ulBanner,{top:-step*160},150)
    bannerTip()
};
//2.焦点自动轮播
function bannerTip(){
    var tmpStep=step>=bDUL.length?0:step;
    for(var i=0; i<bDUL.length; i++){
       if(tmpStep===i){
           animate(bDEM,{top:step*55},150);
           aI[i].style.zIndex=-999;
       }else {
           aI[i].style.zIndex=0;
       }

    }
}
//3,移入停止，移出继续
divBanner.onmouseover=function(){
    clearInterval(timer);
};
divBanner.onmouseout=function(){
    clearInterval(timer);
    timer=setInterval(autoMove,4000);
};
//7.点击焦点手动切换
handleChange();
function handleChange(){
    for(var i=0; i<bDUL.length; i++){
        bDUL[i].index=i;
        bDUL[i].onmouseover=function(){
            step=this.index;
            animate(ulBanner,{top:-step*160},150);
            bannerTip();
        }
    }
}
/*-------------------------------轮播图-----------------------------------*/
/*-------------------------------搜索框-----------------------------------*/
var searchBox = document.getElementById("search-box");
var searchIp = document.getElementById("search-input");
console.log(searchIp)
searchIp.onblur=function () {
    this.placeholder="技术总监";
    this.style.color="rgb(153, 153, 153)";
}
searchIp.onfocus=function () {
    this.placeholder="搜索职位，公司或地点";
    this.style.color="rgb(153, 153, 153)";
}
/*-------------------------------搜索框-----------------------------------*/