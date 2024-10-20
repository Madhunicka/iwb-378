import ballerina/sql;

//query to retrive all bugs
isolated function getAllBugsQuery() returns sql:ParameterizedQuery => 
`
SELECT * FROM bugs
`;

// query to insert a new bug
isolated function addBugQuery(string title, string description, string priority, string status, int createdBy, int assignedTo, string severity) returns sql:ParameterizedQuery => 
    `INSERT INTO bugs (title, description, priority, status, assigned_to, reported_by, severity) VALUES (${title}, ${description}, ${priority}, ${status}, ${createdBy}, ${assignedTo}, ${severity})`;


// Query to add a log
isolated function addLogQuery(int bugId, string logType, string logData) returns sql:ParameterizedQuery => 
    `INSERT INTO logs (bug_id, log_type, log_data) VALUES (${bugId}, ${logType}, ${logData})`;

// Query to add a screenshot
isolated function addScreenshotQuery(int bugId, string screenshotUrl) returns sql:ParameterizedQuery => 
    `INSERT INTO screenshots (bug_id, screenshot_url) VALUES (${bugId}, ${screenshotUrl})`;

// Query to add a comment
isolated function addCommentQuery(int bugId, int userId, string commentText) returns sql:ParameterizedQuery => 
    `INSERT INTO comments (bug_id, user_id, comment_text) VALUES (${bugId}, ${userId}, ${commentText})`;


//query to get bug by its id
isolated function getBugByIdQuery(int bugId) returns sql:ParameterizedQuery => 
`
SELECT * FROM bugs
WHERE id = ${bugId}

`;

//query to assign bugs to users
isolated function assignUserToBugQuery(int bugId, int assignedTo) returns sql:ParameterizedQuery => 
`
UPDATE bugs
SET assigned_to = ${assignedTo}, updated_at = CURRENT_TIMESTAMP
WHERE id = ${bugId};
`;

//query to get all users
isolated function getAllUsersQuery() returns sql:ParameterizedQuery => 
`
SELECT * FROM users
`;

//query to get logs
isolated function getLogsByBugIdQuery(int bugId) returns sql:ParameterizedQuery => 
    `SELECT * FROM logs WHERE bug_id = ${bugId}`;

//query to get screenhshots
isolated function getScreenshotsByBugIdQuery(int bugId) returns sql:ParameterizedQuery => 
    `SELECT * FROM screenshots WHERE bug_id = ${bugId}`;

//query to get comments
isolated function getCommentsByBugIdQuery(int bugId) returns sql:ParameterizedQuery => 
    `SELECT * FROM comments WHERE bug_id = ${bugId}`;


//functuion to get user by its id
isolated function getUserByIdQuery(int id) returns sql:ParameterizedQuery => 
`
SELECT * FROM users
WHERE id = ${id}

`;
// query to chnage the status of a bug
isolated function statusChangeToBugQuery(int bugId, int status) returns sql:ParameterizedQuery => 
`
UPDATE bugs
SET status = ${status}, updated_at = CURRENT_TIMESTAMP
WHERE id = ${bugId};
`;

isolated function updateUserQuery(int userId, string name, string email) returns sql:ParameterizedQuery =>
`
UPDATE users
SET name = ${name}, email = ${email}
WHERE id = ${userId};
`;