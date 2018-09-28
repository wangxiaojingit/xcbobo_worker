 var uid=parameter().uid
 var token=parameter().token;
 var kanjia_id=parameter().kanjia_id;
 var isShare=parameter().isShare;
 //在第三个页面中网址上面除了上面的参数需要带着,下面的暂不需要,都是从这个页面获取的,先初始化为app的,在下面接口给予赋值
 var giftId="";
 var union_id="";
 var nick="";
 var generation=0;//在app 内代数为1
 
	//var appid="wx301d36d30e628ebf";//线上
 
	 var appid="wx6d134e29ee846ec5";//开发
 
 

//var shareIcon=baseimghead+"bargain/bargain_logo.png"
 var shareIcon=base+"/wh5/Bargain/images/shareIcon.jpg" //分享图片

 if(parameter().isShare==1){
	 //在app外
	 var code=parameter().code;	
 }
 
 // ADD TEST
 

 //isShare==1 说明是外部的分享出去的页面
 
var myapp=new Vue({
    el:"#main",
    data:{
    	is_help:0,//是否帮砍过
        messageDate:null,
        imgbath:imgbase,
        kanjiaInfo:null,
        giftInfo:null,
        kanjia_record:[],
        dTime:null,//倒计时剩下的时间
        computedtime:0, //本地的时间
        djs:null,
        union_id:null, //这个是拿到邱瑞的union_id 去请求凯旋的uino_id
        headimgurl:"",
        cutshare:parameter().isShare,//如果这个值是0 说明是在APP内,按钮是app内的按钮
        sharecutstatu:"",
        kanjia_count:null,
        union_id2:null,  //邱瑞的union_id2
        current_price:"",
        gift_price:"",
        downHref:"",
        flagshow:false,
        ishelp:false,//是否帮砍
        products_myNum:0,
        timout:false //标志时间过期
    },
    created:function(){
    	var that=this;
    	if(parameter().kanjia_id=="null"){
    		
    		window.location.href=base+"/xcbb_web/wh5/Bargain/index.html?uid="+parameter().uid+"&token="+parameter().token+"&giftId=0";
    			
    	}
    	if(parameter().isShare==0){
    		that.messagelitsFn();//请求商品信息
        	if(isAndroid){
        		 anzhuo.isShowButton(true);
            }
        	
        	
        }
    	
    	
        
       
    },
    mounted:function(){
        var  that=this;
        that.downapp();
        if(parameter().isShare==1){
            //如果参数isShare==1 说明是分享出去的页面,就去请求config 中所需要的配置信息
            //that.config();//配置微信信息
        	if(localStorage.getItem('union_id')){
        		//如果本地存的有
        		 union_id= localStorage.getItem('union_id'); //这里是获取到微信中的union_id;
        		 that.union_id2=union_id;
        		 that.messagelitsFn();//拿到union_id 之后才去请求商品列表
        	}else{
        		 //本地如果没有存,求去请求
        		 that.getOpenId();
        	}
           
        }
       
        window.setInterval(function(){
            //总共过的时间
           that.defTime=(new Date().getTime()-that.computedtime)/1000;
            
           if(that.dTime-that.defTime<=0){
        	   that.djs="00:00:00" ;
        	   that.timout=true; //标志时间过期的
        	   return;
        	   
           }
           
           that.djs=that.formateTime(that.dTime-that.defTime);
           
           
           
        })
        
        
        
        /*var messageTime=window.setTimeout(function(){
                		  clearTimeout(messageTime);
                		  $("#main").css("display","block");
        },500)*/
    
    },
    filters:{
    	peopleFilter:function(val){
    		return (50000+val*1000)/10000 +"万"
    	}
    },
    methods:{
    	//商品过期
    	timeover:function(){
    		$(".weboverBlock").css("display","block");
    		$(".weboverBlock .status4").css("display","block");
    	},
    	//关闭商品过期提示框
    	webclosestatus4:function(){
    		$(".weboverBlock").css("display","none");
    		$(".weboverBlock .status4").css("display","none");
    	},
    	//是否显示sharebutton 
    	//是否显示sharebutton 
        appisbutton:function(){        
        	 if(isAndroid){        		
            	 anzhuo.isShowButton(true);
            }else if(isIOS){
            	isShowButton(true);
            }else{
            	alert(请在安卓或ios手机打开)
            }
        },
    	 //显示shareview
       	shareshow:function(){       		
           var that=this;        	   
           $(".blockShare").show();
       		
       	},  
       	getUrl:function(index){
       		if(parameter().isShare==1){
       			uid=0;//在web的时候传uid=0
       			var url=base+"/xcbb_web/wh5/Bargain/"+index+".html?uid="+uid+"&token="+token+"&giftId="+giftId+"&nick="+nick+"&generation="+generation+"&isShare="+isShare+"&union_id="+union_id+"&kanjia_id="+kanjia_id;
       		  var link=base+"/xcbb_web/auth2.html?url="+url.split("#")[0];
       		}else{
       			var link=base+"/xcbb_web/wh5/Bargain/"+index+".html?uid="+uid+"&token="+token+"&giftId="+giftId+"&nick="+nick+"&generation="+generation+"&isShare="+isShare+"&union_id="+union_id+"&kanjia_id="+kanjia_id;
       		}
       	  
		 return link;
       	},
       	toMyGoodsPage:function(){
       		
       	 window.location.href=this.getUrl("mygoods")
       	},
    	webclose:function(){
    		//我也要免费拿礼物,跳转到活动首页
    		
    		 window.location.href=this.getUrl("index")
    		 //window.location.href=this.getUrl("index")
    	},
    	closebtn:function(){
    		$(".weboverBlock").css("display","none");
    		$(".status1").css("display","none");
    		$(".status2").css("display","none");
    		$(".status3").css("display","none");
    	},
    	linggift:function(){
    		//已帮砍,我也想0元拿礼物 跳转到活动首页
    		//base+"/xcbb_web/auth2.html?url="+location.href.split('#')[0];
    		 
    		 window.location.href=this.getUrl("index");
    		//window.localtion.href="./index.html?uid="+uid+"&token="+token+"&giftId="+giftId+"&union_id="+union_id+"&nick="+nick+"generation="+generation+"&isShare="+isShare;

    		//    		$(".weboverBlock").css("display","block");
//
//    		$(".status1").css("display","none");
//    		$(".status2").css("display","none");
//    		$(".status3").css("display","none");
//    		$(".status4").css("display","block");


    	},
    	closeblock6:function(){
    		$(".block").css("display","none");
    	},
    	//我来砍一刀,弹出的弹框关闭
    	close:function(str){
    		$("."+str).hide();
    		$(".weboverBlock").hide();
    	},
    	//aaa8
    	//在web 打开分享页面,并且是本人打开的时候
    	webshareshowme:function(){
    		$(".block").show();//提示分享
    	},
    	//web外点击分享按钮,并且不是本人的时候,调用砍一刀
    	webshareshownome:function(){
    		var that=this;
    		///xcbb_web/activity/bargain/kanjia-help?uid=10000000&token=1&kanjia_id=4
    		if(parameter().isShare==0){
    			var is_new=false;
    		}else{
    			var is_new=true;
    		}
    		$("#nomeText").hide();
    		$("#bangkut").css("display","block");
    		//FIX
    		 axios({
                 method:'get',
                 url:base+"/xcbb_web/activity/bargain/kanjia-help?union_id="+that.union_id2+"&is_new="+is_new+"&kanjia_id="+parameter().kanjia_id,
                 responseType:'json'
               }).then(function(response) {
                  
                   var data=response.data
                   if(data.success){
                      //请求成功

                	   that.current_price=data.result.current_price;//当前砍下的多少钱
                	   that.gift_price=data.result.gift_price-that.current_price ;// 还剩多少钱,
                	   that.kanjiaInfo=data.result.gift_info;//更新砍价信息;
                	  
                	   if(Number(that.gift_price)>0){
                		   that.sharecutstatu="1";//说明砍了一刀之后还没砍到0元
                           $(".weboverBlock").show();
                           
						   $(".status1").show();
                	   }else if(Number(that.gift_price)==0){
                		   that.sharecutstatu=2;//说明砍了一刀之后已经砍到0元,可以免费领取
                           $(".weboverBlock").show();
                           $(".status2").show();
                	   }/*else{
                		   that.sharecutstatu=3; //说明出错
                           $(".weboverBlock").show();
                           $(".status3").show();
                	   }*/
                	   //砍价成功的时候
                	   $("#nomeText").hide();
               		   $("#bangkut").css("display","block");
                	   //更新数据了
               		  that.messagelitsFn2();
                   }else{
                	   that.sharecutstatu=3; //说明出错
                 	  // alert(data.error_code_desc);

                 	  $(".weboverBlock").show();
                 	  $("#bargin_false").text(data.error_code_desc);
                      $(".status3").show();
                   }
                  
               });
    	},
    	//下载webapp
    	downapp:function(){
    		var that=this;
    		if(isAndroid){
//                window.setTimeout(function() {                     
//                        window.location.href = "https://www.xcbobo.com/xcbb_web/free/mobile/version/versionCheck?version=0.0.1&build=0";//安卓下载地址  
//                   
//                },2000);  
//                window.location.href = "xcshow://splash";
    			that.downHref="http://a.app.qq.com/o/simple.jsp?pkgname=com.prsoft.xcshow&ckey=CK1366217053025";
                
               // window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.prsoft.xcshow&ckey=CK1366217053025";//安卓下载地址  
    			
    		}else if(isIOS){
//                window.setTimeout(function() {  
//                        window.location.href= "@itms-apps://itunes.apple.com/app/id1191416714";//ios下载地址  
//                },2000);  
//                window.location.href= "wxe74cd88b478b9d3b";  //打开app
    			that.downHref="https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E7%9B%B4%E6%92%AD-%E6%B8%B8%E6%88%8F%E7%A4%BE%E4%BA%A4%E4%BA%92%E5%8A%A8%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0/id1191416714?mt=8";
    			//window.location.href ="https://itunes.apple.com/cn/app/%E5%B0%8F%E8%8D%89%E7%9B%B4%E6%92%AD-%E6%B8%B8%E6%88%8F%E7%A4%BE%E4%BA%A4%E4%BA%92%E5%8A%A8%E8%A7%86%E9%A2%91%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0/id1191416714?mt=8"   			
    		}
    		
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
    	                union_id=data.unionid;//跳转首页需要带的参数
    	                
    	                //把请求到的union_id 存放到本地,也是openId
    	                localStorage.setItem('union_id', union_id);
    	                that.messagelitsFn();//拿到union_id 之后才去请求商品列表
    	                
    	                
    	            }
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
    	       wx.ready(function(){
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
                   var link=base+"/xcbb_web/auth2.html?url="+location.href.split('#')[0];
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

    	 //显示shareview
       	shareshow:function(){
           var that=this;        	   
           $(".blockShare").show();
       		
       	},   
    	 //app分享      
        share:function(type){
            console.log(type);
            var winUrl=base+"/xcbb_web/wh5/Bargain/message.html"+"?uid="+parameter().uid+"&token="+parameter().token+"&kanjia_id="+parameter().kanjia_id+"&isShare=1";
            winUrl=encodeURIComponent(winUrl) 

            if(isAndroid){
            	 anzhuo.Appshare(type,winUrl,appid);
            }else if(isIOS){
            	  Appshare(type,winUrl,appid);
            }else{
            	alert(请在安卓或ios手机打开)
            }
            
           
        },
        //关闭分享按钮
        closeShare:function(){
            $(".blockShare").hide();
        },
        //请求商品列表的接口
        messagelitsFn:function(){
            var that=this;
           /* var uid=parameter().uid||"10000000";
            var token=parameter().token||1;
            var kanjia_id=parameter().kanjia_id||1;*/
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain/kanjia-info?kanjia_id="+kanjia_id+"&uid="+uid+"&union_id="+union_id+"&token="+token,
                responseType:'json'
              }).then(function(response) {
            	 
                  var data=response.data
                  if(data.success){
                     //请求成功
                    that.messageDate=data.result;
                    that.is_help=that.messageDate.is_help;//是否帮砍过
                    that.kanjia_count=that.messageDate.kanjia_count
                    //砍价信息
                    that.kanjiaInfo=that.messageDate.kanjia_info;
                    generation=that.kanjiaInfo.generation;//把代数带过去,重新赋值,需要带都首页
                    giftId=that.kanjiaInfo.gift_id;//giftId//重新赋值,需要带都首页
                    nick=that.kanjiaInfo.nick;//昵称
                    that.products_myNum=that.messageDate.products_my.filter(function(item){
                    	return item.flag==1||item.flag==2
                    }).length;
                    that.union_id=that.kanjiaInfo.union_id;
                    if(that.union_id==that.union_id2){
                    	that.isme=true;//证明是本人
                    }else{
                    	that.isme=false;//证明不是本人
                    }
                    //遍历砍价信息
                    that.messageDate.kanjia_record.forEach(function(item){
                    	
                    	if(item.union_id==that.union_id2){
                    		ishelp=true;
                    		$("#nomeText").css("display","none");
                    		$("#bangkut").css("display","block");
                    	}
                    })
                    //检测是否有头像
                    var photo=baseimghead+that.kanjiaInfo.photo+".png";
                   
                   
                    if(that.isHasImg(photo)){
                    	that.headimgurl= photo
                    }else{
                    	that.headimgurl="./images/avtor.jpg";
                    }
                    
                    //物品信息
                    that.giftInfo=that.messageDate.gift_info;
                    //记录倒计时的时间
                               
                    that.dTime=that.messageDate.kanjia_info.count_down;
                    //记录本地电脑的时间
                    that.computedtime=new Date().getTime();

                    that.kanjia_record=that.messageDate.kanjia_record;
                    
                   
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
            
        },
        //更新数据
        messagelitsFn2:function(){
            var that=this;
            
            axios({
                method:'get',
                url:base+"/xcbb_web/activity/bargain/kanjia-info?kanjia_id="+kanjia_id+"&token="+token+"&uid="+uid+"&union_id="+union_id,
                responseType:'json'
              }).then(function(response) {
                  var data=response.data
                  if(data.success){
                     //请求成功
                    that.messageDate=data.result;
                    that.kanjia_record=that.messageDate.kanjia_record;
                  }else{
                	  alert(data.error_code_desc);
                  }
                 
              });
            
        },
        //检测图片链接是否有效的方法
        isHasImg:function(pathImg){
             var ImgObj=new Image();
             ImgObj.src=pathImg;
             if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
             {
             return true;
             } else {
             return false;
             }
        },
        //图片
        imgurl:function(item){
        	var imgurl=imgbase+item.folder_path+"/"+item.goods_icon+".png";
        	
        	return imgurl; 
          
        },
        appurl:function(photo){
        	var phone=baseimghead+photo+".png";
        		if(!this.isHasImg(phone)){
        			//如果图片链接无效
        			return "./images/avtor.jpg";
        		}else{
        			return phone;
        		}
        	 
        },
        tohome:function(){
        	$(".right").removeClass("select");
            $(".left").addClass("select");            
            window.location.href="./index.html?uid="+uid+"&token="+token;
        }, 
       
        Toback:function(){
            if(isAndroid){
                test.back();
            }else if(isIOS){
               back()
            }
        },
        toMygoods:function(){
        	$(".right").addClass("select");
            $(".left").removeClass("select");

            var uid=parameter().uid||"10000000";
            var token=parameter().token||1;
            window.location.href="./mygoods.html?uid="+uid+"&token="+token;
        },
        
        formateTime:function(time){
        	
        	
        		
        	
        	   //time 秒 
            var that=this;
          //  var day=parseInt(time/(60*60*24));
          //  var leaveTime=time%(60*60*24);//剩下的秒数
            var hour=parseInt(time/60/60);//剩下的小时数
            var minute=parseInt((time-hour*3600)/60); //剩下的分钟数
            var second=parseInt(time-hour*3600-minute*60); //剩下的秒数
            var mSecond=Number(((time-hour*3600-minute*60-second)*1000+"").slice(0,1));//剩下的毫秒
            
//            var leaveTime2=leaveTime%(60*60) //剩下的秒数
//            var minute=parseInt(leaveTime2/60) //分钟数
//    
//            var second=parseInt(leaveTime2%60) //剩下的秒数
//            
           
            if(hour<=0){
            	hour=0
            }
            if(minute<=0){
            	minute=0
            }
            if(second<=0){
            	second=0;
            }
            if(mSecond<=0){
            	mSecond=0;
            }
            
            
            var a= that.formateDouble(hour)+":"+that.formateDouble(minute)+":"+that.formateDouble(second)+"."+mSecond;
            
            return a
            
          },
          formateDouble:function(time){
                if(time<10){
                  return "0"+time
                }
                return time
          },
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
