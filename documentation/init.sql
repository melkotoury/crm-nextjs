-- ERD for the CRM

-- Entities:
-- 1. contacts
-- 2. users
-- 3. deals
-- 4. tasks
-- 5. interactions

-- Table: contacts
CREATE TABLE contacts (
    contact_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: deals
CREATE TABLE deals (
    deal_id SERIAL PRIMARY KEY,
    deal_name VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    close_date DATE,
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: tasks
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    user_id INT REFERENCES users(user_id),
    deal_id INT REFERENCES deals(deal_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: interactions
CREATE TABLE interactions (
    interaction_id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- e.g., email, call, meeting
    notes TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE,
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
