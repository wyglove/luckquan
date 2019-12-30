function goodsTbTpl() {
    /*<% for(var i = 0; i < this.length; i++) {var data = this[i]; %>
            <div class="item-thumbnail" style="position: relative; float:left; width:45%;margin-left:3.5%; background:#fff; padding-bottom:0.5em; border-bottom:0.0625em #F4F4F4  solid; margin-bottom:0.9em; border-radius:10px; overflow:hidden;" tapmode onClick="ddevent.taobaoView('<%data.num_iid%>')">
            <div style="display: -webkit-box;">
            <div style="height:100%; width:100%;position: relative;">
            <%if(data.is_video==1){%>
            <div style="border-radius: 50%;position: absolute;width: 4em;height: 4em;background: rgba(0,0,0,.4);top:50%;left:50%;margin:-2em auto auto -2em;border: 2px solid hsla(0,0%,100%,.5);z-index:9;">
            <img src="../../img/fq_play.png" style="position: relative;width: 1.5em;height: 1.5em;border: none;left: 1.35em;top: 1.25em;">
            </div>
            <%}%>
            <div class="imgsize" >
            <img class="lazyimg img" id="<%data.id%>"  data-img="<%data.img%>_300x300.jpg">
            </div>
            </div>
            </div>
            <div style="position:relative;margin-left:0.5em;margin-bottom:0.5em; width:95%;">
            <div><span style="color:#333;overflow: hidden;text-overflow:  ellipsis;height:36px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2; font-size:13px;padding-top:5px; font-weight:500;margin-bottom:20px;">
            <%if(data.laiyuan_type==1){%>
            <span class="iconfont" style="color:#F60;"></span> 
            <%}else if(data.laiyuan_type==2){%>
            <span class="iconfont" style="color: red;"></span> 
            <%}%>
            <%data.title%></span></div>
            <div style="">

            <div style="font-size:0.875em; margin-top:0.6em;color:#666;">热销:<b><%data.sell%></b>件</div>
            <div style="margin-bottom: -0.3em;margin-top: 0.3em;"><span style="color:#FF464E; font-size:0.75em">￥</span><b style="font-size:1.53em;color:#FF464E;"><%toFixed(data.quan_price,1)%></b>
            <%if(0<data.price){%>
            <del style="color:#999;font-size:0.75em">￥<%toFixed(data.price,1)%></del>
            <%}%>
            </div>
            </div>
            <div style="position:absolute; right:0.4em; bottom:0.3em; text-align:right">
            <% if(0<data.price_jian){%>
            <div style="width:auto;display:inline-block;">
            <div style="background: #ff464e;border: 1px solid #ff464e;border-radius: 3px;display: flex;line-height: 1.5; margin-top:0.5em;font-size:0.875em;">
<div style="padding: 0 5px;text-align: center;color:#ffffff">券</div><div style="background: #ffffff;color:#ff464e;padding: 0 5px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;"><%data.price_jian%>元</div>
</div></div>
            <%}%>
            <div><span style="background:#feebca; padding:0 0.5em; color:#9b6a32; font-size:0.875em;border-radius: 0.3em;height: 1.5em;display: inline-block;line-height: 1.5em; margin-top:0.65em;">
            <%if(iosAudit==1){%>立即购<%}else{%>奖励<%}%>
            <%if(iosAudit==0 && appInfo.show_jfb_level<=user.level){%>
            <%toFixed(data.fanli_bl*siteInfo.fxbl[user.type]*data.quan_price/100,2)%>
            <%}%>
            </span></div>
            </div>
            </div>
            </div>
            <% } %>
            */
    ;
}

function transGoodsHtml(param) {
    var arr_data = [], data = param.data, laiyuan = param.laiyuan;
    laiyuan = laiyuan=='taobao'?'tb':laiyuan;
    var isOffCoupon = param.isOffCoupon || false;
    var img_suf = {
        'tb': '_300x300.jpg',
        'pdd': '@300w_1l_80Q.jpg',
        'jd': '?imageView2/2/w/300/h/300',
        'vip': '_300x300_80.jpg',
        'kaola': '?imageView&thumbnail=300x0&quality=80'
    }
    var title_icon = {
        'tb': ['','#ff4200'],
        'tmall': ['','#fe0137'],
        'pdd': ['','#e02e24'],
        'jd': ['','#e31d1a'],
        'vip': ['','#e5007f'],
        'kaola': ['','#ff080f']
    }
    for (var i = 0, len = data.length; i < len; i++) {
        var arr_icon = laiyuan=='tb'&&data[i].laiyuan_type==2?title_icon['tmall']:title_icon[laiyuan];

        var img_url = data[i].img || data[i].goods_thumbnail_url || data[i].pic_url;
        if (laiyuan == 'vip') {
            img_url = img_url.replace('.jpg','');
        }
        img_url += img_suf[laiyuan];

        var goods_price;
        if (0<data[i].quan_price) {
            goods_price = data[i].quan_price;
        } else if (0<data[i].daoshou) {
            goods_price = data[i].daoshou;
        } else {
            goods_price = data[i].price;
        }
        goods_price = parseFloat(toFixed(goods_price));

        var goods_coupon;
        if (isOffCoupon) {
            goods_coupon = 0;
        } else {
            goods_coupon = data[i].price_jian || data[i].coupon,
            goods_coupon = parseFloat(toFixed(goods_coupon));
        }

        var tsell = 0;
        if (param.hotCode==1) {
            tsell = data[i].paoliang;
        } else if (param.hotCode==2 || param.hotCode==3) {
            tsell = data[i].tsell;
        }

        var yj_msg = '';
        if(iosShenhe()==0 && typeof user.id!=='undefined') {
            var commission;
            if (laiyuan == 'tb') {
                commission = data[i].fanli_bl * data[i].quan_price / 100;
            } else if (laiyuan == 'jd') {
                var jdrate = data[i].rate || data[i].commission || data[i].fanli_bl;
                commission = jdrate * data[i].quan_price;
            } else {
                commission = data[i].commission;
            }
            var fanli = toFixed(user['flrate'][laiyuan] * commission);
            if (fanli>0) {
                yj_msg = user.fltip +'  ¥ '+ fanli;
            }
        }

		var tlj = 0;
		if (0<data[i].tlj) {
            tlj=data[i].tlj;
        }

        var obj = {
            id: data[i].num_iid || data[i].goods_id || data[i].data_id,
            laiyuan: laiyuan,
            img: img_url,
            video: data[i].video,
            title: data[i].title || data[i].goods_name,
            icon_code: arr_icon[0],
            icon_color: arr_icon[1],
            nick: data[i].nick || data[i].mall_name || data[i].brand_name,
            quan_price: goods_price,
            sell: data[i].sell,
            price_jian: goods_coupon,
            yj_msg: yj_msg,
            fuwu: laiyuan=='kaola'?data[i].fuwu:'',
            isWait: param.isWait || false,
            hotCode: param.hotCode,
            tsell: tsell,
			tlj: tlj
        };
        arr_data.push(obj);
    }
    return barretTpl(transGoodsTpl, arr_data);
}
function transGoodsTpl() {
    /*<% for(var i = 0; i < this.length; i++) {var data = this[i];%>
        <div class="goods flex-wrap" tapmode onclick="setPageParam('tlj', <%data.tlj%>);toGoodsView('<%data.id%>','<%data.laiyuan%>')">
            <div class="goods-img">
                <img class="lazyimg" src="../../img/loading_300_300.gif" data-img="<%data.img%>">
                <%if(data.video!='' && data.video!=null){%>
                    <div class="video-btn flex-wrap flex-align flex-justify"><img src="../../img/fq_play.png"></div>
                <%}%>
                <%if(data.isWait){%>
                    <div class="startzhezhao">即将开始</div>
                <%}%>
                <%if(data.hotCode==1){%>
                    <p class="twohours">近2小时成交<em><%data.tsell%></em>件</p>
                <%}else if(data.hotCode==2){%>
                    <p class="twohours">今日已成交<em><%data.tsell%></em>件</p>
                <%}else if(data.hotCode==3){%>
                    <p class="twohours">昨日已成交<em><%data.tsell%></em>件</p>
                <%}%>
            </div>
            <div class="goods-info flex-con">
                <div class="goods-title text-wrap-2">
                    <i class="iconfont" style="color:<%data.icon_color%>"><%data.icon_code%></i> <%data.title%>
                </div>
                <div class="goods-shop"><%data.nick%></div>
                <div class="goods-price">
                    <%if(0<data.price_jian){%>券后<%} else {%>促销<%}%>
                    <span class="goods-price-mark">¥<strong><%parseFloat(data.quan_price)%></strong></span>
                    <%if(0<data.sell){%>热销<%data.sell%>件<%}%>
                </div>
                <div class="goods-youhui flex-wrap flex-align">
                    <%if(0<data.price_jian){%>
                        <div class="goods-quan">
                            <span class="quan-left">券</span>
                            <span class="quan-right">¥<%parseFloat(data.price_jian)%></span>
                        </div>
                    <%}%>
                    <%if(data.yj_msg!='' && data.yj_msg!=null){%>
                        <div class="goods-yongjin"><%data.yj_msg%></div>
                    <%}%>
                    <%if(data.fuwu!='' && data.fuwu!=null){%>
                        <div class="goods-fuwu text-wrap-1"><%data.fuwu%></div>
                    <%}%>
                </div>
            </div>
        </div>
    <% } %>*/;
}

/*动态的点击事件，都加在这个方法里，解决参数里有引号带来的问题*/
var ddevent = {
    'data': [],
    'add': function(a) {
        return this.data.push(a) - 1;
    },
    'fun': function(index) {
        if (isNaN(index)) {
            var str = index;
        } else {
            var str = this.data[index];
        }
        if (typeof str!='string' || str == '') {
            return false;
        }
        if (str.indexOf('!') == 0) {
            str = str.replace('!', '');
            var user = checkLogin();
            if (user === false) {
                ddevent.page('user', 'login');
                return false;
            }
        }
        s = str.split('=');
        var fun = s[0];
        if (typeof s[1] != 'undefined') {
            var parm = s[1];
            parm = parm.split('&');
            if (fun == 'url') {
                parm[0] = str.replace('url=', '');
            }
            if (fun == 'fun') {
                parm[0] = str.replace('fun=', '');
            }
        }
        switch (fun) {
            case 'url':
                this.url(parm[0]);
                break;
            case 'taourl':
                this.taourl(parm[0],parm[1]);
                break;
            case 'jdurl':
                this.jdurl(parm[0],parm[1]);
                break;
            case 'url_x5':
                this.url_x5(parm[0]);
                break;
            case 'page':
                if(typeof parm[2]=='undefined'){
                    parm[2]='';
                }
                this.page(parm[0],parm[1],parm[2]);
                break;
            case 'iid':
                this.taobaoView(parm[0]);
                break;
            case 'taobaoView':
                this.taobaoView(parm[0]);
                break;
            case 'taobaoShare':
                this.taobaoShare(parm[0]);
                break;
            case 'jdView':
                this.jdView(parm[0]);
                break;
            case 'pddView':
                this.pddView(parm[0]);
                break;
            case 'vipView':
                this.vipView(parm[0]);
                break;
            case 'kaolaView':
                this.kaolaView(parm[0]);
                break;
            case 'video':
                this.video();
                break;
            case 'zhibo':
                this.zhibo();
                break;
            case 'list':
                if(typeof parm[3]!='undefined' && parm[3]!=''){
                    setGlobalData('title',parm[3]);
                }
                this.goodsList(parm[0],parm[1],parm[2]);
                break;
            case 'zt':
                this.zhuanti(parm[0]);
                break;
            case 'fun':
                this['function'](parm[0]);
                break;
            case 'copy':
                this.copy(parm[0],parm[1],parm[2]);
                break;
            case 'tixian':
                this.tixian();
                break;
            case 'win':
                this.win(parm[0],parm[1]);
                break;
            case 'shipin':
                this.shipin(parm[0],parm[1]);
                break;
			      case 'activitylink':
                var user=checkLogin();
                if(user==false){
                    user={'id':0};
                }
                activitylink(parm[0],user.id);
                break;
            case 'taoquan':
                    this.taoquan();
                    break;
            case 'huodong':
                    this.huodong(parm[0]);
                    break;
        }
    },
    'huodong': function(scene_id) {
        var user = checkLogin(1);
        if (user == false) {
            return false;
        }
        var url = createUrl('goods', {
            'fun': 'huodong_kouling',
            'scene_id': scene_id
        });
        getJson(url, '', function(data) {
            if (data.s == 0) {
                openAlert(data.r);
                return false;
            }
            url = data.r.url;
            baichuan.open(url);
        }, 0);
    },
    'taoquan': function() {
        var user = checkLogin(1);
        if (user == false) {
            return false;
        }
        var url = createUrl('user', {
            'fun': 'taoquan'
        });
        var _this = this;
        getJson(url, '', function(ret) {
              if (ret.s == 1) {
                    setPageParam('isTitleLock', true);
                    _this.url(ret.r, '会员生活圈');
                    //_this.url_x5(ret.r, '会员生活圈');
                } else {
                    openAlert(ret.r);
                }
            });
    },
    'win':function(m,a){
        openWin({
            'mod': m,
            'act': a
        });
    },
    'tixian':function(){
        openPage('user','tixian','',0);
    },
    'copy':function(str,tip,type){
		clipboardSet(str);
		if(type=='weixin'){
			tip=tip||'打开微信然后添加微信(已自动复制)';
			openAlert(tip,function(){
				openApp('weixin://');
			});
		}else{
			tip=tip||'复制成功';
			toast(tip);
		}
	},
    'openPage':function(mod, act,title){
        this.page(mod, act,title);
    },
    'page': function(mod, act,title) {
        if(act=='index'){
            act=mod;
        }
        if(mod=='huodong' && act=='zt'){
            act='zhuanti';
        }else if(mod=='mall' && act=='jd'){
            mod='jd';
            act='list_header';
        }else if(mod=='goods' && act=='list'){
            mod='goods';
            act='list_header';
        }else if(mod=='mall' && act=='pdd'){
            mod='pdd';
            act='list_header';
        }else if(mod=='goods' && act=='quan'){
            mod='taobao';
            act='haohuo';
        }else if(mod=='goods' && act=='fenlei'){
            mod='taobao';
            act='fenlei';
        }else if(mod=='goods' && act=='videolist'){
            this.video();
            return true;
        }
        if (typeof appInfo != 'undefined' && typeof appInfo.rewrite != 'undefined') {
            for (var i in appInfo.rewrite) {
                if (appInfo.rewrite[i].mod == mod + '&' + act && appInfo.rewrite[i].status == 1) {
                    this.url(appInfo.rewrite[i].url);
                    return true;
                }
            }
        }
        openPage([mod, act,title]);
    },
    'function': function(str) {
        var fn = new Function(str);
        fn();
    },
    'url': function(url, title) { /*打开webview*/
        setPageParam('url', url);
        if (typeof title != 'undefined') {
            api.setGlobalData({
                key: 'title',
                value: title
            });
        }
        openWin({
            'mod': 'page',
            'act': 'url'
        });
    },
    'url_x5': function(url, title) { /*打开webview*/
        setPageParam('url', url);
        if (typeof title != 'undefined') {
            api.setGlobalData({
                key: 'title',
                value: title
            });
        }
        openWin({
            'mod': 'page',
            'act': 'url_x5'
        });
    },
    'taourl': function(url,title) { /*打开webview*/
        setPageParam('url', url);
        if(typeof title!='undefined'){
            api.setGlobalData('title',title);
        }
        openWin({
            'mod': 'page',
            'act': 'tao_url'
        });
    },
    'jdurl': function(url,title) { /*打开webview*/
        setPageParam('url', url);
        if(typeof title!='undefined'){
            api.setGlobalData('title',title);
        }
        openWin({
            'mod': 'page',
            'act': 'jd_url'
        });
    },
    taobaoView: function(iid) { /*打开详情页*/
        api.pageParam.barColor='light';
        setPageParam('iid', iid);
        openPage('taobao', 'view', String(iid), 0);
    },
    taobaoShare:function(iid){
        if(checkLogin(1)==false){
            return false;
        }
        setPageParam('id', iid);
        openPage('taobao', 'share');
    },
    jdView: function(id) {
        if(checkLogin(1)==false){
            return false;
        }
        setPageParam('id', id);
        openPage('jd', 'view', String(id), 0);
    },
    jdShare:function(id){
        if(checkLogin(1)==false){
            return false;
        }
        setPageParam('id', id);
        openPage('jd', 'share');
    },
    pddView: function(id) {
        if(checkLogin(1)==false){
            return false;
        }
        setPageParam('id', id);
        openPage('pdd', 'view', String(id), 0);
    },
    pddShare:function(id){
        if(checkLogin(1)==false){
            return false;
        }
        setPageParam('id', id);
        openPage('pdd', 'share');
    },
    vipView: function(id) { /*打开详情页*/
        api.pageParam.barColor='light';
        setPageParam('id', id);
        openPage('vip', 'view', String(id), 0);
    },
    kaolaView: function(id) { /*打开详情页*/
        api.pageParam.barColor='light';
        setPageParam('id', id);
        openPage('kaola', 'view', String(id), 0);
    },
    jdList:function(){
        openPage('jd','list_header');
    },
    goodsList: function(code, cid, is, sort, q, type, is_rank) { /*打开列表页*/
        code = code || '';
        cid = cid || 0;
        is = is || '';
        sort = sort || 0;
        q = q || '';
        type = type || '';
        is_rank = is_rank || 0;
        setPageParam('code', code);
        setPageParam('cid', cid);
        setPageParam('sort', sort);
        setPageParam('q', q);
        setPageParam('type', type);
        setPageParam('is_rank', is_rank);
        if (is != '') {
            setPageParam('is', is);
        } else {
            setPageParam('is', '');
        }
        openPage('taobao','list_header');
    },
    'zhibo': function() {
        openPage('zhibo', 'zhibo');
    },
    'video':function(){
        api.setGlobalData({
            key: 'title',
            value:'边看边买'
        });
        setPageParam('code','video');
        openPage('taobao','list_header');
    },
    'shipin':function(url,title){
        title=title||'';
        shipin(url,title);
    },
    'searchPop':function(from){
        from=from||'';
        setPageParam('from',from);
        api.execScript({
            script: "window.pop='search_pop_frm'"
        });
        var obj={'mod':'search','act':'pop_frm','rect':{'x':0,'y':0,'w':'auto','h':'auto'},'reload':true,'useWKWebView':false};
        openFrame(obj);
    },
    'zhuanti':function(id){
        setPageParam('id',id);
        openPage('taobao','zhuanti');
    },
    'search':function(type,q,from){
        from=from||'';
        q=q||'';
        if(q==''){
            return '请输入关键词';
        }
        if(type=='taobao'){
            if(q.indexOf('http')==0){
                return '淘宝不能搜索商品网址';
            }
        }else{
            if(type=='jd'){
                if(q.indexOf('item.m.jd.com/ware')>0){
                    var a=q.match(/wareId=(\d+)/);
                }else if(q.indexOf('wq.jd.com/item/view')>0 || q.indexOf('wqs.jd.com/pingou/item.shtml')>0){
                    var a=q.match(/sku=(\d+)/);
                }else{
                    var a=q.match(/(\d+).html/);
                }
                if(a!=null){
                    var id=a[1];
                    this.jdView(id);
                    return false;
                }
            }else if(type=='pdd'){
                var a=q.match(/goods_id=(\d+)/);
                if(a!=null){
                    var id=a[1];
                    this.pddView(id);
                    return false;
                }
            }else if(type=='kaola'){
                var a=q.match(/product\/(\d+)\.html/);
                if(a!=null){
                    var id=a[1];
                    this.kaolaView(id);
                    return false;
                }
            }else if(type=='vip'){
                var a=q.match(/(product|detail)-\d+-(\d+)\.html/);
                if(a!=null){
                    var id=a[2];
                    this.vipView(id);
                    return false;
                }
            }
        }
        setPageParam('q',q);
        if(from==''){
            openPage(type,'list_header');
        }else{
            api.execScript({
                name: from.replace('/','_'),
                script: 'reStart("'+q+'")'
            });
        }
    }
};

var qwdJd={
	'pagesize':20,
	'searchApi':function(q,page,coupon,sortName,callback){
		if(sortName=='price'){
			var sort='asc';
		}else if(sortName=='commissionShare'){
			var sort='desc';
		}else if(sortName=='inOrderCount30Days'){
			var sort='desc';
		}else{
			var sort='';
		}
		var url='http://quan2.meiquan8.com/api/tool/tqq.php?tqq_key=78859337&method=jd_quanpin_search&q='+urlencode(q)+'&page='+page+'&page_size='+this.pagesize+'&coupon='+coupon+'&sort_name='+sortName+'&sort='+sort;
		getAjax(url,function(data){
			callback(data.data);
		},'数据获取中',3600);
	},
	'viewApi':function(id,callback){
		var url='http://quan2.meiquan8.com/api/tool/tqq.php?tqq_key=78859337&method=jd_danpin_view&data_id='+id;
		getAjax(url,function(data){
			callback(data.data);
		},'数据获取中',3600);
	},
	'translate':function(row){
		row.commissionPrice=toFixed(row.commission*0.9);
		row.comRate=row.fanli_bl=toFixed(row.rate*0.01*0.9,3);
		if(typeof row.price_jian!='undefined' && row.price_jian>0){
			row.coupon=row.price_jian;
			row.coupon_price=toFixed(row.price-row.price_jian);
			row.commissionPrice=toFixed(row.coupon_price*row.comRate);
			row.lq_url=row.coupon_link;
		}else{
			row.coupon=0;
			row.coupon_price=row.price;
			row.lq_url='';
		}
		row.saleCount=row.sell;
		row.imgUrl=row.img;
		row.quan_price=row.coupon_price;
		row.commissionprice=row.commissionPrice;
		return row;
	},
	'searchBack':function(data,callback){
		for(var i in data){
			data[i]=this.translate(data[i]);
		}
		if(data.length==0){
			callback({'s':0,'r':[]});
		}else{
			callback({'s':1,'r':data});
		}
	},
	'search':function(page,q,sortby,callback){
		var _this=this;
		q=q||'';
		sortby=sortby||'';
		_this.searchApi(q,page,0,sortby,function(data){
	     _this.searchBack(data,callback);
		});
	},
	'jingtui':function(id,callback){
        var signature = api.require('signature');
        var md5Key = signature.md5Sync({
            'data': YUN_KEY,
            'uppercase': false
        });
		var url='http://cms.luckq.com/m/index.php?mod=jd_goods&act=view&data_id='+id+'&plat_form=1&key='+md5Key.toLowerCase()+'&url='+urlencode(URL2);
		getAjax(url,function(data){
			if(data.s==0){
				data['s']=0;
			}
			callback(data);
		},'数据获取中',3600);
	},
	'view':function(id,callback,duotu){
		duotu=duotu||0;
		var _this=this;
		_this.viewApi(id,function(data){
			if(data!=null){
				data=_this.translate(data);
				_this.jingtui(id,function(data1){
					if(data1.s==1){
						if(data1.r.price_jian>data.coupon){
							data.coupon=data.price_jian=data1.r.price_jian;
							data.lq_url=data1.r.lq_url;
							data.coupon_price=data.quan_price=toFixed(data1.r.discount_price-data.coupon);
							data.commissionPrice=data.commissionprice=toFixed(data.coupon_price*data.fanli_bl);
						}
						data.content=data1.r.content;
						data.title=data1.r.title;
					}else{
						data.content='';
					}
					data.commissionprice=data.commissionPrice;
					var text=data.title+"\r\n售价："+data.price;
					if(data.price_jian>0){
						text+="\r\n券后价："+data.quan_price;
					}
					if(data.content!=''){
						text+="\r\n推荐理由："+data.content;
					}
					data.text=text;
                    data.fxje=toFixed(appInfo.jd_fxbl[user.type]*data.commissionPrice);
					callback({'s':1,'r':data});
				});
			}else{
				callback({'s':0});
			}
		});
	}
};
function activitylink(id,uid){

    var url = createUrl('goods',{'fun':'tmallActivity','scene_id':id,'title':'','img':''});
	getJson(url,'',function(ret) {
		if (ret.s == 1) {
			baichuan.open(ret.r.url);
		}
    },'数据获取中',3600);
}

/*pageGroup*/var pageGroup=[];/*pageGroup*/
