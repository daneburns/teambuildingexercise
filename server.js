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
            "Update employee's manager",
            "View employees by manager",
            "Delete an employee",
            "Delete a role",
            "Delete a department",
            "View department budget"
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
            await employeeView()

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
        case "View employees by manager":
            await viewByManager()
            break;
        case "Delete an employee":
            await deleteCat("employee")
            break;
        case "Delete a role":
            await deleteCat("roles")
            break;
        case "Delete a department":
            await deleteCat("department")
            break;
        case "View department budget":
            await budgetView()
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

function employeeView() {
    return connection.query(`
    SELECT e.id, e.first_name, e.last_name,  r.title, d.name, CONCAT(f.first_name," ", f.last_name) AS manager
    FROM employee e
       LEFT JOIN
       roles AS r
       ON r.id = e.role_id
       LEFT JOIN
       department d
       ON r.department_id = d.id
       LEFT JOIN
       employee f
    ON e.manager_id = f.id;`, function (err, results) {
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
                const jerb2 = results2.filter(results2 => results2.first_name + " " + results2.last_name === answers.which)
                connection.query("UPDATE employee SET role_id=(?) WHERE id=(?)", [jerb[0].id, jerb2[0].id], function (err, data) {
                    if (err) throw err;
                    console.log(`Updated ${jerb2[0].first_name} ${jerb2[0].last_name}'s role to ${jerb[0].title}`)
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
            connection.query("UPDATE employee SET manager_id=(?) WHERE id=(?)", [jerb[0].id, jerb2[0].id], function (err, data) {
                if (err) throw err;
                console.log(`Updated ${jerb2[0].first_name} ${jerb2[0].last_name}'s manager to ${jerb[0].first_name} ${jerb[0].last_name}`)
                init()
            })
        })
    })


}

function viewByManager() {

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
                message: "Which manager's employee's would you like to see?",
                choices: choicesArray2
            },

        ]).then(answers => {


            const jerb = results.filter(results => results.first_name + " " + results.last_name === answers.which)
            connection.query("SELECT * FROM employee WHERE manager_id=(?)", [jerb[0].id], function (err, data) {
                if (err) throw err;
                console.table(data)
                init()
            })
        })
    })


}

function deleteCat(table) {
    return connection.query(`SELECT * FROM ${table}`, function (err, results) {
        if (err) throw err;
        console.table(results)
        const choicesArray2 = []
        if (table === "employee") {
            results.forEach(element => {
                choicesArray2.push(element.first_name + " " + element.last_name)
            })
        }
        if (table === "roles") {
            results.forEach(element => {
                choicesArray2.push(element.title)
            })
        }
        if (table === "department") {
            results.forEach(element => {
                choicesArray2.push(element.name)
            })
        }
        console.log(choicesArray2)
        inquirer.prompt([
            {
                name: "which",
                type: "list",
                message: "Which would you like to delete?",
                choices: choicesArray2
            },

        ]).then(answers => {

            if (table === "roles") {
                const jerb = results.filter(results => results.title === answers.which)
                connection.query("DELETE FROM roles WHERE roles.title=(?)", [jerb[0].title], function (err, data) {
                    if (err) throw err;
                    (`Deleted ${jerb[0].title} from roles!`)
                    init()
                })
            }
            if (table === "employee") {
                const jerb = results.filter(results => results.first_name + " " + results.last_name === answers.which)
                console.log(jerb)
                connection.query("DELETE FROM employee WHERE employee.id=(?)", [jerb[0].id], function (err, data) {
                    if (err) throw err;
                    console.log(`Deleted ${jerb[0].first_name} ${jerb[0].last_name} from employees!`)
                    init()
                })
            }
            if (table === "department") {
                const jerb = results.filter(results => results.name === answers.which)
                connection.query("DELETE FROM department WHERE department.name=(?)", [jerb[0].name], function (err, data) {
                    if (err) throw err;
                    (`Deleted ${jerb[0].name} from deparments!`)
                    init()
                })
            }

        })
    })
}

function budgetView() {
    connection.query("SELECT * FROM department", function (error, results) {
        if (error) throw error
        const choicesArray2 = []
        results.forEach(element => {
            choicesArray2.push(element.name)
        })
        inquirer.prompt([
            {
                name: "which",
                type: "list",
                message: "Which department's budget would you like to see?",
                choices: choicesArray2
            },

        ]).then(answers => {


            const jerb = results.filter(results => results.name === answers.which)
            connection.query("SELECT r.department_id, r.salary, d.id FROM roles r INNER JOIN department d ON r.department_id = d.id WHERE department_id=(?)", [jerb[0].id], function (err, data) {
                const salariesArray = []
                data.forEach(element => {
                    salariesArray.push(element.salary)
                });
                if (err) throw err;
                let sum = salariesArray.reduce(function (a, b) {
                    return a + b;
                }, 0)
                console.log(`The total budget for ${jerb[0].name} is $ ${sum}`)
                init()
            })
        })
    })

}
// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department