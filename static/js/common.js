var com = com || {};

com.init = function (stype) {
    // 获取当前样式类型
    com.nowStype = stype || com.getCookie("stype") || "stype2";

    // 通过样式类型获取对应的样式配置
    let stypeConfig = com.stype[com.nowStype];  // 使用 let 而不是 var
    com.width = stypeConfig.width;  // 画布宽度
    com.height = stypeConfig.height;  // 画布高度
    com.spaceX = stypeConfig.spaceX;  // 着点X跨度
    com.spaceY = stypeConfig.spaceY;  // 着点Y跨度
    com.pointStartX = stypeConfig.pointStartX;  // 第一个着点X坐标
    com.pointStartY = stypeConfig.pointStartY;  // 第一个着点Y坐标
    com.page = stypeConfig.page;  // 图片目录

    // 初始化画布
    com.canvas = document.getElementById("chess");
    com.ct = com.canvas.getContext("2d");
    com.canvas.width = com.width;
    com.canvas.height = com.height;

    // 初始化子元素列表
    com.childList = com.childList || [];

    // 载入图片资源
    com.loadImages(com.page);
};

// 样式配置
com.stype = {
    stype1: {
        width: 450,     // 画布宽度
        height: 505,    // 画布高度
        spaceX: 50,     // 着点X跨度
        spaceY: 50,     // 着点Y跨度
        pointStartX: 5, // 第一个着点X坐标
        pointStartY: 7, // 第一个着点Y坐标
        page: "stype_1" // 图片目录
    },
    stype2: {
        width: 523,     // 画布宽度
        height: 580,    // 画布高度
        spaceX: 57,     // 着点X跨度
        spaceY: 57,     // 着点Y跨度
        pointStartX: 3, // 第一个着点X坐标
        pointStartY: 5, // 第一个着点Y坐标
        page: "stype_2" // 图片目录
    },
    stype3: {
        width: 530,     // 画布宽度
        height: 567,    // 画布高度
        spaceX: 57,     // 着点X跨度
        spaceY: 57,     // 着点Y跨度
        pointStartX: -2,// 第一个着点X坐标
        pointStartY: 0, // 第一个着点Y坐标
        page: "stype_3" // 图片目录
    }
};
//获取ID
com.get = function (id) {
    return document.getElementById(id)
}

window.onload = function () {
    // 初始化组件
    com.bg = new com.class.Bg();    // 背景(棋盘)
    com.dot = new com.class.Dot();  // 移动提示点(可能用于显示可走位置)
    com.pane = new com.class.Pane();// 面板(可能是操作面板或信息面板)
    com.pane.isShow = false;        // 默认隐藏面板

    com.childList = [com.bg, com.dot, com.pane];
    com.mans = {}; // 棋子集合

    // 将所有事件处理器集中在一个函数里
    bindEvents();
};

// 绑定所有事件
function bindEvents() {
    // 开始对弈
    com.get("playBtn").addEventListener("click", startPlay);

    //开始PK
    com.get("PKBtn").addEventListener("click", startAIPlay);

    // 开始挑战
    com.get("clasliBtn").addEventListener("click", startChallenge);

    // 悔棋
    com.get("regretBtn").addEventListener("click", regretMove);

    // 返回首页
    com.get("gohomeBtn").addEventListener("click", returnHome);

    // 返回
    com.get("menuFh").addEventListener("click", returnToMainMenu);

    //AI
    com.get("menuAI").addEventListener("click", returnToMainAIMenu);

    // 返回关闭
    com.get("menuGb").addEventListener("click", returnToMainMenu);

    // 重新开始棋局
    com.get("restartBtn").addEventListener("click", restartGame);
}

// 开始挑战
function startChallenge() {
    play.isPlay = true;
    // 使用 const 或 let 代替 var
    const clasli = parseInt(getRadioValue("clasli"), 10) || 0;
    play.init(4, com.clasli[clasli].map);
    com.get("chessBox").style.display = "block";
    com.get("menuBox").style.display = "none";
}

// 悔棋
function regretMove() {
    play.regret();
}

// 返回首页
function returnHome(e) {
    com.get("chessBox").style.display = "none";
    com.get("menuBox").style.display = "block";
    com.get("indexBox").style.display = "block";
    com.get("menuQj").style.display = "none";
    com.get("menuDy").style.display = "none";
    com.get("menuPk").style.display = "none"; // 隐藏AI对局部分
}

// 返回主菜单（统一处理）
function returnToMainMenu(e) {
    com.get("menuBox").style.display = "block"
    com.get("indexBox").style.display = "block";
    com.get("menuQj").style.display = "none";
    com.get("menuDy").style.display = "none";
    com.get("menuPk").style.display = "none"; // 隐藏AI对局部分
}

function returnToMainAIMenu(e) {
    com.get("menuBox").style.display = "block"
    com.get("indexBox").style.display = "block";
    com.get("menuQj").style.display = "none";
    com.get("menuDy").style.display = "none";
    com.get("menuPk").style.display = "none"; // 隐藏AI对局部分
}
// 重新开始棋局
function restartGame(e) {
    if (confirm("是否确定要重新开始？")) {
        play.isPlay = true;
        play.init(play.depth, play.nowMap);
    }
}

//挑战棋局
document.addEventListener("DOMContentLoaded", function () {
    // 人机对弈
    const indexDy = document.getElementById("indexDy");
    if (indexDy) {
        indexDy.addEventListener("click", function (e) {
            document.getElementById("indexBox").style.display = "none";
            document.getElementById("menuQj").style.display = "none";
            document.getElementById("menuDy").style.display = "block";
            document.getElementById("menuPk").style.display = "block";
        });
    } else {
        console.error("Element with ID 'indexDy' not found!");
    }

    const indexPk = document.getElementById("indexPk");
    if (indexPk) {
        indexPk.addEventListener("click", function (e) {
            document.getElementById("indexBox").style.display = "none";
            document.getElementById("menuQj").style.display = "none";
            document.getElementById("menuDy").style.display = "none";
            document.getElementById("menuPk").style.display = "block";
        });
    } else {
        console.error("Element with ID 'indexPk' not found!");
    }

    const indexQj = document.getElementById("indexQj");
    if (indexQj) {
        indexQj.addEventListener("click", function (e) {
            document.getElementById("indexBox").style.display = "none";
            document.getElementById("menuQj").style.display = "block";
            document.getElementById("menuDy").style.display = "none";
            document.getElementById("menuPk").style.display = "none";
        });
    } else {
        console.error("Element with ID 'indexQj' not found!");
    }

    // 换肤
    com.get("stypeBtn").addEventListener("click", function (e) {
        let stype = com.nowStype;

        // 切换皮肤
        if (stype === "stype3") {
            stype = "stype2";
        } else if (stype === "stype2") {
            stype = "stype1";
        } else if (stype === "stype1") {
            stype = "stype3";
        }

        // 初始化新皮肤并显示
        com.init(stype);
        com.show();

        // 更新cookie
        document.cookie = "stype=" + stype;

        // 清除定时器，确保只调用一次
        clearInterval(timer);

        // 切换皮肤动画
        let i = 0;
        let timer = setInterval(function () {
            com.show();  // 重新渲染
            if (i++ >= 5) {
                clearInterval(timer);  // 停止动画
            }
        }, 2000);
    });

    com.init();
});


// 获取单选框选择的值
function getRadioValue(name) {
    const obj = document.getElementsByName(name); // 获取单选框列表
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].checked) {
            return obj[i].value;  // 返回被选中的单选框的值
        }
    }
}


// 获取文件数据并处理
fetch("static/js/gambit.js")
    .then(response => response.text())  // 获取响应文本内容
    .then(data => {
        com.gambit = data.split(" ");  // 假设文件内容是以空格分隔的
        AI.historyBill = com.gambit;  // 将数据赋给AI.historyBill
    })
    .catch(error => {
        console.error("Error loading gambit.all.js:", error);
    });


com.loadImages = function (stype) {
    // 创建一个辅助函数来拼接图片路径
    const buildImagePath = (type, fileName) => `static/img/${stype}/${type}/${fileName}`;

    // 绘制棋盘背景
    com.bgImg = new Image();
    com.bgImg.src = buildImagePath('bg', 'bg.png');
    // com.bgImg.src = buildImagePath('bg', 'bg.png');

    // 提示点
    com.dotImg = new Image();
    com.dotImg.src = buildImagePath('dot', 'dot.png');

    // 载入棋子
    for (let i in com.args) {
        com[i] = {};
        com[i].img = new Image();
        com[i].img.src = buildImagePath('pieces', `${com.args[i].img}.png`);  // 拼接棋子图片路径
    }

    // 棋子外框
    com.paneImg = new Image();
    com.paneImg.src = buildImagePath('frame', 'r_box.png');  // 棋子外框

    // 更新背景图片
    document.body.style.background = `url(${buildImagePath('bg', 'bg.jpg')})`;
};

// 显示所有子对象（如棋盘和棋子）
com.show = function () {
    com.ct.clearRect(0, 0, com.width, com.height); // 清空画布
    com.childList.forEach(child => child.show()); // 使用 forEach 遍历子对象并调用 show
}

// 显示棋子外框（标记移动区域）
com.showPane = function (x, y, newX, newY) {
    com.pane.isShow = true;
    com.pane.x = x;
    com.pane.y = y;
    com.pane.newX = newX;
    com.pane.newY = newY;
}

// 根据给定的地图生成棋子
com.createMans = function (map) {
    map.forEach((row, i) => {
        row.forEach((key, n) => {
            if (key !== null && key !== undefined) { // 确保 key 存在
                com.mans[key] = new com.class.Man(key); // 创建棋子
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.childList.push(com.mans[key]); // 将棋子加入子对象列表
            }
        });
    });
}


// 调试用 alert (简化版)
com.alert = function (obj, f, n) {
    if (typeof obj !== "object") {
        try {
            console.log(obj);
        } catch (e) {
        }
        return; // 直接返回避免后续代码执行
    }
    const arr = [];
    for (let key in obj) {
        arr.push(`${key} = ${obj[key]}`);
    }
    try {
        console.log(arr.join(n || "\n"));
    } catch (e) {
    }
}

const z = com.alert;
const l = console.log;

// 获取元素相对于页面左上角的坐标
com.getDomXY = function (dom) {
    const rect = dom.getBoundingClientRect();  // 获取元素的边界框
    return {x: rect.left + window.scrollX, y: rect.top + window.scrollY}; // 加上滚动偏移
}


// 获取cookie值
com.getCookie = function (name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue); // 使用 decodeURIComponent 解码
        }
    }
    return false;
}

// 二维数组克隆
com.arr2Clone = function (arr) {
    return arr.map(innerArr => innerArr.slice()); // 使用 map 和 slice 进行克隆
}

// 使用 Fetch API 载入数据
com.getData = function (url, fun) {
    fetch(url) // 使用 Fetch 请求数据
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // 获取文本数据
        })
        .then(data => {
            fun(data); // 调用回调函数处理返回的数据
        })
        .catch(error => {
            console.error('Fetch error: ', error);
        });
}
com.createMove = function (map, x, y, newX, newY) {
    const man = com.mans[map[y][x]];  // 获取棋子对象
    let moveDescription = man.text;  // 开始生成描述，首先是棋子的名称

    map[newY][newX] = map[y][x];  // 更新棋盘
    delete map[y][x];  // 删除旧位置的棋子

    const direction = (newY > y) ? "进" : (newY < y) ? "退" : "平";  // 判断进、退还是平
    const isPlayer1 = man.my === 1;  // 判断是否为玩家1
    const rowLabels = isPlayer1 ? ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"] : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    // 处理棋子的横向移动
    const xMoveDescription = rowLabels[newX];

    if (isPlayer1) {
        // 玩家1棋子的描述
        moveDescription += (newY !== y) ? rowLabels[8 - x] + direction : "平" + xMoveDescription;
    } else {
        // 玩家2棋子的描述
        moveDescription += rowLabels[x];
        moveDescription += direction + (newY !== y ? rowLabels[newY - y - 1] : "") + (newX !== x ? rowLabels[newX] : "");
    }

    return moveDescription;
}


com.initMap = [
    ['C0', 'M0', 'X0', 'S0', 'J0', 'S1', 'X1', 'M1', 'C1'],
    [null, null, null, null, null, null, null, null, null],
    [null, 'P0', null, null, null, null, null, 'P1', null],
    ['Z0', null, 'Z1', null, 'Z2', null, 'Z3', null, 'Z4'],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    ['z0', null, 'z1', null, 'z2', null, 'z3', null, 'z4'],
    [null, 'p0', null, null, null, null, null, 'p1', null],
    [null, null, null, null, null, null, null, null, null],
    ['c0', 'm0', 'x0', 's0', 'j0', 's1', 'x1', 'm1', 'c1']
];


com.keys = {
    'player1': {
        'c0': 'c', 'c1': 'c', 'c2': 'c', 'c3': 'c', 'c4': 'c', 'c5': 'c',
        'm0': 'm', 'm1': 'm', 'm2': 'm', 'm3': 'm', 'm4': 'm', 'm5': 'm',
        'x0': 'x', 'x1': 'x', 'x2': 'x', 'x3': 'x', 'x4': 'x', 'x5': 'x',
        's0': 's', 's1': 's', 's2': 's', 's3': 's', 's4': 's', 's5': 's',
        'j0': 'j', 'j1': 'j', 'j2': 'j', 'j3': 'j', 'j4': 'j', 'j5': 'j',
        'p0': 'p', 'p1': 'p', 'p2': 'p', 'p3': 'p', 'p4': 'p', 'p5': 'p',
        'z0': 'z', 'z1': 'z', 'z2': 'z', 'z3': 'z', 'z4': 'z', 'z5': 'z'
    },
    'player2': {
        'C0': 'C', 'C1': 'C', 'C2': 'C', 'C3': 'C', 'C4': 'C', 'C5': 'C',
        'M0': 'M', 'M1': 'M', 'M2': 'M', 'M3': 'M', 'M4': 'M', 'M5': 'M',
        'X0': 'X', 'X1': 'X', 'X2': 'X', 'X3': 'X', 'X4': 'X', 'X5': 'X',
        'S0': 'S', 'S1': 'S', 'S2': 'S', 'S3': 'S', 'S4': 'S', 'S5': 'S',
        'J0': 'J', 'J1': 'J', 'J2': 'J', 'J3': 'J', 'J4': 'J', 'J5': 'J',
        'P0': 'P', 'P1': 'P', 'P2': 'P', 'P3': 'P', 'P4': 'P', 'P5': 'P',
        'Z0': 'Z', 'Z1': 'Z', 'Z2': 'Z', 'Z3': 'Z', 'Z4': 'Z', 'Z5': 'Z'
    }
};


com.bylaw = {};

// 车的走法
com.bylaw.c = function (x, y, map, my) {
    const directions = [
        {dx: -1, dy: 0}, // 左
        {dx: 1, dy: 0},  // 右
        {dx: 0, dy: -1}, // 上
        {dx: 0, dy: 1}   // 下
    ];

    const validMoves = [];
    const boardWidth = 9, boardHeight = 10; // 棋盘大小

    // 遍历四个方向
    for (const {dx, dy} of directions) {
        let newX = x + dx;
        let newY = y + dy;

        while (newX >= 0 && newX < boardWidth && newY >= 0 && newY < boardHeight) {
            if (!map[newY] || map[newY][newX] === undefined) {
                break; // 如果访问到了 `undefined`，直接停止
            }

            const target = map[newY][newX];

            if (target) {
                // 有棋子时，判断是否是敌方棋子
                const piece = com.mans[target];
                if (piece && piece.my !== my) {
                    validMoves.push([newX, newY]); // 可以吃
                }
                break; // 遇到棋子后不能再继续走
            }

            validMoves.push([newX, newY]); // 为空，可以走
            newX += dx;
            newY += dy;
        }
    }

    return validMoves;
};


// 马的走法
com.bylaw.m = function (x, y, map, my) {
    const directions = [
        {dx: 1, dy: -2, footX: 0, footY: -1},  // 1点
        {dx: 2, dy: -1, footX: 1, footY: 0},   // 2点
        {dx: 2, dy: 1, footX: 1, footY: 0},    // 4点
        {dx: 1, dy: 2, footX: 0, footY: 1},    // 5点
        {dx: -1, dy: 2, footX: 0, footY: 1},   // 7点
        {dx: -2, dy: 1, footX: -1, footY: 0},  // 8点
        {dx: -2, dy: -1, footX: -1, footY: 0}, // 10点
        {dx: -1, dy: -2, footX: 0, footY: -1}  // 11点
    ];

    const validMoves = [];
    const boardSize = {width: 9, height: 10}; // 9列 10行

    directions.forEach(direction => {
        const newX = x + direction.dx;
        const newY = y + direction.dy;
        const footX = x + direction.footX;
        const footY = y + direction.footY;

        // 判断是否越界
        if (newX >= 0 && newX < boardSize.width && newY >= 0 && newY < boardSize.height) {
            // 判断马脚是否被堵住（马脚有棋子则不能跳）
            if (!map[footY]?.[footX]) {
                // 确保 newX, newY 位置没有己方棋子
                const targetPiece = map[newY]?.[newX];
                if (!targetPiece || (com.mans[targetPiece] && com.mans[targetPiece].my !== my)) {
                    validMoves.push([newX, newY]);
                }
            }
        }
    });

    return validMoves;
};


//相
com.bylaw.x = function (x, y, map, my) {
    const directions = [
        {dx: 2, dy: 2}, // 4点半
        {dx: -2, dy: 2}, // 7点半
        {dx: 2, dy: -2}, // 1点半
        {dx: -2, dy: -2} // 10点半
    ];

    const validMoves = [];

    // 检查相的走法是否越界
    function isValidMove(newX, newY) {
        return newX >= 0 && newX <= 8 && newY >= 0 && newY <= 9;
    }

    // 检查相的合法走法
    function checkMove(newX, newY, my) {
        return !play.map[newY][newX] &&
            (!com.mans[map[newY][newX]] || com.mans[map[newY][newX]].my !== my);
    }

    // 计算红方或黑方的走法范围
    const yLimit = my === 1 ? 9 : 4; // 红方最多到9行，黑方最多到4行
    const yMin = my === 1 ? 5 : 0;   // 红方最小为第5行，黑方最小为第0行

    directions.forEach(direction => {
        const newX = x + direction.dx;
        const newY = y + direction.dy;

        // 检查是否越界以及是否符合红方/黑方的规则
        if (isValidMove(newX, newY)) {
            // 红方和黑方在不同的y轴范围限制
            if ((my === 1 && newY <= yLimit && newY >= yMin) ||
                (my === 0 && newY >= yMin && newY <= yLimit)) {
                // 检查是否符合走法规则
                if (checkMove(newX, newY, my)) {
                    validMoves.push([newX, newY]);
                }
            }
        }
    });

    return validMoves;
};

//士
com.bylaw.s = function (x, y, map, my) {
    const d = [];
    const directions = [
        {dx: 1, dy: 1}, // 4点半
        {dx: -1, dy: 1}, // 7点半
        {dx: 1, dy: -1}, // 1点半
        {dx: -1, dy: -1} // 10点半
    ];

    // 红方的九宫格限制（5-9行）
    // 黑方的九宫格限制（0-4行）
    const yMin = my === 1 ? 7 : 0; // 红方起始行限制为7
    const yMax = my === 1 ? 9 : 2; // 红方最大行限制为9

    // 遍历四个方向，检查是否符合士的走法规则
    directions.forEach(direction => {
        const newX = x + direction.dx;
        const newY = y + direction.dy;

        // 确保目标位置在九宫格内
        if (newY >= yMin && newY <= yMax && newX >= 3 && newX <= 5) {
            // 检查目标位置是否为空或是敌方棋子
            if (!play.map[newY][newX] || (com.mans[map[newY][newX]] && com.mans[map[newY][newX]].my !== my)) {
                d.push([newX, newY]);
            }
        }
    });

    return d;
};

//将
com.bylaw.j = function (x, y, map, my) {
    const d = [];

    // 判断是否清空路径
    const isNull = (function () {
        const y1 = com.mans["j0"].y;
        const x1 = com.mans["J0"].x;
        const y2 = com.mans["J0"].y;
        for (let i = y1 - 1; i > y2; i--) {
            if (map[i][x1]) return false;
        }
        return true;
    })();

    if (my === 1) { // 红方
        // 下
        if (y + 1 <= 9 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my !== my)) d.push([x, y + 1]);
        // 上
        if (y - 1 >= 7 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my !== my)) d.push([x, y - 1]);
        // 老将对老将的情况
        if (com.mans["j0"].x === com.mans["J0"].x && isNull) d.push([com.mans["J0"].x, com.mans["J0"].y]);

    } else { // 黑方
        // 下
        if (y + 1 <= 2 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my !== my)) d.push([x, y + 1]);
        // 上
        if (y - 1 >= 0 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my !== my)) d.push([x, y - 1]);
        // 老将对老将的情况
        if (com.mans["j0"].x === com.mans["J0"].x && isNull) d.push([com.mans["j0"].x, com.mans["j0"].y]);
    }

    // 右
    if (x + 1 <= 5 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my !== my)) d.push([x + 1, y]);
    // 左
    if (x - 1 >= 3 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my !== my)) d.push([x - 1, y]);

    return d;
};


//炮
com.bylaw.p = function (x, y, map, my) {
    const d = [];

    // 左侧检索
    let n = 0;
    for (let i = x - 1; i >= 0; i--) {
        if (map[y][i]) {
            if (n === 0) {
                n++;
            } else {
                if (com.mans[map[y][i]].my !== my) d.push([i, y]);
                break;
            }
        } else {
            if (n === 0) d.push([i, y]);
        }
    }

    // 右侧检索
    n = 0; // 重置 n
    for (let i = x + 1; i <= 8; i++) {
        if (map[y][i]) {
            if (n === 0) {
                n++;
            } else {
                if (com.mans[map[y][i]].my !== my) d.push([i, y]);
                break;
            }
        } else {
            if (n === 0) d.push([i, y]);
        }
    }

    // 上检索
    n = 0; // 重置 n
    for (let i = y - 1; i >= 0; i--) {
        if (map[i][x]) {
            if (n === 0) {
                n++;
            } else {
                if (com.mans[map[i][x]].my !== my) d.push([x, i]);
                break;
            }
        } else {
            if (n === 0) d.push([x, i]);
        }
    }

    // 下检索
    n = 0; // 重置 n
    for (let i = y + 1; i <= 9; i++) {
        if (map[i][x]) {
            if (n === 0) {
                n++;
            } else {
                if (com.mans[map[i][x]].my !== my) d.push([x, i]);
                break;
            }
        } else {
            if (n === 0) d.push([x, i]);
        }
    }

    return d;
};


com.bylaw.z = function (x, y, map, my) {
    const d = [];

    if (my === 1) { // 红方
        // 上
        if (y - 1 >= 0 && (!com.mans[map[y - 1][x]] || com.mans[map[y - 1][x]].my !== my)) d.push([x, y - 1]);
        // 右
        if (x + 1 <= 8 && y <= 4 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my !== my)) d.push([x + 1, y]);
        // 左
        if (x - 1 >= 0 && y <= 4 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my !== my)) d.push([x - 1, y]);
    } else { // 黑方
        // 下
        if (y + 1 <= 9 && (!com.mans[map[y + 1][x]] || com.mans[map[y + 1][x]].my !== my)) d.push([x, y + 1]);
        // 右
        if (x + 1 <= 8 && y >= 6 && (!com.mans[map[y][x + 1]] || com.mans[map[y][x + 1]].my !== my)) d.push([x + 1, y]);
        // 左
        if (x - 1 >= 0 && y >= 6 && (!com.mans[map[y][x - 1]] || com.mans[map[y][x - 1]].my !== my)) d.push([x - 1, y]);
    }

    return d;
};

com.value = {

    //车价值
    c: [
        [206, 208, 207, 213, 214, 213, 207, 208, 206],
        [206, 212, 209, 216, 233, 216, 209, 212, 206],
        [206, 208, 207, 214, 216, 214, 207, 208, 206],
        [206, 213, 213, 216, 216, 216, 213, 213, 206],
        [208, 211, 211, 214, 215, 214, 211, 211, 208],

        [208, 212, 212, 214, 215, 214, 212, 212, 208],
        [204, 209, 204, 212, 214, 212, 204, 209, 204],
        [198, 208, 204, 212, 212, 212, 204, 208, 198],
        [200, 208, 206, 212, 200, 212, 206, 208, 200],
        [194, 206, 204, 212, 200, 212, 204, 206, 194]
    ],

    //马价值
    m: [
        [90, 90, 90, 96, 90, 96, 90, 90, 90],
        [90, 96, 103, 97, 94, 97, 103, 96, 90],
        [92, 98, 99, 103, 99, 103, 99, 98, 92],
        [93, 108, 100, 107, 100, 107, 100, 108, 93],
        [90, 100, 99, 103, 104, 103, 99, 100, 90],

        [90, 98, 101, 102, 103, 102, 101, 98, 90],
        [92, 94, 98, 95, 98, 95, 98, 94, 92],
        [93, 92, 94, 95, 92, 95, 94, 92, 93],
        [85, 90, 92, 93, 78, 93, 92, 90, 85],
        [88, 85, 90, 88, 90, 88, 90, 85, 88]
    ],

    //相价值
    x: [
        [0, 0, 20, 0, 0, 0, 20, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 23, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 20, 0, 0, 0, 20, 0, 0],

        [0, 0, 20, 0, 0, 0, 20, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [18, 0, 0, 0, 23, 0, 0, 0, 18],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 20, 0, 0, 0, 20, 0, 0]
    ],

    //士价值
    s: [
        [0, 0, 0, 20, 0, 20, 0, 0, 0],
        [0, 0, 0, 0, 23, 0, 0, 0, 0],
        [0, 0, 0, 20, 0, 20, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 20, 0, 20, 0, 0, 0],
        [0, 0, 0, 0, 23, 0, 0, 0, 0],
        [0, 0, 0, 20, 0, 20, 0, 0, 0]
    ],

    //奖价值
    j: [
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],

        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
        [0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
    ],

    //炮价值
    p: [

        [100, 100, 96, 91, 90, 91, 96, 100, 100],
        [98, 98, 96, 92, 89, 92, 96, 98, 98],
        [97, 97, 96, 91, 92, 91, 96, 97, 97],
        [96, 99, 99, 98, 100, 98, 99, 99, 96],
        [96, 96, 96, 96, 100, 96, 96, 96, 96],

        [95, 96, 99, 96, 100, 96, 99, 96, 95],
        [96, 96, 96, 96, 96, 96, 96, 96, 96],
        [97, 96, 100, 99, 101, 99, 100, 96, 97],
        [96, 97, 98, 98, 98, 98, 98, 97, 96],
        [96, 96, 97, 99, 99, 99, 97, 96, 96]
    ],

    //卒价值
    z: [
        [9, 9, 9, 11, 13, 11, 9, 9, 9],
        [19, 24, 34, 42, 44, 42, 34, 24, 19],
        [19, 24, 32, 37, 37, 37, 32, 24, 19],
        [19, 23, 27, 29, 30, 29, 27, 23, 19],
        [14, 18, 20, 27, 29, 27, 20, 18, 14],

        [7, 0, 13, 0, 16, 0, 13, 0, 7],
        [7, 0, 7, 0, 15, 0, 7, 0, 7],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}

//黑子为红字价值位置的倒置
com.value.C = com.arr2Clone(com.value.c).reverse();
com.value.M = com.arr2Clone(com.value.m).reverse();
com.value.X = com.value.x;
com.value.S = com.value.s;
com.value.J = com.value.j;
com.value.P = com.arr2Clone(com.value.p).reverse();
com.value.Z = com.arr2Clone(com.value.z).reverse();

//棋子们
com.args = {
    //红子 中文/图片地址/阵营/权重
    'c': {text: "车", img: 'r_c', my: 1, bl: "c", value: com.value.c},
    'm': {text: "马", img: 'r_m', my: 1, bl: "m", value: com.value.m},
    'x': {text: "相", img: 'r_x', my: 1, bl: "x", value: com.value.x},
    's': {text: "仕", img: 'r_s', my: 1, bl: "s", value: com.value.s},
    'j': {text: "将", img: 'r_j', my: 1, bl: "j", value: com.value.j},
    'p': {text: "炮", img: 'r_p', my: 1, bl: "p", value: com.value.p},
    'z': {text: "兵", img: 'r_z', my: 1, bl: "z", value: com.value.z},

    //蓝子
    'C': {text: "�", img: 'b_c', my: -1, bl: "c", value: com.value.C},
    'M': {text: "�R", img: 'b_m', my: -1, bl: "m", value: com.value.M},
    'X': {text: "象", img: 'b_x', my: -1, bl: "x", value: com.value.X},
    'S': {text: "士", img: 'b_s', my: -1, bl: "s", value: com.value.S},
    'J': {text: "帅", img: 'b_j', my: -1, bl: "j", value: com.value.J},
    'P': {text: "炮", img: 'b_p', my: -1, bl: "p", value: com.value.P},
    'Z': {text: "卒", img: 'b_z', my: -1, bl: "z", value: com.value.Z}
};

com.class = com.class || {}; // 确保类对象存在

// 定义棋子类 Man
com.class.Man = function (key, x, y) {
    // 获取棋子类型的首字母
    this.pater = key.slice(0, 1);

    // 确保通过 pater 找到对应的棋子信息
    const o = com.args[this.pater];
    if (!o) {
        console.error("无效的棋子类型:", this.pater);
        return;
    }

    // 初始化棋子的坐标
    this.x = x || 0;
    this.y = y || 0;
    this.key = key; // 棋子的唯一标识
    this.my = o.my; // 阵营
    this.text = o.text; // 棋子的中文名称
    this.value = o.value; // 棋子的价值
    this.isShow = true; // 是否显示
    this.alpha = 1; // 透明度
    this.ps = []; // 可着点（棋子可以走的地方）

    // 显示棋子
    this.show = function () {
        if (this.isShow) {
            com.ct.save();
            com.ct.globalAlpha = this.alpha; // 设置透明度
            com.ct.drawImage(
                com[this.pater].img,
                com.spaceX * this.x + com.pointStartX,
                com.spaceY * this.y + com.pointStartY
            );
            com.ct.restore();
        }
    }

    // 根据规则获取棋子能走的地方
    this.bl = function (map) {
        map = map || play.map; // 默认使用当前地图
        return com.bylaw[o.bl](this.x, this.y, map, this.my); // 获取着点
    }
};


com.class.Bg = function (img, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.isShow = true;

    // 显示背景
    this.show = function () {
        if (this.isShow) {
            com.ct.drawImage(com.bgImg, com.spaceX * this.x, com.spaceY * this.y);
        }
    };
};

com.class.Pane = function (img, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.newX = x || 0;
    this.newY = y || 0;
    this.isShow = true;

    // 显示面板
    this.show = function () {
        if (this.isShow) {
            com.ct.drawImage(com.paneImg, com.spaceX * this.x + com.pointStartX, com.spaceY * this.y + com.pointStartY);
            com.ct.drawImage(com.paneImg, com.spaceX * this.newX + com.pointStartX, com.spaceY * this.newY + com.pointStartY);
        }
    };
};

com.class.Dot = function (img, x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.isShow = true;
    this.dots = [];

    // 显示点
    this.show = function () {
        if (this.isShow) {
            // 使用 `for...of` 替代 `for`，提高可读性
            for (const dot of this.dots) {
                com.ct.drawImage(com.dotImg, com.spaceX * dot[0] + 10 + com.pointStartX, com.spaceY * dot[1] + 10 + com.pointStartY);
            }
        }
    };
};


