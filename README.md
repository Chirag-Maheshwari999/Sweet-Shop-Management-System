# Sweet Shop Management System

A modern, full-stack application for managing a sweet shop's inventory and sales. Built with a React frontend and a Spring Boot backend using MySQL.

## 🚀 Features

### User Features
*   **Browse Sweets:** View a catalog of available sweets with images and prices.
*   **Search**: Real-time search by name or description.
*   **Purchase**: Buy sweets (updates stock automatically).
*   **Dashboard**: Clean, responsive, and animated user interface.

### Admin Features
*   **Inventory Management**: Add, update, and delete sweets.
*   **Stock Management**: Restock inventory items.
*   **Secure Access**: Role-based access control (RBAC) protecting admin routes.

## 🛠️ Tech Stack

### Frontend
*   **React** (Vite)
*   **Tailwind CSS** (Styling & Animations)
*   **Lucide React** (Icons)
*   **React Router** (Navigation)
*   **Axios** (API Communication)

### Backend
*   **Java 17+**
*   **Spring Boot 3** (Web, Security, JPA)
*   **MySQL** (Database)
*   **Spring Security & JWT** (Authentication & Authorization)

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js & npm
*   Java JDK 17+
*   Maven
*   MySQL Server

### 1. Database Setup
1.  Open your MySQL Workbench or CLI.
2.  Run the script provided in `database_setup.sql` (located in `.gemini/antigravity/brain/...` or root if moved).
    *   This creates the `sweetshop` database and `users`/`sweets` tables.
    *   It also inserts a default **Admin User**.
    *   **Admin Credentials**: Username: `admin`, Password: `admin123`

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Configure Database:
    *   Open `src/main/resources/application.properties`.
    *   Update `spring.datasource.username` and `spring.datasource.password` with your local MySQL credentials.
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *   The backend runs on `http://localhost:8080`.

### 3. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *   The frontend runs on `http://localhost:5173` (or similar).

## 🧪 API Endpoints

### Authentication
*   `POST /api/auth/register` - New user registration
*   `POST /api/auth/login` - User login (Returns JWT)

### Sweets
*   `GET /api/sweets` - Get all sweets
*   `GET /api/sweets/search?q=...` - Search sweets
*   `POST /api/sweets` - Add sweet (Admin only)
*   `PUT /api/sweets/{id}` - Update sweet (Admin only)
*   `DELETE /api/sweets/{id}` - Delete sweet (Admin only)
*   `POST /api/sweets/{id}/purchase` - Purchase sweet