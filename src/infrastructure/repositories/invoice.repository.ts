import {Pool} from 'pg';
import {DBConfig} from '../../database'
import { IItem } from '../../models/item.model';
import { IInvoice } from '../../models/invoice.model';

export class InvoiceRepository {
    
    private dbConnection: Pool;

    constructor(){
        this.dbConnection = DBConfig.getConnection();
    }

    private async addInvoiceItems( items: Array<IItem> ) {
        let sql2 = `INSERT INTO item( "InvoiceNumber", "Name", "Price", "Quantity", "Amount" ) VALUES ` ;               
        items.forEach((item, index) => {
            sql2 += ` ( '${item.InvoiceNumber}', '${item.Name}', ${item.Price}, ${item.Quantity}, ${item.Amount}  )`;
            sql2 +=   index !== (items.length - 1) ? ", " :"; " ;            
        })

        await this.dbConnection.query( sql2 );        
    }

    private async addInvoiceDetails( invoiceDetails: IInvoice ) {
        const sql1 = 'INSERT INTO public.invoice(\
            "InvoiceNumber", "InvoicedBy", "InvoicedTo", "ShippingAddress", "PONumber", "InvoiceGeneratedOn", "DueDate", "Note", "SubTotal", "TotalAmount", "AmountPaid", "AmountBalance")\
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 , $11, $12 );'
        const values = Object.values( invoiceDetails )
            
        await this.dbConnection.query( sql1, values )
    }

    public async getInvoiceDetails( invoiceNumber: string ){
        const sql = `SELECT * FROM invoice WHERE "InvoiceNumber" = ${invoiceNumber} ;`
        const result = await this.dbConnection.query(sql)
        return result.rows[0]
    }

    public async getInvoiceItems( invoiceNumber: string ){
        const sql = `SELECT "Name", "Quantity", "Price", "Amount" FROM item WHERE "InvoiceNumber" = ${invoiceNumber} ;`
        const result = await this.dbConnection.query(sql)
        return result.rows
    }

    public async createInvoice( invoiceDetails: IInvoice, items: Array<IItem>  ) {
       
        // Inserting values in item values
        await this.addInvoiceDetails( invoiceDetails );

        // For Inserting values in item table
        await this.addInvoiceItems(items);        
    }

    // If the invoice number is present in the database it will return true else false
    public async isInvoiceNumberPresent( invoiceNumber: string ): Promise<boolean> {
        const result = await this.dbConnection.query( `SELECT * FROM invoice WHERE "InvoiceNumber" = '${invoiceNumber}'` );
        return result.rows.length === 0 ? false : true;
    }

    public async deleteInvoice( invoiceNumber: string ) {
        const sql = `DELETE FROM invoice WHERE "InvoiceNumber" = ${invoiceNumber};`
        await this.dbConnection.query( sql )
    }

    public async deleteItemFromInvoice( invoiceNumber:string, itemName:string ){
        const sql = `DELETE FROM item WHERE "InvoiceNumber" = '${invoiceNumber}' AND "Name" = '${itemName}';`
        await this.dbConnection.query( sql )
    }

    public async update ( details: IInvoice ) {
        const sql = `UPDATE invoice  SET 
            "InvoicedBy" = '${ details.InvoicedBy }', 
            "InvoicedTo" = '${details.InvoicedTo}',
            "ShippingAddress" = '${details.ShippingAddress}',
            "PONumber" = '${details.PONumber}',
            "InvoiceGeneratedOn" = '${details.InvoiceGeneratedOn}',
            "DueDate" = '${details.DueDate}',
            "Note" = '${details.Note}', 
            "SubTotal"= ${details.SubTotal},
            "TotalAmount" = ${details.TotalAmount},
            "AmountPaid" = ${details.AmountPaid},
            "AmountBalance" = ${details.AmountBalance}
            WHERE "InvoiceNumber" = ${details.InvoiceNumber};  `

        const result = await this.dbConnection.query( sql )
        console.log("Updating Product details" , result)
    }


}