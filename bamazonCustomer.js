// Delcares requires node modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// Creates MySQL connection object
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazon_DB"
});

// Connects to MySQL database and calls product display function upon connection
connection.connect(function(err) {
    if (err) throw err;
    productDisplay();
});

// Creates global variable
var totalProductLines = 0;

// Displays available products
function productDisplay() {
    // Queries product table for all available products
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m',"\nWelcome to Bamazon! See our available products below.\n");

        // Creates a table object using the cli-table node module and declares table headers and column widths
        var table = new Table({
            head: ['Product ID','Product Name','Price'],
            colWidths: [25,25,25]
        });
        
        // Sets variable equal to the count of total products available
        totalProductLines = res.length;

        // Loops through each row in table and pushes the data to the table
        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price.toFixed(2)]);
        };

        // Logs table to console
        console.log(table.toString());
        console.log("\n");

        // Calls main menu function after displaying products
        mainMenu();
    });
};

// Uses inquirer and switch functions to choose between purchasing products and quiting application
function mainMenu() {
    console.log("Welcome to the Bamazon Manager Application!")
    inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
          "Purchase Products",
          "Quit"
      ]
    }).then(function(answer) {
        switch(answer.choice) {
            case "Purchase Products":
                purchaseProduct();
                break;
            case "Quit":
                connection.end();
                break;
        };
    });
};

// Function for allowing user to purchase a product
function purchaseProduct() {
    // Inquirer asks for product id and quantity to purchase
    inquirer
    .prompt([{
      name: "productID",
      type: "input",
      message: "Please enter the ID of the product you'd like to buy."
    },
    {
        name: "quantity",
        type: "input",
        message: "How many units would you like to purchase?"
    }])
    .then(function(answer) {
        // Checks if Product ID matches existing product range
        if(!(0<answer.productID && answer.productID<=totalProductLines)){
            console.log('\x1b[31m%s\x1b[0m',"\nIncorrect Product ID.\n");
            return mainMenu();
        };

        // Queries MySQL for product that user selected
        connection.query("SELECT * FROM products WHERE item_id = ?", answer.productID, function(err, res) {
            if (err) throw err;

            // Checks if quantity to purchase is in stock
            if(res[0].stock_quantity<answer.quantity) {
                console.log('\x1b[31m%s\x1b[0m',"\nInsufficient inventory! Only " + res[0].stock_quantity + " in stock.\n");
                return mainMenu();
            } else {
                // Variable to store updated inventory
                var updatedStock = res[0].stock_quantity - answer.quantity;

                // Queries MySQL to update product inventory
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

                      // Logs purchase to console
                      console.log('\x1b[32m%s\x1b[0m',"\nYour purchase has been approved!");
                      console.log("Product: " + res[0].product_name);
                      console.log("Quantity: " + answer.quantity);
                      console.log("Order total: $" +(answer.quantity*res[0].price).toFixed(2));
                      console.log("Thank you for shopping with us!\n");

                      // Calls function to update product_sales column
                      updateSales(answer.productID, (answer.quantity*res[0].price),res[0].product_sales);
                });
            };
        });
    });
};

// Updates product sales column once purchase is complete
function updateSales(itemID, salePrice, previousSales) {
    if(previousSales === null){
        previousSales = 0;
    };

    // Calculates the new sales total value
    var newSales = parseFloat(salePrice) + parseFloat(previousSales);

    // Queries MySQL to update sales column
    connection.query("UPDATE products SET ? WHERE ?",[{product_sales: newSales},{item_ID: itemID}],function(err,res){
        if (err) throw err;
    });

    // Ends connection upon completion
    connection.end();
};