# vue-postgres-node-docker-example

This project is a wireframe of a Docker setup for a Vue.js, Postgres, Redis, and NodeJS/Express app.

The production setup and configuration is not fully fleshed-out yet. Here are some working endpoints/routes:

- `http://localhost:82`
- `http://localhost:82/about`
- `http://localhost:3009/test/redis`

This is mostly a proof-of-concept, template app. Only a few auth APIs work.

## Project structure

- `backend/`: Contains the Express.js backend code.
- `frontend/`: Houses the Vue.js frontend code.
- `docker-compose.yml`: Defines Docker services for running the project.
- `example-env-template.txt`: Example environment file for configuring the `.dev.env` file.
- `Dockerfile.backend`: Dockerfile for building the Express.js backend image.
- `Dockerfile.frontend.dev`: Dockerfile for building the Vue.js frontend image.
- `backend/pg-data`: Stores PostgreSQL data.
- `backend/config/init.sql`: Initialization SQL script for PostgreSQL.
- `backend/config/postgresql.conf`: PostgreSQL configuration file.
- `frontend/nginx.dev.conf`: Nginx configuration for development.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Docker
- Docker Compose
- Yarn (Creates using Node.js v20.x)

### Installation

Clone the repository to your local machine:

```bash
git clone git@github.com:basperheim/vue-postgres-node-docker-example.git
```

Navigate to the project directory:

```bash
cd vue-postgres-node-docker-example
```

Create a `.dev.env` file based on the `example-env-template.txt file`. Configure the environment variables to match your development setup.

### Install dependencies

Install dependencies for both the frontend and backend by running the following commands:

```bash
cd frontend
yarn install
cd ../backend
yarn install
```

Access the frontend at `http://localhost:82` and the backend at `http://localhost:3009`. Develop and make changes to the Vue.js frontend and Express.js backend as needed.

**NOTE:** You can restart the container (`docker restart app_backend`), or modify some of the Express code to kick-off nodemon to apply changes.

### Docker build and up

Build and run the Docker containers:

```bash
docker compose build && docker compose up
```

The `/pg-data` directory should be created in `/backend` for the persistent Postgres data.

### Create 'users' table

Connect to the Postgres container:

```bash
psql -h localhost -U user_here -d db_name -p 54321
```

Enter the password (as specified in `.dev.env`) and create the `'users'` table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

Exit psql using the `\q` command, and press <b>return</b>.

## Create a user

POST `http://localhost:3009/auth/login`

```
{
    "email": "johndoe@gmail.com",
    "first": "John",
    "last": "Doe",
    "password": "sOmEsTronGpAssWord!@"
}
```

## Contributing

Contributions are welcome!

## License

This project is open-source and is distributed under the GNU General Public License version 3.0 (GPL-3.0). See the `LICENSE` file for more details.
