import { Express } from "express";
import { debug } from "console";
import http from "http";
import expressApp from "./expressApp";
import { downloadM3U8, downloadSourceHtml, logNetwork, testScreenShot } from "../models/pupeteer";
import path from "path";


// import { Post, PostsGetRequestResponseObject } from "../models/post.model";

export default class Server {
  private port: number | string;
  private expressApp: Express;
  private httpServer: http.Server;

  constructor(port: number | string) {
    this.port = port;
    this.expressApp = expressApp;

    this.expressApp.set("port", this.port);
    this.httpServer = http.createServer(this.expressApp);

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

  public start() {
    this.httpServer.on("error", (err: NodeJS.ErrnoException) =>
      this.onError(err)
    );
    this.httpServer.on("listening", () => this.onListening());

    this.httpServer.listen(this.port);

    const assetFolder = path.join(__dirname, '../../assets');

    downloadM3U8('https://www.lgyy.cc/vodplay/68998-4-8.html', 'D:\\Documents\\kuang biao\\8');
    // logNetwork('https://www.pornhub.com/view_video.php?viewkey=ph6358eef4b7d44', 0);
    // testScreenShot('https://www.pornhub.com/view_video.php?viewkey=63d29737068ff', 'pp');
    // downloadSourceHtml('https://www.lgyy.cc/vodplay/68998-4-6.html', `${assetFolder}/test.html`);
  }

  public getHttpServer() {
    return this.httpServer;
  }

  private onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind =
      typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
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

  private onListening() {
    // const addr = this.httpServer.address();
    const bind =
      typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
    debug("Listening on " + bind);
  }
}
