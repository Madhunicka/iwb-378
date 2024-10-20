import ballerina/sql;
import ballerina/io;
import backend.types;
import backend.utils;

# Fetches all bugs from the database.
#
# + return - Returns an array of `Bug` objects if successful, or an error if the operation fails.
public isolated function getAllBugs() returns Bug[]|error {

    stream<Bug, sql:Error?> result = dbClient->query(getAllBugsQuery());
    io:println(result);
    Bug[]|error bugs = from Bug bug in result
        select bug;
        io:println(bugs);
    if bugs is error {
        return error("Error in fetching bugs");
    }
    return bugs;

}


# Fetches a specific bug by its ID from the database.
#
# + bugId - The ID of the bug to be fetched.
# + return - Returns an array of `Bug` objects if the bug is found, or an error if there is an issue during retrieval.
public isolated function getBugById(int bugId) returns error|Bug[] {
    sql:ParameterizedQuery query = getBugByIdQuery(bugId);
    stream<Bug, sql:Error?> result = dbClient->query(query);
    Bug[]|error bugs = from Bug b in result
        select b;
    if bugs is error {
        return error("Error in fetching bug");
    }
    return bugs;
}


# Assigns a user to a specific bug in the database.
#
# + bugId - The ID of the bug to which the user is to be assigned.
# + assignedTo - The ID of the user to be assigned to the bug.
# + return - Returns the updated `Bug` object if successful, or an error if the assignment fails or the bug is not found.
public isolated function assignUserToBug(int bugId, int assignedTo) returns types:Bug|error {
   
    sql:ParameterizedQuery query = assignUserToBugQuery(bugId, assignedTo);
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    
    if result is sql:Error {
        return error("Error in assigning user to bug: " + result.message());
    }
    
    error|Bug[] fetchedBugs = getBugById(bugId);
    if fetchedBugs is error {
        return error("Error fetching updated bug: " + fetchedBugs.message());
    }
    if fetchedBugs.length() == 0 {
        return error("Bug not found with ID: " + bugId.toString());
    }

    return fetchedBugs[0]; 
}


# Fetches all users from the database.
#
# + return - Returns an array of `User` objects if successful, or an error if the operation fails.
public isolated function getAllUsers() returns User[]|error {
    stream<User, sql:Error?> result = dbClient->query(getAllUsersQuery());
    io:println(result);
    User[]|error users = from User user in result
        select user;
    io:println(users);
    if users is error {
        return error("Error in fetching users");
    }
    return users;
}

# Fetches detailed information for a specific bug, including logs, screenshots, and comments.
#
# + bugId - The ID of the bug for which detailed information is to be fetched.
# + return - Returns the `BugDetails` record containing the bug, logs, screenshots, and comments, or an error if any part of the retrieval fails.

public isolated function getBugDetails(int bugId) returns types:BugDetails|error {
   
    types:Bug[] | error bugResult = check getBugById(bugId);
    if bugResult is error {
        return error("Error fetching bug: " + bugResult.message());
    }
    if bugResult.length() == 0 {
        return error("Bug not found with ID: " + bugId.toString());
    }

    types:Bug bug = bugResult[0];

    stream<Log, sql:Error?> logsStream = dbClient->query(getLogsByBugIdQuery(bugId));
    Log[] | error logs = from Log log in logsStream select log;

    if logs is error {
        return error("Error fetching logs: " + logs.message());
    }
    
    stream<Screenshot, sql:Error?> screenshotsStream = dbClient->query(getScreenshotsByBugIdQuery(bugId));
    Screenshot[] | error screenshots = from Screenshot screenshot in screenshotsStream select screenshot;

    if screenshots is error {
        return error("Error fetching screenshots: " + screenshots.message());
    }

    stream<Comment, sql:Error?> commentsStream = dbClient->query(getCommentsByBugIdQuery(bugId));
    Comment[] | error comments = from Comment comment in commentsStream select comment;

    if comments is error {
        return error("Error fetching comments: " + comments.message());
    }
    types:BugDetails bugDetails = {
        bug: bug,
        logs: logs,
        screenshots: screenshots,
        comments: comments
    };
    return bugDetails;
}

# Adds a new bug to the database, along with its logs, screenshots, and comments.
#
# + title - The title of the bug.
# + description - The description of the bug.
# + priority - The priority of the bug.
# + severity - The severity of the bug.
# + status - The status of the bug.
# + createdBy - The ID of the user who reported the bug.
# + assignedTo - The ID of the user to whom the bug is assigned.
# + logs - Iterates through the logs array, and for each log, prepares and executes a query to insert the log into the database. If an error occurs during this process, it returns the error message.
# + screenshots - Iterates through the screenshots array, and for each screenshot, prepares and executes a query to insert the screenshot into the database. If an error occurs, it returns the error message.
# + comments - Iterates through the comments array, and for each comment, prepares and executes a query to insert the comment into the database. If an error occurs, it returns the error message.
# + return - Returns the newly added `Bug` record or an error if any step in the process fails.
public isolated function addBug(string title, string description, string priority, string severity, string status, int createdBy, int assignedTo, Log[] logs, Screenshot[] screenshots, Comment[] comments) returns Bug|error {
    sql:ParameterizedQuery query = addBugQuery(title, description, priority, status, createdBy, assignedTo, severity);
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    if result is sql:Error {
        return error("Error in adding bug: " + result.message());
    }
    int bugId = <int>result.lastInsertId;

    foreach var log in logs {
        sql:ParameterizedQuery logQuery = addLogQuery(bugId, log.logType, log.logData);
        sql:ExecutionResult|sql:Error logResult = dbClient->execute(logQuery);
        if logResult is sql:Error {
            return error("Error in adding log: " + logResult.message());
        }
    }

    foreach var screenshot in screenshots {
        sql:ParameterizedQuery screenshotQuery = addScreenshotQuery(bugId, screenshot.screenshotUrl);
        sql:ExecutionResult|sql:Error screenshotResult = dbClient->execute(screenshotQuery);
        if screenshotResult is sql:Error {
            return error("Error in adding screenshot: " + screenshotResult.message());
        }
    }

    foreach var comment in comments {
        sql:ParameterizedQuery commentQuery = addCommentQuery(bugId, comment.userId, comment.commentText);
        sql:ExecutionResult|sql:Error commentResult = dbClient->execute(commentQuery);
        if commentResult is sql:Error {
            return error("Error in adding comment: " + commentResult.message());
        }
    }

    stream<Bug, sql:Error?> resultStream = dbClient->query(getBugByIdQuery(bugId));
    Bug[]|error fetchedBugs = from Bug b in resultStream select b;
    if fetchedBugs is error {
        return error("Error fetching added bug: " + fetchedBugs.message());
    }
    if fetchedBugs.length() == 0 {
        return error("Bug not found with ID: " + bugId.toString());
    }
    return fetchedBugs[0];
}


// fetch the user by ID
public isolated function getUserById(int id) returns error|User[] {
    sql:ParameterizedQuery query = getUserByIdQuery(id);
    stream<User, sql:Error?> result = dbClient->query(query);
    User[]|error users = from User u in result
        select u;
    if users is error {
        return error("Error in fetching bug");
    }
    return users;
}

// Function to assign a user to a bug
public isolated function statusChangeToBug(int bugId, string status) returns types:Bug|error {
    int statusInt = utils:mapStatus(status); 

    if (statusInt == 0) {
        return error("Invalid status: " + status);
    }

    sql:ParameterizedQuery query = statusChangeToBugQuery(bugId, statusInt); 

    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    
    if result is sql:Error {
        return error("Error in assigning status to bug: " + result.message());
    }

    error|types:Bug[] fetchedBugs = getBugById(bugId);
    if fetchedBugs is error {
        return error("Error fetching updated bug: " + fetchedBugs.message());
    }

    if fetchedBugs.length() == 0 {
        return error("Bug not found with ID: " + bugId.toString());
    }

    return fetchedBugs[0]; 
}




// Function to update user details in the database
public isolated function updateUserInDatabase(int userId, string name, string email) returns boolean {
    sql:ParameterizedQuery query = updateUserQuery(userId, name, email);
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    if result is sql:Error {
        return false;
    }
    
    return true;
}

