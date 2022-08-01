CREATE TABLE Invoice(
    "InvoiceNumber" INT NOT NULL UNIQUE ,
    "InvoicedBy" VARCHAR(100) NOT NULL,
    "InvoicedTo" VARCHAR(100) NOT NULL,
    "ShippingAddress" VARCHAR(255),
    "PONumber" varchar(6), 
    "InvoiceGeneratedOn" date,
    "DueDate" date,
    "Note" TEXT,
    "SubTotal" NUMERIC(10, 2),
    "TotalAmount" NUMERIC(10, 2),
    "AmountPaid" NUMERIC(10, 2),
    "AmountBalance" NUMERIC(10, 2),

    PRIMARY KEY( InvoiceNumber )
);

CREATE TABLE Item(
    "Id" SERIAL NOT NULL PRIMARY KEY,
    "InvoiceNumber" INT NOT NULL REFERENCES invoice(InvoiceNumber) ON DELETE CASCADE ,
    "Name" VARCHAR(150) ,
    "Price" NUMERIC(8,2),
    "Quantity" INT,
    "Amount" NUMERIC(10,2)

);

INSERT INTO public.invoice(
	"InvoiceNumber", "InvoicedBy", "InvoicedTo", "ShippingAddress", "PONumber", "InvoiceGeneratedOn", "DueDate", "Note", "SubTotal", "TotalAmount", "AmountPaid", "AmountBalance")
	VALUES (1, 'abc', 'cde', 'def', '004567', '2-2-2022', '2-2-2022', 'some notes', 246.50, 246.50, 246.50, 0.00);