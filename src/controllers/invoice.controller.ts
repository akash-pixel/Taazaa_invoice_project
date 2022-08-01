import InvoiceService from "../infrastructure/services/invoice.service";

export default class InvoiceController {

    public async getInvoice( req: any , res: any, next:any ){
        const invoiceNumber = req.params.invoiceNumber;
        try{
            const result = await new InvoiceService().getInvoice( invoiceNumber )
            return res.send( result ) 
        } catch( err ){
            next(err);
        }
    }
    
    public async createInvoice( req: any , res: any, next: any){
        try{
            const result = await new InvoiceService().createInvoice( req.body )
            return res.send(result)
        } catch (err){
            next(err)
        }
    }

    public async updateInvoice( req: any, res: any, next: any ){
        const inv = req.body
        inv.InvoiceNumber = req.params.invoiceNumber ;
        try{
            const result = await new InvoiceService().updateInvoice( inv )
            res.send(result)
        } catch (err){
            next(err)
        }
    }

    public async deleteInvoice( req:any, res: any, next:any ){
        try{
            const result = await new InvoiceService().deleteInvoice( req.params.invoiceNumber )
            res.send( result )
        } catch( err) {
            next(err)
        }
    }

    public async deleteItem( req: any, res: any, next: any ){
        const {invoiceNumber, item } = req.params;
        try{
            const result = await new InvoiceService().deleteItemFromInvoice(invoiceNumber, item)
            res.send(result)
        } catch (err){
            next(err)
        }
    } 

    public async getPDF(req: any, res: any, next: any) {
        try{
            const result: any = await new InvoiceService().getPDF( req.params.invoiceNumber ) 
            return res.download( result.path, result.fileName )   
        }catch(err){
            next(err)
        }
    }
}