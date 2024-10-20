import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable DatabaseConfig databaseConfig = ?;

final mysql:Client dbClient = check new (
    user = databaseConfig.user,
    password = databaseConfig.password,
    database = databaseConfig.database,
    host = databaseConfig.host
);
