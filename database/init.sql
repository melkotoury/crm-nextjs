-- ERD for the CRM

-- Entities:
-- 1. contacts
-- 2. users
-- 3. deals
-- 4. tasks
-- 5. interactions

-- Table: contacts
CREATE TABLE IF NOT EXISTS contacts (
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
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: deals
CREATE TABLE IF NOT EXISTS deals (
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
CREATE TABLE IF NOT EXISTS tasks (
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
CREATE TABLE IF NOT EXISTS interactions (
    interaction_id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- e.g., email, call, meeting
    notes TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE,
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: leads
CREATE TABLE IF NOT EXISTS leads (
    lead_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    status VARCHAR(100) NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    opportunity_id SERIAL PRIMARY KEY,
    opportunity_name VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    close_date DATE,
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    campaign_id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    status VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: emails
CREATE TABLE IF NOT EXISTS emails (
    email_id SERIAL PRIMARY KEY,
    campaign_id INT REFERENCES campaigns(campaign_id),
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    sent_date TIMESTAMP WITH TIME ZONE,
    recipient_count INT,
    open_rate DECIMAL(5, 2),
    click_through_rate DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: social_posts
CREATE TABLE IF NOT EXISTS social_posts (
    post_id SERIAL PRIMARY KEY,
    campaign_id INT REFERENCES campaigns(campaign_id),
    platform VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    post_date TIMESTAMP WITH TIME ZONE,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    comments INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: tickets
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: knowledge_base_articles
CREATE TABLE IF NOT EXISTS knowledge_base_articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
    report_id SERIAL PRIMARY KEY,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(100),
    generated_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data JSONB
);

-- Table: dashboards
CREATE TABLE IF NOT EXISTS dashboards (
    dashboard_id SERIAL PRIMARY KEY,
    dashboard_name VARCHAR(255) NOT NULL,
    layout JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: workflows
CREATE TABLE IF NOT EXISTS workflows (
    workflow_id SERIAL PRIMARY KEY,
    workflow_name VARCHAR(255) NOT NULL,
    trigger_event VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: workflow_steps
CREATE TABLE IF NOT EXISTS workflow_steps (
    step_id SERIAL PRIMARY KEY,
    workflow_id INT REFERENCES workflows(workflow_id),
    step_order INT NOT NULL,
    action_type VARCHAR(255) NOT NULL,
    action_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: calls
CREATE TABLE IF NOT EXISTS calls (
    call_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    call_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: meetings
CREATE TABLE IF NOT EXISTS meetings (
    meeting_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    contact_id INT REFERENCES contacts(contact_id),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: integrations
CREATE TABLE IF NOT EXISTS integrations (
    integration_id SERIAL PRIMARY KEY,
    integration_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255),
    status VARCHAR(50) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE NOT NULL
);

-- Table: permissions
CREATE TABLE IF NOT EXISTS permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(255) UNIQUE NOT NULL
);

-- Junction Table: role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT REFERENCES roles(role_id),
    permission_id INT REFERENCES permissions(permission_id),
    PRIMARY KEY (role_id, permission_id)
);

-- Alter Table: users to add role_id
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role_id INT REFERENCES roles(role_id) DEFAULT 1;

-- Table: user_settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INT PRIMARY KEY REFERENCES users(user_id),
    settings JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    action_type VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id INT,
    old_value JSONB,
    new_value JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: shared_calendars
CREATE TABLE IF NOT EXISTS shared_calendars (
    calendar_id SERIAL PRIMARY KEY,
    calendar_name VARCHAR(255) NOT NULL,
    owner_user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
    document_id SERIAL PRIMARY KEY,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    owner_user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: quotes
CREATE TABLE IF NOT EXISTS quotes (
    quote_id SERIAL PRIMARY KEY,
    deal_id INT REFERENCES deals(deal_id),
    quote_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    status VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: proposals
CREATE TABLE IF NOT EXISTS proposals (
    proposal_id SERIAL PRIMARY KEY,
    deal_id INT REFERENCES deals(deal_id),
    proposal_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    status VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: territories
CREATE TABLE IF NOT EXISTS territories (
    territory_id SERIAL PRIMARY KEY,
    territory_name VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(255),
    manager_user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: team_performance
CREATE TABLE IF NOT EXISTS team_performance (
    performance_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10, 2),
    record_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: customer_lifetime_value
CREATE TABLE IF NOT EXISTS customer_lifetime_value (
    clv_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id) UNIQUE,
    lifetime_value DECIMAL(10, 2),
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: churn_prediction
CREATE TABLE IF NOT EXISTS churn_prediction (
    churn_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id) UNIQUE,
    churn_probability DECIMAL(5, 4),
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: cross_selling_opportunities
CREATE TABLE IF NOT EXISTS cross_selling_opportunities (
    opportunity_id SERIAL PRIMARY KEY,
    contact_id INT REFERENCES contacts(contact_id),
    product_service VARCHAR(255),
    likelihood DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: market_trends
CREATE TABLE IF NOT EXISTS market_trends (
    trend_id SERIAL PRIMARY KEY,
    trend_name VARCHAR(255) NOT NULL,
    description TEXT,
    trend_date DATE,
    impact_score INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) UNIQUE,
    bio TEXT,
    profile_picture_url TEXT,
    social_media_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: data_imports
CREATE TABLE IF NOT EXISTS data_imports (
    import_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    status VARCHAR(50),
    imported_by INT REFERENCES users(user_id),
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: data_exports
CREATE TABLE IF NOT EXISTS data_exports (
    export_id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    status VARCHAR(50),
    exported_by INT REFERENCES users(user_id),
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
