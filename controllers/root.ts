import * as K from "kwyjibo";
import App from "../app";
import * as Process from "child_process";

@K.Controller("/")
@K.DocController("Root controller.")
class Root {

    @K.Get("/")
    @K.DocAction(`Redirect to docker controller`)
    @K.ActionMiddleware(App.authorize)
    oauth(context: K.Context): void {
        context.response.render("launch", { doItUrl: K.getActionRoute(Root, "doIt") });
    }

    @K.Get("/doIt")
    @K.DocAction("Execute the action")
    @K.ActionMiddleware(App.authorize)
    doIt(context: K.Context): void {
        let command: string = process.env.ACTION_COMMAND;

        if (command == undefined) {
            throw new K.InternalServerError("Missing ACTION_COMMAND");
        }
        
        let output = Process.execFileSync(command, { encoding: "utf8", stdio: "pipe" });
            context.response.render("done", { output: output });
        
    }
}