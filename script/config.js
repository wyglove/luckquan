//基础js
URL1 = 'http://quan2.meiquan8.com/';
URL2 = 'http://cms.luckq.com/';
YUN_KEY = 'bWFzYlHfSPvPYrw4zpwkD2ZmzmiKUlB8'; //协议密钥
URL = 'http://app.luckquan.com/';
APP_TAG = 'luckquan'; //防止同一个手机安装2个应用缓存名相同
APP_KEY = 'wJjCfGwiwFjDhMEMcYwzAPHjmzCkrP5r'; //协议密钥
APP_FRAME = 'meiquan'; //meiquan表示返利站框架   meiquanApp表示美券站框架
TPL_URL = 'http://quan2.meiquan8.com/app/';
/*主题用*/
TPL_VERSION = 0;
TPL_NAME = 'fanliMeiquan';
TPL_VERSION_NUM = 37;
/*主题用*/
BAR_COLOR = '1'; //首页状态栏颜色，0表示白色，1表示黑色。安卓的沉浸式状态栏颜色只能设置一次，之后不能修改，所以如果首页设置了白色，那么内页就要添加一个状态栏的背景色
ROOT_HEADER_COLOR = ['#fd9126','#ff5201'];
DEVELOP_HTML = 'html';
HUNXIAO = 0;
TENCENT_ADS = 0;

URL2URL = 0;

/*热更新号*/
HOT_VERSION_IOS=7;
HOT_VERSION_ANDROID=6;

/*自定义配置*/
var hideGetQudao=1;

var webMalls={'taobao':'淘宝','jd':'京东','pdd':'拼多多'};

//苹果用wk引擎，比默认的相应会慢0.1秒，但是支持懒加载，所以只在这些页面中使用
var useWKWebViewFrame=[];//['index_index_frm','taobao_list_frm','jd_list_frm','pdd_list_frm','taobao_view_frm','jd_view_frm','pdd_view_frm','vip_view_frm','kaola_view_frm','page_fixed_frm','taobao_time_frm','zhibo_zhibo_frm','taobao_taolijin2_frm','taobao_haohuo_frm'];
var appInfo = {},siteInfo={},user={'id':0,'type':0}; //app基本信息数据，全局可用
var pageGroup=[];//登记所有页面
var yinxingZifu='%E3%80%80';
