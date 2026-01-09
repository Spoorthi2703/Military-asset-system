Military Asset Management System
A full-stack web application designed to track military inventory, including asset purchases, transfers, and assignments. This system ensures high data integrity and real-time tracking of mission-critical hardware.

🚀 Live Deployment Links

Frontend (UI): https://military-asset-system-lac.vercel.app

Backend (API): https://military-asset-system-jkxg.onrender.com

🛠 Tech Stack
Frontend: React.js, Tailwind CSS, Axios (Deployed on Vercel)

Backend: Node.js, Express.js (Deployed on Render)

Database: MySQL (Hosted on Aiven Cloud)

Authentication: JSON Web Tokens (JWT)

📊 Database Justification & Design
For this project, a Relational Database (SQL) was selected over NoSQL.

Justification:
Data Integrity: Military tracking requires strict consistency. Relational databases ensure that quantities are updated accurately across tables without discrepancies.

ACID Compliance: Transactions (like transferring a stock from one base to another) must either succeed completely or fail completely. SQL provides the atomicity required for these operations.

Auditability: The relational model allows for complex queries to generate history logs, ensuring every movement of an asset is tied to a specific user and timestamp.

Requirement Support:
Purchases: Recorded in the transactions table with a PURCHASE type, increasing the total inventory.

Assignments: Assets are linked to specific personnel/units via foreign keys, ensuring clear accountability.

Movements: The system calculates "Closing Balances" by performing real-time aggregations of all historical inbound and outbound movements.

📂 Project Structure
/frontendd: React source code and UI components.

/backend: Express API routes, JWT logic, and database configurations.

database_dump.sql: Full SQL script to recreate the schema and sample data.

🔑 Test Credentials
To test the live system, use the following administrator account:

Service ID (Username): admin (or your specific test user)

Access Key (Password): admin123 (or your specific test password)

How to Run Locally
Database: Import database_dump.sql into your local MySQL instance.

Backend: * Navigate to /backend, run npm install.

Update .env with your local DB credentials.

Run npm start.

Frontend:

Navigate to /frontendd, run npm install.

Run npm run dev.

