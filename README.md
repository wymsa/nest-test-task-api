# NestJS Test Task for White Digital

## Goal

The task is to build a small backend application with NestJS.
It should include authentication, role-based access control, and two simple modules: users and notes.

## Requirements

### Authentication

- Implement registration and login.
- Use JWT for authentication.
- Support at least two roles: `USER` and `ADMIN`.

### Users

- Basic CRUD for users.
- A regular user can only update their own profile.
- An admin has full access to all users, including the ability to block them.
- Blocked users should not be able to log in.
- The endpoint for fetching users should support filtering by name and by blocked status

### Notes

- CRUD for notes.
- Each note belongs to a user.
- Regular users can only manage their own notes.
- Admins can manage all notes.
- The endpoint for fetching notes should support pagination (`page`, `limit`).

### General

- Use PostgreSQL as a database.
- Use Drizzle ORM for database interaction and migrations.
- Use Zod for schema validation.
- Document the API using the OpenAPI spec.
- Use environment variables for secret keys.
- Implement robust error handling and logging.

## Result

Create a PR to the main branch of your forked repository and include a detailed description of the changes made.
