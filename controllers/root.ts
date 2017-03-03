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
        let commandArray = JSON.parse(process.env.ACTION_COMMAND);

        context.response.render("launch", { 
            doItUrl: K.getActionRoute(Root, "doIt"),
            commands: commandArray
        });
    }

    @K.Post("/doIt")
    @K.DocAction("Execute the action")
    @K.ActionMiddleware(App.authorize)
    doIt(context: K.Context, @K.FromBody("command") index: string): Object {

        try {
            let commandIndex = parseInt(index);

            let commandArray = JSON.parse(process.env.ACTION_COMMAND);

            let command = commandArray[commandIndex];

            if (command == undefined) {
                throw new K.InternalServerError("Missing ACTION_COMMAND");
            }

            let output = Process.execFileSync(command, { encoding: "utf8", stdio: "pipe" });

            return { output: output };

        } catch (err) {
            let e = err as Error;
            return { error: `Name: ${e.name} \n Message: ${e.message} \n Stack: ${e.stack}` };
        }
    }
}
