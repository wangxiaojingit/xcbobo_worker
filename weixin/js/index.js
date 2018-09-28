(function($){
var basePath=" http://www.xiuktv.com/xcbb_web/h5Activity/";
	$("#txt").blur(function(){
		var text=$(this).val();
		//console.log(text);
		//判断用户名
		function auto(){
	 	var text=$("#txt").val();
	 console.log(text)
	var urls="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx91ac09ced03b76e6&redirect_uri=http%3a%2f%2fwww.xiuktv.com%2fxcbb_web%2fweixinh5%2freturnCode&response_type=code&scope=snsapi_base&state="+text+"#wechat_redirect";
		console.log(urls);
			   $("#test").on("click",function(){
			   	//alert(1);
			  	 $(".box").show();
			  	//调取名字查重接口
			   		$.ajax({
						type:"POST",
						url:" http://www.xiuktv.com/xcbb_web/h5Activity/isRepeatByName",
						dataType:"json",
						data:{name:text},
						success:function(data){
							console.log(data);
							if(data.isRepeat==true){
								//location.href="#page";
								alert("该名字已使用，换个名字试试吧！");
								location.href=urls;
								//alert(text);
							}else{
							location.href=urls;
							//alert(text);
							$.ajax({
									url:" http://www.xiuktv.com/xcbb_web/weixinh5/getCodeByState?state="+text,
									type:"GET",
									dataType:"json",
									success:function(data){
										//alert(data.success);
									}
							})
					}

				}
			})	 
		})
			   $("#span").on("click",function(){
			   		$(".box").hide();
			   })
	}
	 auto();		
})
})(jQuery)