import ballerina/http;
import backend.database;
import backend.types;
import ballerina/io;
import backend.utils;


@http:ServiceConfig{
    cors: {
        allowOrigins: ["*"],
        allowMethods: [http:GET, http:POST, http:PUT, http:PATCH, http:DELETE],
        allowHeaders: [http:AUTHORIZATION, http:CONTENT_TYPE, "x-jwt-assertion"],
        allowCredentials: false,
        maxAge: 84900
    }
}
@display {
    label: "Certification Service",
    id : "sales/certification-service"
}

service /api on new http:Listener(9090) {

# Retrieves all bugs from the database and returns them as an array.
#
# + return - Returns an array of `Bug` records or an error if fetching fails.
    resource function get getAllBugs() returns types:Bug[]|error {
        types:Bug[]|error bugs = database:getAllBugs();
        io:println(bugs);
        if bugs is error {
            return error("Error in fetching bugs");
        }
        return bugs;
        
    }

# Retrieves a specific bug by its ID from the database.
#
# + bugId - The ID of the bug to fetch from the database. 
# + return - Returns the `Bug` record if found, or an error if the bug is not found or if fetching fails.
resource function get bugs/[int bugId]() returns types:Bug|error {
    types:Bug[]|error bugs = database:getBugById(bugId);
    if (bugs is error) {
        return error("Error in fetching bug");
    }
    if (bugs.length() == 0) {
        return error("Bug not found");
    }
    return bugs[0];
}


# Assigns a user to a specific bug by its ID.
#
# + bugId - The ID of the bug to which the user will be assigned.
# + assignedTo - The ID of the user who is being assigned to the bug.
# + return - Returns the updated `Bug` record if the assignment is successful, or an error if the assignment fails.
    resource function post assignUserToBug(int bugId, int assignedTo) returns types:Bug|error {
        types:Bug|error updatedBug = database:assignUserToBug(bugId, assignedTo);
        if updatedBug is error {
            return error("Error in assigning user to bug: " + updatedBug.message());
        }
        return updatedBug;
        }

        resource function get allUsers() returns database:User[]|error {
        database:User[]|error users = database:getAllUsers();
        if users is error {
            return error("Error in fetching users: " + users.message());
        }
        return users;
    }

# Retrieves detailed information about a specific bug by its ID, including logs, screenshots, and comments.
#
# + bugId - The ID of the bug for which details are being fetched.
# + return - Returns a `BugDetails` record if the fetching is successful, or an error if fetching fails.
    resource function get bugs/[int bugId]/details() returns types:BugDetails|error {
        
        types:BugDetails | error bugDetails = check database:getBugDetails(bugId);
        if bugDetails is error {
            return error("Error fetching bug details: " + bugDetails.message());
        }
        return bugDetails;
    }
     
# Adds a new bug to the system using the provided bug details from the HTTP payload.
#
# + payload - The JSON payload containing bug information, which is deserialized into a `Bug` record.
# + return - Returns the newly created `Bug` record if successful, or an error if adding the bug fails.
        resource function post addBug(@http:Payload json payload) returns types:Bug|error {
            
            types:Bug bug = check payload.fromJsonWithType(types:Bug); 
            types:Log[] logs = bug?.logs ?: [];
            types:Screenshot[] screenshots = bug?.screenshots?:[];
            types:Comment[] comments = bug?.comments?:[];
            
            int statusInt = utils:mapStatus(bug.status);
            int priorityInt = utils:mapPriority(bug.priority);

            types:Bug|error newBug = database:addBug(
                bug.title,
                bug.description,
                priorityInt.toString(),
                bug.severity,
                statusInt.toString(),
                bug.reportedBy,
                bug.assignedTo,
                logs,
                screenshots,
                comments
            );
            
            if newBug is error {
                return error("Error in adding bug: " + newBug.message());
            }
            return newBug;
        }

# Fetches a user by their ID from the database.
#
# + id - The ID of the user to be fetched.
# + return - Returns a `User` record if found, or an error if the user cannot be fetched or does not exist.
    resource function get user/[int id]() returns types:User|error {
        types:User[]|error users = database:getUserById(id);
        if (users is error) {
            return error("Error in fetching bug");
        }
        if (users.length() == 0) {
            return error("Bug not found");
        }
        return users[0];
    }

# Changes the status of a bug identified by its ID.
#
# + bugId - The ID of the bug whose status is to be changed.
# + return - Returns the updated `Bug` record if successful, or an error if the status change fails.
resource function post bugs/[int bugId]/status(@http:Payload json payload) returns types:Bug|error {
  
    json payloadData = payload.toJson();
    string status = (check payloadData.status).toString(); 

    if (status == "") {
        return error("Status cannot be empty.");
    }

    types:Bug|error updatedBug = database:statusChangeToBug(bugId, status);
    if updatedBug is error {
        return error("Error in assigning status to bug: " + updatedBug.message());
    }
    return updatedBug;
}





 // Fetch current user settings
    resource function get userSettings(http:Caller caller, http:Request req) returns error? {
        types:User[]|error user = database:getUserById(1);
        check caller->respond(user);
    }

// Update user settings (username and email)
    resource function put updateSettings(http:Caller caller, http:Request req) returns error? {
        json payload = check req.getJsonPayload();
        string newName = (check payload.name).toString();
        string newEmail = (check payload.email).toString();

        // Update user in database
        boolean result = database:updateUserInDatabase(1,newName,newEmail);
        if (result) {
            check caller->respond({ message: "User settings updated successfully" });
        } else {
            check caller->respond({ message: "Failed to update user settings" });
        }
    }

}

