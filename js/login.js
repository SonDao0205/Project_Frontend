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
const loginButtonElement = document.querySelector("#loginButton")
const userLocals = JSON.parse(localStorage.getItem("users")) || []

loginButtonElement.addEventListener("click",(event) => {
    event.preventDefault()
    const passwordValue = passwordInputElement.value
    const usernameValue = usernameInputElement.value
    // kiểm tra sự hợp lệ của thông tin
    if(usernameValue.length === 0){
        alert("Tên đăng nhập không được bỏ trống!")
        return
    }
    if (passwordValue.length === 0) {
        alert("Mật khẩu không được bỏ trống")
        return
    }
    // kiểm tra sự tồn tại
    const user = userLocals.find(user => user.username === usernameValue && user.password === passwordValue);
    if (!user) {
        alert("Tài khoản hoặc mật khẩu không đúng!");
        return;
    }
    alert("Đăng nhập thành công!");
    window.location = "../pages/home.html"
})

