var bill = bill || {};

// 初始化
bill.init = function () {
    if (com.store) {
        clearInterval(bill.timer); // 清除定时器
        bill.setBillList(com.arr2Clone(com.initMap)); // 写入棋谱列表
        play.isPlay = false; // 停止游戏
        com.show(); // 刷新显示
    } else {
        bill.timer = setInterval("bill.init()", 300); // 设置定时器，每隔 300ms 检查一次
    }
};

// 把所有棋谱写入棋谱列表
bill.setBillList = function (map) {
    const list = com.get("billList"); // 获取棋谱列表 DOM 元素

    // 遍历棋谱库，生成选项
    for (let i = 0; i < com.store.length; i++) {
        const option = document.createElement("option");
        option.text = `棋谱${i + 1}`;
        option.value = `${i}`;
        list.add(option, null);
    }

    // 绑定棋谱选择事件
    list.addEventListener("change", function (e) {
        bill.setBox(com.store[this.value], map); // 根据选择的棋谱更新显示
    });

    // 默认显示第一个棋谱
    bill.setBox(com.store[0], map);
};

// 棋谱分析，写入棋盘
bill.setMove = function (bl, inx, originalMap) {
    const map = com.arr2Clone(originalMap); // 克隆初始棋盘

    // 初始化棋盘上的所有棋子
    for (let i = 0; i < map.length; i++) {
        for (let n = 0; n < map[i].length; n++) {
            const key = map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }

    // 遍历棋谱，执行每一步走法
    for (let i = 0; i <= inx; i++) {
        const n = i * 4;
        const y = bl[n + 1];
        const newX = bl[n + 2];
        const x = bl[n];
        const newY = bl[n + 3];

        // 如果目标位置有棋子，隐藏该棋子
        if (com.mans[map[newY][newX]]) {
            com.mans[map[newY][newX]].isShow = false;
        }

        // 移动棋子
        com.mans[map[y][x]].x = newX;
        com.mans[map[y][x]].y = newY;

        // 如果是当前步，显示移动效果
        if (i === inx) {
            com.showPane(x, y, newX, newY);
        }

        // 更新棋盘状态
        map[newY][newX] = map[y][x];
        delete map[y][x];
    }

    return map; // 返回更新后的棋盘
};

// 写入棋谱到棋谱框
bill.setBox = function (bl, initMap) {
    const map = com.arr2Clone(initMap); // 克隆初始棋盘
    const moves = bl.split(""); // 将棋谱字符串拆分为数组
    let h = ""; // 用于存储生成的 HTML

    // 遍历棋谱，生成 HTML
    for (let i = 0; i < moves.length; i += 4) {
        h += `<li id="move_${i / 4}">`;
        const x = moves[i];
        const y = moves[i + 1];
        const newX = moves[i + 2];
        const newY = moves[i + 3];
        h += com.createMove(map, x, y, newX, newY); // 生成走法描述
        h += "</li>\n\r";
    }

    // 将生成的 HTML 写入棋谱框
    com.get("billBox").innerHTML = h;

    // 绑定棋谱步数的点击事件
    const doms = com.get("billBox").getElementsByTagName("li");
    for (let i = 0; i < doms.length; i++) {
        doms[i].addEventListener("click", function (e) {
            const inx = this.getAttribute("id").split("_")[1]; // 获取步数索引
            bill.setMove(bl, inx, initMap); // 更新棋盘
            com.show(); // 刷新显示
        });
    }
};