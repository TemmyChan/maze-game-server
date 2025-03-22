const WebSocket = require("wss");

const server = new WebSocket.Server({ port: process.env.PORT || 8080 });
let players = {};

server.on("connection", (socket) => {
    console.log("新しいプレイヤーが接続");

    socket.on("message", (data) => {
        const message = JSON.parse(data);
        
        if (message.type === "move") {
            players[message.id] = { x: message.x, y: message.y };

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
});

console.log("WebSocket サーバーが起動しました");
