import fs from 'fs' ;
import path from 'path';
import * as puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

import { IInvoiceViewModel } from '../api.models/invoice.view.model';

export default class PDF{

    private getDate( date:Date ) : string { 
        const d=new Date(date); 
        const month = d.getMonth() +1; 
        return d.getDate()+"/"+ month +"/"+ d.getFullYear() 
    }

    public async generatePdf( invoice: IInvoiceViewModel ) : Promise<void> {

        var templateHtml = fs.readFileSync( path.join(process.cwd(), 'src/templates/pdf.html'), 'utf8' )
        var template = Handlebars.compile(templateHtml);
        var html = template({invoice})

        
    	var pdfPath = path.join('pdf', `${invoice.InvoiceNumber}.pdf`);

        var options = {
            width: '1230px',
            headerTemplate: "<p></p>",
            footerTemplate: "<p></p>",
            displayHeaderFooter: false,
            margin: {
                top: "10px",
                bottom: "30px"
            },
            printBackground: true,
            path: pdfPath
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: true
        });

        var page = await browser.newPage();

        await page.goto(`data:text/html;charset=UTF-8,${html}`, {
            waitUntil: 'networkidle0'
        })

        await page.pdf(options);
        await browser.close()
    }

}