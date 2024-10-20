CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('admin', 'developer', 'tester') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bugs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    severity ENUM('UI', 'backend', 'performance', 'security'),
    assigned_to INT REFERENCES users(id),
    reported_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    bug_id INT REFERENCES bugs(id),
    log_type ENUM('console', 'network') NOT NULL,
    log_data Text NOT NULL, -- Store logs as JSON for structured data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE screenshots (
    id SERIAL PRIMARY KEY,
    bug_id INT REFERENCES bugs(id),
    screenshot_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    bug_id INT REFERENCES bugs(id),
    user_id INT REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





INSERT INTO users (name, email, role) VALUES 
('Alice Smith', 'alice@example.com', 'admin'),
('Bob Johnson', 'bob@example.com', 'developer'),
('Carol Williams', 'carol@example.com', 'tester'),
('David Brown', 'david@example.com', 'developer'),
('Eve Davis', 'eve@example.com', 'tester');



INSERT INTO bugs (title, description, status, priority, severity, assigned_to, reported_by) VALUES 
('Login Button Not Responding', 'The login button does not work on the login page.', 'new', 'high', 'UI', 2, 1),
('Data Retrieval Slow', 'Fetching data from the server takes too long.', 'in_progress', 'medium', 'backend', 4, 1),
('Crash on Invalid Input', 'The application crashes when entering invalid input in the form.', 'new', 'critical', 'security', 2, 3),
('UI Overlap on Mobile', 'Elements overlap on mobile devices.', 'resolved', 'low', 'UI', 3, 1),
('Memory Leak in Background Process', 'The application consumes more memory over time.', 'closed', 'critical', 'performance', 4, 2);

INSERT INTO logs (bug_id, log_type, log_data) VALUES 
(1, 'console', '{"level": "error", "message": "Button click event not firing."}'),
(2, 'network', '{"url": "/api/data", "responseTime": "2000ms", "status": "500"}'),
(3, 'console', '{"level": "fatal", "message": "Application crashed due to uncaught exception."}'),
(4, 'network', '{"url": "/api/mobile/ui", "responseTime": "1500ms", "status": "200"}'),
(5, 'console', '{"level": "warn", "message": "High memory usage detected."}');



INSERT INTO screenshots (bug_id, screenshot_url) VALUES 
(1, 'http://example.com/screenshots/login_bug.png'),
(3, 'http://example.com/screenshots/crash_bug.png'),
(4, 'http://example.com/screenshots/ui_overlap.png');


INSERT INTO comments (bug_id, user_id, comment_text) VALUES 
(1, 3, 'This bug needs to be fixed ASAP.'),
(2, 4, 'I am currently working on this issue.'),
(3, 1, 'Let’s reproduce the steps to better understand the crash.'),
(4, 5, 'I think this is a CSS issue.'),
(5, 2, 'We should look into optimizing the memory usage.');





