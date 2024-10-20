import ballerina/sql;
# Database Configuration
type DatabaseConfig record {|
    # Database Host
    string host;
    # Database User
    string user;
    # Database Password
    string password;
    # Database Name
    string database;
|};


public type User record {| 
    # User ID
    int id; 
    # User Name
    string name; 
    # User Email
    string email; 
    # User Role
    string role; 
    # Created Timestamp
    @sql:Column {
        name: "created_at"
    }
    string createdAt; 
|};


# Bug Record
# 
# Represents a bug record in the database.
public type Bug record {|
    # Bug ID
    int? id;
    # Bug Title
    string title;
    # Bug Description
    string description;
    # Bug Status
    string status;
    # Bug Priority
    string priority;
    # Bug Severity
    string severity;
    # Assigned User ID
    @sql:Column {
        name: "assigned_to"
    }
    int assignedTo;
    # Reported User ID
    @sql:Column {
        name: "reported_by"
    }
    int reportedBy;
    # Created Timestamp
    @sql:Column {
        name: "created_at"
    }
    string createdAt;
    # Updated Timestamp
    @sql:Column {
        name: "updated_at"
    }
    string updatedAt;
    # Logs associated with the bug
    Log[]? logs?;

    # Screenshots associated with the bug
    Screenshot[]? screenshots?;

    # Comments associated with the bug
    Comment[]? comments?;
|};


public type Log record {
    int id;
    int bugId;
    string logType;
    string logData;
     @sql:Column {
        name: "created_at"
    }
    string createdAt;
};

// Screenshot Record
public type Screenshot record {
    int id;
    int bugId;
    string screenshotUrl;
    @sql:Column {
        name: "created_at"
    }
    string createdAt;
};

// Comment Record
public type Comment record {
    int id;
    int bugId;
    int userId;
    string commentText;
    @sql:Column {
        name: "created_at"
    }
    string createdAt;
};

// Bug Details Record
public type BugDetails record {
    Bug bug;
    Log[] logs;
    Screenshot[] screenshots;
    Comment[] comments;
};

