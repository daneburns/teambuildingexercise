const mysql = require("mysql");
const connection = require("./connection")
const inquirer = require("inquirer");
async function buttStuff() {
  const mongoose = await weinerStuff()
  queryThis(mongoose.choices)
}
console.log(buttStuff());

function weinerStuff() {
  const peepee = inquirer.prompt({
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

function queryThis(param) {

  switch (param) {

    case "View All Roles":
      queryView('roles')
    case "Add A Role":
      addRole()
      break;
    case "View All Departments":
      queryView('department')
      break;
    case "Add A Department":
      addDepartment('Billing')
      break;
    case "View All Employees":
      queryView('employee')
      break;
    case "Add Employees":
      addEmployee()
      break;



    default:
      console.log("I don't understand")
      buttStuff()

  }
}

function queryView(table) {
  connection.query(`SELECT * FROM ${table}`, function (err, results) {
    if (err) throw err;
    console.log(results)
    console.table(results)
    buttStuff();
  }
  );
}

function addDepartment() {
  inquirer.prompt({
    name: "input",
    type: "input",
    message: "What department would you like to add?",
  }).then(answers => {
    connection.query("INSERT INTO department (name) VALUES (?)", answers.input, function (err, results) {
      if (err) throw err;
      console.log(`Added ${answers.input} to list of departments.`)
      buttStuff();
    })

  })
}
function addEmployee() {
    connection.query("SELECT * FROM roles", function(error, results){
    if (error) throw error
    const titlesArray = []
    const titlesArrayGenerate = results.forEach(element => {
      titlesArray.push(element.title)
    })
    console.log(titlesArray)
    inquirer.prompt([{
      name: "firstname",
      type: "input",
      message: "What is the employee's first name?",
    },
    {
      name: "lastname",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role",
      type: "list",
      message: "What is the employee's job title?",
      choices: titlesArray
    },  
    {
      name: "manager",
      type: "input",
      message: "Who is the employee's manager?"
    },
    ]).then(answers => {
      connection.query("INSERT INTO employee (first_name, last_name VALUES (?,?); SELECT employee.first_name, employee.last_name, roles.title INNER JOIN roles.id ON", [answers.firstname, answers.lastname], function (err, results) {
        if (err) throw err;
        console.log(`Added ${answers.firstname} to list of employees.`)
        buttStuff();
      })
    })
    })
}
 
  


function addRole() {
  inquirer.prompt([
  {
    name: "title",
    type: "input",
    message: "What role would you like to add?",
  },
  {
    name: "salary",
    type: "input",
    message: "What is the salary?",

  }]).then(answers => { 
    connection.query("INSERT INTO roles (title, salary) VALUES (?,?)", [answers.title, answers.salary], function (err, results) {
    if (err) throw err;
    console.log(`Added ${answers.title} to list of roles.`)
    buttStuff()
  })
})
}


