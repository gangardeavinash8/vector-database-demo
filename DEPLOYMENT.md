# Deployment to Amazon EKS

This guide outlines the steps to deploy the Semantic Search application to Amazon EKS using GitHub Actions.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **Amazon EKS Cluster**: You must have an EKS cluster running.
    - If you haven't created one, you can use `eksctl`:
      ```bash
      eksctl create cluster --name semantic-search-cluster --region us-east-1 --nodegroup-name standard-workers --node-type t3.medium --nodes 2
      ```
3.  **Docker Hub Account**: For storing container images.

## Setup GitHub Secrets

Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following secrets:

-   `AWS_ACCESS_KEY_ID`: Your AWS Access Key.
-   `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key.
-   `AWS_REGION`: The region where your EKS cluster is located (e.g., `us-east-1`).
-   `EKS_CLUSTER_NAME`: The name of your EKS cluster (e.g., `semantic-search-cluster`).
-   `DOCKER_USERNAME`: Your Docker Hub username.
-   `DOCKER_PASSWORD`: Your Docker Hub password (or Access Token).

## Architecture

The application is deployed as a set of Kubernetes microservices:

-   **sementic-frontend**: React application (served via Nginx). exposed via `LoadBalancer` on port 80.
-   **search-service**: FastAPI application. Exposed via `LoadBalancer` (externally accessible for the frontend to call).
-   **embedding-service**: FastAPI application. Internal service (only accessible within the cluster).
-   **qdrant**: Vector database. Internal service.

## Verification

1.  Push your changes to the `main` branch.
2.  Go to the **Actions** tab in GitHub to watch the "Deploy to Amazon EKS" workflow.
3.  Once the workflow completes successfully, you can verify the services on your machine (assuming you have `kubectl` configured):
    ```bash
    aws eks update-kubeconfig --name <YOUR_CLUSTER_NAME> --region <YOUR_REGION>
    kubectl get services
    ```
4.  Find the `EXTERNAL-IP` for `sementic-frontend` and open it in your browser.
