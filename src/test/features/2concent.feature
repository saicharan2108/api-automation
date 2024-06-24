Feature: Consent API Testing

  Scenario: Navigate to URL, login, select items, confirm, and verify consent details
    Given I have the generated access token
    When I send a POST request to the Consent API
    And I navigate to the URL from the response
    And I log in and select items
    Then I should see a success message
    And I should verify the consent details
