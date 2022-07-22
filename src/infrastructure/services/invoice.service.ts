import { IInputInvoce, IInvoice, IItem } from "../api.models/invoice.interfaces";
import { InvoiceRepository } from "../repositories/invoice.repository";
import * as path from 'path';
import PDF from "./pdf.service";

export default class InvoiceService{

    private repository:any ;

    constructor() {
        this.repository = new InvoiceRepository()  
    }

    public async getAllInvoices() {
        return await this.repository.getAllInvoices() ;
    }

    public async getInvoice( invoiceno: any ) {
        if( invoiceno.length < 1 || isNaN(invoiceno) ){
            console.log("Invalid Invoice number.")
            return "Invalid Invoice number."
        }
        return await this.repository.getInvoice( invoiceno ) ;
    }

    public async createInvoice( inv: IInputInvoce  ){
        // Invoice number validation
        const isNumberValid = await this.isInvoiceNoValid(inv.Invoiceno)
        if( !isNumberValid ){
            return "Invalid invoice number"
        }

        //  Data validation
        if( !this.isInvoiceValid(inv) )
            return "Invalid Data"

        // Calculations
        const { invoiceDetails, items } = this.Calculations( inv )

        // Saving data
        this.repository.createInvoice( invoiceDetails, items )
        return { invoiceDetails, items } ;
    }

    public async deleteInvoice( invoiceno:any ) {
        if( isNaN( invoiceno ) && invoiceno.length < 1 )
            return "Its not a number."

        await this.repository.deleteInvoice( invoiceno )
        return `${invoiceno} has been deleted.`
    }

    public async deleteItemFromInvoice( invoiceno:string, itemName:string ){
        await this.repository.deleteItemFromInvoice( invoiceno, itemName  )
        return `${itemName} is deleted.`
    }

    public async updateInvoice ( inv: IInputInvoce ) {
        const num = await this.repository.isValidInvoiceNo(inv.Invoiceno)
        
        if( isNaN(inv.Invoiceno) || num ){
            return "Invalid invoice number"
        }
        // Data validation
        if( !this.isInvoiceValid(inv) )
            return "Invalid Data"

        const { invoiceDetails } = this.Calculations( inv )
        await this.repository.update( invoiceDetails )
        return `${inv.Invoiceno} is been updated.`
    }

    private Calculations( inv: IInputInvoce): { invoiceDetails: IInvoice, items: any  } {
        let Subtotal : number = 0;
        const items  = inv.Items;
        delete inv.Items;

        items?.forEach( (item: Partial< IItem > ) => {
            item["Invoiceno"] = inv.Invoiceno ;
            item["Amount"] = item.Price! * item.Quantity! ;
            Subtotal += item.Amount
        })

        const Totalamount = Subtotal;
        const Amountbalance = Totalamount - inv.Amountpaid
        const invoiceDetails: IInvoice = { ...inv, Subtotal, Totalamount, Amountbalance }

        return { invoiceDetails, items }
    }

    public isInvoiceValid( inv:IInputInvoce ) {
        if( inv.Billto.length < 1 || inv.Billfrom.length < 1  )
            return false

        // let filetedList = inv.Items?.filter(item => {
        //     if( item.Name.length < 1 || item.Price < 0 || item.Quantity < 0 )
        //         return false
        // })
        
        return true
    }

    private async isInvoiceNoValid( invoiceno: any ): Promise<boolean> {

        if( isNaN( invoiceno ) || invoiceno.length < 1 )
            return false;

        const isValid: boolean =  await this.repository.isValidInvoiceNo( invoiceno ) ;
        return isValid;
    }

    public async getPDF( invoiceno: string ){
        
        const result = await this.getInvoice(invoiceno) ;
        new PDF().generatepdf( result )

        return `./pdf/${invoiceno}.pdf`
    }

}