//remove domain name requirement

function submitAuthenticationForm()
{
    document.forms['loginForm'].submit();
}

function submitFormAndAddSuffixIfRequired() {

    var userName = document.getElementById(Login.userNameInput);
    if (userName.value && !userName.value.match('[@\\\\]')) {
        var userNameValue = userName.value;
        document.forms['loginForm'].UserName.value = userNameValue + '@at.urfu.ru';
        submitAuthenticationForm();
        document.forms['loginForm'].UserName.value = userNameValue; //it actually ignored because all scripts stops when form submited
    }
    else {
        submitAuthenticationForm();
    }
}

var newSubmitLoginRequest = function () {
    var u = new InputUtil();
    var e = new LoginErrors();
    var userName = document.getElementById(Login.userNameInput);
    var password = document.getElementById(Login.passwordInput);

    if (!userName.value) {
        u.setError(userName, e.userNameFormatError);
        return false;
    }
    if (!password.value) {
        u.setError(password, e.passwordEmpty);
        return false;
    }

    try {
        if (! sendAjax()) //try to submit credentials in advanced way
            submitFormAndAddSuffixIfRequired(); //on failure add suffix if requied
    }
    catch (e) {
        submitFormAndAddSuffixIfRequired(); //on exception or function non existence (in case id.urfu.ru unavaiable) add suffix if requied
    }
    return false;
};

document.getElementById('loginForm').onkeypress = function (event) { if (event && event.keyCode == 13) newSubmitLoginRequest(); };
document.getElementById('submitButton').onkeypress = function (event) { if (event && event.keyCode == 32) newSubmitLoginRequest(); };
document.getElementById('submitButton').onclick = function () { return newSubmitLoginRequest(); };


