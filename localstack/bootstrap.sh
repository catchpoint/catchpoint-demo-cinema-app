#!/usr/bin/env bash

awslocal --region us-east-1 sqs create-queue --queue-name cinema-queue
awslocal --region us-east-1 ses verify-email-identity --email test@cinema-app.local
awslocal --region us-east-1 ses verify-email-identity --email admin@cinema-app.local
awslocal --region us-east-1 ses verify-email-identity --email manager@cinema-app.local
awslocal --region us-east-1 ses verify-email-identity --email user@cinema-app.local