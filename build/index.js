"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const server_1 = __importDefault(require("./server/server"));
const PORT = process.env.PORT || 4000;
class App {
    constructor() {
        this.server = null;
    }
    initServer(port) {
        console.info(`App::initServer( ${port} ) - start`);
        this.server = new server_1.default(port);
        this.server.start();
    }
}
exports.App = App;
const app = new App();
app.initServer(PORT);
