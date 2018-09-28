
 var uid=parameter().uid
 var token=parameter().token
 var kanjia_id=parameter().kanjia_id||"";
 var union_id=0;
 var giftId="";
 var generation=0;
 var isShare=parameter().isShare;
 var shareIcon=base+"/wh5/Bargain/images/shareIcon.jpg" //分享图片
 var shareKan_id="null";
 inApp=null;//3期新增参数
 if(parameter().isShare==0){
	 //在APP内
	 union_id=null;
	 giftId=0;
	 generation=0;
	 inApp=1
	
 }else if(parameter().isShare==1){
	  uid=0;
	  inApp=0;
	  union_id=parameter().union_id;
	  giftId=parameter().giftId;
	  generation=parameter().generation||""
 }
var appid="wx6d134e29ee846ec5";//开发
//var appid="wx301d36d30e628ebf";//线上
var myapp=new Vue({
    el:"#main",
    data:{
        mygoodslists:[],
        mycomputedTime:0,
        defTime:0,
        imgbath:imgbase,
        flagshow:false,
        cut1_money:0,
        leave_money:0,
        union_id2:"",
        deviceNum:""
    },
    created:function(){
        var that=this;
        
        if(parameter().isShare==0){
        	 that.mygoodslitsFn();
        	if(isAndroid){
        		 anzhuo.isShowButton(false);
            }
        	//如果是app内的话,先判断网址上是否有blockShare 辉煌新增需求:1
        	if(parameter().cut1_money){
        		that.cut1_money=parameter().cut1_money;
        		that.leave_money=parameter().leave_money;
        		//说明是从index 页面进来的,需要让blockShare 变成show
        		$(".blockShare").css("display","block");
        	}
        	that.getDeviceNum();	
        }
        if(parameter().isShare==1){
            // 进来的时候如果是web 就去配置微信   	
         	that.config();
        }
       
       
    },
    mounted:function(){
        var  that=this;
        if(localStorage.getItem('union_id')){
    		//如果本地存的有
    		 union_id= localStorage.getItem('union_id');
    		 that.mygoodslitsFn();;//拿到union_id 之后才去请求商品列表
    	}else{
    		 //本地如果没有存,求去请求
    		 that.getOpenId();
    	}
        window.setInterval(function(){
           that.defTime=(new Date().getTime()-that.mycomputedTime)/1000;
        },1000)
    },
    computed:{
    	myGoodsNum:function(){
    		return this.mygoodslists.filter(function(item){
    			return item.flag==1||item.flag==2
    		}).length
    	}
    },
    methods:{
    	//获取设备号的方法,一进这个页面的时候,我就回去调用原生的方法,获取设备号
    	getDeviceNum:function(){
    		var that=this;
    		
    		try{
    			if(isAndroid){
        			//如果是安卓
        			 that.deviceNum= anzhuo.phoneDevice();
        			
        			
        		}else{
        			
        			//alert(window.AndroidWebView.phoneDevice)
        			// that.deviceNum=window.AndroidWebView.phoneDevice();
        			// that.deviceNum=phoneDevice();
        			                          
        			that.deviceNum=parameter().deviceNum;
        			
        			
        		}
    			
    			//把设备号存放到本地
    			//alert("获取本地设备号:"+that.deviceNum);
    		}catch(e){
    			
    		}
    		//获取设备号
    		
    		
    		
    	},
    	//请求签名信息
    	config:function(){
    		 var that=this;
    		 //var code=parameter().code; //获取微信的code值
    		 var aaurl=encodeURIComponent(location.href.split('#')[0]);
    		 var url25=base+"/xcbb_web/event/getJsapiSign?url="+aaurl;
    		    $.ajax({
    		        url:url25,    //请求的url地址
    		        dataType:"json",   //返回格式为json
    		        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
    		        type:"GET",   //请求方式
    		        cache:false,
    		        success:function(data){
    		            if(data.success){
                            var data=data.result;
                            var appId=data.appid;
                            var timestamp=data.timestamp;
                            var nonceStr=data.nonceStr;
                            var signature=data.signature;
                            that.weixinCallback(appId,timestamp,nonceStr,signature);
    		            }

    		        },
    		        error:function(){
    		        	alert("error!")
    		        }

    		    });
    		 
    	},
    	//获取openId
    	getOpenId:function(){
    		var that=this;
    		var url=base+"/xcbb_web/event/getWexinUserInfo?code="+parameter().code;
    	    $.ajax({
    	        url:url,    //请求的url地址
    	        dataType:"json",   //返回格式为json
    	        async:true,//请求是否异步，默认为异步，这也是ajax重要特性
    	        type:"GET",   //请求方式
    	        cache:false,
    	        success:function(data){
    	            if(data.success){
    	                //获取openid
    	                that.union_id2=data.unionid;
    	                union_id=data.unionid;
    	                localStorage.setItem('union_id',union_id);
    	                //拿到openId 以后再去请求商品
    	                that.mygoodslitsFn();
    	            }
    	        }
    	    });
    	},
    
    	// 微信分享调用接口配置:
//    	  weixinCallback:function(appId,timestamp,nonceStr,signature){
//    		  var that=this;
//    	       //微信分享配置
//    	       wx.config({
//    	           debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//    	           appId: appId, // 必填，公众号的唯一标识
//    	           timestamp:timestamp , // 必填，生成签名的时间戳
//    	           nonceStr: nonceStr, // 必填，生成签名的随机串
//    	           signature:signature,// 必填，签名，见附录1
//    	           jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage",'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//    	       });
//    	       //判断当前客户端版本是否支持指定的js接口
//    	       wx.ready(function(){
//    	           //隐藏按钮
//                   wx.hideMenuItems({
//                       menuList: [
//                           "menuItem:share:timeline",  //在活动页面隐藏分享到朋友圈     
//                           'menuItem:share:appMessage',// 在活动页隐藏分享到好友      
//                           'menuItem:share:qq',
//                           'menuItem:share:weiboApp',
//                           'menuItem:favorite',
//                           'menuItem:share:facebook',
//                           'menuItem:share:QZone',
//                           'menuItem:openWithSafari',
//                           'menuItem:share:email',
//                           'menuItem:readMode',
//                           'menuItem:setFont',
//                           'menuItem:exposeArticle',
//                           'menuItem:refresh',
//                           'menuItem:dayMode',
//                           'menuItem:nightMode',
//                           'menuItem:profile',
//                           'menuItem:addContact',
//                           'menuItem:editTag',
//                           'menuItem:delete',
//
//                           'menuItem:originPage',
//                           'menuItem:openWithQQBrowser',
//                           'menuItem:share:brand'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//                       success:function(res){
//                           //alert("隐藏");
//                       }
//                   });
//    	       })   
//                  
//    	          
//    	           
//
//    	   },
        // 微信分享调用接口配置:
    	  weixinCallback:function(appId,timestamp,nonceStr,signature){
    		  var that=this;
    	       //微信分享配置
    	       wx.config({
    	           debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    	           appId: appId, // 必填，公众号的唯一标识
    	           timestamp:timestamp , // 必填，生成签名的时间戳
    	           nonceStr: nonceStr, // 必填，生成签名的随机串
    	           signature:signature,// 必填，签名，见附录1
    	           jsApiList: ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage",'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    	       });
    	       //判断当前客户端版本是否支持指定的js接口
    	       wx.ready(function(){
    	           //隐藏按钮
                   wx.hideMenuItems({
                       menuList: [
                                  'menuItem:share:appMessage',
                                  'menuItem:share:timeline',
                           'menuItem:share:qq',
                           'menuItem:share:weiboApp',
                           'menuItem:favorite',
                           'menuItem:share:facebook',
                           'menuItem:share:QZone',
                           'menuItem:openWithSafari',
                           'menuItem:share:email',
                           'menuItem:readMode',
                           'menuItem:setFont',
                           'menuItem:exposeArticle',
                           'menuItem:refresh',
                           'menuItem:dayMode',
                           'menuItem:nightMode',
                           'menuItem:profile',
                           'menuItem:addContact',
                           'menuItem:editTag',
                           'menuItem:delete',

                           'menuItem:originPage',
                           'menuItem:openWithQQBrowser',
                           'menuItem:share:brand'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                       success:function(res){
                           //alert("隐藏");
                       }
                   });
                   //分享链接
                   url=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+uid+"&token="+parameter().token+"&kanjia_id="+shareKan_id+"&isShare=1"+"&union_id="+union_id;
                   
                   var link=base+"/xcbb_web/auth2.html?url="+url.split("#")[0]
    	           //如果支持分享给朋友圈的时候开始!
    	           wx.onMenuShareTimeline({
    	               title:'免费礼物随便拿，只需进来砍个价！', // 分享标题
    	               link:link,
    	               imgUrl:shareIcon, // 分享图标
    	               success: function () {    	     
    	            	  alert("分享成功")
    	            	   
    	            	  
    	            	   
    	            	   
    	            	   
    	               }
    	              
    	           });
    	           //如果支持分享给朋友圈的时候结束!
    	           //获取“分享给朋友”按钮点击状态及自定义分享内容接口开始
    	           wx.onMenuShareAppMessage({
    	               title: "免费礼物随便拿，只需进来砍个价！", // 分享标题
    	               desc:"我在参加小草直播官方砍价，砍到0元就能免费拿啦，帮我砍一下吧",
    	               link: link,
    	               imgUrl: shareIcon, // 分享图标
    	               type: '', // 分享类型,music、video或link，不填默认为link
    	               dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    	               success: function () {    	                   
    	                  alert("分享成功!")
    	            	 
    	               }
    	           });
    	       })

    	   },
    	//是否显示sharebutton 
    	//是否显示sharebutton 
        appisbutton:function(){       
        	if(isAndroid){
        		anzhuo.isShowButton(false);
            	 
            }else if(isIOS){
            	isShowButton(false);
            }else{
            	alert("请在安卓或ios手机打开")
            }
        },
        //下载app
        downapp:function(){
    		var that=this;
    		if(isAndroid){
//                window.setTimeout(function() {                     
//                        window.location.href = "https://www.xcbobo.com/xcbb_web/free/mobile/version/versionCheck?version=0.0.1&build=0";//安卓下载地址  
//                   
//                },2000);  
//                window.location.href = "xcshow://splash";
    			that.downHref="http://a.app.qq.com/o/simple.jsp?pkgname=com.prsoft.xcshow&ckey=CK1366217053025";
                
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.prsoft.xcshow&ckey=CK1366217053025";//安卓下载地址  
    			
    		}else if(isIOS){
//                window.setTimeout(function() {  
//                        window.location.href= "@itms-apps://itunes.apple.com/app/id1191416714";//ios下载地址  
//                },2000);  
//                window.location.href= "wxe74cd88b478b9d3b";  //打开app
    			that.downHref="https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E7%9B%B4%E6%92%AD-%E6%B8%B8%E6%88%8F%E7%A4%BE%E4%BA%A4%E4%BA%92%E5%8A%A8%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0/id1191416714?mt=8";
    			window.location.href ="https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E7%9B%B4%E6%92%AD-%E6%B8%B8%E6%88%8F%E7%A4%BE%E4%BA%A4%E4%BA%92%E5%8A%A8%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0/id1191416714?mt=8"   			
    		}
    		
    	},
    	// 领取奖励
    	getreward:function(item){
    		
    		if(isShare==1){
    			//说明在web
    			$("#getpriceTips").show();
    			//在web 设备号等于一个时间戳,s
    			var deviceNum=new Date().getTime()/1000;
    		}else if(isShare==0){
    			//说明在app内
	    		var that=this;
	    		//在app 内
    			var deviceNum=that.deviceNum;
    			
	    		 axios({
	                 method:'get',
	                 url:base+"/xcbb_web/activity/bargain/get?token="+token+"&uid="+uid+"&kanjia_id="+item.id+"&deviceNum="+deviceNum,
	                 responseType:'json'
	               }).then(function(response) {
	                   var data=response.data
	                   if(data.success){
	                      //请求成功
	                	   $("#lingqvtips").html("已领取到跑道中!");
	                	   $("#lingqvtips").css("display","block");
	                	   window.setTimeout(function(){
	                		   $("#lingqvtips").hide();
	                	   },1000)
	                      //更新数据
	                      that.mygoodslitsFn();
	                   }else{
	                	   //如果没有绑定手机号,需要先绑定手机号
	                	  // alert(data.error_code_desc);
	                	   $("#lingqvtips").html(data.error_code_desc);
	                	   $("#lingqvtips").css("display","block");
	                	   if(data.error_code==13){
	                		      window.setTimeout(function(){
	                		    	  $("#lingqvtips").css("display","none");
	                		    	  var url=window.location.href;
		                			   //跳转到手机绑定页面
		                			   window.location.href="./bindPhone.html?uid="+uid+"&token="+token+"&union_id="+union_id+"&isShare="+isShare+"&kanjia_id="+kanjia_id+"&giftId="+giftId+"&deviceNum="+deviceNum;

	                		      },1000)
	                	   }
	                 	 
	                   }
	               });
    		}
    	},
    	closeBlockWebShare2:function (){
    		$(".blockWebShare2").hide();
    	},
    	 //显示shareview
       	shareshow:function(item){     
       	   var kanjia_id=item.id;//砍价id
       	   $(".blockShare").attr("kanjia_id",kanjia_id);
           var that=this;        	   
           $(".blockShare").show();
       		
       	},   
        //app分享
        share:function(type){
        	    var that=this;
        	    if(!parameter().kanjia_id||parameter().kanjia_id=="null"){
        	    	var kanjia_id=$(".blockShare").attr("kanjia_id");
        	    }else {
        	    	var kanjia_id=parameter().kanjia_id;
        	    }
        		
            var winUrl=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+uid+"&token="+parameter().token+"&kanjia_id="+kanjia_id+"&isShare=1";
           
            winUrl=encodeURIComponent(winUrl) 

            if(isAndroid){
            	 that.appSucessShare1(type,winUrl,appid);
            	// anzhuo.Appshare(type,winUrl,appid);
            }else if(isIOS){
            	 that.appSucessShare1(type,winUrl,appid);
            	 // Appshare(type,winUrl,appid);
            }else{
            	alert("请在安卓或ios手机打开");
            }
            
           
        },
        //关闭分享按钮
        closeShare:function(){
        	$(".blockShare").hide();
        },
        mygoodslitsFn:function(){
            var that=this;
           
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain//products/list?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId="+giftId+"&inApp="+inApp,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                 
                  if(data.success){
                	 
                	  
                     //请求成功
                     that.mygoodslists=data.result.products_my;
                     if(that.mygoodslists.length){
                    	 $(".giftlists").css("display","block");
                     }else{
                    	 $("#nogift").css("display","block");
                     }
                    
                     //that.countDown()
                     //本地时间
                    that.mycomputedTime=new Date().getTime();
                  }else{
                	  alert(data.error_code_desc);
                  }
              });
           
        },
        countDown:function(time){
            var that=this;
            var oldDate=new Date().getTime();//获取当前时间
            window.setInterval(function(){
              var nowTime=new Date().getTime();
              var passTime=(nowTime-oldDate)/1000 //经过的秒数
              that.formateTime(that.next_gift_flush_time-passTime);
            },1000)
        },
        formateTime:function(time){
          //time 秒 
          var that=this;
          time= time-that.defTime;
          var day=parseInt(time/(60*60*24));
          var leaveTime=time%(60*60*24)//剩下的秒数
          var hour=parseInt(leaveTime/60/60)+day*24;
          var leaveTime2=leaveTime%(60*60);//剩下的秒数
          var minute=parseInt(leaveTime2/60); //分钟数
  
          var second=parseInt(leaveTime2%60); //剩下的秒数
          
          if(day<=0){
          	day=00
          }
          if(hour<=0){
          	hour=0
          }
          if(minute<=0){
          	minute=0
          }
          if(second<=0){
          	second=0;
          }
          
          
          var a=that.formateDouble(hour)+":"+that.formateDouble(minute)+":"+that.formateDouble(second);
          return a
          
        },
        formateDouble:function(time){
              if(time<10){
                return "0"+time
              }
              return time
        },
        imgurl:function(item){
            return imgbase+item.folder_path+"/"+item.goods_icon+".png";
        },
        tohome:function(){
        	$(".right").removeClass("select");
            $(".left").addClass("select");
            var that=this;
            if(isShare==0){
            	//说明是在app 内
            	window.location.href="./index.html?uid="+uid+"&token="+token+"&isShare="+isShare;
            	if(isIOS){
            		window.location.href="./index.html?uid="+uid+"&token="+token+"&isShare="+isShare+"&deviceNum="+that.deviceNum;
            	}else{
            		window.location.href="./index.html?uid="+uid+"&token="+token+"&isShare="+isShare;
            	}
            }else if(isShare==1){
            	
            	var url=base+"/xcbb_web/wh5/Bargain/index.html?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId="+giftId+"&isShare="+isShare+"&generation="+generation+"&kanjia_id="+kanjia_id;
            	url=url.split("#")[0];
            	window.location.href=base+"/xcbb_web/auth2.html?url="+url;
            	//window.location.href="./index.html?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId="+giftId+"&isShare="+isShare+"&generation="+generation;
            }
            
        },
        Toback:function(){
            
           
            if(isAndroid){
               test.back();
            }else if(isIOS){
               back()
            }
        },
        toMygoods:function(){
        	return;
        	$(".right").addClass("select");
            $(".left").removeClass("select");
            window.location.href="./mygoods.html?uid="+uid+"&token="+token;
        },
        toMessage:function(item,index){
        	
        	var that=this;
        	var kanjia_id=item.id;
        	//先临时写死,这个后台接口下个版本上;
        	var is_shared=item.is_shared;
        	//var is_shared=false;
        	
        	//alert("is_shared:"+is_shared);
        	shareKan_id=item.id;
        	
        	if(!is_shared){
        		that.cut1_money=item.current_price;
        		that.leave_money=item.gift_price-item.current_price;
        		if(parameter().isShare==0){
        			//app内
        			that.shareshow(item);
        			
        		}else{
        			 kanjia_id=item.id;
        			//新增逻辑
        			 var urlshare=base+"/xcbb_web/wh5/Bargain/message2.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"&cut1_money="+that.cut1_money+"&leave_money="+that.leave_money;
        			
        			  window.location.href=base+"/xcbb_web/auth2.html?url="+urlshare.split("#")[0];
        			 return;
        			 
        			 
        			
        			
        			//$(".blockWebShare2").css("display","block");
        		}
        		
        		that.index=index;
        	}else{
        		if(isShare==0){
        			//说明在app内新增逻辑,如果分享过了,我们就跳转到新的分享页面.辉煌新增
        			
        			var urlshare=base+"/xcbb_web/wh5/Bargain/message3.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare=0&union_id=null";
        			window.location.href=urlshare;
        		//	window.location.href=base+"/xcbb_web/auth2.html?url="+urlshare.split("#")[0];
        			
        		}else if(isShare==1){
        			//说明在app外
        			var url=base+"/xcbb_web/wh5/Bargain/message.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare;
               	    url=url.split("#")[0];
               	    window.location.href=base+"/xcbb_web/auth2.html?url="+url;
        			//window.location.href="./message.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"";
        		}
        		
        	}
        	
        	//为了调试,先跳过那个步骤.
        	//window.location.href="./message.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare=0";
//        	if(!is_shared){
//        		//再次走下砍第二刀的接口        		
//        		var id=item.id;
//        		
//           	 axios({
//                    method:'get',
//                    url:base+"/xcbb_web/activity/bargain/kanjia-share?uid="+uid+"&token="+token+"&kanjia_id="+id,
//                    responseType:'json'
//                  }).then(function(response) {
//                     
//                      var data=response.data
//                      if(data.success){
//                        //请求成功
//                  	   that.cut1_money=data.result.current_price;//当前砍下的多少钱
//                   	   that.leave_money=data.result.gift_price-that.cut1_money ;// 还剩多少钱
//                   	 window.location.href="./message.html?uid="+uid+"&token="+token+"&kanjia_id="+id+"&isShare=0";
//                      }else{
//                    	  alert(data.error_code_desc);
//                      }
//                     
//                  });
//        		
//        	}else{
//        		that.shareshow();
//        	}

        },
        parameterBase:function(url){
      	  var url=decodeURIComponent(url);
      	  //  var url="http://www.xiuktv.com/xcbb_web/h5Activity/getSharePageInfo?zid=10004125&uid=10004122&type=1&sex=1&page=1&pageSize=100&token=123&province=111&nice=小辣"
      	  var obj={};
      	  var tem=[];
      	  var ary=url.split("?")[1].split("&");
      	  for(var i=0;i<ary.length;i++){
      	      var cur=ary[i];
      	      tem= cur.split("=");
      	      obj[tem[0]]=tem[1];
      	  }
      	  return obj;
      },
      appSucessShare1:function(type,winUrl,appid){
          $("#shareText1").html("分享砍掉");
     	   $("#shareText2").html("分享给好友快速帮你砍价吧!~");
       	var that=this;
       	var kanjia_id=that.parameterBase(winUrl).kanjia_id;
       	 axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain/kanjia-share?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                  if(data.success){
                     //请求成功
               	   that.mygoodslists[that.index].is_shared=true;
               	   that.cut1_money=data.result.current_price;//当前砍下的多少钱
               	   that.leave_money=data.result.gift_price-that.cut1_money-data.result.firstKanjiaPrize;// 还剩多少钱
               	   
                  }else{
                	 // alert(data.error_code_desc);
                	 // window.location.href="./message.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare=0";
                  }
                  
                  if(isAndroid){
                 	 anzhuo.Appshare(type,winUrl,appid);
                 }else if(isIOS){
                 	 Appshare(type,winUrl,appid);
                 }
              });
   		
       	
       },
        appSucessShare:function(winUrl){
        	
             //辉煌新增逻辑,在每次分享成功之后,我需要刷新下数据,去更新下按钮的状态,看是否分享过,从而进行页面的跳转.
        	 that.mygoodslitsFn();
      	       
    		
        	
        },

       
       
    },
    watch:{
        list:function(){
            //监听到数据发生改变的时候,就执行跑马灯
            var that=this;
            if(that.flag||that.flag==1){
                window.setTimeout(function(){
                    that.runMessage();
                },600)
            }

            
        }
    }
})
