/*!
 * jQuery General Validator Plugin v1.0.0
 * Developed by: Alvaro Burghi (alvaro.burghi@gmail.com) and Guilherme Gomes (gmgomess@gmail.com)
 * Date: 2014-10-08
 */
(function ($) {
    var glbSet;

    $.fn.validate = function (options) {
        // Default settings
        var settings = $.extend({
            mask: true,
            requiredMsg: 'Campo Requerido!',
            radioMsg: 'Selecione uma opção!',
            checkedMsg: 'Marque uma opção!',
            emailMsg: 'O e-mail informado é inválido!',
            cpfMsg: 'CPF informado é inválido!',
            cnpjMsg: 'CNPJ informado é inválido!',
            dateMsg: 'Data informada é inválida!',
            numericMsg: 'O valor deve ser númerico!',
            minlengthMsg: 'Informe ao menos § caracteres!',
            maxlengthMsg: 'A quantidade máxima é de § caracteres!',
            passwordMsg: 'Senhas não conferem!',
            phoneMsg: 'O telefone informado é inválido!',
            cepMsg: 'Cep não encontrado, informe um CEP válido.',
            callbackCep: null,
            ifValid: null,
            ifInvalid: null
        }, options);

        /* masks */
        if (settings.mask) {
            /* date mask  */
            if ($(this).find('.date').length > 0)
                $(this).find('.date').mask('99/99/9999');
            /* cpf mask */
            if ($(this).find('.cpf').length > 0)
                $(this).find('.cpf').mask('999.999.999-99');
            /* cnpj mask */
            if ($(this).find('.cnpj').length > 0)
                $(this).find('.cnpj').mask('99.999.999/9999-99');
            /* vehicle registration plate mask */
            if ($(this).find('.plate').length > 0)
                $(this).find('.plate').mask('aaa-9999');
            /* phone mask */
            if ($(this).find('.phone').length > 0) {
                var opt = {
                    onKeyPress: function (phone) {
                        var masks = ['(00)0000-00009', '(00)00000-0000'];
                        mask = (phone.length > 13) ? masks[1] : masks[0];
                        $(this).find('.phone').mask(mask, this);
                    }
                };
                $(this).find('.phone').mask('(00)0000-00009', opt);
            }
            /* cep mask */
            if ($(this).find('.cep').length > 0)
                $(this).find('.cep').mask('99999-999');
        }

        var ctrl = $(this);

        /* reset button */
        $(this).find('.reset').click(function () {
            $(this).attr('onsubmit', 'return false');
            ctrl.trigger('reset');
            ctrl.find('*').removeClass('invalid').removeClass('valid');
            ctrl.find('.error-msg').remove();
            return false;
        });

        $(this).on("focusout", $(".cep"), function () {
            glbSet = settings;
            $(this).find(".cep").each(function () {
                if ($.trim($(this).val()) != "") {
                    var cepr = $.ajax({
                        url: 'http://cep.republicavirtual.com.br/web_cep.php?cep=' + $.trim($(this).val().replace('-', '')) + '&formato=json',
                        async: false
                    }).responseText;
                    cepr = $.parseJSON(cepr);
                    if (cepr.resultado == 0) {
                        fctInvalid($(this), settings.cepMsg, 'cep');
                    }
                    else {
                        if ($.isFunction(settings.callbackCep)) {
                            var callbacks = $.Callbacks();
                            callbacks.add(settings.callbackCep);
                            callbacks.fire(cepr);
                        }
                        fctValid($(this));
                    }
                }
            });
        });

        $(this).submit(function (e) {
            glbSet = settings;
            e.stopPropagation();

            if (!validateMethods($(this), settings)) {
                e.preventDefault();
            }
        });
    }

    function validateMethods(ctrl, settings) {
        try {
            var valid = true;
            // required validations
            var arr = ctrl.find(':input');
            $.each(arr, function () {
                // cep
                if ($(this).hasClass('cep') && $.trim($(this).val()) != "") {
                    var cepr = $.ajax({
                        url: 'http://cep.republicavirtual.com.br/web_cep.php?cep=' + $.trim($(this).val().replace('-', '')) + '&formato=json',
                        async: false
                    }).responseText;
                    cepr = $.parseJSON(cepr);
                    if (cepr.resultado == 0) {
                        valid = fctInvalid($(this), settings.cepMsg, 'cep');
                    }
                    else {
                        fctValid($(this));
                    }
                }

                // e-mail
                if ($(this).hasClass('email')) {
                    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
                    if (!er.test($.trim($(this).val()))) {
                        valid = fctInvalid($(this), settings.emailMsg, 'email');
                    }
                    else
                        fctValid($(this));
                }

                // date
                if ($(this).hasClass('date')) {
                    var sdata = $(this).val();
                    if (sdata.length != 10) {
                        valid = fctInvalid($(this), settings.dataMsg);
                    }
                    var dia = sdate.substr(0, 2);
                    var barra1 = sdate.substr(2, 1);
                    var mes = sdate.substr(3, 2);
                    var barra2 = sdate.substr(5, 1);
                    var ano = sdate.substr(6, 4);
                    if ((sdate.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) ||
                        ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) || (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) || (ano < 1900)) {
                        valid = fctInvalid($(this), settings.dataMsg, 'date');
                    }
                }

                // cpf
                if ($(this).hasClass('cpf')) {
                    var cpf = $(this).val().replace('.', '');
                    cpf = cpf.replace('.', '');
                    cpf = cpf.replace('-', '');
                    while (cpf.length < 11) cpf = "0" + cpf;
                    var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
                    var a = [];
                    var b = new Number;
                    var c = 11;
                    for (i = 0; i < 11; i++) {
                        a[i] = cpf.charAt(i);
                        if (i < 9) b += (a[i] * --c);
                    }
                    if ((x = b % 11) < 2) {
                        a[9] = 0
                    } else {
                        a[9] = 11 - x
                    }
                    b = 0;
                    c = 11;
                    for (y = 0; y < 10; y++) b += (a[y] * c--);
                    if ((x = b % 11) < 2) {
                        a[10] = 0;
                    } else {
                        a[10] = 11 - x;
                    }
                    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) {
                        valid = fctInvalid($(this), settings.cpfMsg, 'cpf');
                    }
                }

                // cnpj
                if ($(this).hasClass('cnpj')) {
                    var cnpj = $(this).val()
                    cnpj = cnpj.replace('.', '');
                    cnpj = cnpj.replace('.', '');
                    cnpj = cnpj.replace('/', '');
                    cnpj = cnpj.replace('-', '');
                    var a = new Array();
                    var b = new Number;
                    var c = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                    for (i = 0; i < 12; i++) {
                        a[i] = cnpj.charAt(i);
                        b += a[i] * c[i + 1];
                    }
                    if ((x = b % 11) < 2) {
                        a[12] = 0
                    } else {
                        a[12] = 11 - x
                    }
                    b = 0;
                    for (y = 0; y < 13; y++) {
                        b += (a[y] * c[y]);
                    }
                    if ((x = b % 11) < 2) {
                        a[13] = 0;
                    } else {
                        a[13] = 11 - x;
                    }
                    if ((cnpj.charAt(12) != a[12]) || (cnpj.charAt(13) != a[13])) {
                        valid = fctInvalid($(this), settings.cnpjMsg, 'cnpj');
                    }
                }

                // password
                if ($(this).hasClass('password') && $(this).parent().parent().find('.password').hasClass('password')) {

                    if ($.trim($(this).val()) != $.trim($(this).parent().parent().find('.password').val())) {
                        valid = fctInvalid($(this), settings.passwordMsg, 'password');
                    }
                }

                // pattern
                if ($(this).attr('data-pattern')) {
                    if ($.trim($(this).val()).match(new RegExp($(this).attr('data-pattern'))) == null) {
                        valid = fctInvalid($(this), settings.passwordMsg, 'pattern');
                    }
                    else
                        fctValid($(this));
                }

                // required
                if ($(this).hasClass('required') && $.trim($(this).val()) == "") {
                    valid = fctInvalid($(this), settings.requiredMsg, 'required');
                }

                // radio required
                if ($(this).attr('type') == 'radio' && $(this).hasClass('required')) {
                    var elmname = $(this).attr('name');
                    if (!$('input[name="' + elmname + '"]').is(':checked')) {
                        valid = fctInvalid($(this), settings.radioMsg, 'required');
                    }
                    else
                        fctValid($(this));
                }

                // checkbox required
                if ($(this).attr('type') == 'checkbox' && $(this).hasClass('required')) {
                    var elmname = $(this).attr('name');
                    if ($('input[name="' + $(this).attr('name') + '"]:checked').length == 0) {
                        valid = fctInvalid($(this), settings.checkedMsg, 'required');
                    }
                    else
                        fctValid($(this));
                }

                // minlength
                if ($(this).val().length > 0 && $(this).attr('data-minlength')) {
                    if ($.trim($(this).val()).length < $(this).attr('data-minlength')) {
                        valid = fctInvalid($(this), settings.minMsg.replace(/§/g, $(this).attr('data-minlength')), 'minlength');
                    }
                    else
                        fctValid($(this));
                }

                // maxlength
                if ($(this).attr('data-maxlength')) {
                    if ($.trim($(this).val()).length > $(this).attr('data-maxlength')) {
                        valid = fctInvalid($(this), settings.minMsg.replace(/§/g, $(this).attr('data-maxlength')), 'maxlength');
                    }
                    else
                        fctValid($(this));
                }

                // numeric
                if ($(this).hasClass('numeric')) {
                    var nan = new RegExp(/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/);
                    if (!nan.test($.trim($(this).val()))) {
                        valid = fctInvalid($(this), settings.numericMsg, 'numeric');
                    }
                    else
                        fctValid($(this));
                }
                if (valid) {
                    fctValid($(this));
                }
            });
            return valid;
        } catch (err) { console.log("Error in " + err.description); }
    }

    function fctInvalid(field, message, error) {
        if (field.attr('data-msg-' + error))
            message = field.attr('data-msg-' + error);

        field.removeClass('valid').addClass('invalid');

        if (field.parent().find('span.error-msg').length > 0)
            field.parent().find('span.error-msg').text(message);
        else
            field.parent().append("<span class='error-msg'>" + message + "</span>");

        if ($.isFunction(glbSet.ifInvalid)) {
            var callbacks = $.Callbacks();
            callbacks.add(glbSet.ifInvalid);
            callbacks.fire(field, message, error);
        }

        return false;
    }

    function fctValid(field) {
        field.removeClass('invalid').addClass('valid');
        var spanError = field.parent().find('span.error-msg');      
        if (glbSet.ifValid != null && $.isFunction(glbSet.ifValid)) {
            var callbacks = $.Callbacks();
            callbacks.add(glbSet.ifValid);
            callbacks.fire(field);
        }
    }
}(jQuery));