# Login Flow

```mermaid
graph TD
    A[User Submits Login] --> B[FastAPI Server]
    B --> C[Validate User in MySQL]
    C --> D[Generate JWT Token]
    D --> E[Return Token to Frontend]