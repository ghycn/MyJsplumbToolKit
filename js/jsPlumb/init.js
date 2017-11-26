$(function () {
    //初始化tooltip
    $("[data-toggle='tooltip']").tooltip();

    var simple_class = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="140" height="100" stroke="black" fill="#fff">' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="0" y="0" width="140" height="100" rx="10" ry="10" style="stroke:#000;stroke-width:4"></rect>' +
        '                <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle"  x="70" y="50" dominant-baseline="central">简单类</text>' +
        '</svg>';

    var interface = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="160" height="120" stroke="black" fill="#fff">' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="0" y="0" width="160" height="120" rx="10" ry="10"  style="stroke:#000;stroke-width:4"></rect>' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="10" y="10" width="140" height="100" class="inner"></rect>' +
        '                <line version="1.1" xmlns="http://www.w3.org/1999/xhtml" x1="0" y1="30" x2="160" y2="30" style="stroke:#000;stroke-width:2"></line>' +
        '                <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle" x="80" y="15" dominant-baseline="central">接口</text>' +
        '</svg>';

    var class_svg = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="160" height="100" stroke="black" fill="#fff">' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="0" y="0" width="160" height="100" rx="10" ry="10"  style="stroke:#000;stroke-width:4"></rect>' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="10" y="10" width="140" height="80" class="inner"></rect>' +
        '                <line version="1.1" xmlns="http://www.w3.org/1999/xhtml" x1="0" y1="30" x2="160" y2="30" style="stroke:#000;stroke-width:2"></line>' +
        '                <line version="1.1" xmlns="http://www.w3.org/1999/xhtml" x1="0" y1="65" x2="160" y2="65" style="stroke:#000;stroke-width:2"></line>' +
        '                <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle" x="80" y="15" dominant-baseline="central">类</text>' +
        '</svg>';

    var active_class = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="160" height="120" stroke="black" fill="#fff">' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="0" y="0" width="160" height="120" rx="10" ry="10"  style="stroke:#000;stroke-width:4"></rect>' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="10" y="10" width="140" height="100" class="inner"></rect>' +
        '                <line version="1.1" xmlns="http://www.w3.org/1999/xhtml" x1="30" y1="0" x2="30" y2="120" style="stroke:#000;stroke-width:2"></line>' +
        '                <line version="1.1" xmlns="http://www.w3.org/1999/xhtml" x1="130" y1="0" x2="130" y2="120" style="stroke:#000;stroke-width:2"></line>' +
        '                <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle" x="80" y="60" dominant-baseline="central">活动类</text>' +
        '</svg>';

    var table = ' <img src="images/table_model.png" style="height: 80px;width: 120px;">' +
        '<div style="text-align: center">Table</div> ';
    var luoji1 = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="140" height="100" stroke="black" fill="#fff">' +
        '                <rect version="1.1" xmlns="http://www.w3.org/1999/xhtml" x="0" y="0" width="140" height="100"  style="stroke:#000;stroke-width:4"></rect>' +
        '                <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle"  x="70" y="50" dominant-baseline="central">实体</text>' +
        '</svg>';
    var luoji2 = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="160" height="120" fill="#fff">' +
        '         <polygon version="1.1" xmlns="http://www.w3.org/1999/xhtml" points="80,0 160,60 80,120  0,60" style="stroke-width:2;stroke:#000;"></polygon>' +
        '         <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle" x="80" y="60" dominant-baseline="central" style="fill:#000;">关系</text>' +
        '</svg>';
    var luoji3 = '<svg version="1.1" xmlns="http://www.w3.org/1999/xhtml" width="160" height="120" fill="#fff">' +
        '       <ellipse version="1.1" xmlns="http://www.w3.org/1999/xhtml" cx="80" cy="60" rx="75" ry="55" style="stroke-width:2;stroke:#000;"></ellipse>' +
        '   <text version="1.1" xmlns="http://www.w3.org/1999/xhtml" text-anchor="middle" x="80" y="60" dominant-baseline="central" style="fill:#000;">键值属性</text>' +
        '</svg>';
    //初始化popover
    $("[data-toggle='popover']").each(function (i) {
        if ($(this).hasClass('uml_simple_class')) {
            $(".uml_simple_class").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                container: 'body',
                content: simple_class
            });
        }
        if ($(this).hasClass('uml_interface')) {
            $(".uml_interface").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: interface
            });
        }
        if ($(this).hasClass('uml_class')) {
            $(".uml_class").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: class_svg
            });
        }
        if ($(this).hasClass('uml_active_class')) {
            $(".uml_active_class").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: active_class
            });
        }
        if ($(this).hasClass('table_model')) {
            $(".table_model").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: table
            });
        }
        if ($(this).hasClass('luoji1')) {
            $(".luoji1").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: luoji1
            });
        }
        if ($(this).hasClass('luoji2')) {
            $(".luoji2").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: luoji2
            });
        }
        if ($(this).hasClass('luoji3')) {
            $(".luoji3").popover({
                placement: 'bottom',
                trigger: 'hover', //触发方式
                html: true,
                content: luoji3
            });
        }
    });

    //设置面板显示
    $('.panel-collapse').collapse('show');

    //进入全屏
    function requestFullScreen() {
        var de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    }

    //退出全屏
    function exitFullscreen() {
        var de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    }

    //注册全屏响应事件
    $(".icon-quanping").click(function () {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        if (fullscreenElement == undefined) {
            requestFullScreen();
        } else {
            exitFullscreen();
        }
    });
    //单击物理物理模型显示导出sql;点击其他超链接不显示导出sql
    $(".link_model ").click(function(){
        $('#iconSqlscript').hide();
    });
    $(".physical_model ").click(function(){
        $('#iconSqlscript').show();
    });



    //点击改变按钮方向
    $("[data-toggle='collapse']").click(function () {
        if ($(this).hasClass('collapsed')) {
            $(this).prev().removeClass('icon-arrfill_l').addClass('icon-arrfill_u-copy');
        } else {
            $(this).prev().removeClass('icon-arrfill_u-copy').addClass('icon-arrfill_l');
        }
    });

    //点击显示悬浮窗
    $('.link_model').bind('click',function(){
        var width = $('body').width();
        if($(this).hasClass('concept_model')){
            $('.icon-daochu').addClass('icon-daochu-uml');
            $('.icon-daochu').removeClass('icon-daochu-database');

            $('#database_workplace').hide();
            $('#uml_workplace').show();
            $('.alert-info').hide();
            $('.concept_model_alert').show();
            $('.concept_model_alert').offset({top:42,left:width-200});
        }else if($(this).hasClass('uml_class_model')){
            $('.icon-daochu').addClass('icon-daochu-uml');
            $('.icon-daochu').removeClass('icon-daochu-database');

            $('#database_workplace').hide();
            $('#uml_workplace').show();
            $('.alert-info').hide();
            $('.uml_class_model_alert').show();
            $('.uml_class_model_alert').offset({top:42,left:width-230});
        }else if($(this).hasClass('physical_model')){
            $('.icon-daochu').addClass('icon-daochu-database');
            $('.icon-daochu').removeClass('icon-daochu-uml');

            $('#database_workplace').show();
            $('#uml_workplace').hide();
            $('.alert-info').hide();
            $('.database_model_alert').show();
            $('.database_model_alert').offset({top:42,left:width-95});
        }
    });

    //点击隐藏悬浮窗
    $('.close_alert').bind('click',function(){
        $(this).parent().hide();
    });

    //设置悬浮窗可拖拽
    // $( ".draggable" ).draggable();
});
