$(document).ready(function(){
    $('#slider').slidesjs({
        width: 880,
        height: 130,
        navigation: false,
        pagination: false
    });
    $('.fancybox').fancybox();
    $('.call-modal').click(function() {
        if ($(this).attr("data-tariff"))
            $(".one-tariff[data-tariff="+$(this).attr("data-tariff")+"]").click();
        $('.modal').modal({
            overlayClose:true,
            closeClass: "modal-close"
        });
        $("[name=phone]").mask("+7 (999) 999-99-99");
    });
    $(".one-tariff").click(function(){
        $(".one-tariff").removeClass("active");
        $(this).addClass("active");
        $("[name=tariff]").val($(this).text());
    });
    $("a[href^=#]").click(function(e) {
        e.preventDefault();
        $scrollobj = $($(this).attr("href"));
        if ($scrollobj.length)
            $("html, body").animate({ scrollTop: $scrollobj.offset().top }, "slow");
        return false;
    });
    $('#order-form, #contact-form').submit(function(){
        var err = false;
        var modal = this.id=="order-form";
        $("[name=email],[name=name],[name=phone]", this).each(function(){
            var regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,6})$/;
            if ($(this).val() == "") {
                if (!$(this).hasClass("error"))
                    $(this).after("<span class=\"error\">Пожалуйста, заполните все контактные данные</span>");
                else
                    $(this).next("span.error").text("Пожалуйста, заполните все контактные данные");
                $(this).addClass("error");
                err = true;
            }
            else if ($(this).attr("name") == "email" && !regEmail.test($(this).val())) {
                if (!$(this).hasClass("error"))
                    $(this).after("<span class=\"error\">Неверный формат email</span>");
                else
                    $(this).next("span.error").text("Неверный формат email");
                $(this).addClass("error");
                err = true;
            }
            else
                $(this).removeClass("error").next("span.error").remove();
        });
        if (err)
            return false;
        
        $('input[type=submit]', this).attr('disabled', 'disabled');
        $.post("/ajax/box_b2b_handler.php",
            {
                form: 'b2b',
                EMAIL: $("[name=email]", this).val(),
                PHONE: $("[name=phone]", this).val(),
                NAME: $("[name=name]", this).val(),
                TEXT: $("[name=comment]", this).val(),
                TARIFF: $("[name=tariff]", this).val()
            },
            function(data){
                $('input[type=submit]', this).removeAttr('disabled');
                if (data == "ok")
                    if (modal) {
                        $(".modal").html("<h3>Заявка успешно отправлена</h3>\
                                    <div class=\"thankyou\">\
                                        Спасибо, ваша заявка была успешно отправлена. В ближайшее время с вами свяжется наш менеджер для уточнения деталей заказа.\
                                        <span class=\"btn-close modal-close\">Спасибо</span>\
                                    </div>");
                        $(".modal-close").click(function(){$.modal.close();});
                    }
                    else {
                        $("#contact-form").html("<div class=\"thankyou\">\
                                        Спасибо, ваша заявка была успешно отправлена. В ближайшее время с вами свяжется наш менеджер для уточнения деталей заказа.\
                                        </div>");
                    }
                    
        });
        return false;
    });
});