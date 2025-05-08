var AI = AI || {};

AI.historyTable = {}; // 历史表
AI.historyBill = []; // 开局库

// 人工智能初始化
AI.init = function (pace) {
    const bill = AI.historyBill || com.gambit; // 获取开局库

    // 如果开局库存在
    if (bill.length) {
        const len = pace.length; // 获取当前步数记录的长度
        const arr = []; // 用于存储匹配的开局走法

        // 遍历开局库，查找匹配的走法
        for (let i = 0; i < bill.length; i++) {
            if (bill[i].slice(0, len) === pace) {
                arr.push(bill[i]); // 提取匹配的走法
            }
        }

        // 如果有匹配的走法，随机选择一个
        if (arr.length) {
            const inx = Math.floor(Math.random() * arr.length);
            AI.historyBill = arr; // 更新历史库
            return arr[inx].slice(len, len + 4).split(""); // 返回随机选择的走法
        } else {
            AI.historyBill = []; // 清空历史库
        }
    }

    // 如果棋谱里面没有，人工智能开始运作
    const initTime = new Date().getTime(); // 记录开始时间
    AI.treeDepth = play.depth; // 设置搜索深度
    AI.number = 0; // 初始化搜索节点计数
    AI.setHistoryTable.length = 0; // 清空历史表

    // 使用 Alpha-Beta 剪枝算法搜索最佳着法
    let val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, com.arr2Clone(play.map), play.my);

    // 如果搜索失败或返回无效值，降低搜索深度重新搜索
    if (!val || val.value === -8888) {
        AI.treeDepth = 2; // 降低搜索深度
        val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, com.arr2Clone(play.map), play.my);
    }

    // 如果找到最佳着法
    if (val && val.value !== -8888) {
        const man = play.mans[val.key]; // 获取最佳着法的棋子
        const nowTime = new Date().getTime(); // 记录结束时间

        // 打印搜索信息
        console.log(
            `最佳着法：${com.createMove(com.arr2Clone(play.map), man.x, man.y, val.x, val.y)} ` +
            `搜索深度：${AI.treeDepth} 搜索分支：${AI.number}个 ` +
            `最佳着法评估：${val.value}分 搜索用时：${nowTime - initTime}毫秒`
        );

        // 返回最佳着法的坐标
        return [man.x, man.y, val.x, val.y];
    } else {
        // 如果没有找到最佳着法，返回 false
        return false;
    }
};

// 迭代加深搜索着法
AI.iterativeSearch = function (map, my) {
    const timeOut = 100; // 设置超时时间（单位：毫秒）
    const initDepth = 1; // 初始搜索深度
    const maxDepth = 8; // 最大搜索深度
    AI.treeDepth = 0; // 初始化搜索深度
    const initTime = new Date().getTime(); // 记录开始时间
    let val = {}; // 用于存储搜索结果

    // 从初始深度到最大深度进行迭代搜索
    for (let i = initDepth; i <= maxDepth; i++) {
        const nowTime = new Date().getTime(); // 记录当前时间

        // 设置当前搜索深度
        AI.treeDepth = i;
        AI.aotuDepth = i;

        // 使用 Alpha-Beta 剪枝算法进行搜索
        val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, map, my);

        // 如果超时，返回当前搜索结果
        if (nowTime - initTime > timeOut) {
            return val;
        }
    }

    // 如果没有超时，返回最终的搜索结果
    return val || false;
};

// 取得棋盘上所有棋子
AI.getMapAllMan = function (map, my) {
    const mans = []; // 用于存储符合条件的棋子

    // 遍历棋盘
    for (let i = 0; i < map.length; i++) {
        for (let n = 0; n < map[i].length; n++) {
            const key = map[i][n]; // 获取棋子的 key

            // 如果棋子存在且属于当前玩家
            if (key && play.mans[key].my === my) {
                // 更新棋子的坐标
                play.mans[key].x = n;
                play.mans[key].y = i;

                // 将棋子添加到数组中
                mans.push(play.mans[key]);
            }
        }
    }

    // 返回符合条件的棋子数组
    return mans;
};

// 取得棋谱所有己方棋子的着法
AI.getMoves = function (map, my) {
    const manArr = AI.getMapAllMan(map, my); // 获取所有己方棋子
    const moves = []; // 用于存储所有合法着法
    const foul = play.isFoul; // 获取长将着法

    // 遍历所有己方棋子
    for (let i = 0; i < manArr.length; i++) {
        const man = manArr[i]; // 当前棋子
        const val = man.bl(map); // 获取当前棋子的所有可能着法

        // 遍历当前棋子的所有可能着法
        for (let n = 0; n < val.length; n++) {
            const x = man.x; // 当前棋子的 x 坐标
            const y = man.y; // 当前棋子的 y 坐标
            const newX = val[n][0]; // 目标位置的 x 坐标
            const newY = val[n][1]; // 目标位置的 y 坐标

            // 如果不是长将着法
            if (foul[0] !== x || foul[1] !== y || foul[2] !== newX || foul[3] !== newY) {
                moves.push([x, y, newX, newY, man.key]); // 将着法添加到数组中
            }
        }
    }

    // 返回所有合法着法
    return moves;
};

// Alpha-Beta 剪枝算法
AI.getAlphaBeta = function (A, B, depth, map, my) {
    // 如果达到搜索深度，返回当前局面的评估值
    if (depth === 0) {
        return { value: AI.evaluate(map, my) }; // 局面评价函数
    }

    // 生成所有可能的走法
    const moves = AI.getMoves(map, my);
    let bestMove = null; // 用于记录最佳走法

    // 遍历所有走法
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i]; // 当前走法
        const key = move[4]; // 当前棋子的 key
        const oldX = move[0]; // 当前棋子的原 x 坐标
        const oldY = move[1]; // 当前棋子的原 y 坐标
        const newX = move[2]; // 目标位置的 x 坐标
        const newY = move[3]; // 目标位置的 y 坐标
        const clearKey = map[newY][newX] || ""; // 目标位置的棋子 key（如果有）

        // 执行走法
        AI.applyMove(map, key, oldX, oldY, newX, newY);

        // 如果吃掉了对方的将（或帅），直接返回胜利
        if (clearKey === "j0" || clearKey === "J0") {
            // 撤消走法
            AI.undoMove(map, key, oldX, oldY, newX, newY, clearKey);
            return { key, x: newX, y: newY, value: 8888 }; // 返回胜利
        }

        // 递归调用 Alpha-Beta 剪枝算法
        const val = -AI.getAlphaBeta(-B, -A, depth - 1, map, -my).value;

        // 撤消走法
        AI.undoMove(map, key, oldX, oldY, newX, newY, clearKey);

        // 剪枝
        if (val >= B) {
            return { key, x: newX, y: newY, value: B }; // Beta 剪枝
        }
        if (val > A) {
            A = val; // 更新最佳值
            bestMove = { key, x: newX, y: newY, value: A }; // 记录最佳走法
        }
    }

    // 如果已经递归回根节点
    if (AI.treeDepth === depth) {
        if (!bestMove) {
            // 如果没有最佳走法，说明被将死，返回 false
            return false;
        } else {
            // 返回最佳走法
            return bestMove;
        }
    }

    // 返回当前最佳值
    return bestMove || { value: A };
};

// 执行走法
AI.applyMove = function (map, key, oldX, oldY, newX, newY) {
    map[newY][newX] = key;
    delete map[oldY][oldX];
    play.mans[key].x = newX;
    play.mans[key].y = newY;
};

// 撤消走法
AI.undoMove = function (map, key, oldX, oldY, newX, newY, clearKey) {
    play.mans[key].x = oldX;
    play.mans[key].y = oldY;
    map[oldY][oldX] = key;
    delete map[newY][newX];
    if (clearKey) {
        map[newY][newX] = clearKey;
    }
};

// 评估棋局，取得棋盘双方棋子价值差
AI.evaluate = function (map, my) {
    let val = 0; // 初始化评估值

    // 遍历棋盘
    for (let i = 0; i < map.length; i++) {
        for (let n = 0; n < map[i].length; n++) {
            const key = map[i][n]; // 获取棋子的 key

            // 如果棋子存在，累加其价值
            if (key) {
                val += play.mans[key].value[i][n] * play.mans[key].my;
            }
        }
    }

    AI.number++; // 增加搜索节点计数
    return val * my; // 返回评估值
};

// 将着法记录到历史表
AI.setHistoryTable = function (txtMap, depth, value, my) {
    AI.setHistoryTable.length++;
    AI.historyTable[txtMap] = { depth, value };
};