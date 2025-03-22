const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 10000;

// HTTP サーバーを作成
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "X-Content-Type-Options": "nosniff"
    });
    res.end("WebSocket サーバー稼働中");
});

// WebSocket サーバーを HTTP サーバー上に作成
const wss = new WebSocket.Server({ server });

let players = {};

wss.on("connection", (ws) => {
    console.log("新しいプレイヤーが接続");

    ws.on("message", (data) => {
        const message = JSON.parse(data);

        if (message.type === "move") {
            players[message.id] = { x: message.x, y: message.y };

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", players }));
                }
            });
        }
    });

    ws.on("close", () => {
        console.log("プレイヤーが退出");
    });

    ws.on("error", (err) => {
        console.error("WebSocketエラー:", err);
    });
});

// HTTP サーバーを起動
server.listen(port, () => {
    console.log(`WebSocket サーバーがポート ${port} で起動しました`);
});
