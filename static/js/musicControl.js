const MusicControl = {
    backgroundMusic: null, // 背景音乐元素
    musicSelect: null,     // 音乐选择下拉框元素

    // 初始化方法
    init: function() {
        // 获取 DOM 元素
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicSelect = document.getElementById('musicSelect');

        // 检查元素是否存在
        if (!this.backgroundMusic || !this.musicSelect) {
            console.error("背景音乐或音乐选择元素未找到！");
            return;
        }

        // 加载设置并绑定事件
        this.loadSettings();
        this.addEventListeners();
    },

    // 加载设置
    loadSettings: function() {
        // 从 localStorage 中获取保存的音乐，默认为 "audio/video.mp3"
        const savedMusic = localStorage.getItem("selectedMusic") || "{{ url_for('static', filename='audio/video.mp3') }}";

        // 设置下拉框的值
        this.musicSelect.value = savedMusic;

        // 如果选择的不是 "none"，则加载并播放音乐
        if (savedMusic !== "none") {
            this.backgroundMusic.src = savedMusic;
            this.backgroundMusic.play().catch(error => {
                console.error("音频播放失败:", error);
            });
        }
    },

    // 添加事件监听器
    addEventListeners: function() {
        // 监听下拉框的变化事件
        this.musicSelect.addEventListener('change', () => {
            const selectedMusic = this.musicSelect.value;

            // 更新背景音乐的源
            this.backgroundMusic.src = selectedMusic;

            // 如果选择的不是 "none"，则播放音乐
            if (selectedMusic !== "none") {
                this.backgroundMusic.play().catch(error => {
                    console.error("音频播放失败:", error);
                });
            } else {
                this.backgroundMusic.pause(); // 如果选择 "none"，暂停音乐
            }

            // 将选择的音乐保存到 localStorage
            localStorage.setItem("selectedMusic", selectedMusic);
        });
    }
};

// 在 DOM 加载完成后初始化音乐控制
document.addEventListener("DOMContentLoaded", () => MusicControl.init());