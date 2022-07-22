import * as express from "express";
import InvoiceController from "../controllers/invoice.controller";

export default class Invoice{

    private controller:any;
    constructor () {
        this.controller = new InvoiceController()
    }

    public init( router: express.Router){
        // GET
        router.get("/api/invoices", this.controller.getInvoices )
        router.get( "/api/:invoiceno", this.controller.getInvoice )
        router.get("/api/pdf/:invoiceno", this.controller.downloadInvoice )

        // POST
        router.post("/api/", this.controller.createInvoice )
        // PUT
        router.put( "/api/:invoiceno", this.controller.updateInvoice )
        // DELETE
        router.delete("/api/:invoiceno", this.controller.deleteInvoice )
        router.delete("/api/:invoiceno/:item", this.controller.deleteItem )
    }

}