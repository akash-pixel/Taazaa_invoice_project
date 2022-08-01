/**
 * This file contains the code required
 * to initialize and map routes.
 */
import * as express from "express";

import Invoice from "./invoice.route";

export default class Routes {
    public static init(app: express.Application, router: express.Router) {
        /**
         * Initialize App Routes
         */
        // new DummyRoutes().init(router);

        new Invoice().init( router );

        app.use("/", router);
    }
}
