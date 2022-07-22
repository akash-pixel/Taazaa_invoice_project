CREATE TABLE Invoice(
    InvoiceNo INT NOT NULL UNIQUE ,
    BillFrom VARCHAR(100) NOT NULL,
    BillTo VARCHAR(100) NOT NULL,
    ShipTo VARCHAR(255),
    PoNumber varchar(6), 
    BillDate date,
    DueDate date,
    Note TEXT,
    Subtotal NUMERIC(10, 2),
    TotalAmount NUMERIC(10, 2),
    AmountPaid NUMERIC(10, 2),
    AmountBalance NUMERIC(10, 2),

    PRIMARY KEY( InvoiceNo )
);

CREATE TABLE Item(
    Id SERIAL NOT NULL PRIMARY KEY,
    InvoiceNo INT NOT NULL REFERENCES invoice(InvoiceNo)    
    ON DELETE CASCADE ,
    Name VARCHAR(150) ,
    Price NUMERIC(8,2),
    Quantity INT,
    Amount NUMERIC(10,2)

);

INSERT INTO public.Invoice(
	InvoiceNo, BillFrom, BillTo, ShipTo, PoNumber, BillDate, DueDate, Note, Subtotal, TotalAmount, AmountPaid, AmountBalance)
	VALUES (1, 'abc', 'cde', 'def', '004567', '2-2-2022', '2-2-2022', 'some notes', 246.50, 246.50, 246.50, 0.00);