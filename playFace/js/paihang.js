/**
 * Created by wangxiaojin on 2017/4/13.
 */

$(function(){
    $(".close").click(function(){
        $(".paihang").hide();
    })
    //点击排行榜上面的哪个li的时候就让相应的内容出现
    $(".paihangTop  li").click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $(".conboxs .conbox").eq($(this).index()).show().siblings().hide();
    })



})