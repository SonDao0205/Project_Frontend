const users = [
    {
        "id" : 1,
        "username" : "123",
        "password" : "123"
    },
    {
        "id" : 2,
        "username" : "234",
        "password" : "234"
    }
]

const usernameInputElement = document.querySelector("#usernameInput")
const passwordInputElement = document.querySelector("#passwordInput")
const confirmPasswordInputElement = document.querySelector("#confirmPasswordInput")
const registerButtonElement = document.querySelector("#registerButton")
const userLocals = JSON.parse(localStorage.getItem("users")) || []

const validatePassword = (passwordValue) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return passwordRegex.test(passwordValue);
}

registerButtonElement.addEventListener("click",(event) => {
    event.preventDefault()
    const passwordValue = passwordInputElement.value
    const usernameValue = usernameInputElement.value
    const confirmPasswordValue = confirmPasswordInputElement.value
    // kiểm tra độ hợp lệ của thông tin
    if (usernameValue.length === 0) {
        alert("Tên đăng nhập không được để trống")
        return
    }
    if (passwordValue.length === 0) {
        alert("Mật khẩu không được để trống!")
        return
    }
    else if (!validatePassword(passwordValue)) {
        alert("Mật khẩu không hợp lệ!")
        return
    }
    else if (confirmPasswordValue === 0) {
        alert("Xác nhận mật khẩu không được để trống!")
        return
    }
    else if (passwordValue !== confirmPasswordValue) {
        alert("Xác nhận mật khẩu thất bại!")
        return
    }
    // kiểm tra sự tồn tại
    const user = userLocals.find(user => user.username === usernameValue);
    if (user) {
        alert("Tài khoản đã tồn tại!");
        return;
    }
    // thêm tài khoản vào local
    const newUsers = {
        "id" : Math.floor(Math.random() * 99),
        "username" : usernameValue,
        "password" : passwordValue
    }
    userLocals.push(newUsers)
    localStorage.setItem("users",JSON.stringify(userLocals))
    alert("Đăng ký thành công")
    window.location = "../pages/login.html"
    
})