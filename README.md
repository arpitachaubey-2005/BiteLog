# 🍽️ BiteLog

A full-stack meal and symptom tracking application that helps users record meals, monitor digestion-related symptoms, and identify patterns between food and health.

## 📌 Overview

BiteLog allows users to create an account, log their daily meals, rate how those meals affected them, and record symptoms experienced afterward. The goal is to help users better understand their eating habits and digestive health.

## ✨ Features

* User Registration and Login
* Secure Authentication with Passport.js
* Add and manage meals
* Track meal ratings
* Record symptoms for individual meals
* View meal history
* PostgreSQL database integration
* Session-based authentication

## 🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* EJS
* Passport.js
* Express Session
* HTML
* CSS
* JavaScript

## 📂 Database Structure

### Users

* id
* email
* password

### Meals

* id
* user_id
* meal_type
* meal_date
* rating
* notes

### Symptoms

* id
* meal_id
* symptoms

## 🚀 How to Run

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add required environment variables.

4. Start the application

```bash
node index.js
```

5. Open the application in your browser.

## 🧠 Concepts Practiced

* Authentication and Authorization
* CRUD Operations
* Relational Databases
* Session Management
* Express Routing
* PostgreSQL Queries
* EJS Templating

## 🔮 Future Improvements

* Food analytics dashboard
* Search and filtering
* Charts and reports
* Mobile-friendly design
* Export meal history

## 👩‍💻 Author

Arpita Chaubey
