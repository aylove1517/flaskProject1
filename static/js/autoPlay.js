// let gameOver = false;
// let turn = 1; // 1 表示红方（玩家），-1 表示黑方（AI）
//
// // **让 AI 走一步**
// function nextMove() {
//     if (gameOver || !play.isPlay || turn === 1) {
//         return;
//     }
//
//     console.log("AI 计算最佳走法...");
//     const bestMove = AI.init(play.pace);
//     console.log("AI 计算出的走法:", bestMove);
//
//     if (!bestMove) {
//         console.log("AI 无法走子，游戏结束！");
//         gameOver = true;
//         return;
//     }
//
//     // 执行走法
//     play.movePiece(bestMove[0], bestMove[1], bestMove[2], bestMove[3]);
//     play.pace.push(bestMove);
//
//     // 检查游戏是否结束
//     if (play.isGameOver()) {
//         console.log("游戏结束！");
//         gameOver = true;
//         return;
//     }
//     // 切换回合给玩家
//     turn = 1;
// }
//
// // **玩家走棋后，触发 AI 走棋**
// function playerMove(x, y, newX, newY) {
//     if (gameOver || !play.isPlay || turn === -1) {
//         return;
//     }
//
//     console.log("玩家移动棋子:", x, y, "->", newX, newY);
//     play.movePiece(x, y, newX, newY);
//     play.pace.push([x, y, newX, newY]);
//
//     // 检查游戏是否结束
//     if (play.isGameOver()) {
//         console.log("游戏结束！");
//         gameOver = true;
//         return;
//     }
//
//     // 切换回合给 AI
//     turn = -1;
//     setTimeout(nextMove, 500); // 500ms 后 AI 走棋
// }
//
//
//
// // **暂停游戏**
// function pauseGame() {
//     play.isPlay = false;
//     console.log("游戏暂停！");
// }
//
// // **绑定按钮事件**
// // document.addEventListener("DOMContentLoaded", function () {
// //     document.getElementById("startButton").addEventListener("click", startPlay);
// //     document.getElementById("pauseButton").addEventListener("click", pauseGame);
// // });
