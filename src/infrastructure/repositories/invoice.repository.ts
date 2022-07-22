import { query } from 'express';
import {Pool} from 'pg';
import {DBConfig} from '../../database'
import { IInvoice, IItem } from '../api.models/invoice.interfaces';

export class InvoiceRepository {
    
    private dbConnection: Pool;

    constructor(){
        this.dbConnection = DBConfig.getConnection();
    }

    private async addInvoiceItems( items: Array<IItem> ) {
        let sql2 = `INSERT INTO item( invoiceno, name, price, quantity, amount ) VALUES ` ;               
        items.forEach((item, index) => {
            sql2 += ` ( '${item.Invoiceno}', '${item.Name}', ${item.Price}, ${item.Quantity}, ${item.Amount}  )`;
            sql2 +=   index !== (items.length - 1) ? ", " :"; " ;            
        })

        await this.dbConnection.query( sql2 );        
    }

    private addInvoiceDetails( invoiceDetails: IInvoice ):void {
        const sql1 = `INSERT INTO public.invoice
            ( InvoiceNo, BillFrom, BillTo, ShipTo, PoNumber, BillDate, DueDate, Note, Subtotal, TotalAmount, AmountPaid, AmountBalance )
            VALUES ( $1, $2, $3, $4, $5 ,  $6, $7, $8, $9, $10 , $11, $12 );` 
        const values = Object.values( invoiceDetails )

        this.dbConnection.query( sql1, values )
    }

    public async getAllInvoices() {
        const sql = `select invoice.*,
                array_agg( item.name ) as ItemNames, 
                array_agg(item.price) as ItemPrices,
                array_agg( item.quantity ) as ItemQuantity, 
                array_agg(item.amount) as Amount
            from invoice
            INNER JOIN item ON item.invoiceno = invoice.invoiceno
            Group By invoice.invoiceno ;` ;
        const result = await this.dbConnection.query(sql);
        return result.rows; 
    }

    public async getInvoice( invoiceno: string ){
       const sql = `select invoice.*,
            array_agg( item.name ) as ItemNames, 
            array_agg(item.price) as ItemPrices,
            array_agg( item.quantity ) as ItemQuantity, 
            array_agg(item.amount) as Amount
        from invoice
        INNER JOIN item ON item.invoiceno = invoice.invoiceno
        WHERE invoice.invoiceno = ${invoiceno}
        Group By invoice.invoiceno ;`

        const result = await this.dbConnection.query(sql)
        return result.rows[0]
        
    }

    public async createInvoice( invoiceDetails: IInvoice, items: Array<IItem>  ) {
       
        // Inserting values in item values
        this.addInvoiceDetails( invoiceDetails );

        // For Inserting values in item table
        this.addInvoiceItems(items);        
    }

    public async isValidInvoiceNo( invoiceno: string ){
        const result = await this.dbConnection.query( `SELECT * FROM invoice WHERE invoiceno = '${invoiceno}'` );
        return result.rows.length === 0 ? true : false;
    }

    public async deleteInvoice( invoiceno: string ) {
        const sql = `DELETE FROM invoice WHERE invoice.invoiceno = ${invoiceno};`
        await this.dbConnection.query( sql )
    }

    public async deleteItemFromInvoice( invoiceno:string, itemName:string ){
        const sql = `DELETE FROM item WHERE invoiceno = '${invoiceno}' AND name = '${itemName}';`
        await this.dbConnection.query( sql )
    }

    public async update ( details: IInvoice ) {
        const sql = `UPDATE invoice  SET 
            billfrom = '${ details.Billfrom }', 
            billto = '${details.Billto}',
            shipto = '${details.Shipto}',
            ponumber = '${details.Ponumber}',
            billdate = '${details.Billdate}',
            duedate = '${details.Duedate}',
            note = '${details.Note}', 
            subtotal= ${details.Subtotal},
            totalamount = ${details.Totalamount},
            amountpaid = ${details.Amountpaid},
            amountbalance = ${details.Amountbalance}
            WHERE invoiceno = ${details.Invoiceno};  `

        const result = await this.dbConnection.query( sql )
        console.log("Updating Product details" , result)
    }


}