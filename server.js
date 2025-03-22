const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

// HTTP サーバーを作成
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running.");
});

// WebSocket サーバーを HTTP サーバーに紐付け
const wss = new WebSocket.Server({ server });

let players = {};

wss.on("connection", (ws) => {
    console.log("新しいプレイヤーが接続");

    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data);

            if (message.type === "move") {
                players[message.id] = { x: message.x, y: message.y };

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: "update", players }));
                    }
                });
            }
        } catch (error) {
            console.error("メッセージ解析エラー:", error);
        }
    });

    ws.on("close", () => {
        console.log("プレイヤーが退出");
    });

    ws.on("error", (err) => {
        console.error("WebSocket エラー:", err);
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket サーバーがポート ${PORT} で起動しました`);
});
