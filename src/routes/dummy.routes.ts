import * as express from "express";
import { DummyController } from "../controllers/dummy.controller";

export class DummyRoutes {

    constructor() {
    }

    public init(router: express.Router) {
        router.get("/api/getInvoices", new DummyController().getInvoices );
    }
}
