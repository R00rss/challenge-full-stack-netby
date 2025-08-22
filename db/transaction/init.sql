IF DB_ID('TransactionInventory') IS NULL 
BEGIN 
    CREATE DATABASE TransactionInventory;
END

GO
    USE TransactionInventory;

GO
    IF OBJECT_ID('dbo.TransactionRecord', 'U') IS NULL 
    BEGIN 
        CREATE TABLE dbo.TransactionRecord (
            Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
            TransactionDate DATETIME NOT NULL,
            TransactionType NVARCHAR(50) NOT NULL,
            ProductId UNIQUEIDENTIFIER NOT NULL,
            Quantity INT NOT NULL,
            UnitPrice DECIMAL(18, 2) NOT NULL,
            TotalPrice DECIMAL(18, 2) NOT NULL,
            Detail NVARCHAR(MAX) NULL
        );
    END

GO
    INSERT INTO
        dbo.TransactionRecord (
            Id,
            TransactionDate,
            TransactionType,
            ProductId,
            Quantity,
            UnitPrice,
            TotalPrice,
            Detail
        )
    VALUES
        (
            '371B32D6-8375-438D-A82D-453026C8BBA5',
            GETDATE(),
            'Sale',
            'CAB8E0AC-C0EA-46E9-8208-095A89D94BBB',
            2,
            1.25,
            2.50,
            'Venta de 2 unidades de Doritos'
        ),
        (
            '4272A7A2-52F6-40A8-8D3E-FEE52C608889',
            GETDATE(),
            'Purchase',
            '4ED3D122-8E1A-4123-8CF9-C584B4143057',
            1,
            0.50,
            0.50,
            'Venta de 1 unidad de coca cola'
        );
GO