# RERC Module System for University of St. La Salle

This system is designed to streamline and enhance the research ethics application process at the University of St. La Salle. 
Leveraging modern web technologies, it provides real-time updates, intuitive interfaces, and a seamless experience for researchers and committee members alike.

## 📖 Overview

The RERC Module System is designed to facilitate efficient communication between researchers and the RERC staff and chairperson. 
By leveraging modern technologies, it provides real-time updates and an intuitive interface, enhancing the overall experience of managing research ethics applications. 
It aims to:

- Simplify the application process for researchers.
- Provide real-time status updates on application reviews.
- Enhance communication between researchers and the RERC.
- Maintain a secure and organized repository of all research ethics documents.

## 🚀 Features

- **User Roles**:
    - **Researchers**: Submit and track their research applications.
    - **RERC Staff**: Access, review, and manage all research applications.
    - **RERC Chairperson**: Oversee applications and make final decisions.

- **Real-time Updates**:
    - Utilizes **Pusher** for real-time UI updates and notifications.
    - **ReactJS Toast Notifications** alert users of application updates.

- **Dynamic UI**:
    - Changes in application status are reflected immediately in the user interface.

## 🛠 Tech Stack

- **Backend Framework**: Laravel 11
- **Frontend**: Inertia.js with ReactJS v18
- **Real-time Communication**: Pusher
- **Databases**:
    - **Development**: SQLite
    - **Production**: NeonDB (PostgreSQL)

## 🎯 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **PHP** >= 8.4
- **Composer**
- **Node.js** & **NPM**
- **SQLite** (for development)
- **PostgreSQL** (for production)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/rerc-module-system.git
   cd rerc-module
   ```

2. **Install PHP Dependencies**

   ```bash
   composer install
   ```

3. **Install JavaScript Dependencies**

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**

   Copy the `.env.example` file to `.env` and adjust the settings as needed.

   ```bash
   cp .env.example .env
   ```

5. **Generate Application Key**

   ```bash
   php artisan key:generate
   ```

6. **Run Migrations**

   ```bash
   php artisan migrate
   ```

7. **Build Assets**

   ```bash
   npm run dev
   ```

8. **Start the Development Server**

   ```bash
   php artisan serve
   ```
   
9. **Start Laravel Reverb**

   ```bash
   php artisan reverb:serve
   ```
   
10. **Start Queue Worker**

   ```bash
   php artisan queue:work
   ```

11. **Access the Application**

   Visit http://localhost:8000 or http://127.0.0.1:8000 in your web browser.

## 🔧 Usage

- **For Researchers**:
    - Sign up and create a new research ethics application.
    - Upload required documents and submit for review.
    - Receive real-time updates on the status of your application.
    - Communicate with RERC members through the mini messaging system.

- **For RERC Staffs and Chairpersons**:
    - Log in to access all research applications.
    - Review and manage incoming applications.
    - Provide feedback and request additional information.
    - Update application statuses and notify researchers.

## 🤝 Contributing

- **Branch Naming Convention:**
    - **Feature Branches**: `feature/your-feature-name`
    - **Bugfix Branches**: `fix/your-fix-name`

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add some feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

Please make sure your code adheres to the project's coding standards and includes appropriate tests.

## 📝 License

This project is private and intended for University of St. La Salle use only. Unauthorized use is prohibited.

## 📚 Additional Resources

- **Laravel Documentation**: [https://laravel.com/docs/11.x](https://laravel.com/docs/11.x)
- **Inertia.js Documentation**: [https://inertiajs.com/](https://inertiajs.com/)
- **ReactJS Documentation**: [https://react.dev/](https://react.dev/)
- **Pusher Documentation**: [https://pusher.com/docs/](https://pusher.com/docs/)
