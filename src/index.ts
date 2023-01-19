import Server from "./server/server";

const PORT = process.env.PORT || 4000;

export class App {
  private server: Server | null = null;

  public initServer(port: number | string) {
    console.info(`App::initServer( ${port} ) - start`);
    this.server = new Server(port);
    this.server.start();
  }
}

const app = new App();
app.initServer(PORT);
