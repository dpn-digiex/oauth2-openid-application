# Side Project: Authentication with OAuth2 and OpenID Connect in practical application

## Overview

This side project aims to create a robust authentication system by implementing OAuth2 and OpenID Connect (OIDC) flows. These protocols are widely used for secure authorization and authentication, ensuring that users can log in to applications using trusted identity providers like Google, Facebook, and others.

## Technologies Used

- **OAuth2**: For authorization and obtaining access tokens to access protected resources.
- **OpenID Connect (OIDC)**: An identity layer on top of OAuth2, enabling authentication and providing user profile information.
- **React**: For building the front-end user interface.
- **Node.js**: For creating the authentication server and handling OAuth2/OIDC flows.
- **JWT (JSON Web Token)**: For secure transmission of claims and user information.
- **Express.js**: For building the authentication API.

## OAuth2 Flows Implemented

### 1. **Authorization Code Flow**
This flow is designed for applications that can securely store client secrets. The user is redirected to the identity provider to authenticate and authorize the application to access resources on their behalf. Once authorized, an authorization code is returned, which is exchanged for an access token and refresh token.

- **Steps**:
  1. User clicks the "Login" button on the client application.
  2. The client redirects the user to the identity provider’s authorization endpoint.
  3. The user logs in and authorizes the application.
  4. The identity provider redirects the user back to the client with an authorization code.
  5. The client exchanges the authorization code for an access token and a refresh token.

### 2. **Implicit Flow**
This flow is used for applications that run on the client side (e.g., single-page applications) and cannot securely store client secrets. Instead of exchanging an authorization code for a token, the access token is returned directly to the client in the URL fragment.

- **Steps**:
  1. User clicks the "Login" button on the client application.
  2. The client redirects the user to the identity provider’s authorization endpoint with parameters indicating the desired scope.
  3. The identity provider returns an access token in the URL fragment after successful login.
  4. The client parses the URL fragment to obtain the access token.

### 3. **Client Credentials Flow**
This flow is used by applications to access their own resources on a resource server. There’s no user interaction involved since the client authenticates itself to obtain an access token.

- **Steps**:
  1. The client sends a request to the authorization server with its client ID and client secret.
  2. The authorization server returns an access token directly to the client.

### 4. **Refresh Token Flow**
This flow allows clients to obtain a new access token using a refresh token when the current access token expires. This ensures that users don't need to authenticate repeatedly.

- **Steps**:
  1. The client detects that the access token has expired.
  2. The client sends a request to the authorization server with the refresh token.
  3. The authorization server returns a new access token and, optionally, a new refresh token.

## OpenID Connect Features

### 1. **ID Token**
OpenID Connect extends OAuth2 by providing an ID token, which contains information about the authenticated user, including their unique identifier (subject), and other attributes such as name and email.

### 2. **UserInfo Endpoint**
The UserInfo endpoint allows the client to fetch additional user information after authentication. This is helpful for retrieving profile information, such as the user's email, picture, and more.

### 3. **Authentication Request**
An authentication request includes additional parameters to specify what information is being requested (such as ID token and user info) and can involve multiple authentication factors.

## Flow Diagram

![OAuth2 and OpenID Connect Flows](./images/oauth2-oidc-flows.png)

## Features and Challenges

- **Secure Token Storage**: Storing tokens securely in a client application (especially for SPAs) is critical to prevent unauthorized access.
- **Single Sign-On (SSO)**: OpenID Connect facilitates seamless authentication across multiple applications, creating a smoother user experience.
- **Token Expiry and Refreshing**: Handling token expiry and refreshing tokens without requiring the user to log in again is a challenge.
- **Cross-Origin Resource Sharing (CORS)**: Handling CORS between the client and the identity provider is essential when implementing the authentication flows.

## Future Enhancements

- **Multi-Factor Authentication (MFA)**: Adding an extra layer of security to the authentication process.
- **Stateful Sessions**: Improving session management with tokens stored in secure HTTP-only cookies.
- **Authorization Server**: Setting up a custom authorization server to handle OAuth2 and OIDC flows internally.
- **Custom Scopes and Claims**: Expanding the OAuth2 scopes and OIDC claims to offer more granular control over what data the client can access.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/authentication-oauth2-oidc.git
2. 
