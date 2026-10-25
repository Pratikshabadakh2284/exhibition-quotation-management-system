# ExpoCraft
### Exhibition Quotation Management System

ExpoCraft is a web-based application I'm developing to make the quotation process easier for exhibition stand businesses.

Exhibition projects often involve several products and services, such as flooring, lighting, furniture, installation and transportation. Keeping track of customer details, product prices and project requirements can become difficult when information is managed across spreadsheets or separate documents.

The idea behind ExpoCraft is to bring these activities together in one place. The application is designed primarily for an administrator who manages customers, maintains a catalogue of products and services, and eventually prepares quotations for exhibition projects.

This project is being developed as part of my full-stack development coursework using the MERN stack.


## Features Implemented

### 1. Customer Management

The Customer Management module allows the administrator to maintain customer information in one place.

It supports:

- Adding new customers
- Viewing existing customer records
- Updating customer details
- Deleting customer records
- Searching customer information
- Validating form inputs before submission

Customer information is stored in MongoDB and retrieved through REST API endpoints.

This module provides the foundation for associating customers with exhibition projects and quotations in later development.

### 2. Products & Services Management

This module maintains a catalogue of the items and services an exhibition business may include in its quotations.

Each record contains:

- **Type:** Identifies whether the entry is a product or a service.
- **Name:** The name of the product or service.
- **Category:** Groups related items, such as lighting, furniture or installation.
- **Description:** Provides additional information about the item.
- **Unit Price:** The price of one unit, expressed in euros (€).
- **Unit:** Defines how the item is measured or charged.

The application supports adding, viewing, editing and deleting catalogue records. It also includes searching, filtering by product or service type, and form validation.

Different pricing units are supported, including Each, m², Metre, Hour, Job, Trip and Set.

For example, carpet flooring might be charged per square metre, while installation work might be charged per job.

The aim is to reuse these catalogue prices when generating quotations rather than entering the same pricing information repeatedly.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the frontend interface |
| Vite | Frontend development environment |
| JavaScript | Application functionality |
| HTML and CSS | Page structure and styling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | Database schemas and operations |
| Git and GitHub | Version control and project tracking |
| Visual Studio Code | Development environment |


## Project Structure

The application is organised into separate frontend and backend folders.

```text
Exhibition-quotation-management-system/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Customers.jsx
│   │   │   └── ProductsServices.jsx
│   │   │
│   │   ├── services/
│   │   │   └── productServiceApi.js
│   │   │
│   │   ├── utils/
│   │   │   └── productServiceValidation.js
│   │   │
│   │   ├── styles/
│   │   │   └── productsServices.css
│   │   │
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   └── package.json
│
├── server/
│   ├── models/
│   │   ├── Customer.js
│   │   └── ProductService.js
│   │
│   ├── controllers/
│   │   └── productServiceController.js
│   │
│   ├── routes/
│   │   └── productServiceRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

*The structure above highlights the main files discussed so far. Additional configuration and customer-related files are also part of the project.*

## How the Application Works

ExpoCraft follows a simple frontend–backend architecture.

```text
Administrator
     |
     v
React Frontend
     |
     | HTTP Requests
     v
Express REST API
     |
     v
Mongoose
     |
     v
MongoDB Atlas
```

When the administrator submits a form, React collects the entered information and performs frontend validation.

The application then sends an HTTP request to the Express backend, where the request is processed and the database operation is performed using Mongoose.

The backend returns a response, which the frontend uses to update the interface or display an appropriate message.

This structure keeps the user interface, application logic and database operations separate.

