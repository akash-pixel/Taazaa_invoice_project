/**
 * This file contains the code required
 * to spin up the application and required
 * services.
 */
import express from "express";
import CONFIG from "./config";
import { DBConfig } from "./database";
import Routes from "./routes";

const app = express();

app.use( express.urlencoded({extended: true}) );
app.use( express.json() )

// todo: Plug with actual tenant Id from process

const setup = (err: Error | null) => {
    if (err) {
        process.exit(1);
    }

    /**
     * Initialize Routes
     */
    Routes.init(app, express.Router());

    /**
     * Initialize App Server
     */
    initAppServer();
}

/**
 * Start Application Server
 */
 const initAppServer = () => {
    app.listen(CONFIG.reports.HTTP_PORT, (err?: Error | null) => {
        if (err) {
            process.exit(1);
        }
        console.log(`[**] MS Structure running on ${CONFIG.reports.HTTP_PORT}`);
    });
};

DBConfig.initPostgresDb( setup );


