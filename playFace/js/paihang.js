/**
 * Created by wangxiaojin on 2017/4/13.
 */

$(function(){
    $(".close").click(function(){
        $(".paihang").hide();
    })
    //������а�������ĸ�li��ʱ�������Ӧ�����ݳ���
    $(".paihangTop  li").click(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $(".conboxs .conbox").eq($(this).index()).show().siblings().hide();
    })



})