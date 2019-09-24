// Delcares requires node modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// Creates MySQL connection object
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

// Connects to MySQL database and calls main menu function upon connection
connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

// Main menu function uses inquirer for selection and switch statements to determie what function to run next
function mainMenu() {
    console.log("Welcome to the Bamazon Supervisor Application!")
    inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Quit"
      ]
    }).then(function(answer) {
        switch(answer.choice) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Quit":
                connection.end();
                break;
        };
    });
};

// Displays table with deparment information, overhead costs, products sales, and total profit
function viewSales() {
    // Queries MySQL and uses join to combine information from products and departments tables
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id;",function(err,res) {
        if(err) throw err;

        // Creates table to store information
        var table = new Table({
            head: ['Department ID','Department Name','Overhead Costs',"Product Sales","Total Profit"],
            colWidths: [25,25,25,25,25]
        });

        // Loops throus returned data and pushes to table
        for(i=0;i<res.length;i++){
            if(res[i].product_sales === null){
                res[i].product_sales = 0;
            };
            table.push([res[i].department_id,res[i].department_name,"$"+res[i].over_head_costs.toFixed(2),"$"+res[i].product_sales.toFixed(2),"$"+(res[i].product_sales-res[i].over_head_costs).toFixed(2)]);
        };

        // Logs table to console
        console.log("\n"+table.toString()+"\n");

        // Calls function to return to main menu
        mainMenu();
    });
};

// Function for creating a new department
function createDepartment() {
    // Inquirer prompts user for department information
    inquirer
    .prompt([
        {
            name: "departmentName",
            type: "input",
            message: "Please enter the Department Name."
        },
        {
            name: "overhead",
            type: "input",
            message: "Please enter the Overhead Costs."
        }
    ]).then(function(answer) {
        // Sends query to MySQL to add department to table
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?,?);",[answer.departmentName,answer.overhead],function(err,res) {
            if(err) throw err;

            // Logs to console to let user know department was succesfully created.
            console.log('\x1b[32m%s\x1b[0m',"New Department (" + answer.departmentName + ") has been created.");

            // Returns user to main menu
            mainMenu();
        });
    });
};