# Professional CRM

A comprehensive CRM solution built with Next.js, GraphQL, Prisma, and PostgreSQL.

## Features

This CRM includes the following modules:

*   **Contact Management System**
*   **Sales Force Automation (Lead Management)**
*   **Pipeline Management**
*   **Marketing Automation (Campaigns)**
*   **Customer Service and Support (Tickets & Knowledge Base)**
*   **Workflow Automation**
*   **Communication Tracking (Calls & Meetings)**
*   **Customization (Roles & Permissions)**
*   **AI and Machine Learning (Models & Predictions)**
*   **Quote and Proposal Management**
*   **Territory and Team Management**
*   **Data Management (Imports & Exports)**
*   **Analytics and Reporting (Reports & Dashboards)**

## Getting Started

Follow these steps to set up and run the project locally using Docker.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop) installed and running on your system.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd crm-nextjs
    ```

2.  **Build and run Docker containers:**

    This command will build the Docker images, start the PostgreSQL database, and the Next.js application. It also sets up hot-reloading for development.

    ```bash
    docker-compose up --build
    ```

    The first time you run this, it might take a while to download images and build the application.

3.  **Access the application:**

    Once the containers are up and running, open your web browser and navigate to:

    ```
    http://localhost:3000
    ```

    You will be redirected to the login page.

### Data Seeding

Upon the first successful `docker-compose up --build`, the database will be seeded with initial data, including default roles and a test user (`testuser`/`password`) and an admin user (`admin`/`password`).

## GraphQL Playground Testing

This project uses GraphQL for its API. You can test the API endpoints using a GraphQL Playground.

1.  **Access the GraphQL Playground:**

    While the application is running (after `docker-compose up`), open your web browser and navigate to:

    ```
    http://localhost:3000/api/graphql
    ```

    This will open the GraphQL Playground interface.

2.  **Explore Schema and Documentation:**

    In the GraphQL Playground, you can:
    *   View the `SCHEMA` tab on the right to see all available queries, mutations, and types.
    *   Use the `DOCS` tab (also on the right) to explore the API documentation, including arguments and return types for each operation.

3.  **Example Query (Fetch Contacts):**

    To fetch all contacts, you can use the following query in the left panel of the Playground:

    ```graphql
    query {
      contacts {
        contact_id
        first_name
        last_name
        email
        phone_number
        company
        job_title
      }
    }
    ```

    Click the "Play" button (usually a triangle icon) to execute the query.

4.  **Example Mutation (Add Contact):**

    To add a new contact, use the following mutation:

    ```graphql
    mutation AddNewContact($first_name: String!, $last_name: String!, $email: String!, $phone_number: String, $company: String, $job_title: String) {
      addContact(first_name: $first_name, last_name: $last_name, email: $email, phone_number: $phone_number, company: $company, job_title: $job_title) {
        contact_id
        first_name
        email
      }
    }
    ```

    And provide the `Query Variables` in the bottom panel (JSON format):

    ```json
    {
      "first_name": "Test",
      "last_name": "User",
      "email": "test.user@example.com",
      "phone_number": "111-222-3333",
      "company": "Example Corp",
      "job_title": "QA Engineer"
    }
    ```

    Execute the mutation to see the new contact created.

## Documentation

### UML Diagrams

UML diagrams for the project can be found in the `documentation/uml.md` file.

### ERD Diagrams

Entity-Relationship Diagrams (ERD) for the database schema can be found in the `documentation/erd.md` file.

### API Design Documentation

Detailed API design specifications are available in the `documentation/api_design.md` file.

## Access Roles and Permissions

This CRM system defines the following user roles with specific access permissions:

*   **Admin:** Full access to all features and data, including user management, system configuration, and all CRUD operations across all modules.
*   **Owner:** (To be defined - typically similar to Admin but with specific ownership over certain data or modules, e.g., a business owner).
*   **Normal User:** Limited access, typically focused on their own data and assigned tasks. Can view and manage their contacts, leads, deals, and activities. Permissions for creating, updating, and deleting records are restricted based on their assigned responsibilities.

Further granular permissions for each role will be detailed in the API Design Documentation and potentially within the application's administration interface.