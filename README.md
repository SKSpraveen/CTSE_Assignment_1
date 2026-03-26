
# CTSE_Assignment_1

## Overview

CTSE_Assignment_1 is a full-stack appointment management platform built with a microservices architecture. It features:
- **React + Vite** frontend (client)
- **Node.js/Express** backend microservices (User, Admin, Appointment, Service Provider)
- **API Gateway** (Nginx)
- **Docker Compose** for orchestration

**Live Demo:** [Vercel Hosted Frontend](https://ctse-assignment-1-one.vercel.app/)

---

## Folder Structure

```
├── admin-service/              # Admin microservice (Node.js/Express)
├── appointment-service/        # Appointment microservice (Node.js/Express)
├── service-provider-service/   # Service provider microservice (Node.js/Express)
├── user-service/               # User microservice (Node.js/Express)
├── api-gateway/                # Nginx API gateway
├── client/                     # React + Vite frontend
├── docker-compose.yml          # Multi-service orchestration
└── README.md                   # Project documentation
```

---

## Backend (Microservices)

Each service is a Node.js/Express app with its own dependencies and Dockerfile. All services use MongoDB (connection string in `.env`).

**Services:**
- `user-service` (port 3001)
- `admin-service` (port 3002)
- `appointment-service` (port 3003)
- `service-provider-service` (port 3004)

**Common scripts:**
- `npm install` — install dependencies
- `npm run dev` — start with nodemon (dev)
- `npm start` — start with node (prod)

**Run a service locally:**
```sh
cd <service-folder>
npm install
npm run dev
```

**Run all backend services with Docker Compose:**
```sh
docker-compose up --build
```

---

## Frontend (Client)

The frontend is a modern React app (Vite, Tailwind CSS, lucide-react, react-router-dom).

**Scripts:**
- `npm install` — install dependencies
- `npm run dev` — start dev server (http://localhost:5173)
- `npm run build` — build for production
- `npm run preview` — preview production build

**Run locally:**
```sh
cd client
npm install
npm run dev
```

---

## API Gateway

Nginx is used as an API gateway to route requests to backend services. Configured in `api-gateway/nginx.conf`.

---

## Environment Variables

Each backend service requires a `.env` file with MongoDB connection and JWT secrets. Example:

```
MONGO_URI=mongodb://localhost:27017/<db>
JWT_SECRET=your_jwt_secret
```

---

## Running Everything with Docker Compose

To start all services and the API gateway:

```sh
docker-compose up --build
```
Frontend will be available at http://localhost:8080 (proxied by Nginx).

---

## Production Deployment

- **Frontend:** Deployed on Vercel — [https://ctse-assignment-1-one.vercel.app/](https://ctse-assignment-1-one.vercel.app/)
- **Backend:** Deploy each service to your preferred cloud provider or use Docker Compose on a VM.

---

## Useful Links

- [Vercel Frontend](https://ctse-assignment-1-one.vercel.app/)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## Authors

- SKSpraveen

---