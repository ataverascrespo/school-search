# syntax=docker/dockerfile:1

# Use the official Python 3.10 image as the base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]