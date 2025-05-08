// 获取 DOM 元素
const nameDisplay = document.getElementById('nameDisplay');
const nameInput = document.getElementById('nameInput');
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');

// 页面加载时，从 localStorage 获取保存的名称
window.onload = function() {
    const savedName = localStorage.getItem('settingName');
    if (savedName) {
        nameDisplay.textContent = savedName; // 显示保存的名称
    }
};

// 点击“修改”按钮时，显示输入框和“保存”按钮，隐藏“修改”按钮
editBtn.addEventListener('click', function() {
    nameInput.style.display = 'inline';    // 显示输入框
    saveBtn.style.display = 'inline';      // 显示保存按钮
    editBtn.style.display = 'none';        // 隐藏修改按钮
    nameInput.value = nameDisplay.textContent; // 设置输入框初始值为当前名称
});

// 点击“保存”按钮时，保存新名称并隐藏输入框，恢复“修改”按钮
saveBtn.addEventListener('click', function() {
    const newName = nameInput.value;
    if (newName) {
        nameDisplay.textContent = newName;  // 更新显示的名称
        localStorage.setItem('settingName', newName);  // 保存到 localStorage
        nameInput.style.display = 'none';   // 隐藏输入框
        saveBtn.style.display = 'none';     // 隐藏保存按钮
        editBtn.style.display = 'inline';   // 恢复显示修改按钮
        alert('名称已保存');
    } else {
        alert('请输入新名称');
    }
});
