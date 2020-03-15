const mysql = require("mysql");
const connection = require("./connection")
const inquirer = require("inquirer");
async function buttStuff() {
    const mongoose = await weinerStuff()
    queryThis(mongoose.choices)
}
console.log(buttStuff());

function weinerStuff() {
   const peepee =  inquirer.prompt({
    name: "choices",
    message: "What would you like to do?",
    type: "list",
    choices: [
      "View All Roles",
      "Add A Role",
      "View All Departments",
      "Add A Department",
      "View All Employees",
      "Add Employees",
    ]
  });
  return peepee
  
}

function queryThis(param){

    switch(param){

        case "View All Roles":
        console.log(param)
        queryView('department')
        case "Add A Role":
        console.log(param)
        break;
        case "View All Departments":
        console.log(param)
        break;
        case "Add A Department":
        console.log(param)
        break;
        case "View All Roles":
        console.log(param)
        break;
        case "View All Roles":
        console.log(param)
        break;
        case "View All Roles":
        console.log(param)
        break;
        

    
    default:
    
    }
}

function queryView(table){
        connection.query(
        "SELECT * FROM ?", table,
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          buttStuff();
        }
      );
}