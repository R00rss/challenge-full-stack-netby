IF DB_ID('ProductInventory') IS NULL 
BEGIN 
    CREATE DATABASE ProductInventory;
END

GO
    USE ProductInventory;

GO
    IF OBJECT_ID('dbo.Product', 'U') IS NULL 
    BEGIN 
        CREATE TABLE dbo.Product (
            Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
            Name NVARCHAR(255) NOT NULL,
            Description NVARCHAR(MAX) NULL,
            Category NVARCHAR(100) NULL,
            Image NVARCHAR(500) NULL,
            Price DECIMAL(18, 2) NOT NULL,
            Stock INT NOT NULL
        );
    END

GO
    INSERT INTO
        dbo.Product (
            Id,
            Name,
            Description,
            Category,
            Image,
            Price,
            Stock
        )
    VALUES
        (
            '4ED3D122-8E1A-4123-8CF9-C584B4143057',
            'Coca cola Personal',
            'Bebida azucarada con sabor a caramelo',
            'Refresco',
            'https://www.shutterstock.com/image-photo/yogyakarta-indonesia-oct-142021-coca-600nw-2534402125.jpg',
            0.50,
            100
        ),
        (
            'CAB8E0AC-C0EA-46E9-8208-095A89D94BBB',
            'Doritos',
            'Snack a base de maiz con colorante',
            'Snack',
            'https://www.supermaxi.com/wp-content/uploads/2025/06/7861018591422-1-1.jpg.webp',
            1.25,
            50
        );
GO