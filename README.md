# 🎟️ E-Ticket Booking System

A full-stack MERN (MongoDB, Express, React, Node.js) web application for booking tickets, containerized with Docker and deployed using Kubernetes on Minikube. CI/CD pipeline integration is handled via GitHub Actions and Jenkins with self-hosted runners.

---

## 📁 Project Structure

/E-Ticket Booking System
│
└── /app
├── /frontend # React-based UI for ticket search & booking
└── /backend # Express.js API + MongoDB for tickets, users


---

## 🚀 Tech Stack

- **Frontend:** React, Axios, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB
- **Containerization:** Docker
- **Orchestration:** Kubernetes (Minikube)
- **CI/CD:** GitHub Actions, Jenkins (optional)
- **Version Control:** Git & GitHub

---

## 🔧 Setup Instructions

### 🖥️ Run Locally

**Backend**
cd app/backend
npm install
npm start

**Frontend**
cd app/frontend
npm install
npm start


## 🔨 Docker Build
**Backend**
docker build -t your-dockerhub-username/e-ticket-backend:latest ./app/backend

**Frontend**
docker build -t your-dockerhub-username/e-ticket-frontend:latest ./app/frontend


## ☸️ Kubernetes Deploy (Minikube)

**Start Minikube:**
minikube start

**Apply Manifests:**
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml

**Access Frontend:**
minikube service frontend-service


## 🤖 CI/CD Pipeline:

**GitHub Actions Workflow**
Auto builds Docker images

**Pushes to Docker Hub**
Deploys to Minikube Kubernetes cluster

**Stored at:**
.github/workflows/deploy.yml

**Secrets required:**
DOCKER_USERNAME
DOCKER_PASSWORD

## 🧪 Testing
Manual testing via UI and API endpoints. Automated testing can be integrated with Jest (frontend) and Mocha/Chai (backend).

## 👤 Author
Azghan Ahmad
Bachelor of Software Engineering – FAST NUCES
Email: azghanduplicate786@gmail.com

## 📄 License
This project is licensed under the MIT License.
