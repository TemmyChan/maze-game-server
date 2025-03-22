const WebSocket = require("ws");

const port = process.env.PORT || 10000;
console.log("サーバーがポート番号", port, "で起動しました");

const server = new WebSocket.Server({ port: port });
let players = {};

server.on("connection", (socket) => {
    console.log("新しいプレイヤーが接続");

    socket.on("message", (data) => {
        const message = JSON.parse(data);

        if (message.type === "move") {
            players[message.id] = { x: message.x, y: message.y };

            // すべてのクライアントにプレイヤーの位置を送信
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "update", players }));
                }
            });
        }
    });

    socket.on("close", () => {
        console.log("プレイヤーが退出");
    });

    socket.on("error", (err) => {
        console.log("WebSocketエラー:", err);
    });
});

server.on('error', (err) => {
    console.log("サーバーエラー:", err);
});

console.log("WebSocket サーバーが起動しました");
