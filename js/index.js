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
        id:1,
        userId:1,
        month : "2024-03",
        categoryId:1,
        amount:150000,
        date:"2024-03-10"
    },
    {
        id:2,
        userId:1,
        month : "2024-03",
        categoryId:3,
        amount:50000,
        date:"2024-03-15"
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

// Hàm kiểm tra đã nhập thời gian chưa
const validateMonth = () => {
    const monthValue = monthInputElement.value
    if (monthValue.length === 0) {
        alert("Bạn cần nhập thời gian!")
        return
    }
}
// Hàm chỉ dùng khi tạo 1 mảng mới để kiểm tra xem mảng đó đã nhập ngân sách chưa
const validateBudget = () => {
    const budgetValue = budgetInputElement.value.trim()
    if (budgetValue.length === 0) {
        alert("Bạn cần nhập ngân sách!")
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
        console.log(monthlyCategories);
        
    }
}


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
        console.log(monthlyCategories);
        
    }
})
// Khi đổi tháng thì dữ liệu sẽ được render theo tháng đấy (Quản lí danh mục, số tuền còn lại)
monthInputElement.addEventListener("change", (event) => {
    event.preventDefault()
    remainAmountElement.textContent = "0 VND"
    const monthValue = monthInputElement.value
    const index = monthlyCategories.findIndex((element) => element.month === monthValue)
    // Nếu tháng đấy tồn tại thì render ra dữ liệu tháng đó
    if (index !== -1) {
        remainAmountElement.textContent = `${monthlyCategories[index].budget} VND`
        renderCategoriesData()    
    }
    // Nếu tháng đấy không tồn tại thì render trống 
    else{
        remainAmountElement.textContent = "0 VND"
        categoryListElement.innerHTML = ""
    }
})


// Thêm danh mục
addCategoryElement.addEventListener("click" , (event) => {
    event.preventDefault()
    validateMonth()
    const monthValue = monthInputElement.value
    const categoryNameValue = categoryNameInputElement.value.trim()
    const limitValue = limitInputElement.value.trim()
    if (categoryNameValue.length === 0) {
        alert("Bạn cần nhập tên danh mục!")
        return
    }
    if (limitValue.length === 0) {
        alert("Bạn cần nhập giới hạn của danh mục!")
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
    }
    else{
        addCategory(monthValue,categoryNameValue,limitValue)      
    }
    categoryNameInputElement.value = ""
    limitInputElement.value = ""
    renderCategoriesData()
})

// Thêm chi tiêu
addSpendingElement.addEventListener("click" ,(event) => {
    event.preventDefault()
    
})