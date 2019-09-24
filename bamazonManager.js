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

// Connects to MySQL database and calls main menu function upon connection
connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

// Main menu function uses inquirer for selection and switch statements to determie what function to run next
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

// Displays all the available products including the quantity in stock
function viewProducts() {
    // Queries products table for all rows
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m',"\nHere are the currently stocked products.\n");
  
        // Creates table to be logged to console using cli-table module
        var table = new Table({
            head: ['Produt ID','Product Name','Price',"Quantity"],
            colWidths: [25,25,25,25]
        });

        // Loops through returned data and pushes information to the table
        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price.toFixed(2),res[i].stock_quantity]);
        };

        // Logs table to console
        console.log(table.toString());
        console.log("\n");

        // Calls function to return to the main menu
        mainMenu();
    });
};

// Displays items with inventory less than 5
function lowInventory() {

    // Queries MySQL for all rows where stock quantity is less than 5
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        console.log("\nLow Inventory:\n");
  
        // Creates table to be logged to console with low inventory items
        var table = new Table({
            head: ['Produt ID','Product Name','Price',"Quantity"],
            colWidths: [25,25,25,25]
        });

        // Loops through returned MySQL data and pushes to table
        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price.toFixed(2),res[i].stock_quantity]);
        };

        // Logs table to console
        console.log(table.toString());
        console.log("\n");

        // Calls function to return to main menu
        mainMenu();
    });
};

// Allows manager to add additional inventory to products
function addInventory() {
    // Inquirer prompts user for prodcut ID and quantity to add to inventory
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

        // Queries table for products matching the item_id provided
        connection.query("SELECT * FROM products WHERE item_id = ?", answer.productID, function(err, res) {
            if (err) throw err;

            // Updates stock quantity based on initial stock and user input
            updatedStock = res[0].stock_quantity + parseInt(answer.quantity);

            // Updates stock quantituy for the item in the MySQL table
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

                    // Logs response to console let manager know what product has been added
                    console.log('\x1b[32m%s\x1b[0m',"\n"+answer.quantity + " units added to " + res[0].product_name + " inventory.\n");
                    mainMenu();
            });
        });
    });
};

// Function to create new product
function newProduct() {
    // Inquirer prompts user for product information
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

        // Sends query to MySQL to add new product to table
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",[answer.productName,answer.departmentName,answer.price,answer.quantity],function(err,res) {
            if(err) throw err;
            console.log('\x1b[32m%s\x1b[0m',"\nNew product (" + answer.productName + ") has been added to the Bamazon marketplace.\n");

            // Calls function to return to main menu when finished
            mainMenu();
        });
    });
};