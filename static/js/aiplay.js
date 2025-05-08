var aiPlay = aiPlay || {};

// 添加游戏状态控制变量
aiPlay.gameInterval = null;
aiPlay.isAutoPlaying = false;

aiPlay.init = function (depth, map) {
    var map = map || com.initMap;
    var depth = depth || 3;
    aiPlay.my = -1; // AI方
    aiPlay.nowMap = map;
    aiPlay.map = com.arr2Clone(map); // 初始化棋盘
    aiPlay.nowManKey = false; // 当前要操作的棋子
    aiPlay.pace = []; // 记录每一步
    aiPlay.isPlay = true; // 是否能走棋

    aiPlay.bylaw = com.bylaw;
    aiPlay.show = com.show;
    aiPlay.showPane = com.showPane;
    aiPlay.isOffensive = false; // AI方不是先手
    aiPlay.depth = depth; // 搜索深度
    aiPlay.isFoul = false; // 是否犯规长将
    com.pane.isShow = false; // 隐藏方块

    // 清除所有旗子
    aiPlay.mans = com.mans = {};

    com.childList.length = 3;

    com.createMans(map); // 生成棋子
    com.bg.show();

    // 初始化棋子
    for (let i = 0; i < aiPlay.map.length; i++) {
        for (let n = 0; n < aiPlay.map[i].length; n++) {
            const key = aiPlay.map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }
    aiPlay.show();

    // 绑定点击事件
    // com.canvas.addEventListener("click", aiPlay.clickCanvas);
}

// 开始自动对局
aiPlay.startAutoPlay = function() {
    if (aiPlay.isAutoPlaying) return;

    aiPlay.isAutoPlaying = true;
    aiPlay.isPlay = true;

    // 如果是新游戏，玩家先走
    if (aiPlay.pace.length === 0) {
        aiPlay.my = -1; // 玩家方
    } else {
        // 根据最后一步判断该谁走
        aiPlay.my = aiPlay.pace.length % 2 === 0 ? -1 : 1;
    }

    // 设置定时器自动走棋
    aiPlay.gameInterval = setInterval(function() {
        if (!aiPlay.isPlay) {
            clearInterval(aiPlay.gameInterval);
            return;
        }

        if (aiPlay.my === 1) {
            // AI走棋
            aiPlay.AIPlay();
        } else {
            // 玩家走棋 - 这里可以添加提示或等待玩家操作
            // 在实际应用中，你可能需要让玩家点击棋盘走棋
            // 这里简化处理，直接让AI走下一步
            aiPlay.my = 1;
        }
    }, 1500); // 每1.5秒走一步
};

// 暂停自动对局
aiPlay.pauseAutoPlay = function() {
    aiPlay.isAutoPlaying = false;
    aiPlay.isPlay = false;
    if (aiPlay.gameInterval) {
        clearInterval(aiPlay.gameInterval);
        aiPlay.gameInterval = null;
    }
};

// 重置游戏
aiPlay.resetGame = function() {
    aiPlay.pauseAutoPlay();
    aiPlay.init(aiPlay.depth);
};

// 修改后的AI自动走棋函数
aiPlay.AIPlay = function () {
    if (!aiPlay.isPlay) return;

    aiPlay.my = 1;
    const pace = AI.init(aiPlay.pace.join(""));
    if (!pace) {
        aiPlay.showWin(1);
        aiPlay.pauseAutoPlay();
        return;
    }
    aiPlay.pace.push(pace.join(""));
    let key = aiPlay.map[pace[1]][pace[0]];
    aiPlay.nowManKey = key;

    key = aiPlay.map[pace[3]][pace[2]];
    if (key) {
        aiPlay.AIclickMan(key, pace[2], pace[3]);
    } else {
        aiPlay.AIclickPoint(pace[2], pace[3]);
    }
    com.get("clickAudio").play();

    // 切换走棋方
    aiPlay.my = -1;
}

// AI 方点击棋子
aiPlay.AIclickMan = function (key, x, y) {
    const man = com.mans[key];
    // 吃子
    man.isShow = false;
    delete aiPlay.map[com.mans[aiPlay.nowManKey].y][com.mans[aiPlay.nowManKey].x];
    aiPlay.map[y][x] = aiPlay.nowManKey;
    aiPlay.showPane(com.mans[aiPlay.nowManKey].x, com.mans[aiPlay.nowManKey].y, x, y);

    com.mans[aiPlay.nowManKey].x = x;
    com.mans[aiPlay.nowManKey].y = y;
    aiPlay.nowManKey = false;

    com.show();
    if (key === "j0") aiPlay.showWin(-1);
    if (key === "J0") aiPlay.showWin(1);
}

// AI 方点击着点
aiPlay.AIclickPoint = function (x, y) {
    const key = aiPlay.nowManKey;
    const man = com.mans[key];
    if (aiPlay.nowManKey) {
        delete aiPlay.map[com.mans[aiPlay.nowManKey].y][com.mans[aiPlay.nowManKey].x];
        aiPlay.map[y][x] = key;

        aiPlay.showPane(man.x, man.y, x, y);

        man.x = x;
        man.y = y;
        aiPlay.nowManKey = false;
    }
    com.show();
}

// AI 方判断是否犯规
aiPlay.checkFoul = function () {
    var p = aiPlay.pace;
    var len = parseInt(p.length, 10);
    if (len > 11 && p[len - 1] === p[len - 5] && p[len - 5] === p[len - 9]) {
        return p[len - 4].split("");
    }
    return false;
}

// AI 方点击事件
aiPlay.clickCanvas = function (e) {
    if (!aiPlay.isPlay) return false;
    var key = aiPlay.getClickMan(e);
    var point = aiPlay.getClickPoint(e);

    var x = point.x;
    var y = point.y;

    if (key) {
        aiPlay.clickMan(key, x, y);
    } else {
        aiPlay.clickPoint(x, y);
    }
    aiPlay.isFoul = aiPlay.checkFoul(); // 检测是否是长将
}

// 点击棋子，AI 选择棋子或吃子
aiPlay.clickMan = function (key, x, y) {
    var man = com.mans[key];
    // 吃子
    if (aiPlay.nowManKey && aiPlay.nowManKey !== key && man.my !== com.mans[aiPlay.nowManKey].my) {
        if (aiPlay.indexOfPs(com.mans[aiPlay.nowManKey].ps, [x, y])) {
            man.isShow = false;
            var pace = com.mans[aiPlay.nowManKey].x + "" + com.mans[aiPlay.nowManKey].y;
            delete aiPlay.map[com.mans[aiPlay.nowManKey].y][com.mans[aiPlay.nowManKey].x];
            aiPlay.map[y][x] = aiPlay.nowManKey;
            aiPlay.showPane(com.mans[aiPlay.nowManKey].x, com.mans[aiPlay.nowManKey].y, x, y);
            com.mans[aiPlay.nowManKey].x = x;
            com.mans[aiPlay.nowManKey].y = y;
            com.mans[aiPlay.nowManKey].alpha = 1;

            aiPlay.pace.push(pace + x + y);
            aiPlay.nowManKey = false;
            com.pane.isShow = false;
            com.dot.dots = [];
            com.show();
            com.get("clickAudio").play();
            setTimeout(aiPlay.AIPlay, 500);
            if (key === "j0") aiPlay.showWin(-1);
            if (key === "J0") aiPlay.showWin(1);
        }
    } else {
        if (man.my === -1) {
            if (com.mans[aiPlay.nowManKey]) com.mans[aiPlay.nowManKey].alpha = 1;
            man.alpha = 0.8;
            com.pane.isShow = false;
            aiPlay.nowManKey = key;
            com.mans[key].ps = com.mans[key].bl(); // 获取所有能着点
            com.dot.dots = com.mans[key].ps;
            com.show();
            com.get("selectAudio").play();
        }
    }
}

// 点击着点，AI 移动棋子
aiPlay.clickPoint = function (x, y) {
    var key = aiPlay.nowManKey;
    var man = com.mans[key];
    if (aiPlay.nowManKey) {
        if (aiPlay.indexOfPs(com.mans[key].ps, [x, y])) {
            var pace = man.x + "" + man.y;
            delete aiPlay.map[man.y][man.x];
            aiPlay.map[y][x] = key;
            aiPlay.showPane(man.x, man.y, x, y);
            man.x = x;
            man.y = y;
            man.alpha = 1;
            aiPlay.pace.push(pace + x + y);
            aiPlay.nowManKey = false;
            com.dot.dots = [];
            com.show();
            com.get("clickAudio").play();
            setTimeout(aiPlay.AIPlay, 500);
        }
    }
}

// AI 方获取点击的着点
aiPlay.getClickPoint = function (e) {
    const domXY = com.getDomXY(com.canvas);
    const x = Math.round((e.pageX - domXY.x - com.pointStartX - 20) / com.spaceX);
    const y = Math.round((e.pageY - domXY.y - com.pointStartY - 20) / com.spaceY);
    return { "x": x, "y": y };
}

// 获取点击的棋子
aiPlay.getClickMan = function (e) {
    const clickXY = aiPlay.getClickPoint(e);
    const x = clickXY.x;
    const y = clickXY.y;
    if (x < 0 || x > 8 || y < 0 || y > 9) return false;
    return (aiPlay.map[y][x] && aiPlay.map[y][x] !== "0") ? aiPlay.map[y][x] : false;
}

// 判断点击的着点是否在棋子的可能着点范围内
aiPlay.indexOfPs = function (ps, xy) {
    for (var i = 0; i < ps.length; i++) {
        if (ps[i][0] === xy[0] && ps[i][1] === xy[1]) return true;
    }
    return false;
}

aiPlay.showWin = function (my) {
    aiPlay.isPlay = false;
    if (my === -1) {
        alert("AI 赢了！");
    } else {
        alert("AI 输了！");
    }
}

// **开始游戏（人机对弈）**
function startAIPlay() {
    if (!aiPlay) {
        console.error("play 对象未定义");
        return;
    }

    const depth = parseInt(getRadioValue("depth"), 10) || 3;
    aiPlay.init(depth);

    // 添加控制按钮
    const controlDiv = document.createElement('div');
    controlDiv.style.margin = '10px';
    controlDiv.innerHTML = `
        <button id="startBtn">开始自动对局</button>
        <button id="pauseBtn">暂停</button>
        <button id="resetBtn">重置</button>
    `;
    document.getElementById('chessBox').appendChild(controlDiv);

    // 绑定按钮事件
    document.getElementById('startBtn').addEventListener('click', function() {
        aiPlay.startAutoPlay();
    });

    document.getElementById('pauseBtn').addEventListener('click', function() {
        aiPlay.pauseAutoPlay();
    });

    document.getElementById('resetBtn').addEventListener('click', function() {
        aiPlay.resetGame();
    });

    com.get("chessBox").style.display = "block";
    com.get("menuBox").style.display = "none";
}