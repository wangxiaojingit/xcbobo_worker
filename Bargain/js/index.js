//  case UMSocialPlatformType_QQ:
//            userType = 1; //qq
//            break;
//        case UMSocialPlatformType_Qzone:
//            userType = 5; // 代表qq 空间
//            break;
//        case UMSocialPlatformType_WechatSession:
//            userType = 2;  //代表微信好友
//            break;
//        case UMSocialPlatformType_WechatTimeLine:
//            userType = 4;  //微信朋友圈
//            break;
//        case UMSocialPlatformType_Sina:
//            userType = 3;  //新浪微博
//            break;
//        default:
//            break;

 
 var uid=parameter().uid||"0";
 var token=parameter().token||"a";
 var union_id=0;
 var giftId=0;
 var generation="";//在app 内代数为0
 var isShare=parameter().isShare
 var nick="";//微信中昵称
 var shareIcon=base+"/wh5/Bargain/images/shareIcon.jpg" //分享图片
 var kanjia_id=parameter().kanjia_id||"";
 var share_kanjia_id="null";
 var inApp=null;
 if(parameter().isShare==0){
	 //在APP内
	 union_id=null;
	 inApp=1;//在app 内 inApp=1
	 nick="";
	 generation=0;
	 
 }else if(parameter().isShare==1){
	  uid=0;
	  union_id=parameter().union_id;
	  inApp=0;//在app外 inApp=0;
	  nick=parameter().nick;
	  generation=parameter().generation;
 }
 
var appid="wx6d134e29ee846ec5";//xiuktv 用的
//var appid="wx301d36d30e628ebf";//线上
 

var myapp=new Vue({
    el:"#main",
    data:{
    	myGoodsNumIing:0, //正在砍价的商品数量,flag=1 继续砍价的数量
        time:"123",
        list:[],
        runMessNum:-1,
        runMessMoveY:0,
        flag:1,
        timeBar:null,
        goodslists:[],
        imgbath:imgbase,
        next_gift_flush_time:null,
        downtime:"",
        downtimeFlag:true,
        cut1_money:"0",//首刀砍下的钱数
        leave_money:"0" ,//还剩多少钱
        myGoodsNum:0,
        timeindex:null,
        tipMessage:"",
        giftFlag:false,
        deviceNum:"",
        grade_product:[],//特定等级礼物列表
        tool_product:[],//道具等级列表
        preLeve:null ,//存储第一条数据的leve;
        preis_kanjia:null //存储上一个是否砍过价

    },
    created:function(){
        var that=this;
        //请求弹幕接口
        this.Barrage();
       
        if(parameter().isShare==0){
        	that.goodslitsFn();
        	if(isAndroid){
        		 try{
        			 anzhuo.isShowButton(false);
        		 }catch(e){
        			 
        		 }
              	
              	 
            }
        	that.getDeviceNum();
        }
        if(parameter().isShare==1){
            // 进来的时候如果是web 就去配置微信   	
         	that.config1();
        }
      
        	
     
        
       
    },
    mounted:function(){
    	
        var that=this;
        //活动埋点
        this.burialPoint();
        if(parameter().isShare==1){
            //如果参数isShare==1 说明是分享出去的页面,就去请求config 中所需要的配置信息
        	if(localStorage.getItem('union_id')){
        		//如果本地存的有
        		 union_id= localStorage.getItem('union_id');
        		 that.goodslitsFn();//拿到union_id 之后才去请求商品列表
        	}else{
        		 //本地如果没有存,求去请求
        		 that.getOpenId();
        	}
           
           
        }
    
        var myindexTime=setTimeout(function(){
  		  clearTimeout(myindexTime);
  		  that.giftFlag=true;
  		  
  	    },500);
        var enurl=window.location.href
      
    
    },
    
    methods:{
    	burialPoint:function(){
    		var uid=parameter().uid||"";
    		var token=parameter().token||"";
    		var activityId=parameter().activityId||"";
    		var source=parameter().source||"";
    		
    		//活动埋点
    		$.ajax({
    			type:"get",
    			url:base+"/xcbb_web/mobile/api/headlines/clickCount?uid="+uid+"&token="+token+"&activityId=2&source="+source,
    			success:function(data){
    				
    			}
    			
    		})
    	},
    	closetipskangbox:function(){
    		$("#tipskangbox").css("display","none")
    	},
    	closeBlockWebShare2:function (){
    		$(".blockWebShare2").hide();
    	},
    	shareClose2:function(){
    		$("#blockShare").hide();
    	},
    	//获取设备号的方法,一进这个页面的时候,我就回去调用原生的方法,获取设备号
    	getDeviceNum:function(){
    		var that=this;
    		
    		try{
    			if(isAndroid){
        			//如果是安卓
    				 
        			 that.deviceNum= anzhuo.phoneDevice();
        			 
        			 
        		}else{
        			
        		    if(parameter().deviceNum){
        				
        				that.deviceNum=parameter().deviceNum;
        				
        			}else{
        				
        				that.deviceNum=window.AndroidWebView.phoneDevice();
        				
        			}
        			
        			 
        		
        			
        		}
    			
    			//把设备号存放到本地
    			//alert("获取本地设备号:"+that.deviceNum);
    		}catch(e){
    			
    		}
    		//获取设备号
    		
    		
    		
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
    	                //拿到openId 以后再去请求商品
    	                
    	                localStorage.setItem('union_id',union_id);
    	                that.goodslitsFn();
    	            }
    	        }
    	    });
    	},
    	//请求签名信息
    	config1:function(){
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
                            that.weixinCallback1(appId,timestamp,nonceStr,signature);
    		            }

    		        },
    		        error:function(){
    		        	alert("error!")
    		        }

    		    });
    		 
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
	           //隐藏按钮
           wx.hideMenuItems({
               menuList: [
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
          // var kanjia_id=parameter().kanjia_id||"";
          // var kanjia_id=$(".blockShare").attr("kanjia_id")||"null";
           url=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+uid+"&token="+parameter().token+"&kanjia_id="+share_kanjia_id+"&isShare=1"+"&union_id="+union_id;
           
           var link=base+"/xcbb_web/auth2.html?url="+url.split("#")[0]
           //如果支持分享给朋友圈的时候开始!
           wx.onMenuShareTimeline({
               title:'免费礼物随便拿，只需进来砍个价！', // 分享标题
               link:link,
               imgUrl:shareIcon, // 分享图标
             
               success: function () {    	     
            	 // alert("分享成功")
            	 index.html
            	  
            	   
            	   
            	   
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
                  //alert("分享成功!")
            	 
               }
           });
  	       wx.ready(function(){

  	       })

  	   },
       // 微信分享调用接口配置:
   	  weixinCallback1:function(appId,timestamp,nonceStr,signature){
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
              // var kanjia_id=parameter().kanjia_id||"";
              // var kanjia_id=$(".blockShare").attr("kanjia_id")||"null";
               url=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+uid+"&token="+parameter().token+"&kanjia_id="+share_kanjia_id+"&isShare=1"+"&union_id="+union_id;
               
               var link=base+"/xcbb_web/auth2.html?url="+url.split("#")[0]
               //如果支持分享给朋友圈的时候开始!
               wx.onMenuShareTimeline({
                   title:'免费礼物随便拿，只需进来砍个价！', // 分享标题
                   link:link,
                   imgUrl:shareIcon, // 分享图标
                 
                   success: function () {    	     
                	 // alert("分享成功")
                	 
                	  
                	   
                	   
                	   
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
                      //alert("分享成功!")
                	 
                   }
               });
   	       })

   	   },

    	//点击领取按钮,返回亚卓错误信息弹框
    	tipsclose:function(){
    		$(".tipbox").hide();
    	},
    
    	//显示shareview
    	shareshow:function(item,key,event){
    		
    		var el =event.currentTarget;
    		var that=this;
    		//round_id
    		//gift_id
    		///xcbb_web/activity/bargain/kanjia-qiang-gou?round_id=150&gif    		
    		var round_id=item.round_id;
    		
    		if(typeof item.level=="number"){
    			var gift_id="level:"+item.level;
    		}else if(typeof item.reel_id=="number"){
    			var gift_id="reel:"+item.reel_id;
    		}else{
    			var gift_id=item.id;
    		}
    		//获取设备号
    		if(parameter().isShare==0){
    			//在app 内
    			
    			var deviceNum=that.deviceNum;
    			
    		}else{
    			
    			//在web 设备号等于一个时间戳,s
    			var deviceNum=new Date().getTime()/1000;
    			
    		}
    		 //uid=10000000;// 临时写死
    		 axios({
                 method:'get',
                 url:base+"/xcbb_web/activity/bargain/kanjia-qiang-gou?uid="+uid+"&token="+token+"&round_id="+round_id+"&gift_id="+gift_id+"&union_id="+union_id+"&nick="+nick+"&generation="+generation+"&deviceNum="+deviceNum,
                 responseType:'json'
               }).then(function(response) {
                   
                   var data=response.data
                   if(data.success){
                	  
                      //请求成功
                	   that.cut1_money=data.result.current_price;//当前砍下的多少钱
                	   that.leave_money=data.result.gift_price-that.cut1_money ;// 还剩多少钱
                	   $(".blockShare").attr("round_id",round_id);
                	   $(".blockShare").attr("kanjia_id",data.result.kanjia_id);
                	   share_kanjia_id=data.result.kanjia_id;
                	   if(parameter().isShare==0){
                		   //在App内
                    	   
                    	   $(".blockShare").show();
                    	   //点击砍价之后更新下数据
                    	   that.goodslitsFn3();
                    	   

                	   }else if(parameter().isShare==1){
                		   //$(".blockWebShare2").css("display","block");
                		   
                		   //在这里点击了0元砍下之后,跳转到第三个页面message2进行分享2中间层
                		   var urlshare=base+"/xcbb_web/wh5/Bargain/message2.html?uid="+uid+"&token="+token+"&kanjia_id="+share_kanjia_id+"&isShare="+isShare+"&union_id="+union_id+"&cut1_money="+that.cut1_money+"&leave_money="+that.leave_money;
                		  // var link=base+"/xcbb_web/auth2.html?url="+location.href.split('#')[0];
                		   window.location.href=base+"/xcbb_web/auth2.html?url="+urlshare.split("#")[0];
                		   
                		   return;
                		   
                		   
                		   
                		   
                	   }
                	   $(el).parent().find(".current_people").html(data.result.current_people);
                	   //获取我的商品数量,flag=1 继续抢购,flag=2 未领取
                	   that.myGoodsNum= data.result.products_my.filter(function(item){
                		   return item.flag==1||item.flag==2
                	   }).length;
                	   
                	   //过滤出来继续砍价的商品数量
                	   that.myGoodsNumIing= data.result.products_my.filter(function(item){
                		   return item.flag==1
                	   }).length;
                	   
                	   
                	   // 不刷新数据,自己手动增加
                	   //that.goodslitsFn2();
                	   item.current_people=data.result.current_people;
                   }else{
                	   $(".tipbox").css("display","flex");
                	   if(data.error_code=="12"){
               			item.current_people=item.gift_num;
               		   }
                	   that.tipMessage=data.error_code_desc;
                	   // 不刷新数据,自己手动增加
                	   //that.goodslitsFn2();
                		  
                	   
                 	  //alert(data.error_code_desc);
                   }
                  
               });
    		
    		
    		
    		
    		
    	},
        //分享
        share:function(type){
        	var that=this;
        	var round_id=$(".blockShare").attr("round_id");
      	    var kanjia_id=$(".blockShare").attr("kanjia_id");
      	    var item={"kanjia_id":kanjia_id};
      	    
      	  var winUrl=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+uid+"&token="+parameter().token+"&kanjia_id="+kanjia_id+"&isShare=1";
      	  winUrl=encodeURIComponent(winUrl) 

      	    
      	  // var item={"round_id":45,"kanjia_id":67};
           // console.log(type);
            if(isAndroid){
            	  that.appSucessShare1(type,winUrl,appid);
            	  //anzhuo.Appshare(type,winUrl,appid);
            }else if(isIOS){
            	  that.appSucessShare1(type,winUrl,appid);
            	 // Appshare(type,winUrl,appid);
            }else{
            	alert("请在安卓或ios手机打开")
            }
            
           
        },
        //是否显示sharebutton 
        appisbutton:function(){     
        	
        	 if(isAndroid){
        		 
            	 anzhuo.isShowButton(false);
            }else if(isIOS){
            	isShowButton(false);
            }else{
            	alert("请在安卓或ios手机打开");
            }
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
//       	if(isAndroid){
//       		item={"kanjia_id":item};
//       	}
//       	var kanjia_id=item.kanjia_id;
       	 axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain/kanjia-share?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id,
                responseType:'json'
              }).then(function(response) {
                  
                  var data=response.data
                  if(data.success){
                     //请求成功
               	   that.cut1_money=data.result.current_price;//当前砍下的多少钱
               	   that.leave_money=data.result.gift_price-that.cut1_money-data.result.firstKanjiaPrize;// 还剩多少钱
           	  
                  }else{
                	//  alert(data.error_code_desc);
                  }
                  
                  if(isAndroid){
                	  try{
                		  anzhuo.Appshare(type,winUrl,appid);
                	  }catch(e){
                		  
                	  }
                	 
	              }else if(isIOS){
	            	  try{
	            		  Appshare(type,winUrl,appid);
	            	  }catch(e){
	            		  
	            	  }
	                  
	              }
                 
              });
   		
       	
       },

        appSucessShare:function(winUrl){
        	//辉煌修改逻辑,新增需求,在首页分享成功之后,跳转到我的商品页面
        	var that=this;
        	//alert(this.myGoodsNum);
        	if(this.myGoodsNum>=1){
//    			$("#tipskangbox").css("display","block");
//   			    return;
        		
        		 //直接跳转到第二个页面
        		$(".right").addClass("select");
                $(".left").removeClass("select");
              
                var kanjia_id=$(".blockShare").attr("kanjia_id")||null;      
                //window.location.href="./mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&union_id="+union_id+"&giftId="+giftId+"&isShare="+isShare;
               var cut1_money= that.cut1_money;
         	   var leave_money=that.leave_money;
                	//说明在app内
                	window.location.href="./mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"&cut1_money="+cut1_money+"&leave_money="+leave_money+"&deviceNum="+that.deviceNum;
    		}
        	/*$("#shareText1").html("分享砍掉");
        	$("#shareText2").html("快分享给好友帮你砍价吧!~");
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
                	   that.cut1_money=data.result.current_price;//当前砍下的多少钱
                	   that.leave_money=data.result.gift_price-that.cut1_money ;// 还剩多少钱
            	  
                   }else{
                 	  alert(data.error_code_desc);
                   }
                  
               });*/
    		
        	
        },
        //关闭分享按钮
        closeShare:function(){
        	
            $(".blockShare").hide();
        },
        // 弹幕的接口
        Barrage:function(){
            var that=this;
            if(that.timeBar){
                clearTimeout(that.timeBar)
            }
            var str11=new Date().getTime();
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain/danmaku?str11="+str11,
                responseType:'json'
              }).then(function(response) {
                 
                  var data=response.data
                  if(data.success){
                     //请求成功
                     that.list=that.list.concat(data.result);
                     that.timeBar= window.setTimeout(that.Barrage,10000);
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
        },
        //请求商品列表的接口
        goodslitsFn:function(){
            var that=this;
            //var uid=parameter().uid||"10000000";
            //var token=parameter().token||1;
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain//products/list?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId=0&inApp="+inApp,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                 
                  if(data.success){
                     //请求成功
                     that.goodslists=data.result.products;
                     //3.0新增
                     that.grade_product=data.result.grade_product; //等级砍价
                     //存储第一条数据的leve;
                     that.preLeve=data.result.grade_product[0].level;
                     that.preis_kanjia=data.result.grade_product[0].is_kanjia;
                     that.grade=data.result.grade; //目前主播或者用户的等级,这个值和list列表中的level 对比,如果相等就达到开启条件
                     that.tool_product=data.result.tool_product; //tool_product 道具砍价列表
                     that.identity=data.result.identity; //判断是不是主播,如果此值等于2就是主播,否则就是用户
                     
                     
                     that.myGoodsNum=data.result.products_my.filter(function(item){
                    	 return item.flag==1||item.flag==2
                     }).length;
                     that.next_gift_flush_time=data.result.next_gift_flush_time;
                     if(that.next_gift_flush_time==-1){
                         that.downtimeFlag=false;
                        return;
                     }
                     //请求到数据之后,调用倒计时
                     that.countDown();
                     console.log(that.goodslists)
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
            
        },
        //刷新数据
        goodslitsFn3:function(){
            var that=this;
            //var uid=parameter().uid||"10000000";
            //var token=parameter().token||1;
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain//products/list?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId=0&inApp="+inApp,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                 
                  if(data.success){
                    
                     
                     //3.0新增
                     that.grade_product=data.result.grade_product; //等级砍价
                     //存储第一条数据的leve;
                     that.preLeve=data.result.grade_product[0].level;
                     that.preis_kanjia=data.result.grade_product[0].is_kanjia;
                     that.grade=data.result.grade; //目前主播或者用户的等级,这个值和list列表中的level 对比,如果相等就达到开启条件
                     that.tool_product=data.result.tool_product; //tool_product 道具砍价列表
                     that.identity=data.result.identity; //判断是不是主播,如果此值等于2就是主播,否则就是用户
                     
                     
                   
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
            
        },
      //只请求商品列表,更改刷新数据
        goodslitsFn2:function(){
            var that=this;
           
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain//products/list?uid="+uid+"&token="+token,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                 
                  if(data.success){
                     //请求成功
                     that.goodslists=data.result.products;
                     that.myGoodsNum=data.result.products_my.length;
                    
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
            
        },
        //图片
        imgurl:function(item){
          return imgbase+item.folder_path+"/"+item.goods_icon+".png";
        },
        runMessage:function(){
            var that=this;
            var timer=null;
            that.flag=false;
            runfn();
           function runfn (){
            
                clearTimeout(timer);
                if(that.list.length){
                    that.runMessNum++;
                   
                    
                    if(that.runMessNum>=0){
                        that.runMessMoveY+=0.6;
                        var move=-that.runMessMoveY;
                         $("#runMessage").css("transform","translateY("+move+"rem)");
                         $("#runMessage>li").eq(that.runMessNum).css("transform","translateY(0)");
                    }
                    if(that.runMessNum==that.list.length-1){
                        //假设走都了最后一个第7个
                        //动画执行完了，就把数据归0，重新开始
                       // that.list=[];
                        //that.runMessNum=-1;
                       // that.runMessMoveY=0;
                        that.flag=1;
                       
                      
                       return;
                    }
                    timer= window.setTimeout(runfn,1000)
                }
            }
            



        },
        tohome:function(){
        	return;
        	$(".right").removeClass("select");
            $(".left").addClass("select");
            window.location.href="./index.html?uid="+uid+"&token="+token+"&union_id="+union_id+"&giftId=0"+"&isShare="+isShare;
        }, 
       
        Toback:function(){
            if(isAndroid){
                test.back();
            }else if(isIOS){
               back()
            }
        },
        toMygoods:function(){
        	var that=this;
        	$(".right").addClass("select");
            $(".left").removeClass("select");
          
            var kanjia_id=$(".blockShare").attr("kanjia_id")||null;      
            //window.location.href="./mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&union_id="+union_id+"&giftId="+giftId+"&isShare="+isShare;
            if(isShare==0){
            	//说明在app内
            	window.location.href="./mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"&deviceNum="+that.deviceNum;
            }else if(isShare==1){
            	//说明在web
            	var url=base+"/xcbb_web/wh5/Bargain/mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"&union_id="+union_id+"&giftId="+giftId+"&generation="+generation;
            	 url=url.split("#")[0];
            	 window.location.href=base+"/xcbb_web/auth2.html?url="+url;

            	//window.location.href="./mygoods.html?uid="+uid+"&token="+token+"&kanjia_id="+kanjia_id+"&isShare="+isShare+"&union_id="+union_id+"&giftId="+giftId+"&generation="+generation;
            }
            
        },
        countDown:function(){
            var that=this;
            var oldDate=new Date().getTime();//获取当前时间
            that.timeindex=window.setInterval(function(){
              var nowTime=new Date().getTime();
              var passTime=(nowTime-oldDate)/1000 //经过的秒数
              that.formateTime(that.next_gift_flush_time-passTime);
            },1000)
          },
          formateTime:function(time){
            //time 秒 
            var that=this;
            var day=parseInt(time/(60*60*24));
            var leaveTime=time%(60*60*24);//剩下的秒数
            var hour=parseInt(leaveTime/60/60)
            var leaveTime2=leaveTime%(60*60) //剩下的秒数
            var minute=parseInt(leaveTime2/60) //分钟数
    
            var second=parseInt(leaveTime2%60) //剩下的秒数
            
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
            
            //隐藏天数
            that.downtime= that.formateDouble(hour)+":"+that.formateDouble(minute)+":"+that.formateDouble(second)
           // that.downtime= that.formateDouble(day)+":"+that.formateDouble(hour)+":"+that.formateDouble(minute)+":"+that.formateDouble(second)
           
            if(time==0){
            	that.that.timeindex=null;
            	clearInterval(that.that.timeindex);
            }
          },
          formateDouble:function(time){
              if(time<10){
                return "0"+time
              }
              return time
          }
       
    },
    watch:{
        list:function(newlist){
             //监听到数据发生改变的时候,就执行跑马灯
             var that=this;
            if(newlist.length){
                if(that.flag||that.flag==1){
                    window.setTimeout(function(){
                        that.runMessage();
                    },600)
                }
    
            }

            
        }
    }
})
