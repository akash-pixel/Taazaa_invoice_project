import InvoiceService from "../infrastructure/services/invoice.service";

export default class InvoiceController {

    public async getInvoices(req:Express.Request, res: any) {
        console.log("YOU REACHED TO THE ConTroLleR")
        const result =  await new InvoiceService().getAllInvoices()
        return res.send(result)
    }

    public async getInvoice( req: any , res: any ){
        const num = req.params.invoiceno;
        const result = await new InvoiceService().getInvoice( num )
        return res.send( result ) 
    }
    
    public async createInvoice( req: any , res: any){
       const result = await new InvoiceService().createInvoice( req.body )
       return res.send(result)     
    }

    public async updateInvoice( req: any, res: any ){
        const Invoiceno = req.params.invoiceno ;
        const inv = req.body
        inv.Invoiceno = Invoiceno
        const result = await new InvoiceService().updateInvoice( inv )
        res.send(result)
        
    }

    public async deleteInvoice( req:any, res: any ){
        const result = await new InvoiceService().deleteInvoice( req.params.id )
        res.send( result )
    }

    public async deleteItem( req: any, res: any ){
        const {invoiceno, item } = req.params;
        const result = await new InvoiceService().deleteItemFromInvoice(invoiceno, item)
        res.send(result)
    } 

    public async downloadInvoice(req: any, res: any){
        const invoiceno = req.params.invoiceno
        const result = await new InvoiceService().getPDF( invoiceno )
       
        res.download(result, `${invoiceno}.pdf` )
    }
}