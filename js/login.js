const usernameInputElement = document.querySelector("#usernameInput")
const passwordInputElement = document.querySelector("#passwordInput")
const confirmPasswordInputElement = document.querySelector("#confirmPasswordInput")
const loginButtonElement = document.querySelector("#loginButton")
const errorIncorrectElement = document.querySelectorAll("#errorIncorrect")
const errorEmptyElement = document.querySelectorAll("#errorEmpty")
const userLocals = JSON.parse(localStorage.getItem("users")) || []

loginButtonElement.addEventListener("click",(event) => {
    event.preventDefault()
    const passwordValue = passwordInputElement.value
    const usernameValue = usernameInputElement.value
    // kiểm tra sự hợp lệ của thông tin
    if(usernameValue.length === 0){
        errorEmptyElement[0].style.display = "block"
        usernameInputElement.classList.add(".active")
        return
    }
    if (passwordValue.length === 0) {
        errorEmptyElement[1].style.display = "block"
        passwordInputElement.classList.add(".active")
        return
    }
    // kiểm tra sự tồn tại
    const user = userLocals.find(user => user.username === usernameValue && user.password === passwordValue);
    if (!user) {
        errorIncorrectElement.forEach(element => {
            element.style.display = "block"
        });
        return
    }
    alert("Đăng nhập thành công!");
    window.location = "../pages/home.html"
})

