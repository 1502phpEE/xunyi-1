'use strict';

// -----验证码获取相关
// 获取短信验证码需要图形验证码
var _sendSmsTimer = null;
function clearSendSmsTimer() {
    if (_sendSmsTimer) {
        clearInterval(_sendSmsTimer);
    }
    $('#getVerifyCodeBtn').prop('disabled', false).text('获取验证码');
}
function startSendSmsTimer() {
    clearSendSmsTimer();
    var current = 60;
    var $btn = $('#getVerifyCodeBtn');
    var ticker = function () {
        current -= 1;
        if (current <= 0) {
            clearSendSmsTimer();
        } else {
            $btn.prop('disabled', true).text(current + '秒后再次获取');
        }
    };
    _sendSmsTimer = setInterval(ticker, 1000);
    ticker();
}
function refreshNewVerifyImg() {
    $.ajax({
        url: "/refresh_captcha",
        cache: false,
        type: "GET",
        dataType: "json",
        success: function (json) {
            if (json.result == 'success') {
                var newCaptchaStr = json.captcha_string;
                $("#captchaInputs").html(newCaptchaStr);
            } else {
                $("#captchaHelper").html("刷新失败，点击图片重试...");
            }
        }
    });
}
function bindSendSmsWithVerifyImg() {
    var verifyCodeInputPop = $('#getVerifyCodeBtn').popover({
        title: "请在输入框中填写图片中结果",
        content: function () {
            return '<form id="getVerifyCodeForm" action="/clinic/get_verify_code" method="POST">' +
                "<div id='captchaInputs'>正在获取图片...</div>" +
                "<div id='captchaHelper'>点击图片刷新</div>" +
                '<p style="margin-top: 9px; border-top: 1px solid #F7F7F7;padding: 9px 0;"><input class="btn" type="submit" value="发送验证码"/></p></form>';
        }
    });

    var opend = false;

    // 弹出获取图片验证码的popover
    $("#getVerifyCodeBtn").click(function () {
        if ($("#docInviteBanner:visible").length > 0) {
            $(".dropDocBanner").html("展示");
        }
        if (opend) {
            verifyCodeInputPop.popover('hide');
            opend = false;
        } else {
            verifyCodeInputPop.popover('show');
            opend = true;
            refreshNewVerifyImg();
        }
    });

    // 刷新图形验证码
    $(".captcha").live('click', function () {
        refreshNewVerifyImg();
    });

    // 根据图形验证码获取短信验证码form提交
    $("#getVerifyCodeForm").live('submit', function (event) {
        event.preventDefault();
        var phone_num = $.trim($('#inputPhone,#id_username').val());
        if (phone_num.length > 0 && check_phone_num(phone_num)) {
            var verifyForm = $(this);
            var captcha_0 = $.trim(verifyForm.find("#id_captcha_0").val());
            var captcha_1 = $.trim(verifyForm.find("#id_captcha_1").val());
            //check captcha
            if (!setAlert($("#id_captcha_1"), $("#id_captcha_1"), "请填写图片中数字结果", null)) {
                return false;
            } else {
                var data = {
                    "captcha_0": captcha_0,
                    "captcha_1": captcha_1,
                    "phone_num": phone_num
                };
                $.ajax({
                    url: "/get_verify_code",
                    cache: false,
                    type: "POST",
                    data: data,
                    dataType: "json",
                    success: function (json) {
                        // 刷新验证码
                        refreshNewVerifyImg();
                        if (json.result == 'success') {
                            // 隐藏popover
                            $('#getVerifyCodeBtn').popover('hide');
                            // 开始倒计时
                            startSendSmsTimer();
                            alert("验证码已通过短信发送到您填写的手机上，请耐心等待2~5分钟。");
                        } else {
                            alert("输入的结果不正确，请重新输入。");
                        }
                    }
                });
            }
        } else {
            alert("请正确填写您的手机号码，以方便收到验证码，完成注册。");
        }
    });
}

// 获取短信验证码不需要图形验证码
function bindSendSmsDirectly() {
    //临时修改获取手机验证码逻辑，去掉图片验证码效验

    $("#getVerifyCodeBtn").click(function () {
        var self = this;
        var phone_num = $.trim($('#inputPhone,#id_username').val());
        if (phone_num.length > 0 && check_phone_num(phone_num)) {
            //判断是否已经发送验证码
            if (!self.verify) {
                //开始发送验证码
                self.verify = true;
                $(self).text("请查收您的短信");
                $.post("/get_verify_code", {'phone_num': phone_num}, function (d) {
                    if (d.result == "success") {
                        alert("验证码发送成功，请耐心等待60秒，若没有收到，60秒后可再次点击发送");
                        setTimeout(function () {
                            self.verify = false;
                            $(self).text("获取验证码");
                        }, 60000);
                        //startVerifyCodeTimer();
                    } else {
                        alert('验证码发送失败,请稍后再试');
                        self.verify = false;
                        $(self).text("获取验证码");
                    }
                }, 'json');
            } else {
                alert("请耐心等待60秒，若您没有收到验证码，60秒后可再次进行点击");
            }
        } else {
            alert("请正确填写您的手机号码，以方便收到验证码，完成注册。");
        }
    });

}

bindSendSmsWithVerifyImg();
// ------验证码获取结束