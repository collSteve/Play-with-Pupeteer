"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const http_1 = __importDefault(require("http"));
const expressApp_1 = __importDefault(require("./expressApp"));
// import { Post, PostsGetRequestResponseObject } from "../models/post.model";
class Server {
    constructor(port) {
        this.port = port;
        this.expressApp = expressApp_1.default;
        this.expressApp.set("port", this.port);
        this.httpServer = http_1.default.createServer(this.expressApp);
        //test
        // setInterval(()=>{
        //   console.log("======Games Log=======");
        //   const gameService = GameService.getInstance();
        //   const games = gameService.getAllGames();
        //   for (const [gameId, game] of games.entries()) {
        //     console.log(`GameID: ${gameId}: ${gameService.getAllUserIdsInGame(gameId)}`);
        //   }
        // }, 10000);
    }
    start() {
        this.httpServer.on("error", (err) => this.onError(err));
        this.httpServer.on("listening", () => this.onListening());
        this.httpServer.listen(this.port);
    }
    getHttpServer() {
        return this.httpServer;
    }
    onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    onListening() {
        // const addr = this.httpServer.address();
        const bind = typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
        (0, console_1.debug)("Listening on " + bind);
    }
}
exports.default = Server;
