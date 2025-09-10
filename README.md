# LinkNest API

A complete RESTful API for a simple link aggregator service, built with Node.js, Express, TypeScript, and MySQL. This project allows users to register, log in, share links, and upvote them.

## Features

-   User registration and password hashing with `bcrypt`.
-   User authentication with JSON Web Tokens (JWT).
-   Protected routes using custom middleware.
-   CRUD operations for posts.
-   Upvoting system for posts.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Language:** TypeScript
-   **Database:** MySQL
-   **Authentication:** JWT (jsonwebtoken)

## API Endpoints

### Authentication

-   `POST /api/auth/register`
    -   **Description:** Register a new user.
    -   **Body:** `{ "email": "user@example.com", "password": "password123" }`

-   `POST /api/auth/login`
    -   **Description:** Log in an existing user.
    -   **Body:** `{ "email": "user@example.com", "password": "password123" }`
    -   **Returns:** A JWT token. `{ "token": "..." }`

### Posts

-   `GET /api/posts`
    -   **Description:** Get a list of all posts, ordered by upvote count.

-   `POST /api/posts` (Protected)
    -   **Description:** Create a new post.
    -   **Requires:** `Authorization: Bearer <token>` header.
    -   **Body:** `{ "title": "A Great Resource", "url": "https://example.com" }`

-   `POST /api/posts/:postId/upvote` (Protected)
    -   **Description:** Upvote a specific post.
    -   **Requires:** `Authorization: Bearer <token>` header.