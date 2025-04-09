const monthlyCategories = [
    {
        month : "2025-03",
        budget:1000000,
        remainMoney: 1000000,
        categories: [
            {
                id:1,
                name:"Ăn uống",
                limit:15000
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
        budget:2000000,
        remainMoney: 2000000,
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
                amount:15000,
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
                id:3,
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
        month:"2025-03",
        totalAmount:200000,
        details : [
            {
                categoryId:1,
                amount:15000
            },
            {
                categoryId:3,
                amount:50000
            }
        ]
    },
    {
        month:"2025-04",
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
const openModalLogOutElement = document.querySelector("#openModal")
const modalLogOutElement = document.querySelector("#modal")
const logOutButtonElement = document.querySelector("#logOutButton")
const cancelLogOutElement = document.querySelector("#cancelLogOutButton")
const overlayElement = document.querySelector(".overlay")
const sortElement = document.querySelector("#sort")
const paginationElement = document.querySelector(".pagination")
const paginationButtonElement = document.querySelectorAll(".page-item")
const errorElement = document.querySelector("#error")
const perPage = 3;
const statisticsSpendingBodyElement = document.querySelector("#statisticsSpendingBody")
const userLocals = JSON.parse(localStorage.getItem("users")) || []
let monthlyCategoriesLocals = JSON.parse(localStorage.getItem("monthlyCategories")) || []
let transactionsLocals = JSON.parse(localStorage.getItem("transactions")) || []
let monthlyReportsLocals = JSON.parse(localStorage.getItem("monthlyReports")) || []
const saveLocals = () => {
    localStorage.setItem("monthlyCategories",JSON.stringify(monthlyCategoriesLocals))
    localStorage.setItem("transactions",JSON.stringify(transactionsLocals))
    localStorage.setItem("monthlyReports",JSON.stringify(monthlyReportsLocals))
}
if (monthlyCategoriesLocals.length === 0 && transactionsLocals.length === 0 && monthlyReportsLocals.length === 0) {
    monthlyCategoriesLocals = [...monthlyCategories]
    transactionsLocals = [...transactions]
    monthlyReportsLocals = [...monthlyReports]
    saveLocals()
}
saveLocals()

// Đăng xuất
openModalLogOutElement.addEventListener("click",(event)=>{
    event.preventDefault()
    Swal.fire({
        title: "Bạn có chắc chắn muốn đăng xuất!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đúng, tôi muốn đăng xuất!",
        cancelButtonText:"Huỷ"
      }).then((result) => {
        if (result.isConfirmed) {
            userLocals[userLocals.length - 1].rememberLogin = 0
            localStorage.setItem("users", JSON.stringify(userLocals))
            window.location = "../pages/login.html"
        }
      });
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
    if (budgetValue.length === 0 || budgetValue < 0) {
        budgetInputElement.classList.add("active")
        return
    }
}

// Hàm render ra dữ liệu của phần quản lý danh mục theo tháng
const renderCategoriesData = (monthValue) => {
    categoryListElement.innerHTML = ""
    const categoryIndex = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    const htmls = monthlyCategoriesLocals[categoryIndex].categories.map((category) => {
        return `
            <li>
                <p>${category.name} - Giới hạn: <span id="limit">${category.limit.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span></p>
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
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá mục này không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, tôi chắc chắn muốn xoá",
                cancelButtonText: "Huỷ"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã xoá thành công!",
                    icon: "success"
                  });
                  handleDeleteCategory(index, categoryIndex,monthValue)
                }
              });
            
        })
    })
}

// Hàm xoá phần tử trong quản lí danh mục
const handleDeleteCategory = (index,categoryIndex,monthValue) => {
    monthlyCategoriesLocals[categoryIndex].categories.splice(index,1)
    renderCategoriesData(monthValue)
    renderOption(monthValue)
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue)
    handleDeleteHistory(index,historyIndex,monthValue)
    currentPage = 1;
    renderPaginatedHistory(currentPage);
    
}

// Hàm sửa phần tử trong quản lí danh mục
const handleEditCategory = (index,categoryIndex) => {
    addCategoryElement.textContent = "Lưu"
    editIndex = index
    editCategoryIndex = categoryIndex
    categoryNameInputElement.value = monthlyCategoriesLocals[categoryIndex].categories[index].name
    limitInputElement.value = monthlyCategoriesLocals[categoryIndex].categories[index].limit
}

// Hàm thêm phần tử vào mảng : nếu như nhập thời gian đã tồn tại thì thêm vào mảng của thời gian đó, nếu nhập thời gian mới thì tạo ra mảng mới
const addCategory = (monthValue,categoryNameValue,limitValue) => {
    const index = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    if (index !== -1) {
        const newCategories = {
            id:Math.floor(Math.random() * 99),
            name:categoryNameValue,
            limit:+(limitValue)
        }
        monthlyCategoriesLocals[index].categories.push(newCategories)
        localStorage.setItem("monthlyCategories",JSON.stringify(monthlyCategoriesLocals))
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
        monthlyCategoriesLocals.push(newCategories)
        localStorage.setItem("monthlyCategories",JSON.stringify(monthlyCategoriesLocals))
        
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
        transactionsLocals.push(newTransaction)
        localStorage.setItem("transactions",JSON.stringify(transactionsLocals))
        addReport(monthValue,newTransaction.transaction[0].categoryId,newTransaction.transaction[0].amount)
    }
    else{
        const newTransaction = {
            id:Math.floor(Math.random()*99),
            categoryId:+(spendingOptionValue),
            note:spendingNoteValue,
            amount:+(spendingMoneyValue),
        }
        transactionsLocals[index].transaction.push(newTransaction)
        localStorage.setItem("transactions",JSON.stringify(transactionsLocals))
        addReport(monthValue,newTransaction.categoryId,newTransaction.amount)
    }
}

// render dữ liệu của option trong phần thêm chi tiêu
const renderOption = (monthValue) => {
    spendingOptionElement.innerHTML = ""
    const categoryIndex = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    const htmls = monthlyCategoriesLocals[categoryIndex].categories.map((category) => {
        return `
        <option value="${category.id}">${category.name}</option>`
    })
    spendingOptionElement.innerHTML = htmls.join("")
}

// render lịch sử giao dịch
const renderHistory = () => {
    const monthValue = monthInputElement.value
    historyListElement.innerHTML = ""
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue)
    const categoryIndex = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    
    if (historyIndex !== -1) {
        const htmls = transactionsLocals[historyIndex].transaction.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategoriesLocals[categoryIndex].categories.find((category) => category.id === transaction.categoryId)
                return `
                <li>
                    <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span></p>
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
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá mục này không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, tôi chắc chắn muốn xoá",
                cancelButtonText: "Huỷ"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã xoá thành công!",
                    icon: "success"
                  });
                  handleDeleteHistory(index,historyIndex,monthValue)
                }
              });
        })
    });
}
// Hàm xoá lịch sử giao dịch
const handleDeleteHistory = (index, historyIndex,monthValue) => {
    transactionsLocals[historyIndex].transaction.splice(index, 1)
    renderHistory()
    budgetWarning(monthValue)
}

// Tìm kiếm lịch sử giao dịch
const searchHistory = (searchHistoryValue) => {
    const monthValue = monthInputElement.value
    historyListElement.innerHTML = ""
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue)
    const categoryIndex = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    if (historyIndex !== -1) {
        const htmls = transactionsLocals[historyIndex].transaction.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategoriesLocals[categoryIndex].categories.find((category) => category.id === transaction.categoryId)
                if (category.name.toLowerCase() === searchHistoryValue.toLowerCase()) {
                    return `
                    <li>
                        <p>${category.name} - <span>${transaction.note}</span> : <span>${transaction.amount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span></p>
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
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá mục này không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, tôi chắc chắn muốn xoá",
                cancelButtonText: "Huỷ"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã xoá thành công!",
                    icon: "success"
                  });
                  handleDeleteHistory(index,historyIndex,monthValue)
                }
              });
        })
    });
}

// sắp xếp lịch sử giao dịch
const sortHistory = (sortValue) => {
    const monthValue = monthInputElement.value
    historyListElement.innerHTML = ""
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue)
    const categoryIndex = monthlyCategories.findIndex((element) => element.month === monthValue)
    if (sortValue == 1) {
        transactionsLocals[historyIndex].transaction.sort((a, b) => b.amount - a.amount);
    } else if (sortValue == 2) {
        transactionsLocals[historyIndex].transaction.sort((a, b) => a.amount - b.amount);
    }

    if (historyIndex !== -1) {
        const htmls = transactionsLocals[historyIndex].transaction.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategories[categoryIndex].categories.find((category) => category.id === transaction.categoryId);
                return `
                <li>
                    <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span></p>
                    <p class="function"><span class="deleteHistory">Xoá</span></p>
                </li>`;
            }
        });
        historyListElement.innerHTML = htmls.join("");
    }

    const deleteHistoryElement = document.querySelectorAll(".deleteHistory");
    deleteHistoryElement.forEach((button, index) => {
        button.addEventListener("click", () => {
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá mục này không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, tôi chắc chắn muốn xoá",
                cancelButtonText: "Huỷ"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã xoá thành công!",
                    icon: "success"
                  });
                  handleDeleteHistory(index,historyIndex,monthValue)
                }
              });
        });
    });
}

// Hàm render lịch sử giao dịch với phân trang
const renderPaginatedHistory = (page) => {
    const monthValue = monthInputElement.value;
    historyListElement.innerHTML = "";
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue);
    const categoryIndex = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue);
    
    if (historyIndex !== -1) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedTransactions = transactionsLocals[historyIndex].transaction.slice(start, end);

        const htmls = paginatedTransactions.map((transaction) => {
            if (categoryIndex !== -1) {
                const category = monthlyCategoriesLocals[categoryIndex].categories.find((category) => category.id === transaction.categoryId);
                return `
                <li>
                    <p>${category.name} - <span>${transaction.note ? transaction.note : ""}</span> : <span>${transaction.amount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span></p>
                    <p class="function"><span class="deleteHistory">Xoá</span></p>
                </li>`;
            }
        });
        historyListElement.innerHTML = htmls.join("");
    }

    const deleteHistoryElement = document.querySelectorAll(".deleteHistory");
    deleteHistoryElement.forEach((button, index) => {
        button.addEventListener("click", () => {
            Swal.fire({
                title: "Bạn có chắc chắn muốn xoá mục này không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đúng, tôi chắc chắn muốn xoá",
                cancelButtonText: "Huỷ"
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: "Đã xoá thành công!",
                    icon: "success"
                  });
                  handleDeleteHistory(index,historyIndex,monthValue)
                }
              });
        });
    });

    renderPaginationControls();
};

// Hàm render các nút phân trang
const renderPaginationControls = () => {
    const monthValue = monthInputElement.value;
    const historyIndex = transactionsLocals.findIndex((element) => element.month === monthValue);

    if (historyIndex !== -1) {
        const totalTransactions = transactionsLocals[historyIndex].transaction.length;
        const totalPages = Math.ceil(totalTransactions / perPage);

        paginationElement.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            paginationElement.innerHTML += `<li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
        }

        const pageLinks = document.querySelectorAll(".page-item");
        pageLinks.forEach((link, index) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                currentPage = index + 1;
                renderPaginatedHistory(currentPage);
            });
        });
    }
};

// hiện cảnh báo nếu giao dịch quá limit của danh mục ấy
const budgetWarning = (monthValue) => {
    // Tìm dữ liệu tháng
    const monthCategoriesIndex = monthlyCategoriesLocals.findIndex(category => category.month === monthValue);
    const monthTransactionIndex = transactionsLocals.findIndex(transaction => transaction.month === monthValue);
    // lấy ra mảng tại thời gian đã tìm
    const currentTransaction = transactionsLocals[monthTransactionIndex].transaction;
    const currentCategory = monthlyCategoriesLocals[monthCategoriesIndex].categories;

    let warningMessages = [];

    for (let i = 0; i < currentCategory.length; i++) {
        // lấy ra sản phẩm thứ i trong mảng 
        const category = currentCategory[i];
        
        // lọc các giao dịch có cùng 1 danh mục
        const transactionFilter = currentTransaction.filter((transaction) => transaction.categoryId === category.id);
        
        // nếu không có giao dịch nào thì bỏ qua
        if (transactionFilter.length === 0) continue;

        // tính tổng amount
        const sum = transactionFilter.reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);

        // kiểm tra vượt giới hạn
        if (sum > category.limit) {
            // nếu thoả mãn thì thêm vào warningMessages
            warningMessages.push(`<p class="errorContent">Danh mục <span>"${category.name}"</span> đã vượt quá giới hạn: ${sum} / ${category.limit}</p>`)
        }
    }

    // render dữ liệu nếu thoả mãn
    if (warningMessages.length !== 0) {
        errorElement.innerHTML = warningMessages.join("");
        errorElement.classList.add("active");
    } else {
        errorElement.innerHTML = "";
        errorElement.classList.remove("active");
    }
};

// thêm chi tiêu vào trong thống kê các tháng
const addReport = (monthValue,categoryId,categoryAmount) => {
    const monthReportIndex = monthlyReportsLocals.findIndex((element) => element.month === monthValue)
    if (monthReportIndex !== -1) {
        const newReport = {
            categoryId:categoryId,
            amount:categoryAmount
        }
        monthlyReportsLocals[monthReportIndex].details.push(newReport)
        localStorage.setItem("monthlyReports",JSON.stringify(monthlyReportsLocals))
    }
    else{
        const newReport = {
            month:monthValue,
            totalAmount:0,
            details : [
                {
                    categoryId:categoryId,
                    amount:categoryAmount
                }
            ]
        }
        monthlyReportsLocals.push(newReport)
        localStorage.setItem("monthlyReports",JSON.stringify(monthlyReportsLocals))
    }
}

// hàm kiểm tra số chi tiêu có vượt quá ngân sách không
const spendingStatisticsCheck = (monthValue) => {
    const monthCategoriesItem = monthlyCategoriesLocals.find((element) => element.month === monthValue)
    const monthlyReportsItem = monthlyReportsLocals.find((element) => element.month === monthValue)
    const sum = monthlyReportsItem.details.reduce((total, report) => total + report.amount, 0);
    monthlyReportsItem.totalAmount = sum
    if (sum < monthCategoriesItem.budget ) {
        return true
    }
    else{
        return false
    }
}

const monthlySpendingStatistics = () => {
    statisticsSpendingBodyElement.innerHTML = ""
    const htmls = monthlyReportsLocals.map((element)=> {
        const monthCategoriesItem = monthlyCategories.find((item) => item.month === element.month)
        spendingStatisticsCheck(element.month)
        return`
            <tr>
                <td>${element.month}</td>
                <td>${element.totalAmount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
                <td>${monthCategoriesItem.budget.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</td>
                <td class="pass">${spendingStatisticsCheck(element.month) ? `✅ Đạt` : `Vượt`}</td>
            </tr>`
    })
    statisticsSpendingBodyElement.innerHTML += htmls.join("")
}

const firstRender = (index,monthValue) => {
        if (index !== -1) {
            // render dữ liệu vào phần tiền còn lại
            remainAmountElement.textContent = `${monthlyCategoriesLocals[index].budget.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`
            // render dữ liệu vào phần quản lí danh mục
            renderCategoriesData(monthValue)    
            // render dữ liệu vào trong phần option
            renderOption(monthValue)
            // render dữ liệu vào phần lịch sử giao dịch
            currentPage = 1;
            renderPaginatedHistory(currentPage);
        }
        // Nếu tháng đấy không tồn tại thì render trống 
        else{
            remainAmountElement.textContent = "0 VND"
            categoryListElement.innerHTML = ""
            historyListElement.innerHTML = "";
            paginationElement.innerHTML = "";
        }
}
    
    // hàm sẽ lấy ra ngày hôm nay và render ra dữ liệu của ngày hôm nay
const load = () => {
    const date = new Date()
    let year = date.getFullYear().toString()
    let month = (date.getMonth()+1).toString()
    if (month < 10) {
        month = `0` + month
    }
    monthInputElement.value = year + "-" + month
    const monthValue = year + "-" + month
    
    const index = monthlyCategories.findIndex((element) => element.month === monthValue)
    
    remainAmountElement.textContent = "0 VND"
    // Nếu tháng đấy tồn tại thì render ra dữ liệu tháng đó
    if (index !== -1) {
        firstRender(index,monthValue)
        monthlySpendingStatistics()
    }
    saveLocals()
}

// CÁC EVENT KHI THAO TÁC VÀ SỰ KIỆN SẼ CHẠY KHI VỪA VÀO WEB
budgetInputElement.textContent = "0 VND"
load()

// bắt đầu vào web thì sẽ cập nhật monthValue = ngày hôm nay

// bắt đầu vào web sẽ render thống kê chi tiêu các tháng

// Nhập ngày tháng, nhập ngân sách , in ra màn hình số ngân sách còn lại của tháng đó
saveButtonElement.addEventListener("click", (event) => {
    event.preventDefault()
    const monthValue = monthInputElement.value
    const budgetValue = budgetInputElement.value.trim()
    validateMonth()
    validateBudget()
    const index = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    if (index !== -1) {
        monthlyCategoriesLocals[index].budget = +(budgetValue)
        monthlyCategoriesLocals[index].remainMoney = +(budgetValue)
        remainAmountElement.textContent = `${monthlyCategoriesLocals[index].budget.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`
        monthInputElement.value = ""
        return
    }
    else{
        const newCategories = 
        {
            month : monthValue,
            budget:+(budgetValue),
            remainMoney: +(budgetValue),
            categories: []
        }
        monthlyCategoriesLocals.push(newCategories)
        localStorage.setItem("monthlyCategories",JSON.stringify(monthlyCategoriesLocals))
        remainAmountElement.textContent = `${monthlyCategoriesLocals[monthlyCategoriesLocals.length-1].budget.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`
    }
    console.log(monthValue);
    
})

// Khi đổi tháng thì dữ liệu sẽ được render theo tháng đấy (Quản lí danh mục, số tiền còn lại, lịch sử giao dịch)
monthInputElement.addEventListener("change", (event) => {
    event.preventDefault()
    monthInputElement.classList.remove("active")
    remainAmountElement.textContent = "0 VND"
    const monthValue = monthInputElement.value
    const index = monthlyCategoriesLocals.findIndex((element) => element.month === monthValue)
    // Nếu tháng đấy tồn tại thì render ra dữ liệu tháng đó
    if (index !== -1) {
        // render dữ liệu vào phần tiền còn lại
        remainAmountElement.textContent = `${monthlyCategoriesLocals[index].budget.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`
        // render dữ liệu vào phần quản lí danh mục
        renderCategoriesData(monthValue)    
        // render dữ liệu vào trong phần option
        renderOption(monthValue)
        // render dữ liệu vào phần lịch sử giao dịch
        currentPage = 1;
        renderPaginatedHistory(currentPage);
    }
    // Nếu tháng đấy không tồn tại thì render trống 
    else{
        remainAmountElement.textContent = "0 VND"
        categoryListElement.innerHTML = ""
        historyListElement.innerHTML = "";
        paginationElement.innerHTML = "";
    }
    monthlySpendingStatistics()
    saveLocals()
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
    if (limitValue.length === 0 || limitValue < 0) {
        limitInputElement.classList.add("active")
        return
    }
    if (editIndex >= 0) {
        monthlyCategoriesLocals[editCategoryIndex].categories[editIndex].name = categoryNameValue;
        monthlyCategoriesLocals[editCategoryIndex].categories[editIndex].limit = limitValue;
        // Reset lại trạng thái
        editIndex = -1; 
        editCategoryIndex = -1;
        // Đổi lại nút thành Thêm
        addCategoryElement.textContent = "Thêm";
        renderOption(monthValue)
    }
    else{
        addCategory(monthValue,categoryNameValue,limitValue)      
    }
    categoryNameInputElement.value = ""
    limitInputElement.value = ""
    renderCategoriesData(monthValue)
    renderOption(monthValue)
    saveLocals()
})

// Thêm chi tiêu
addSpendingElement.addEventListener("click" ,(event) => {
    event.preventDefault()
    if (validateMonth()) {
        return
    }
    const monthValue = monthInputElement.value
    const spendingMoneyValue = spendingMoneyInputElement.value.trim()
    const spendingOptionValue = spendingOptionElement.value
    const spendingNoteValue = spendingNoteInputElement.value.trim()
    const index = transactionsLocals.findIndex((transaction) => transaction.month === monthValue)
    spendingMoneyInputElement.classList.remove("active")
    if (spendingMoneyValue.length === 0 || spendingMoneyValue < 0) {
        spendingMoneyInputElement.classList.add("active")
        return
    }
    addSpending(monthValue,spendingMoneyValue,spendingOptionValue,spendingNoteValue,index)
    spendingMoneyInputElement.value = ""
    spendingNoteInputElement.value = ""
    currentPage = 1;
    renderPaginatedHistory(currentPage);
    budgetWarning(monthValue)
    saveLocals()
})

// nút tìm kiếm sản phẩm trong lịch sử giao dịch
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

// sắp xếp lịch sử giao dịch theo giá
sortElement.addEventListener("change",(event) => {
    event.preventDefault()
    validateMonth()
    const sortValue = sortElement.value
    sortHistory(sortValue)
})

