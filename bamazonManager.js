var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "12345678",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

function mainMenu() {
    console.log("Welcome to the Bamazon Manager Application!")
    inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Quit"
      ]
    }).then(function(answer) {
        switch(answer.choice) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Quit":
                connection.end();
                break;
        };
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m',"\nHere are the currently stocked products.\n");
  
        var table = new Table({
            head: ['Produt ID','Product Name','Price',"Quantity"],
            colWidths: [25,25,25,25]
        });

        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price,res[i].stock_quantity]);
        };
        console.log(table.toString());
        console.log("\n");
        mainMenu();
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        console.log("\nLow Inventory:\n");
  
        var table = new Table({
            head: ['Produt ID','Product Name','Price',"Quantity"],
            colWidths: [25,25,25,25]
        });

        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price,res[i].stock_quantity]);
        };
        console.log(table.toString());
        console.log("\n");
        mainMenu();
    });
};

function addInventory() {
    inquirer
    .prompt([{
      name: "productID",
      type: "input",
      message: "Please enter the ID of the product you wish to add inventory to."
    },
    {
        name: "quantity",
        type: "input",
        message: "How many units are you adding to the inventory?"
    }])
    .then(function(answer) {
        var updatedStock = 0;
        connection.query("SELECT * FROM products WHERE item_id = ?", answer.productID, function(err, res) {
            if (err) throw err;
            updatedStock = res[0].stock_quantity + parseInt(answer.quantity);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: updatedStock
                  },
                  {
                    item_id: answer.productID
                  }
                ],
                function(err2, res2) {
                    if (err2) throw err2;
                    console.log('\x1b[32m%s\x1b[0m',"\n"+answer.quantity + " units added to " + res[0].product_name + " inventory.\n");
                    mainMenu();
                });
        });
        
        
    });
};

function newProduct() {
    inquirer
    .prompt([
    {
        name: "productName",
        type: "input",
        message: "Please enter the new product name."
    },
    {
        name: "departmentName",
        type: "input",
        message: "What department would you like to list this product under?"
    },
    {
        name: "price",
        type: "input",
        message: "Please enter the new product list price."
    },
    {
        name: "quantity",
        type: "input",
        message: "Please enter initial product inventory."
    },
    ])
    .then(function(answer) {
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",[answer.productName,answer.departmentName,answer.price,answer.quantity],function(err,res) {
            if(err) throw err;
            console.log('\x1b[32m%s\x1b[0m',"\nNew product (" + answer.productName + ") has been added to the Bamazon marketplace.\n");
            mainMenu();
        });
    });
};

