if ($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0") && !$.support.style) {
    alert("系统检测到您使用的是IE内核的浏览器!!\n\nIE内核的浏览器访问可能会出现各种不可预料的错误!!\n\n为了您更好的使用本程序\n\n推荐使用 Chrome,FireFox 等浏览器\n\n如使用 搜狗 或者 360 等双核浏览器的请切换成 极速模式!");
}
$(function() {
    var _iCMS = {
        select: function(el, v) {
            var va = v.split(',');
            $.each(va, function(i,val){
              $("#" + el+" option[value='"+val+"']").attr("selected", true);
            });
            $("#"+el).trigger("chosen:updated");
        },
        checked: function(el){
            $(el).prop("checked",true).closest('.checker > span').addClass('checked');
        },
    };
    iCMS = $.extend(iCMS,_iCMS);//扩展 or 替换 iCMS属性
    var doc = $(document);
    //iCMS.modal();

    $(':checkbox[data-type!=switch],:radio[data-type!=switch]').uniform();
    $(".chosen-select").chosen({disable_search_threshold: 30});
    $('.ui-datepicker').datepicker({format: 'yyyy-mm-dd'});

    $('[data-toggle="popover"]').popover({html:true});
    $('.tip').tooltip({html:true});
    $('.tip-left').tooltip({placement:'left',html:true});
    $('.tip-right').tooltip({placement:'right',html:true});
    $('.tip-top').tooltip({placement:'top',html:true});
    $('.tip-bottom').tooltip({placement:'bottom',html:true});

    doc.on("click",'.checkAll',function() {
        var target = $(this).attr('data-target'), checkedStatus = $(this).prop("checked");
        //$('input:checkbox',$(target)).prop("checked",checkedStatus);
        $(".checkAll").prop("checked", checkedStatus);
        $('input:checkbox', $(target)).each(function() {
            this.checked = checkedStatus;
            if (checkedStatus == this.checked) {
                $(this).closest('.checker > span').removeClass('checked');
            }
            if (this.checked) {
                $(this).closest('.checker > span').addClass('checked');
            }
        });
    });
    doc.on("click",'[data-toggle="insert"]',function() {
        var a = $(this), data = a.data('insert'),
        href = a.attr('href'),
        value = a.attr('data-value'),
        target = a.attr('data-target'),
        val = a.text();
        if(value){
            $(target).val(value);
        }else{
            $(target).val(val);
        }
        a.parent().parent().parent().removeClass("open");
        //console.log();
        return false;
    });
    doc.on("click",'[data-toggle="createpass"]',function() {
        var a = $(this),target = a.attr('data-target');
        $(target).val(iCMS.random(8));
        return false;
    });
    doc.on("click",'[data-toggle="insertContent"]',function(event) {
        event.preventDefault();
        var a = $(this),
        href   = a.attr('href'),
        target = a.attr('data-target'),
        mode   = a.attr('data-mode'),
        val    = a.text();
        if(href=='<%var%>'){
            href='<%var_'+iCMS.random(2)+'%>';
        }
        if(mode=="replace"){
            $(target).val(href);
        }else{
            $(target).insertContent(href);
        }
        return false;
    });

    $('[data-toggle="modal"]').click(function(event){
        event.preventDefault();
        window.top.iCMS_MODAL = $(this).modal({width: "85%",height: "640px",overflow:true});
        $(this).parent().parent().parent().removeClass("open");
        return false;
    });

    $.scrollUp({
        scrollName: 'scrollUp', // Element ID
        topDistance: '40', // Distance from top before showing element (px)
        topSpeed: 300, // Speed back to top (ms)
        animation: 'fade', // Fade, slide, none
        animationInSpeed: 200, // Animation in speed (ms)
        animationOutSpeed: 200, // Animation out speed (ms)
        scrollText: '', // Text for element
        activeOverlay: false // Set CSS color to display scrollUp active point, e.g '#00FFFF'
    });
    $('.submenu > a').click(function(event) {
        event.preventDefault();
        var submenu = $(this).siblings('ul');
        var li = $(this).parents('li');
        var submenus = $('#sidebar li.submenu ul');
        var submenus_parents = $('#sidebar li.submenu');
        if (li.hasClass('open')) {
            if (($(window).width() > 768) || ($(window).width() < 479)) {
                submenu.slideUp();
            } else {
                submenu.fadeOut(250);
            }
            li.removeClass('open');
        } else {
            if (($(window).width() > 768) || ($(window).width() < 479)) {
                submenus.slideUp();
                submenu.slideDown();
            } else {
                submenus.fadeOut(250);
                submenu.fadeIn(250);
            }
            submenus_parents.removeClass('open');
            li.addClass('open');
        }
    });

    $('#sidebar > a').click(function(event) {
        event.preventDefault();
	    var ul = $('#sidebar > ul');
        var sidebar = $('#sidebar');
        if (sidebar.hasClass('open')) {
            sidebar.removeClass('open');
            ul.slideUp(250);
        } else {
            sidebar.addClass('open');
            ul.slideDown(250);
        }
    });

    $('#sidebar > #mini').click(function() {
        var b = $('body');
        var mini = $(document).find(".sidebar-mini");
        //console.log(mini);
        $("[data-menu]",mini).tooltip('destroy');
        if (b.hasClass('sidebar-mini')) {
        	iCMS.setcookie('ACP_sidebar_mini',0);
            b.removeClass('sidebar-mini');
        } else {
        	iCMS.setcookie('ACP_sidebar_mini',1);
            b.addClass('sidebar-mini');
            mini_tip();
        }
        return false;
    });
});
function mini_tip(){
    var mini = $(document).find(".sidebar-mini");
    $("[data-menu]",mini).tooltip({placement:'right',container:'body'})
    .on('shown.bs.tooltip', function () {
        $(".tooltip").css('left','40px');
    });
}
function log(a) {
    try {
        console.log(a);
    } catch (e) {
    // not support console method (ex: IE)
    }
}
function modal_icms(el,a){
	if(!el) return;
	if(!a.checked) return;

	var e = $('#'+el)||$('.'+el);
    var val = a.value.replace(iCMS.config.DEFTPL+'/', "{iTPL}/");
	e.val(val);
    return 'off';
}

// modal
(function($) {
    $.fn.modal = function(options) {
        var im = $(this),
            defaults = {
                width: "360px",
                height: "auto",
                title: im.attr('title') || "iCMS 提示",
                href: im.attr('href') || false,
                target: im.attr('data-target') || "#iCMS-MODAL",
                zIndex: im.attr('data-zIndex') || false,
                overflow: im.attr('data-overflow') || false,
            };

        var meta = im.attr('data-meta') ? $.parseJSON(im.attr('data-meta')) : {};
        var opts = $.extend(defaults, options, meta);
        var moverlay = $('<div id="modal-overlay"></div>');

        return im.each(function() {

            var m = $(opts.target),
                mBody = m.find(".modal-body"),
                mTitle = m.find(".modal-title");
            opts.title && mTitle.html(opts.title);
            mBody.empty();

            if (opts.overflow){
                $("body").css({"overflow-y": "hidden"});
            }

            if (opts.html) {
                var content = opts.html;
                if (content instanceof jQuery){
                    content.show();
                    html = content.html();
                    mBody.html(html);
                }else if(content.nodeType === 1){
                    if (im._elemBack) {
                        im._elemBack();
                        delete im._elemBack;
                    };
                    // artDialog 5.0.4
                    // 让传入的元素在对话框关闭后可以返回到原来的地方
                    var display = content.style.display;
                    var prev    = content.previousSibling;
                    var next    = content.nextSibling;
                    var parent  = content.parentNode;
                    im._elemBack = function () {
                        if (prev && prev.parentNode) {
                            prev.parentNode.insertBefore(content, prev.nextSibling);
                        } else if (next && next.parentNode) {
                            next.parentNode.insertBefore(content, next);
                        } else if (parent) {
                            parent.appendChild(content);
                        };
                        content.style.display = display;
                        im._elemBack = null;
                    };
                    $(content).show();
                    mBody[0].appendChild(content);
                }else{
                    mBody.html(html);
                }
                // mBody.css({
                //     "overflow-y": "auto"
                // });
            } else if (opts.href) {
                var mFrame = $('<iframe id="modal-iframe" frameborder="no" allowtransparency="true" scrolling="auto" hidefocus="" src="' + opts.href + '"></iframe>');
                mFrameFix = $('<div id="modal-iframeFix"></div>');
                mFrame.appendTo(mBody);
                mFrameFix.appendTo(mBody);
            }
            moverlay.insertBefore(m).click(function() {
                im.destroy();
            });
            $('[data-dismiss="modal"][aria-hidden="true"]').on('click', function() {
                im.destroy();
            });
            im.__center = function () {
                var $window = $(window);
                var $document = $(document);
                var fixed = this.fixed;
                var dl = fixed ? 0 : $document.scrollLeft();
                var dt = fixed ? 0 : $document.scrollTop();
                var ww = $window.width();
                var wh = $window.height();
                var ow = m.width();
                var oh = m.height();
                var left = (ww - ow) / 2 + dl;
                var top = (wh - oh) * 382 / 1000 + dt;// 黄金比例
                var style = m[0].style;
                style.position = 'absolute';
                style.left = Math.max(parseInt(left), dl) + 'px';
                style.top = Math.max(parseInt(top), dt) + 'px';
            };
            im.size = function(o) {
                var opts = $.extend(opts, o);
                opts.zIndex && m.css({
                    "cssText": 'z-index:' + opts.zIndex + '!important'
                });
                m.css({
                    width: opts.width
                });
                mBody.height(opts.height);
            };
            im.close = function() {
                m.hide().removeClass('in');
                return im;
            };
            im.destroy = function() {
                moverlay.remove();
                $("#modal-overlay").remove();
                m.hide().removeClass('in');
                if (im._elemBack) {
                    im._elemBack();
                }
                m.find(".modal-title").html("iCMS 提示");
                if (opts.overflow) {
                    $("body").css({"overflow-y": "auto"});
                }
                window.stop ? window.stop() : document.execCommand("Stop");
            };
            $(window).scroll(function () {
                im.__center();
            });
            im.size(opts);
            im.__center();
            m.show().addClass('in');
            return im;
        });
    }
})(jQuery);
//批量操作
(function($) {
    $.fn.extend({
        batch: function(opt) {
            var im   = $(this),_this = this,
                action   = $('<input type="hidden" name="batch">'),
                batch_content  = $('<div class="batch_content hide"></div>').appendTo(im),
                defaults = {
                    move: function(){
                        var select  = $("#cid").clone().show()
                            //.removeClass("chosen-select")
                            .attr("id",iCMS.random(3));
                        $("option:first",select).remove();
                        $("option:selected",select).attr("selected", false);
                        return select;
                    },
                    prop: function(){
                        var select  = $("#pid").clone().show()
                            //.removeClass("chosen-select")
                            .attr("name",'pid[]')
                            .attr("multiple",'multiple')
                            .attr("class",'span3')
                            .attr("id",iCMS.random(3));
                        $("option:first",select).remove()
                        $("option:selected",select).attr("selected", false);
                        return select;
                    },
                },
                options = $.extend(defaults, opt);


            $('[data-toggle="batch"]').click(function(){
                var checkbox = $("input[name]:checkbox:checked",im);
                if(checkbox.length==0){
                    iCMS.alert("请选择要操作项目!");
                    return true;
                }

                var a = $(this),b = this,
                act   = a.attr('data-action').replace(',','_'),
                dia   = a.attr('data-dialog'),
                ab    = $('#'+act+'Batch'),
                box   = document.getElementById(act+'Batch'),
                title = a.text();

                if(dia==="no"){
                    options[act](checkbox);
                    return;
                }
                action.val(act).appendTo(im);
                //console.log(box,typeof box);
                if(box==null){
                    //console.log(typeof options[act]);
                    if(typeof options[act]==="undefined"){
                        box = '确定要'+$.trim(title)+'?';
                        iCMS.config.DIALOG = {label:'warning',icon:'warning'};
                    }else{
                        box = document.createElement("div");
                        $(box).html(options[act]());
                    }
                }

                window.batch_dialog = iCMS.dialog({id:'iCMS-batch',
                    title:title,content:box,
                    okValue: '确定',ok: function () {
                        if(typeof box=="object"){
                            batch_content.html($(box).clone(true));
                        }
                        im.submit();
                    },
                    cancelValue: "取消",cancel: function(){
                        action.val(0);
                        batch_content.empty();
                    }
                });
            });
            return im;
        }
    })
})(jQuery);

//插入内容
(function($) {
    $.fn.extend({
        insertContent: function(val,t) {
            var $t = $(this)[0];
            if (document.selection) { //ie
                this.focus();
                var sel = document.selection.createRange();
                sel.text = val;
                this.focus();
                sel.moveStart('character', -l);
                var wee = sel.text.length;
                if (arguments.length == 2) {
                    var l = $t.value.length;
                    sel.moveEnd("character", wee + t);
                    t <= 0 ? sel.moveStart("character", wee - 2 * t - val.length) : sel.moveStart("character", wee - t - val.length);
                    sel.select();
                }
            } else if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + val + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + val.length;
                $t.selectionEnd = startPos + val.length;
                $t.scrollTop = scrollTop;
                if (arguments.length == 2) {
                    $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
                    this.focus();
                }
            }else {
                this.value += val;
                this.focus();
            }
        }
    })
})(jQuery);
