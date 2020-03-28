const mysql = require("mysql");
const connection = require("./connection")
const inquirer = require("inquirer");

init()

async function init() {
    const navChoice = await action()
    await doAction(navChoice)

}

function action() {
    return inquirer.prompt({
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
            "Update employee's role",
            "Update employee's manager"
        ]
    })
}

async function doAction(navChoice) {
    switch (navChoice.choices) {
        case "View All Roles":
            await queryView("roles")

            break;
        case "Add A Role":
            await addRole()


            break;
        case "View All Departments":
            await queryView("department")

            break;
        case "Add A Department":
            const gerb = await addDepartment()



            break;
        case "View All Employees":
            await queryView("employee")

            break;
        case "Add Employees":
            await addEmployee()

            break;
        case "Update employee's role":
            await updateEmployee()
            break;
            case "Update employee's manager":
                await updateManager()
                break;



        default:
            console.log("REEEEEEEE")
            break;
    }
}

function queryView(table) {
    return connection.query(`SELECT * FROM ${table}`, function (err, results) {
        if (err) throw err;
        console.table(results)
        init()
    }
    );
}
async function addDepartment() {
    await inquirer.prompt({
        name: "input",
        type: "input",
        message: "What department would you like to add?",
    }).then(deptQuestions => {
        connection.query("INSERT INTO department (name) VALUES (?)", deptQuestions.input, function (err, results) {
            if (err) throw err;
            console.log(`Added ${deptQuestions.input} to list of departments.`)
            init()
        })
    })

}

function addRole() {
    connection.query("SELECT * FROM department", function (error, results) {
        if (error) throw error
        const departments = results
        const choicesArray = []
        results.forEach(element => {
            choicesArray.push(element.name)
        });


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

            },
            {
                name: "department",
                type: "list",
                message: "What department is this employee in?",
                choices: choicesArray
            }]).then(answers => {
                const jerb = departments.filter(e => e.name === answers.department)
                connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)", [answers.title, answers.salary, jerb[0].id], function (err, results) {
                    if (err) throw err;
                    console.log(`Added ${answers.title} to list of roles.`)
                    init()

                })
            })
    }
    )
}

function addEmployee() {
    connection.query("SELECT * FROM roles", function (error, results) {
        if (error) throw error
        const choicesArray = []
        results.forEach(element => {
            choicesArray.push(element.title)
        })
        connection.query("SELECT * FROM employee", function (error, results2) {
            if (error) throw error
            const choicesArray2 = []
            results2.forEach(element => {
                choicesArray2.push(element.first_name + " " + element.last_name)
            })
            inquirer.prompt([
                {
                    name: "firstname",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "lastname",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is this employee's job title?",
                    choices: choicesArray
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: choicesArray2
                }
            ]).then(answers => {
                
                const jerb = results.filter(results => results.title === answers.role)
                const jerb3 = (answers.manager.split(" "))
                const jerb2 = results2.filter(results2 => results2.first_name === jerb3[0])
                

                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);", [answers.firstname, answers.lastname, jerb[0].id, jerb2[0].id], function (err, data) {
                    if (err) throw err;
                    console.log(`Added ${answers.firstname} to list of employees.`)
                    init()
                })
            })
        })
    })
}

function updateEmployee() {
    connection.query("SELECT * FROM roles", function (error, results) {
        if (error) throw error
        const choicesArray = []
        results.forEach(element => {
            choicesArray.push(element.title)
        })
        connection.query("SELECT * FROM employee", function (error, results2) {
            if (error) throw error
            const choicesArray2 = []
            results2.forEach(element => {
                choicesArray2.push(element.first_name + " " + element.last_name)
            })
            inquirer.prompt([
                {
                    name: "which",
                    type: "list",
                    message: "Which employee's role would you like to change?",
                    choices: choicesArray2
                },
                {
                    name: "newrole",
                    type: "list",
                    message: "What is the employee's new role?",
                    choices: choicesArray
                },
            ]).then(answers => {
    
                const jerb = results.filter(results => results.title === answers.newrole)
                const jerb2 = results2.filter(results2 => results2.first_name + " " + results2.last_name === answers.which )
                connection.query("UPDATE employee SET role_id=(?) WHERE id=(?)", [jerb[0].id, jerb2[0].id], function (err, data) {
                    if (err) throw err;
                    console.log(`Updated ${results2.first_name} ${results2.last_name}'s role to ${jerb.title}`)
                    init()
                })
            })
        })
    })


}

function updateManager() {
   
        connection.query("SELECT * FROM employee", function (error, results) {
            if (error) throw error
            const choicesArray2 = []
            results.forEach(element => {
                choicesArray2.push(element.first_name + " " + element.last_name)
            })
            inquirer.prompt([
                {
                    name: "which",
                    type: "list",
                    message: "Which employee's manager would you like to change?",
                    choices: choicesArray2
                },
                {
                    name: "newmanager",
                    type: "list",
                    message: "Who is the employee's new manager?",
                    choices: choicesArray2
                },
            ]).then(answers => {

    
                const jerb = results.filter(results => results.first_name + " " + results.last_name === answers.newmanager)
                const jerb2 = results.filter(results => results.first_name + " " + results.last_name === answers.which)
                console.log(jerb)
                console.log(jerb2)
                connection.query("UPDATE employee SET manager_id=(?) WHERE id=(?)", [jerb[0].id, jerb2[0].id], function (err, data) {
                    if (err) throw err;
                    console.log(`Updated ${jerb2[0].first_name} ${jerb2[0].last_name}'s manager to ${jerb[0].first_name} ${jerb[0].last_name}`)
                    init()
                })
            })
        })


}