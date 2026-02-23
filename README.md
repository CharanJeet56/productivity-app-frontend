DSA with C -- Needs to be completed before April 5 -> 4000
Mulesoft -- Needs to be completed before March 25 -> Collect Fee for next course AI Dev
C and Python -- Needs to be completed before March 10 -> 4000



# Salesforce Records Delete by Name Integration

This Mule application provides an API to delete Salesforce records by their names instead of IDs. The application queries Salesforce to find records matching the provided names and then deletes them.

## Overview

The application exposes a REST API endpoint that accepts record names and deletes the corresponding Salesforce records. It includes comprehensive error handling and logging for production use.

## Features

- **Delete by Name**: Delete Salesforce records using their names instead of IDs
- **Multiple Object Support**: Supports any Salesforce object type (Account, Contact, Lead, etc.)
- **Batch Processing**: Can delete multiple records in a single request
- **Error Handling**: Comprehensive error handling for connectivity and Salesforce errors
- **Logging**: Detailed logging throughout the flow for debugging
- **JSON Response**: Returns structured JSON responses with operation status

## API Endpoint

### DELETE Records by Name

**URL**: `POST http://localhost:8081/delete`

**Method**: POST

**Content-Type**: application/json

### Request Body

```json
{
  "recordNames": ["Record Name 1", "Record Name 2", "Record Name 3"],
  "objectType": "Account"
}
```

**Parameters:**
- `recordNames` (required): Array of record names to delete
- `objectType` (optional): Salesforce object type (defaults to "Account")

### Response Examples

#### Success Response
```json
{
  "status": "success",
  "message": "Successfully deleted 2 records",
  "deletedRecords": [
    {
      "id": "0031234567890ABC",
      "success": true,
      "errors": []
    },
    {
      "id": "0031234567890DEF",
      "success": true,
      "errors": []
    }
  ]
}
```

#### No Records Found
```json
{
  "status": "warning",
  "message": "No records found with the provided names",
  "deletedRecords": []
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "No record names provided. Please provide recordNames array.",
  "deletedRecords": []
}
```

## Flow Architecture

### Flow Name: `salesforce-delete-records-by-nameFlow`

The flow consists of the following components:

1. **HTTP Listener**: Accepts POST requests on `/delete` endpoint
2. **Input Validation**: Validates and extracts record names and object type
3. **SOQL Query Builder**: Constructs dynamic SOQL query to find records by name
4. **Salesforce Query**: Executes the query to retrieve record IDs
5. **ID Extraction**: Maps query results to extract record IDs
6. **Salesforce Delete**: Deletes records using the retrieved IDs
7. **Response Creation**: Formats the response with operation results
8. **Error Handling**: Comprehensive error handling for all failure scenarios

## Configuration

### Salesforce Connection

The application uses basic authentication to connect to Salesforce:

```xml
<salesforce:sfdc-config name="Salesforce_Config">
    <salesforce:basic-connection 
        username="your-username@domain.com" 
        password="your-password" 
        securityToken="your-security-token" />
</salesforce:sfdc-config>
```

**Note**: Update the credentials in the XML file before deploying.

### HTTP Listener

The HTTP listener is configured to accept connections on:
- Host: `0.0.0.0` (all interfaces)
- Port: `8081`
- Path: `/delete`

## Testing the Application

### Prerequisites

1. Mule Runtime 4.10.0 or higher
2. Valid Salesforce credentials
3. Salesforce connector dependencies (already included in pom.xml)

### Running the Application

1. Update Salesforce credentials in `src/main/mule/salesforce-create-order.xml`
2. Build the project: `mvn clean package`
3. Deploy to Mule runtime
4. The application will be available at `http://localhost:8081`

### Test Examples

#### Test 1: Delete Account Records
```bash
curl -X POST http://localhost:8081/delete \
  -H "Content-Type: application/json" \
  -d '{
    "recordNames": ["Test Account 1", "Test Account 2"],
    "objectType": "Account"
  }'
```

#### Test 2: Delete Contact Records
```bash
curl -X POST http://localhost:8081/delete \
  -H "Content-Type: application/json" \
  -d '{
    "recordNames": ["John Doe", "Jane Smith"],
    "objectType": "Contact"
  }'
```

#### Test 3: Invalid Request (Missing Names)
```bash
curl -X POST http://localhost:8081/delete \
  -H "Content-Type: application/json" \
  -d '{
    "objectType": "Account"
  }'
```

## Error Handling

The flow includes two levels of error handling:

1. **Salesforce Connectivity Errors**: Network or authentication issues
2. **General Errors**: Any other unexpected errors (authentication, query, delete issues, etc.)

All errors return a structured JSON response with:
- Error status
- Descriptive error message
- Empty deletedRecords array

### Error Response Examples

#### Connectivity Error
```json
{
  "status": "error",
  "message": "Failed to connect to Salesforce. Please check your credentials and network connection.",
  "deletedRecords": []
}
```

#### General Error
```json
{
  "status": "error",
  "message": "An error occurred while processing your request. Please check the logs for more details.",
  "deletedRecords": []
}
```

## Logging

The application includes comprehensive logging at INFO, WARN, and ERROR levels:

- Input payload logging
- Query construction logging
- Query results logging
- Delete operation results
- Error logging with detailed descriptions

## Security Considerations

1. **Credentials**: Store Salesforce credentials securely (use property files or secure vaults)
2. **HTTPS**: Use HTTPS in production environments
3. **Authentication**: Consider adding API authentication for the HTTP endpoint
4. **Validation**: The flow validates input to prevent SOQL injection
5. **Permissions**: Ensure the Salesforce user has appropriate delete permissions

## Troubleshooting

### Common Issues

1. **Connection Errors**: Verify Salesforce credentials and network connectivity
2. **Permission Errors**: Ensure the Salesforce user has delete permissions for the object type
3. **Record Not Found**: Verify record names exist and are spelled correctly
4. **Port Conflicts**: Change the HTTP listener port if 8081 is already in use

### Debug Mode

Enable debug logging by modifying `src/main/resources/log4j2.xml`:

```xml
<Logger name="org.mule" level="DEBUG"/>
<Logger name="root" level="DEBUG"/>
```

## Dependencies

The application uses the following key dependencies:

- **Mule HTTP Connector**: For REST API endpoint
- **Mule Salesforce Connector**: For Salesforce integration  
- **DataWeave**: For data transformation
- **Mule Runtime**: 4.10.0

All dependencies are managed in `pom.xml` and will be automatically downloaded during build.

## Project Structure

```
salesforce-create-order/
├── pom.xml                                    # Maven dependencies
├── README.md                                  # This documentation
├── src/
│   ├── main/
│   │   ├── mule/
│   │   │   └── salesforce-create-order.xml    # Main flow configuration
│   │   └── resources/
│   │       └── log4j2.xml                     # Logging configuration
│   └── test/
│       └── munit/                             # Unit tests (if any)
└── target/                                    # Build output
```

## Future Enhancements

Possible improvements to consider:

1. **Bulk Operations**: Support for larger batch sizes using Salesforce Bulk API
2. **Async Processing**: Asynchronous processing for large datasets
3. **Audit Trail**: Logging deleted record details for audit purposes
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **Caching**: Cache frequently accessed data to improve performance
6. **Retry Logic**: Automatic retry for transient failures

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Verify Salesforce connectivity and permissions
3. Review the flow configuration for any customizations needed
4. Test with small datasets first before production use

---

*This documentation covers the complete Salesforce delete-by-name integration flow with comprehensive testing and deployment information.*
