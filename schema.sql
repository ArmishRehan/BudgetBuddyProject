-- Create the database (if not already created)
CREATE DATABASE IF NOT EXISTS budgetdb;

-- Use the newly created database
USE budgetdb;

-- Create the userslogin table
CREATE TABLE IF NOT EXISTS userslogin (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    user_pass VARCHAR(255) NOT NULL
);

-- Sample user (for testing)
INSERT INTO userslogin (user_name, user_pass) 
VALUES ('Lareb', 'lareb123');

ALTER TABLE userslogin
ADD COLUMN user_email VARCHAR(255) UNIQUE;
CREATE TABLE budget_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Income', 'Expense') NOT NULL,
    date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255) NOT NULL
);


select * from userslogin;
