const usernameInputElement = document.querySelector("#usernameInput")
const passwordInputElement = document.querySelector("#passwordInput")
const confirmPasswordInputElement = document.querySelector("#confirmPasswordInput")
const registerButtonElement = document.querySelector("#registerButton")
const errorElement = document.querySelectorAll(".error")
const errorEmptyElement = document.querySelectorAll(".errorEmpty")
const userLocals = JSON.parse(localStorage.getItem("users")) || [];
if (userLocals.length > 0) {
    if (userLocals.some((element) => element.rememberLogin === 1)) {
        window.location = "../pages/home.html"
    }    
    else{
        userLocals[userLocals.length - 1].rememberLogin = 0;    
    }
}
// Nếu tài khoản đã từng đăng nhập rồi thì từ lần sau truy cập sẽ không cần phải đăng nhập lại nữa
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
    // kiểm tra độ hợp lệ của thông tin nhập vào và kiểm tra sự tồn tại
    const user = userLocals.find(user => user.username === usernameValue);
    if (errorEnable(usernameValue,passwordValue,confirmPasswordValue,user)) {
        return
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
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
        });
        Toast.fire({
        icon: "success",
        title: "Đăng Ký Thành Công"
        }).then(() => {
        window.location = "../pages/login.html"
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

const errorEnable = (usernameValue,passwordValue,confirmPasswordValue,user) => {
    if (usernameValue.length === 0) {
        errorEmptyElement[0].style.display = "block"
        usernameInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    if (passwordValue.length === 0) {
        errorEmptyElement[1].style.display = "block"
        passwordInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    if (confirmPasswordValue.length === 0) {
        errorEmptyElement[2].style.display = "block"
        confirmPasswordInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    if (!validatePassword(passwordValue)) {
        errorElement[1].style.display = "block"
        passwordInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    if (passwordValue !== confirmPasswordValue) {
        errorElement[2].style.display = "block"
        confirmPasswordInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    if (user) {
        errorElement[0].style.display = "block"
        usernameInputElement.style.border = "1px solid red"
        errorAlert()
        return true
    }
    return false
}

const errorAlert = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "error",
        title: "Đăng Ký Thất Bại",
      })
      return true
}
