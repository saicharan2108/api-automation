Feature: API1 Testing

  Scenario: Retrieve and store access token from API1
    Given I have API1 endpoint details
    When I send a POST request to retrieve the access token
    Then the access_token should be stored in environment variables
