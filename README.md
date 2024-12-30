# Pharmacy Medicines Backend

A backend system designed for managing pharmacy inventories. This project allows users to add medicines manually or in bulk using an Excel file. Built with **Node.js**, **Express.js**, and **MongoDB**, it ensures efficient and reliable medicine management.

---

## Features

- **Add Medicines Manually**  
  Add individual medicines to the inventory through the provided API endpoints.

- **Bulk Upload via Excel (XLSX)**  
  Upload `.xlsx` files to import multiple medicines into the inventory at once.

- **Database Integration**  
  Leverages **MongoDB** for secure and scalable storage of medicine data.

---

## Technologies Used

- **Backend Framework**: [Express.js](https://expressjs.com/)  
- **Database**: [MongoDB](https://www.mongodb.com/)  
- **Excel Parsing**: [xlsx](https://www.npmjs.com/package/xlsx)  

---

## Installation

Follow these steps to set up and run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pharmacy-medicines-backend.git
   cd pharmacy-medicines-backend
2. Install dependencies:
   npm install

3. Set up environment variables in a `.env` file:
   PORT=3000
   MONGO_URI=<your-mongodb-uri>

4. Start the server:
   npm start
