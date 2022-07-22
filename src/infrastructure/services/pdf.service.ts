import PDFDocument from 'pdfkit'; 
import fs from 'fs' ;

export default class PDF{

    private getDate( str:string ) { 
        const d=new Date(str); 
        const month = d.getMonth() +1; 
        return d.getDate()+"/"+ month +"/"+ d.getFullYear() 
    }

    public generatepdf( result: any ){
        const doc = new PDFDocument({font: 'Times-Roman'})

        // Saving pdf doc
        doc.pipe( fs.createWriteStream(`./pdf/${result.invoiceno}.pdf`) );

        // Text to add in pdf
        let alignLeft = `From: ${result.billfrom} \nTo: ${result.billto} \nShip to: ${result.shipto}`

        // For date and po number
        let alignRight = `Date: ${this.getDate(result.billdate)} \nDue Date: ${ this.getDate(result.duedate)}
        PO Number: ${result.ponumber}`

        // For Item details
        let itemList: string = "";
        for( let i =0; i< result.itemnames.length; i++ ){
            itemList += `${result.itemnames[i]}              ${result.itemquantity[i]}              ${result.itemprices[i]}              ${result.amount[i]} \n`
        }

        let total = `Subtotal: ${result.subtotal} \nTotal: ${result.totalamount} \nPaid: ${result.amountpaid} 
        \nBalance: ${result.amountbalance}`

        // Adding functionality
        doc
        .fontSize( 22 )
        .text( "INVOICE" , 100, 100 , {align: "center" })
        .moveDown();
        
        doc
        .fontSize( 16 )
        .text( `Invoice no.: ${result.invoiceno}`, {align: "left" });

        doc
        .fontSize( 15 )
        .text( alignLeft, {align: "left", width: 500 } )
        .moveUp().moveUp().moveUp()
        .text( alignRight, { align: "right", width: 400} )
        .moveDown();
        
        doc
        .text("Item              Quantity       Price       Amount").moveDown()
        .text( itemList )
        .text( total, {align: "right"} )
        .text( "Note :"+ result.note );

        // Stop writing in the pdf file
        doc.end()
    }

}