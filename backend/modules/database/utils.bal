
# Maps the string representation of a bug status to an integer.
#
# + status - The string status of the bug, which can be "Open", "In Progress", "Closed", or any other status.
# + return - Returns an integer corresponding to the bug status:
#     - 1 for "Open"
#     - 2 for "In Progress"
#     - 3 for "Closed"
#     - 0 for any unrecognized status.
public function mapStatus(string status) returns int {
    if status == "Open" {
        return 1; 
    } else if status.toLowerAscii() == "In progress" {
        return 2; 
    } else if status.toLowerAscii() == "Closed" {
        return 3; 
    } else {
        return 0; 
    }
}


# Maps the string representation of a bug priority to an integer.
#
# + priority - The string priority of the bug, which can be "High", "Medium", "Low", or any other priority.
# + return - Returns an integer corresponding to the bug priority:
#     - 1 for "High"
#     - 2 for "Medium"
#     - 3 for "Low"
#     - 0 for any unrecognized priority.
public function mapPriority(string priority) returns int {
    if priority == "High" {
        return 1;
    } else if priority == "Medium" {
        return 2;
    } else if priority == "Low" {
        return 3;
    } else {
        return 0; 
    }
}
