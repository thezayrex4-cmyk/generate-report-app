# AWS Deployment Guide for ShipTrack Application

## Prerequisites
1. Install AWS CLI
2. Install Docker
3. Configure AWS credentials
4. Create an Amazon ECR repository

## Steps to Deploy

### 1. Build and Test Locally
```bash
# Build and run locally with docker-compose
docker-compose up --build
```

### 2. Push to Amazon ECR
```bash
# Login to ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com

# Tag the image
docker tag shippingmanagement_webapp:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/shiptrack:latest

# Push to ECR
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/shiptrack:latest
```

### 3. Create ECS Cluster
1. Go to AWS ECS Console
2. Create a new cluster
3. Choose "Networking only" for the cluster template
4. Name your cluster (e.g., "shiptrack-cluster")

### 4. Create Task Definition
1. Go to Task Definitions in ECS Console
2. Create new Task Definition
3. Choose "Fargate"
4. Configure:
   - Task Definition Name: shiptrack-task
   - Task Role: ecsTaskExecutionRole
   - Network Mode: awsvpc
   - Task memory: 2GB
   - Task CPU: 1 vCPU
   - Container Definition:
     * Container name: shiptrack
     * Image: YOUR_AWS_ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com/shiptrack:latest
     * Port mappings: 80
     * Environment variables: as needed

### 5. Create Service
1. In your ECS Cluster, create a new Service
2. Configure:
   - Launch type: FARGATE
   - Task Definition: shiptrack-task
   - Service name: shiptrack-service
   - Number of tasks: 2 (for high availability)
   - VPC and Security Groups:
     * Choose your VPC
     * Configure security groups to allow inbound traffic on port 80
   - Load Balancer:
     * Create an Application Load Balancer
     * Configure listener on port 80
     * Create target group

### 6. Set up Auto Scaling (Optional)
1. In your ECS Service, configure Service Auto Scaling
2. Set up scaling policies based on:
   - CPU Utilization
   - Memory Utilization
   - Request Count Per Target

### 7. Monitor
1. Set up CloudWatch Alarms for:
   - Service health
   - Container metrics
   - Application logs

## Important Security Notes
1. Always use HTTPS in production
2. Store sensitive configuration in AWS Secrets Manager
3. Use IAM roles with least privilege
4. Regularly update container images
5. Monitor security advisories

## Cost Optimization
1. Use Fargate Spot for non-critical workloads
2. Implement auto-scaling based on actual usage
3. Monitor and optimize resource allocation
4. Use AWS Cost Explorer to track expenses

## Backup and Disaster Recovery
1. Set up regular snapshots of any persistent data
2. Implement multi-region deployment for critical workloads
3. Document and test recovery procedures
