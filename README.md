# Bamazon-App

## Description

This application is a command line application created using Node.js and MySQL to create a mock amazon product application. The application has 3 differnect access levels. The customer application allows a user to purchase products and stores the information in a MySQL table. The manager application allows the user to view product inventory, update inventory quantites, and add new products. The supervisor application uses MySQL JOINS to create a table showing the department costs, sales to date, and total profit. 

## How To Use
1. Download the github repository to your computer. 
2. Navigate to the project directory in the command line and run npm install to install the necessary node modules.
3. Copy the bamazon.sql file contents into MySQL and run to initialize database and tables. It contains 10 starter products and 5 departments that can be modified as needed.
4. Port and password information for MySQL may need to be modified and can be found at the top of each of the javascript files.
5. Finally, you can run the input commands in the terminal as outlined below.

## Terminal Commands
* npm install
    * Installs the necessary node modules
* node bamazonCustomer.js
    * Calls the customer application
* node bamazonManager.js
    * Calls the manager application
* node bamazonSupervisor
    * Calls the supervisor application

## Technologies Used
* Node.js - Used for core application
* MySQL - Used to store database information
* Inquirer node module - Used for user input
* cli-table node module - Used for formatting data displayed on the command line

## Google Drive Tutorial
* [WebM Google Drive Link](https://drive.google.com/file/d/1ERVkJyy2eF_i12j7vZU_-XaTpByN9GHC/view)

## Creator
Jeff Swanner
