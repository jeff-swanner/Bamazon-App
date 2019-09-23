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
    productDisplay();
});


var totalProductLines = 0;

function productDisplay() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m',"\nWelcome to Bamazon! See our available products below.\n");

        var table = new Table({
            head: ['Produt ID','Product Name','Price'],
            colWidths: [25,25,25]
        });
        
        totalProductLines = res.length;

        for (i=0;i<res.length;i++) {
            table.push([res[i].item_id,res[i].product_name,"$"+res[i].price]);
        };
        console.log(table.toString());
        console.log("\n");
        mainMenu();
    });
};

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

function purchaseProduct() {
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
        if(!(0<answer.productID && answer.productID<=totalProductLines)){
            console.log('\x1b[31m%s\x1b[0m',"\nIncorrect Product ID.\n");
            return mainMenu();
        };
        connection.query("SELECT * FROM products WHERE item_id = ?", answer.productID, function(err, res) {
            if (err) throw err;
            if(res[0].stock_quantity<answer.quantity) {
                console.log('\x1b[31m%s\x1b[0m',"\nInsufficient inventory! Only " + res[0].stock_quantity + " in stock.\n");
                return mainMenu();
            } else {
                var updatedStock = res[0].stock_quantity - answer.quantity;
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
                      console.log('\x1b[32m%s\x1b[0m',"\nYour purchase has been approved!");
                      console.log("Product: " + res[0].product_name);
                      console.log("Quantity: " + answer.quantity);
                      console.log("Order total: $" +(answer.quantity*res[0].price));
                      console.log("Thank you for shopping with us!\n")
                      connection.end();
                    }
                );
            };
        });
    });
};