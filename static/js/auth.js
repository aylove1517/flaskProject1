document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // 检查用户是否已登录
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // 更新按钮状态
    if (isLoggedIn) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline";
    } else {
        loginBtn.style.display = "inline";
        logoutBtn.style.display = "none";
    }

    // 登录按钮点击事件
    loginBtn.addEventListener("click", function (e) {
        e.preventDefault(); // 阻止默认跳转行为
        // 跳转到登录页面
        window.location.href = "/login";
    });

    // 注销按钮点击事件
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault(); // 阻止默认跳转行为
        // 清除登录状态
        localStorage.setItem("isLoggedIn", "false");
        // 刷新页面
        window.location.reload();
    });
});