const usernameInputElement = document.querySelector("#usernameInput")
const passwordInputElement = document.querySelector("#passwordInput")
const confirmPasswordInputElement = document.querySelector("#confirmPasswordInput")
const registerButtonElement = document.querySelector("#registerButton")
const errorElement = document.querySelectorAll(".error")
const errorEmptyElement = document.querySelectorAll(".errorEmpty")
const userLocals = JSON.parse(localStorage.getItem("users")) || [];
if (userLocals.length > 0) {
    userLocals[userLocals.length - 1].rememberLogin = 0;
}
const validatePassword = (passwordValue) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return passwordRegex.test(passwordValue);
}

registerButtonElement.addEventListener("click",(event) => {
    event.preventDefault()
    errorDisable(); // Reset lỗi hiển thị trước khi kiểm tra
    const passwordValue = passwordInputElement.value
    const usernameValue = usernameInputElement.value
    const confirmPasswordValue = confirmPasswordInputElement.value
    // kiểm tra độ hợp lệ của thông tin
    if (usernameValue.length === 0) {
        errorEmptyElement[0].style.display = "block"
        usernameInputElement.style.border = "1px solid red"
        return
    }
    if (passwordValue.length === 0) {
        errorEmptyElement[1].style.display = "block"
        passwordInputElement.style.border = "1px solid red"
        return
    }
    if (confirmPasswordValue.length === 0) {
        errorEmptyElement[2].style.display = "block"
        confirmPasswordInputElement.style.border = "1px solid red"
        return
    }
    if (!validatePassword(passwordValue)) {
        errorElement[1].style.display = "block"
        passwordInputElement.style.border = "1px solid red"
        return
    }
    if (passwordValue !== confirmPasswordValue) {
        errorElement[2].style.display = "block"
        confirmPasswordInputElement.style.border = "1px solid red"
        return
    }
    // kiểm tra sự tồn tại
    const user = userLocals.find(user => user.username === usernameValue);
    if (user) {
        errorElement[0].style.display = "block"
        usernameInputElement.style.border = "1px solid red"
        return;
    }
    errorDisable()
    // thêm tài khoản vào local
    const newUsers = {
        "id" : Math.floor(Math.random() * 99),
        "username" : usernameValue,
        "password" : passwordValue,
        "rememberLogin" :0
    }
    userLocals.push(newUsers)
    localStorage.setItem("users",JSON.stringify(userLocals))
    Swal.fire({
        title: "Đăng ký tài khoản thành công",
        icon: "success"
        }).then((result) => {
        if (result.isConfirmed) {
            window.location = "../pages/login.html"
        }
        });
    
})

const errorDisable = () => {
    usernameInputElement.style.border = "1px solid #E5E7EB"
    passwordInputElement.style.border = "1px solid #E5E7EB"
    confirmPasswordInputElement.style.border = "1px solid #E5E7EB"
    errorEmptyElement.forEach(element => {
        element.style.display = "none"
    });
    errorElement.forEach(element => {
        element.style.display = "none"
    });
}

