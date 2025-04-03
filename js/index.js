const monthlyCategories = [
    {
        month : "2025-03",
        budget:50000,
        categories: [
            {
                id:1,
                name:"Ăn uống",
                limit:10000
            },
            {
                id:2,
                name:"Đi lại",
                limit:20000
            },
            {
                id:3,
                name:"Tiền nhà",
                limit:30000
            }
        ]
    },
    {
        month : "2025-04",
        budget:40000,
        categories: [
            {
                id:4,
                name:"Mua sắm",
                limit:10000
            },
            {
                id:5,
                name:"Giải trí",
                limit:20000
            },
            {
                id:6,
                name:"Ăn uống",
                limit:30000
            }
        ]
    }
]

const transactions = [
    {
        month:"2025-03",
        transaction:[
            {
                id:1,
                categoryId:1,
                note:"ok",
                amount:150000,
            },
            {
                id:2,
                categoryId:3,
                note:"hehe",
                amount:50000,
            }
        ]
    },
    {
        month:"2025-04",
        transaction:[
            {
                id:2,
                month : "2025-04",
                categoryId:4,
                note:"hihi",
                amount:50000,
            }
        ]
    }
        
        
        
]

const monthlyReports = [
    {
        userId:1,
        month:"2024-03",
        totalAmount:200000,
        details : [
            {
                categoryId:1,
                amount:150000
            },
            {
                categoryId:3,
                amount:50000
            }
        ]
    },
    {
        userId:1,
        month:"2024-04",
        totalAmount:120000,
        details : [
            {
                categoryId:4,
                amount:120000
            }
        ]
    }
]

const monthInputElement = document.querySelector("#monthInput")
const budgetInputElement = document.querySelector("#budgetInput")
const saveButtonElement = document.querySelector("#saveButton")
const remainAmountElement = document.querySelector("#remainAmount")
const categoryNameInputElement = document.querySelector("#categoryNameInput")
const limitInputElement = document.querySelector("#limitInput")
const addCategoryElement = document.querySelector("#addCategory")
const categoryListElement = document.querySelector("#categoryList")
let editIndex = -1
let editCategoryIndex = -1
const spendingMoneyInputElement = document.querySelector("#spendingMoneyInput")
const spendingOptionElement = document.querySelector("#spendingOption")
const spendingNoteInputElement = document.querySelector("#spendingNoteInput")
const addSpendingElement = document.querySelector("#addSpending")
const historyListElement = document.querySelector("#historyList")
const searchHistoryInputElement = document.querySelector("#searchHistoryInput")
const submitHistoryButtonElement = document.querySelector("#submitHistoryButton")
const logOutElement = document.querySelector("#logOut")
const userLocals = JSON.parse(localStorage.getItem("users")) || []

// Đăng xuất
logOutElement.addEventListener("click",() => {
    if (confirm("Bạn có thật sự muốn đăng xuất không!")) {
        userLocals[userLocals.length - 1].rememberLogin = 0
        localStorage.setItem("users", JSON.stringify(userLocals))
        return    
    }
})

// Hàm kiểm tra đã nhập thời gian chưa
const validateMonth = () => {
    const monthValue = monthInputElement.value
    if (monthValue.length === 0) {
        monthInputElement.classList.add("active")
        return true
    }
}
// Hàm chỉ dùng khi tạo 1 mảng mới để kiểm tra xem mảng đó đã nhập ngân sách chưa
const validateBudget = () => {
    const budgetValue = budgetInputElement.value.trim()
    if (budgetValue.length === 0) {
        budgetInputElement.classList.add("active")
        return
    }
}

// Hàm render ra dữ liệu của phần quản lý danh mục theo tháng
const renderCategoriesData = () => {
    const monthValue = monthInputElement.value
    categoryListElement.innerHTML = ""
    const categoryIndex = monthlyCategories.findIndex((element) => element.month === monthValue)
    const htmls = monthlyCategories[categoryIndex].categories.map((category) => {
        return `
            <li>
                <p>${category.name} - Giới hạn: <span id="limit">${category.limit} VND</span></p>
                <p class="function"><span class="editCategory">Sửa</span>&nbsp;&nbsp;<span class="deleteCategory">Xoá</span></p>
            </li>`
    })
    categoryListElement.innerHTML = htmls.join("")
    const deleteCategoryElements = document.querySelectorAll(".deleteCategory")
    const editCategoryElement = document.querySelectorAll(".editCategory")
    editCategoryElement.forEach((button,index) => {
        button.addEventListener("click", () => {
            handleEditCategory(index,categoryIndex)
        })
    })
    
    deleteCategoryElements.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn xoá mục này!")) {
                handleDeleteCategory(index, categoryIndex)
            }
        })
    })
}

// Hàm xoá phần tử trong quản lí danh mục
const handleDeleteCategory = (index,categoryIndex) => {
    monthlyCategories[categoryIndex].categories.splice(index,1)
    renderCategoriesData()
    renderOption()
}

// Hàm sửa phần tử trong quản lí danh mục
const handleEditCategory = (index,categoryIndex) => {
    addCategoryElement.textContent = "Lưu"
    editIndex = index
    editCategoryIndex = categoryIndex
    categoryNameInputElement.value = monthlyCategories[categoryIndex].categories[index].name
    limitInputElement.value = monthlyCategories[categoryIndex].categories[index].limit
}

// Hàm thêm phần tử vào mảng : nếu như nhập thời gian đã tồn tại thì thêm vào mảng của thời gian đó, nếu nhập thời gian mới thì tạo ra mảng mới
const addCategory = (monthValue,categoryNameValue,limitValue) => {
    const index = monthlyCategories.findIndex((element) => element.month === monthValue)
    if (index !== -1) {
        const newCategories = {
            id:Math.floor(Math.random() * 99),
            name:categoryNameValue,
            limit:+(limitValue)
        }
        monthlyCategories[index].categories.push(newCategories)
        return
    }
    else{
        validateBudget()
        const newCategories = 
        {
            month : monthValue,
            budget: 0,
            categories: [
                {
                    id:Math.floor(Math.random() * 99),
                    name:categoryNameValue,
                    limit:+(limitValue)
                }
            ]
        }
        monthlyCategories.push(newCategories)
        
    }
}

// Thêm chi tiêu
const addSpending = (monthValue,spendingMoneyValue,spendingOptionValue,spendingNoteValue,index) => {
    if (index === -1) {
        const newTransaction = {
            month: monthValue,
            transaction: [
                {
                    id:Math.floor(Math.random()*99),
                    categoryId:+(spendingOptionValue),
                    note:spendingNoteValue,
                    amount:+(spendingMoneyValue),
                }
            ]
        }
        transactions.push(newTransaction)
    }
    else{
        const newTransaction = {
            id:Math.floor(Math.random()*99),
            categoryId:+(spendingOptionValue),
            note:spendingNoteValue,
            amount:+(spendingMoneyValue),
        }
        transactions[index].transaction.push(newTransaction)
    }
}

// render dữ liệu của option trong phần thêm chi tiêu
const renderOption = () => {
    const monthValue = monthInputElement.value
    spendingOptionElement.innerHTML = ""
    const categoryIndex = monthlyCategories.findIndex((element) => element.month === monthValue)
    const htmls = monthlyCategories[categoryIndex].categories.map((category) => {
        return `
        <option value="${category.id}">${category.name}</option>`
    })
    spendingOptionElement.innerHTML = htmls.join("")
}

// render lịch sử giao dịch
const renderHistory = () => {
    const monthValue = monthInputElement.value
    historyListElement.innerHTML = ""
    const historyIndex = transactions.findIndex((element) => element.month === monthValue)
    const categoryIndex = monthlyCategories.findIndex((element) => element.month === monthValue)
    
    if (historyIndex !== -1) {
        const htmls = transactions[historyIndex].transaction.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategories[categoryIndex].categories.find((category) => category.id === transaction.categoryId)
                return `
                <li>
                    <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount} VND</span></p>
                    <p class="function"><span class="deleteHistory">Xoá</span></p>
                </li>`
            }
        })
        historyListElement.innerHTML = htmls.join("")
    }
    else{
        const htmls = []
        historyListElement.innerHTML = htmls.join("")
    }
    
    const deleteHistoryElement = document.querySelectorAll(".deleteHistory")
    deleteHistoryElement.forEach((button,index) => {
        button.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn xoá mục này!")) {
                handleDeleteHistory(index,historyIndex)
            }
        })
    });
}
// Hàm xoá lịch sử giao dịch
const handleDeleteHistory = (index, historyIndex) => {
    transactions[historyIndex].transaction.splice(index, 1)
    renderHistory()
}

// Tìm kiếm lịch sử giao dịch
const searchHistory = (searchHistoryValue) => {
    const monthValue = monthInputElement.value
    historyListElement.innerHTML = ""
    const historyIndex = transactions.findIndex((element) => element.month === monthValue)
    const categoryIndex = monthlyCategories.findIndex((element) => element.month === monthValue)
    if (historyIndex !== -1) {
        const htmls = transactions[historyIndex].transaction.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategories[categoryIndex].categories.find((category) => category.id === transaction.categoryId)
                if (category.name.toLowerCase() === searchHistoryValue.toLowerCase()) {
                    return `
                    <li>
                        <p>${category.name} - <span>${transaction.note}</span> : <span>${transaction.amount} VND</span></p>
                        <p class="function"><span class="deleteHistory">Xoá</span></p>
                    </li>`    
                }
            }
        })
        historyListElement.innerHTML = htmls.join("")
    }
    else{
        const htmls = []
        historyListElement.innerHTML = htmls.join("")
    }
    
    const deleteHistoryElement = document.querySelectorAll(".deleteHistory")
    deleteHistoryElement.forEach((button,index) => {
        button.addEventListener("click", () => {
            if (confirm("Bạn có chắc chắn muốn xoá mục này!")) {
                handleDeleteHistory(index,historyIndex)
            }
        })
    });
}


// CÁC EVENT BẤM

// Nhập ngày tháng, nhập ngân sách , in ra màn hình số ngân sách còn lại của tháng đó
remainAmountElement.textContent = "0 VND"
saveButtonElement.addEventListener("click", (event) => {
    event.preventDefault()
    const monthValue = monthInputElement.value
    const budgetValue = budgetInputElement.value.trim()
    validateMonth()
    validateBudget()
    const index = monthlyCategories.findIndex((element) => element.month === monthValue)
    if (index !== -1) {
        monthlyCategories[index].budget = +(budgetValue)
        remainAmountElement.textContent = `${monthlyCategories[index].budget} VND`
        monthInputElement.value = ""
        return
    }
    else{
        const newCategories = 
        {
            month : monthValue,
            budget:+(budgetValue),
            categories: []
        }
        monthlyCategories.push(newCategories)
        remainAmountElement.textContent = `${monthlyCategories[monthlyCategories.length-1].budget} VND`
        monthInputElement.value = ""
    }

})
// Khi đổi tháng thì dữ liệu sẽ được render theo tháng đấy (Quản lí danh mục, số tiền còn lại, lịch sử giao dịch)
monthInputElement.addEventListener("change", (event) => {
    event.preventDefault()
    monthInputElement.classList.remove("active")
    remainAmountElement.textContent = "0 VND"
    const monthValue = monthInputElement.value
    const index = monthlyCategories.findIndex((element) => element.month === monthValue)
    // Nếu tháng đấy tồn tại thì render ra dữ liệu tháng đó
    if (index !== -1) {
        // render dữ liệu vào phần tiền còn lại
        remainAmountElement.textContent = `${monthlyCategories[index].budget} VND`
        // render dữ liệu vào phần quản lí danh mục
        renderCategoriesData()    
        // render dữ liệu vào trong phần option
        renderOption()
        // render dữ liệu vào phần lịch sử giao dịch
        renderHistory()
    }
    // Nếu tháng đấy không tồn tại thì render trống 
    else{
        remainAmountElement.textContent = "0 VND"
        categoryListElement.innerHTML = ""

        // render dữ liệu vào phần lịch sử giao dịch
        renderHistory()
    }
})


// Thêm danh mục
addCategoryElement.addEventListener("click" , (event) => {
    event.preventDefault()
    if (validateMonth()) {
        return
    }
    categoryNameInputElement.classList.remove("active")
    limitInputElement.classList.remove("active")
    const monthValue = monthInputElement.value
    const categoryNameValue = categoryNameInputElement.value.trim()
    const limitValue = limitInputElement.value.trim()
    if (categoryNameValue.length === 0) {
        categoryNameInputElement.classList.add("active")
        return
    }
    if (limitValue.length === 0) {
        limitInputElement.classList.add("active")
        return
    }
    if (editIndex >= 0) {
        monthlyCategories[editCategoryIndex].categories[editIndex].name = categoryNameValue;
        monthlyCategories[editCategoryIndex].categories[editIndex].limit = limitValue;
        // Reset lại trạng thái
        editIndex = -1; 
        editCategoryIndex = -1;
        // Đổi lại nút thành Thêm
        addCategoryElement.textContent = "Thêm";
        renderOption()
    }
    else{
        addCategory(monthValue,categoryNameValue,limitValue)      
    }
    categoryNameInputElement.value = ""
    limitInputElement.value = ""
    renderCategoriesData()
    renderOption()
})

// Thêm chi tiêu
addSpendingElement.addEventListener("click" ,(event) => {
    event.preventDefault()
    validateMonth()
    const monthValue = monthInputElement.value
    const spendingMoneyValue = spendingMoneyInputElement.value.trim()
    const spendingOptionValue = spendingOptionElement.value
    const spendingNoteValue = spendingNoteInputElement.value.trim()
    const index = transactions.findIndex((transaction) => transaction.month === monthValue)
    spendingMoneyInputElement.classList.remove("active")
    if (spendingMoneyValue.length === 0) {
        spendingMoneyInputElement.classList.add("active")
        return
    }
    addSpending(monthValue,spendingMoneyValue,spendingOptionValue,spendingNoteValue,index)
    spendingMoneyInputElement.value = ""
    spendingNoteInputElement.value = ""
    renderHistory()
})

submitHistoryButtonElement.addEventListener("click",(event) => {
    event.preventDefault()
    searchHistoryInputElement.classList.remove("active")
    const searchHistoryValue = searchHistoryInput.value.trim()
    if (searchHistoryValue.length === 0) {
        searchHistoryInputElement.classList.add("active")
        return
    }
    searchHistory(searchHistoryValue)
})

