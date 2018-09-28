(function($){
// 得到请求url参数
function getUrlParam(name){  
    //构造一个含有目标参数的正则表达式对象  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    //匹配目标参数  
    var r = window.location.search.substr(1).match(reg);  
    //返回参数值  
    if (r!=null) return unescape(r[2]);  
    return null;  
};
var Code=getUrlParam('code');
//alert(Code);	
var urls="http://www.xiuktv.com/xcbb_web/weixinh5/getOpenIdByCode?appid=wx91ac09ced03b76e6&secret=2f0608ffbba43baa5fd838102b3e523f&code="+Code;
//通过code获得openid
$.ajax({
	url:urls,
	typr:"GET",
	dataType:"json",
	success:function(data){
		var openId=data.openid;
		//alert(data.openid);
		//alert(openId);
		// 获得access_token
		$.ajax({
			url:"http://www.xiuktv.com/xcbb_web/weixinh5/getToken?appid=wx91ac09ced03b76e6&secret=2f0608ffbba43baa5fd838102b3e523f",
			type:"GET",
			dataType:"json",
			success:function(data){
				var ACCESS_TOKEN=data.access_token;
				//通过openid,access_token获得用户信息
				$.ajax({
					url:"http://www.xiuktv.com/xcbb_web/weixinh5/getUserInfoByOpenId?access_token="+ACCESS_TOKEN+"&&openid="+openId+"&lang=zh_CN",
					type:"GET",
					dataType:"json",
					success:function(data){
						var nickname=data.nickname;
						var url="http://www.xiuktv.com/xcbb_web/weixin/post/list";
						var otm="";
						//alert(nickname);
						$.ajax({
							url:url,
							type:"POST",
							dataType:"json",
							success:function(data){
								$.each(data.list,function(key,val){
									var bathUrl="http://www.xiuktv.com/PubImgSour";
									var Post_img=bathUrl+val.post_img;
									var Pid=val.id;

									//console.log(Pid);
									//console.log(Post_img);
									otm+="<div class='list'><h2>"+val.title+"</h2><h3>发布者：<span>"+val.post_name+"</span></h3><h3>发布时间：<span>"+val.create_time+"</span></h3><dl><dt><img src='"+Post_img+"'></dt><dd><p>"+val.post_content+"</p><button class='btn'>我来聊聊</button></dd></dl></div>";
								})
								$(".section").html(otm);
								//点击帖子进入帖子详情页
								$(".list").on("click",function(){
									var listId=$(this).index()+4;
									$("#page").hide();
										$("#wrpage").hide();
										$("#hfpage").show();
										$(this).find("button").html("回复");
										$(this).find("button").css({
											"background":"none",
											"color":"#29d1c4",
											"border":"1px solid #29d1c4",
											"border-radius":"8px",
											"font-size":"12px",
											"padding":"2px 8px",
											"position": "absolute",
											"right":" 0",
											"bottom": "0"
										})
										$(this).find("h2").hide();
										$(this).find("h3").hide();
										var ohtml=$(this).html();
										//console.log(ohtml);
										$(".tiezi").append("<div class='list'>"+ohtml+"</div>");
										var h2text=$(this).find("h2").html();
										//console.log(h2text);
										$("<h2>"+h2text+"</h2>").prependTo($(".hfheader"));
										var h3text=$(this).find("h3").html();
										$("<h3>"+h3text+"</h3>").appendTo($(".hfheader"));
										
										if($(".btn").html("回复")){
											$(".btn").on("click",function(){
												$("#hfpage").hide();
												$("#wrpage").show();
												$("#page").hide();
											})
										};


										/**/
										//获取某帖子全部评论
									/*	var ohtcent="";
												$.ajax({
													url:"http://www.xiuktv.com/xcbb_web/weixin/post/getReplyByPostId",
													type:"POST",
													dataType:"json",
													data:{pid:listId},
												
													success:function(data){
														//console.log(data);
														//console.log(data.list);
														var List=data.list;
														//console.log(List);
														$.each(data.list,function(v,k){
															var messId=k.answerid;
															//console.log(messId);
															var parentId=k.id;
															//console.log(parentId);
														
																$.each(data.list,function(key,val){
																	if(val.parentId==-1){
																		ohtcent+="<p class='ps'>"+val.content+"<a href='#' class='ahf'>回复</a></p>";
																	}
																})
																$(".hfcontent").html(ohtcent);
																/**/
																//回复个人评论，点击个人评论里的回复按钮，回复该条评论
														/*$(".ahf").on("click",function(){
															
															var ohthf="";
															$(this).parent("p").append("<div class='divs'></div>");
															//var parentId=$(this).parent("p").index()+3;
															//console.log(parentId);
															$("#page").hide();
															$("#hfpage").hide();
															$("#wrpage").hide();
															$("#wrpage2").show();
															$("#input2").blur(function(){
																var text2=$(this).val();
																$("#tjbtn2").on("click",function(){
																	//alert(1);
																	$("#page").hide();
																	$("#hfpage").show();
																	$("#wrpage").hide();
																	$("#wrpage2").hide();
																	
																	//获取回复评论接口
																	$.ajax({
																		url:"http://www.xiuktv.com/xcbb_web/weixin/post/replyComment",
																		type:"POST",
																		dataType:"json",
																		data:{hid:openId,bhid:openId,messId:messId,parentId:parentId,pid:listId,content:text2},
																		success:function(data){
																			//console.log(data);
																			//console.log(data.bhid);
																			//console.log(data.content);
																		}
																	});*/
																	/**/
																	//获取某帖子全部评论
																	/*$.ajax({
																		url:"http://www.xiuktv.com/xcbb_web/weixin/post/getReplyByPostId",
																		type:"POST",
																		dataType:"json",
																		data:{pid:listId},
																		success:function(data){
																			//console.log(data);
																					//console.log(data.list);
																			$.each(data.list,function(key,val){
																				if(val.parentId!=-1){
																					ohthf+="<p>"+val.content+"</p>";
																				}
																			})
																			$(".divs").html(ohthf);
																			//console.log($(".divs").html(ohthf));
																		}		
																	});	
																	/**/
															/*	})
															})
														})		
														/**/
													/*	})
													}
												})*/
										/**/

										$("#input").blur(function(){
											var text=$(this).val();
											$("#tjbtn").on("click",function(){
												//var openIds='oYHsmwYSYRevsvu9VtLpZtV-OG8s';
												var ohtcent="";
												$("#wrpage").hide();
												$("#hfpage").show();
												$("#page").hide();
												var hh=$(".hfsection").find(".list").height()+20;
												//console.log(hh);
												$(".hfcontent").css({
													"position":"absolute",
													"left":"0",
													"top":hh+"px"
												})
												//获取评论接口
												$.ajax({
													url:"http://www.xiuktv.com/xcbb_web/weixin/post/pubComment",
													type:"POST",
													dataType:"json",
													data:{replyId:openId,pid:listId,content:text},
													success:function(data){
														//alert(data);
														//alert(data.content);
														console.log(data);
													}
												});
												//获取某帖子全部评论
												$.ajax({
													url:"http://www.xiuktv.com/xcbb_web/weixin/post/getReplyByPostId",
													type:"POST",
													dataType:"json",
													data:{pid:listId},
													success:function(data){
														//console.log(data);
														//console.log(data.list);
														var List=data.list;
														//console.log(List);
														$.each(data.list,function(v,k){
															var messId=k.answerid;
															//console.log(messId);
															var parentId=k.id;
															//console.log(parentId);
																$.each(data.list,function(key,val){
																	if(val.parentId==-1){
																		ohtcent+="<p class='ps'><span>"+nickname+"</span>"+val.content+"<a href='#' class='ahf'>回复</a></p>";
																	}
																})
																$(".hfcontent").html(ohtcent);
														//回复个人评论，点击个人评论里的回复按钮，回复该条评论
														$(".ahf").on("click",function(){
															var ohthf="";
															$(this).parent("p").append("<div class='divs'></div>");
															//var parentId=$(this).parent("p").index()+3;
															//console.log(parentId);
															$("#page").hide();
															$("#hfpage").hide();
															$("#wrpage").hide();
															$("#wrpage2").show();
															$("#input2").blur(function(){
																var text2=$(this).val();
																$("#tjbtn2").on("click",function(){
																	//alert(1);
																	$("#page").hide();
																	$("#hfpage").show();
																	$("#wrpage").hide();
																	$("#wrpage2").hide();
																	//获取回复评论接口
																	$.ajax({
																		url:"http://www.xiuktv.com/xcbb_web/weixin/post/replyComment",
																		type:"POST",
																		dataType:"json",
																		data:{hid:openId,bhid:openId,messId:messId,parentId:parentId,pid:listId,content:text2},
																		success:function(data){
																			//console.log(data);
																			//console.log(data.bhid);
																			//console.log(data.content);
																			console.log(data.hid);
																		}
																	});
																	/**/
																	//获取某帖子全部评论
																	$.ajax({
																		url:"http://www.xiuktv.com/xcbb_web/weixin/post/getReplyByPostId",
																		type:"POST",
																		dataType:"json",
																		data:{pid:listId},
																		success:function(data){
																			//console.log(data);
																			//console.log(data.list);
																			$.each(data.list,function(key,val){
																				if(val.parentId!=-1){
																					ohthf+="<p>"+val.content+"</p>";
																				}
																			})
																			$(".divs").html(ohthf);
																			//console.log($(".divs").html(ohthf));
																		}
																				
																	});	
																	/**/
																})
															})
														})

														})
													}

												})
											})
										});
								})
							}
						})
					}
				})
			}
		})
	}
})
})(jQuery)