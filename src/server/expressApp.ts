import express, {Express} from "express";
import path from "path";

const expressApp:Express = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({
    extended: true
}));

const public_folder_path = path.join(__dirname, '../../public');
expressApp.use(express.static(public_folder_path));

expressApp.use((req, res, next)=>{
    const allowedOrigins = ["http://localhost:4200"];
    const origin = req.headers.origin;

    console.log(origin + " requested http server");
    if (typeof origin === "string" && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

expressApp.get("/test", (req: any,res: { send: (arg0: string) => any; })=>{
    return res.send("test successed");
});

expressApp.get('/*',  function(req: any, res: { sendFile: (arg0: string, arg1: { root: string; }) => void; }, next: any) {
    res.sendFile('index.html', { root: public_folder_path }); 
});

export default expressApp;