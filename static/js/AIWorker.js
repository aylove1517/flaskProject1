importScripts('AI.js'); // 引入你的 AI 逻辑

self.onmessage = function (event) {
    const { type, data } = event.data;

    if (type === "init") {
        const result = AI.init(data.pace);
        self.postMessage({ type: "init_result", result });
    } else if (type === "search") {
        const result = AI.iterativeSearch(data.map, data.my);
        self.postMessage({ type: "search_result", result });
    }
};
