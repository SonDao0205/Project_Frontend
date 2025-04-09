const usernameInputElement = document.querySelector("#usernameInput")
const passwordInputElement = document.querySelector("#passwordInput")
const confirmPasswordInputElement = document.querySelector("#confirmPasswordInput")
const loginButtonElement = document.querySelector("#loginButton")
const errorIncorrectElement = document.querySelectorAll(".errorIncorrect")
const errorEmptyElement = document.querySelectorAll(".errorEmpty")
const userLocals = JSON.parse(localStorage.getItem("users")) || []
// Nếu tài khoản đã từng đăng nhập rồi thì từ lần sau truy cập sẽ không cần phải đăng nhập lại nữa
if (userLocals.length > 0) {
    if (userLocals[userLocals.length - 1].rememberLogin) {
        window.location = "../pages/home.html"
    }    
}

loginButtonElement.addEventListener("click",(event) => {
    errorDisable()
    event.preventDefault()
    const passwordValue = passwordInputElement.value
    const usernameValue = usernameInputElement.value
    // kiểm tra sự hợp lệ của thông tin
    if(usernameValue.length === 0){
        errorEmptyElement[0].style.display = "block"
        usernameInputElement.style.border = "1px solid red"
        if (passwordValue.length === 0) {
            errorEmptyElement[1].style.display = "block"
            passwordInputElement.style.border = "1px solid red"
        }
        return
    }
    // kiểm tra sự tồn tại
    const index = userLocals.findIndex(user => user.username === usernameValue && user.password === passwordValue);
    if (index === -1) {
        errorIncorrectElement.forEach(element => {
            element.style.display = "block"
            usernameInputElement.style.border = "1px solid red"
            passwordInputElement.style.border = "1px solid red"
        });
        return
    }
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
        title: "Đăng Nhập Thành Công"
      }).then(() => {
        userLocals[index].rememberLogin = 1;
        localStorage.setItem("users",JSON.stringify(userLocals))
        window.location = "../pages/home.html"
        });
    
})

const errorDisable = () => {
    errorEmptyElement[0].style.display = "none"
    usernameInputElement.style.border = "1px solid #E5E7EB"
    errorEmptyElement[1].style.display = "none"
    passwordInputElement.style.border = "1px solid #E5E7EB"
    errorIncorrectElement.forEach(element => {
        element.style.display = "none"
    });
}
