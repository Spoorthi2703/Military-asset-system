-- 1. Setup the Database
CREATE DATABASE IF NOT EXISTS military_assets;
USE military_assets;

-- 2. Clean up existing tables
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS bases;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. BASES
CREATE TABLE bases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ASSETS
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, 
    role ENUM('Admin', 'Commander', 'Logistics') NOT NULL DEFAULT 'Logistics',
    base_id INT, 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE SET NULL
);

-- 6. INVENTORY
CREATE TABLE inventory (
    base_id INT,
    asset_id INT,
    quantity INT DEFAULT 0,
    PRIMARY KEY (base_id, asset_id),
    FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- 7. TRANSACTIONS
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    from_base_id INT, 
    to_base_id INT,   
    qty INT NOT NULL,
    type ENUM('PURCHASE', 'TRANSFER', 'ASSIGNMENT', 'EXPENDITURE') NOT NULL,
    personnel_name VARCHAR(100), 
    performed_by INT, 
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (from_base_id) REFERENCES bases(id),
    FOREIGN KEY (to_base_id) REFERENCES bases(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- --- SEED DATA ---

-- Create the main Base
INSERT INTO bases (name, location) VALUES ('Central Command', 'New Delhi');

-- Create initial Assets
INSERT INTO assets (name, type) VALUES ('M4 Carbine', 'Weapon'), ('Armored Jeep', 'Vehicle');

-- Create the Commander Account
-- TRIPLE CHECK: username is 'commander_main', password is 'admin123'
INSERT INTO users (username, password_hash, role, is_active, base_id) 
VALUES ('commander_main', 'admin123', 'Commander', 1, 1);

-- IMPORTANT: Save the changes permanently
COMMIT;