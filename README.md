# ExpoCraft
### Exhibition Quotation Management System

ExpoCraft is a full-stack web application developed to help exhibition stand businesses manage their customers, products, services, projects, and quotations in one place.

Exhibition businesses often work with different customers and handle several requirements for each project, including flooring, lighting, furniture, installation, branding, and transportation. Managing this information through spreadsheets and separate documents can be time-consuming and may lead to pricing mistakes or duplicated work.

ExpoCraft was developed to make this process more organised. It provides a central system where team members can maintain business information, manage exhibition projects, and prepare quotations using products and services already stored in the application.

The application was developed as part of the **B9IS130 – Web Development for Information Systems** module at Dublin Business School using the MERN stack.

## Main Features

### 1. Client Hub (Customer Management)

The Client Hub allows users to maintain customer information in one place.

Features include:
- Add new customers.
- View and search customer records.
- Update customer details.
- Delete customers who do not have linked projects.
- Validate customer information before saving.
- Prevent duplicate customer email addresses.

Customer information is stored in MongoDB and can be associated with exhibition projects.

### 2. Service Catalogue (Products & Services)

The Service Catalogue maintains the products and services used when preparing exhibition quotations.

Each catalogue entry includes:
- Product or service type.
- Name and category.
- Description.
- Unit price in euros (€).
- Pricing unit.

Supported units include Each, m², Metre, Hour, Job, Trip, and Set.

Users can add, view, update, delete, search, and filter catalogue records.

Storing prices in a central catalogue makes it easier to reuse existing items when preparing quotations.

### 3. Project Workspace (Exhibition Projects)

The Project Workspace helps users organise exhibition projects for different customers.

Each project contains information such as:
- Project name.
- Associated customer.
- Exhibition name and location.
- Start and end dates.
- Exhibition stand size.
- Project status.
- Project description.

Users can create, view, update, search, and delete projects, subject to the application's validation and relationship restrictions.

Project statuses include Planning, In Progress, Completed, and Cancelled.

### 4. Quote Studio (Quotation Management)

Quote Studio is the main feature of ExpoCraft.

It allows users to prepare exhibition quotations using customer, project, and catalogue information already available in the system.

The quotation module supports:
- Creating quotations for exhibition projects.
- Selecting products and services from the catalogue.
- Entering quantities and prices.
- Calculating quotation amounts.
- Viewing saved quotations.
- Updating and deleting quotations, subject to application restrictions.

This reduces the need to enter the same information repeatedly and helps maintain more consistent quotation records.

### 5. User Authentication

ExpoCraft includes a login system to restrict access to authorised users.

Authentication features include:
- Email and password login.
- Password hashing using bcrypt.
- JSON Web Token (JWT) authentication.
- HTTP-only authentication cookies.
- Session verification.
- Logout functionality.
- Password change functionality.

The application uses protected backend routes to prevent unauthenticated access to business records.

### 6. Team Management and Role-Based Access

ExpoCraft supports two user roles:

**Administrator**
- Accesses the business modules.
- Manages team member accounts.
- Creates authorised users.

**Staff**
- Accesses permitted business modules.
- Cannot access administrator-only user management functions.

Access restrictions are implemented in both the frontend and backend.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| JavaScript | Frontend and backend programming |
| HTML and CSS | Page structure and styling |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud-hosted database |
| Mongoose | Database models and operations |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Helmet | HTTP security headers |
| Render | Frontend and backend hosting |
| Git and GitHub | Version control |
| Visual Studio Code | Development environment |

## Application Architecture

ExpoCraft follows a client-server architecture.

```text
Administrator / Staff
         |
         v
   React + Vite
      Frontend
         |
         | HTTPS / REST API
         | JSON Requests
         v
  Node.js + Express
       Backend
         |
         | Authentication
         | Validation
         | Business Logic
         v
      Mongoose
         |
         v
    MongoDB Atlas
```

The React frontend handles user interaction and communicates with the backend through REST API requests.

The Express backend processes requests, verifies authentication, validates incoming data, and performs database operations through Mongoose.

MongoDB Atlas stores application data, including customers, products and services, projects, quotations, and user accounts.

Separating the frontend, backend, and database makes the application easier to maintain and extend.

## Project Structure

The project is organised into two main folders.

```text
exhibition-quotation-management-system/
|
|-- client/
|   |-- src/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- utils/
|   |   |-- styles/
|   |   |-- App.jsx
|   |   |-- App.css
|   |
|   |-- package.json
|
|-- server/
|   |-- models/
|   |-- controllers/
|   |-- routes/
|   |-- middleware/
|   |-- server.js
|   |-- package.json
|
|-- README.md
```

This is a simplified overview of the project structure. The actual repository contains additional files for authentication, validation, styling, configuration, and other application functionality.

## REST API

The frontend communicates with the backend using REST APIs.

### Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend availability |
| GET | `/api/customers` | Retrieve customers |
| POST | `/api/customers` | Create a customer |
| PUT | `/api/customers/:id` | Update a customer |
| DELETE | `/api/customers/:id` | Delete a customer |
| GET | `/api/products-services` | Retrieve catalogue items |
| POST | `/api/products-services` | Create a catalogue item |
| GET | `/api/projects` | Retrieve projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/quotations` | Retrieve quotations |
| POST | `/api/quotations` | Create a quotation |
| GET | `/api/auth/me` | Verify the current session |

The application also contains additional endpoints for updating and deleting records, authentication, password management, and administrator-only user management.

The APIs exchange data using JSON.

Protected endpoints require a valid authenticated session, and administrator-only endpoints additionally check the user's role.

## Security Implementation

Security was considered during the development of ExpoCraft.

The main measures include:

- **Password hashing:** User passwords are hashed using bcrypt rather than stored as plain text.
- **JWT authentication:** Authentication tokens are used to verify logged-in users.
- **HTTP-only cookies:** Authentication cookies are not directly accessible through frontend JavaScript.
- **Role-based authorisation:** Administrator-only functionality is restricted through backend permission checks.
- **Input validation:** Customer and other business inputs are checked before database operations.
- **MongoDB ID validation:** Invalid record identifiers are rejected.
- **Duplicate record prevention:** Customer email addresses are checked for duplicates.
- **Relationship protection:** Customers with associated projects cannot be deleted through the customer deletion operation.
- **Security headers:** Helmet is used to configure HTTP security headers.
- **Environment variables:** Sensitive configuration values are kept outside the application source code.

These measures help reduce common security risks, although further security testing and hardening would be appropriate before commercial use.

## Running the Application Locally

### Prerequisites

The following software is required:

- Node.js and npm.
- Git.
- A MongoDB Atlas database.
- Visual Studio Code or another code editor.

### 1. Clone the Repository

```bash
git clone https://github.com/Pratikshabadakh2284/exhibition-quotation-management-system.git
```

```bash
cd exhibition-quotation-management-system
```

### 2. Set Up the Backend

Open a terminal and navigate to the server folder.

```bash
cd server
npm install
```

Create a `.env` file in the server folder and configure the required environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

Use your own database connection string and a securely generated JWT secret.

Do not commit the `.env` file to GitHub.

Start the backend using the start command configured in `server/package.json`.

### 3. Set Up the Frontend

Open another terminal and navigate to the client folder.

```bash
cd client
npm install
```

Configure the frontend API base URL according to the environment configuration used in the project.

For local development, the backend normally runs at:

```text
http://localhost:5000
```

Start the React development server:

```bash
npm run dev
```

The frontend normally becomes available at:

```text
http://localhost:5173
```

### 4. Access the Application

Open the frontend URL in a browser and log in using an authorised account.

Administrator accounts must be created through the application's configured setup process. Additional users can be created through the administrator's user management functionality.

## Cloud Deployment

ExpoCraft is deployed using Render, with MongoDB Atlas providing cloud database storage.

**Frontend Application**

https://exhibition-quotation-management-system.onrender.com/

**Backend API**

https://expocraft-backend-ascb.onrender.com/

**Backend Health Check**

https://expocraft-backend-ascb.onrender.com/api/health

The frontend communicates with the deployed backend through HTTPS requests.

Environment variables are configured separately in the hosting environment.

## Testing

Testing was carried out during development and deployment to verify the application's main functionality.

### Functional Testing

The following workflows were tested:

- Customer creation, editing, and deletion.
- Product and service management.
- Exhibition project creation and editing.
- Quotation management.
- Administrator login and logout.
- Session persistence after page refresh.
- Staff login.
- Administrator-only navigation restrictions.
- Backend role-based authorisation.

### Security Testing

A staff account was used to test an administrator-only API endpoint.

The backend returned HTTP **403 Forbidden**, confirming that the user did not have permission to access the requested administrator functionality.

### Automated Testing

Jest-based controller tests were also used during development to verify selected backend behaviours.

### Deployment Testing

The deployed frontend and backend were tested to verify that the application could communicate with MongoDB Atlas and perform database operations.

## Challenges During Development

Several technical challenges were encountered while building and deploying ExpoCraft.

These included:

- Connecting the Express backend to MongoDB Atlas.
- Configuring frontend and backend communication.
- Handling cross-origin requests between deployed services.
- Configuring authentication cookies.
- Maintaining login sessions after refreshing the browser.
- Implementing administrator and staff access restrictions.
- Validating user input and preventing invalid database operations.

These issues were investigated and resolved during development and testing.

## Future Improvements

ExpoCraft could be extended with additional functionality, including:

- More detailed quotation reporting.
- Customer and project activity summaries.
- Additional automated tests.
- Improved responsive layouts and accessibility.
- More detailed audit logs.
- Further security hardening.

These are possible future enhancements and are not presented as completed features.

## Project Information

**Project:** ExpoCraft – Exhibition Quotation Management System

**Technology:** MERN Stack

**Repository:** https://github.com/Pratikshabadakh2284/exhibition-quotation-management-system

**Deployment:** Render and MongoDB Atlas
