DROP DATABASE IF EXISTS team_DB;
CREATE DATABASE team_DB;
USING team_DB;

CREATE TABLE department (
  id INTEGER(20) PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
);

CREATE TABLE role (

  id INTEGER PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL, 
  department_id INTEGER(20) FOREIGN KEY (department_id) REFERENCES department(id)
 
);

CREATE TABLE employee (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(20) FOREIGN KEY (role_id) 
  manager_id INTEGER(20) FOREIGN KEY (manager_id) 
);



-- * **department**:

--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

-- * **role**:

--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to

-- * **employee**:

--   * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager