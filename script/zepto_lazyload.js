/**
 * Zepto picLazyLoad Plugin
 * 西门 http://ons.me/484.html
 * 20140517 v1.0
 */

function getScrollTop(){
    var scrollTop=0;
    if(document.documentElement&&document.documentElement.scrollTop)
    {
        scrollTop=document.documentElement.scrollTop;
    }
    else if(document.body)
    {
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}

;(function($){
    $.fn.picLazyLoad = function(settings){
        // console.log(1);
        var $this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();
        if(_winScrollTop==0){
            _winScrollTop=getScrollTop();
        }
        if(_winHeight==0){ //安卓下高度可能获取不到
            _winHeight=api.winHeight;
        }

        settings = $.extend({
            threshold: 0, // 提前高度加载
            placeholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
        }, settings||{});

        // 执行懒加载图片
        lazyLoadPic();

        // 滚动触发换图
        $(window).on('scroll', function() {
            _winScrollTop = $(window).scrollTop();
            lazyLoadPic();
        });
        $(window).on('touchmove', function() {
            _winScrollTop = $(window).scrollTop();
            lazyLoadPic();
        });

        function imgOnload($dom,url,type){
            if(type==0){
                $dom.attr('src',url);
            }else{
                $dom.css('background-image','url('+url+')');
            }
            $dom.removeAttr('data-img');
            // var img=new Image();
            // img.src=url;
            // console.log($dom.attr('id')+'---------');
            // if (img.complete) {
            //     console.log($dom.attr('id')+'==========');
            //     if(type==0){
            //         $dom.attr('src',url);
            //     }else{
            //         $dom.css('background-image','url('+url+')');
            //     }
            //     $dom.removeAttr('data-img');
            //     $dom.removeClass('lazyimg');
            // }
        }

        // 懒加载图片
        function lazyLoadPic(){
            $this.each(function(){
                var $self = $(this);
                // 如果是img
                if($self.is('img')){
                    if($self.attr('data-img')){
                        var _offsetTop = $self.offset().top;
                        //console.log($self.attr('id')+':'+parseInt(_offsetTop)+'--'+_winHeight+'--'+_winScrollTop);
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            //console.log($self.attr('id')+'--'+$self.attr('data-img'));
                            imgOnload($self,$self.attr('data-img'),0);
                        }
                    }
                // 如果是背景图
                }else{
                    if($self.attr('data-img')){
                        // 默认占位图片
                        if($self.css('background-image') == 'none'){
                            $self.css('background-image','url('+settings.placeholder+')');
                        }
                        var _offsetTop = $self.offset().top;
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            imgOnload($self,$self.attr('data-img'),1);
                        }
                    }
                }
            });
        }
    }
})(Zepto);
