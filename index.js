var MyForm = {
    validate: function validate() {
        //���������� ������ � ��������� ���������� ��������� (isValid) � �������� �������� �����, ������� �� ������ ��������� (errorFields).
        var res = { isValid: true, errorFields: [] };
        var form = this.getData();
        var patternMail = /^[-\w.]+@(ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/i;
        var patternFIO = /^(\s*[a-zA-z�-��-�]+\s*){3}$/i;
        var patternPhone = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/i;

        $('input.error').removeClass('error');
        if (form.email.search(patternMail) !== 0) {
            res.isValid = false;
            res.errorFields.push("email");
            $('#email').addClass('error');
        }

        if (form.fio.search(patternFIO) !== 0) {
            res.isValid = false;
            res.errorFields.push("fio");
            $('#fio').addClass('error');
        }

        var phoneNumber = form.phone;
        var phoneNumberTotal = 0;

        for (var i = 0; i < phoneNumber.length; i++) {
            var number = parseInt(phoneNumber.charAt(i));
            phoneNumberTotal += Number.isInteger(number) ? number : 0;
        }

        if (form.phone.search(patternPhone) !== 0 || phoneNumberTotal > 30) {
            res.isValid = false;
            res.errorFields.push("phone");
            $('#phone').addClass('error');
        }

        return res;
    },
    getData: function getData() {
        //���������� ������ � ������� �����, ��� ����� ������� ��������� � ������� �������.
        return {
            fio: $('#fio').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        };
    },
    setData: function setData(obj) {
        //��������� ������ � ������� ����� � ������������� �� ������� �����. ���� ����� phone, fio, email ������������.
        $('#fio').val(obj.fio);
        $('#email').val(obj.email);
        $('#phone').val(obj.phone);
    },
    submit: function submit() {
        //��������� ��������� ����� � �������� ajax-�������, ���� ��������� ��������. ���������� �� ����� �� ������ ���������.
        if (!MyForm.validate().isValid) {
            return;
        }

        $.ajax({
            type: 'GET',
            url: $('#myForm').attr('action'),
            data: MyForm.getData(),
            success: function success(result) {

                switch (result.status) {
                    case 'success':
                        $('#resultContainer').addClass('success');
                        $('#resultContainer').text('Success');
                        break;
                    case 'error':
                        $('#resultContainer').addClass('error');
                        $('#resultContainer').text(result.reason);
                        break;
                    case 'progress':
                        $('#resultContainer').addClass('progress');
                        setTimeout(function () {
                            MyForm.submit();
                        }, result.timeout);

                        break;
                }
            }
        });
    }
};

$(document).ready(function () {
    $('#submitButton').click(function (e) {
        e.preventDefault();
        MyForm.submit();
    });
});