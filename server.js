const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 10000;

// HTTP サーバーを作成
const server = http.createServer(app);

// WebSocket サーバーを作成
const wss = new WebSocket.Server({ server });

let players = {};

// WebSocket の接続処理
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

// HTTP のレスポンス設定
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff"); // 追加
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("WebSocket サーバー稼働中");
});

// サーバー起動
server.listen(port, () => {
    console.log(`WebSocket サーバーがポート ${port} で起動しました`);
});
