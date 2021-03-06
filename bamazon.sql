DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL(10,2) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("MacBook Pro", "Computers", 1200.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microsoft Surface", "Computers", 950.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Infinite Jest", "Books", 11.19, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Permanent Record", "Books", 17.99, 250);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Fire Stick", "Electronics", 24.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bamazon Echo", "Electronics", 149.99, 75);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stand Mixer", "Home & Kitchen", 249.99, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sous Vide", "Home & Kitchen", 149.99, 23);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Avengers: End Game", "Movies & TV", 29.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Knife Set", "Home & Kitchen", 49.55, 8);

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Computers",1000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books",100);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics",900);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Home & Kitchen",400);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Movies & TV",1000);