import * as express from "express";
import InvoiceController from "../controllers/invoice.controller";

export default class Invoice{

    private controller:any;
    constructor () {
        this.controller = new InvoiceController()
    }

    public init( router: express.Router){
        // GET
        // router.get("/api/html/:invoiceNumber", this.controller.getPDF )

        router.get( "/api/:invoiceNumber", this.controller.getInvoice )
        router.get("/api/pdf/:invoiceNumber", this.controller.getPDF )

        // POST
        router.post("/api/", this.controller.createInvoice )
        // PUT
        router.put( "/api/:invoiceNumber", this.controller.updateInvoice )
        // DELETE
        router.delete("/api/:invoiceNumber", this.controller.deleteInvoice )
        router.delete("/api/:invoiceNumber/:item", this.controller.deleteItem )
    }

}