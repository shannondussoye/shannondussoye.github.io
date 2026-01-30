---
author: Shannon Dussoye
pubDatetime: '2018-07-18T00:00:00Z'
title: Running Dockerized Python on Raspberry Pi
postSlug: docker-py-pi
featured: false
draft: false
tags:
- python
- docker
description: A guide to containerizing Python applications on Raspberry Pi using Docker
ogImage: /img/dockerpy.jpg
---

Getting started with Docker and Python might seem daunting, but it’s a powerful way to manage your environments. In this tutorial, we’ll create a simple "Hello World" Python script and run it inside a Docker container on a Raspberry Pi.

## Why use Docker for Python Projects?

Docker provides a consistent, isolated environment for your applications, ensuring portability across different hardware. This is particularly valuable for Raspberry Pi projects, as it allows you to manage specific dependencies without cluttering or conflicting with your system's global packages.

## Prerequisites

- A Raspberry Pi with Docker installed ([Official Installation Guide](https://docs.docker.com/engine/install/))
- Basic familiarity with Python and the command line

## Step 1: Create the Python Script

First, let’s create a simple Python script named `app.py`:

```python
# app.py
import datetime
import platform

def main():
    print("🐍 Hello from Python in Docker! 🐳")
    print(f"Current time: {datetime.datetime.now()}")
    print(f"Python version: {platform.python_version()}")
    print(f"Platform: {platform.platform()}")
    print("This script is running successfully inside a Docker container!")

if __name__ == "__main__":
    main()
```

## Step 2: Create the Dockerfile

Next, we’ll define the container’s environment using a `Dockerfile`:

```dockerfile
# Use a slim Python 3.9 image optimized for ARM architecture
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Python script into the container
COPY app.py .

# Execute the script when the container launches
CMD ["python", "app.py"]
```

## Step 3: Build the Docker Image

Build the image and tag it with a descriptive name:

```bash
docker build -t python-hello-world .
```

## Step 4: Run the Container

Launch your containerized script:

```bash
docker run python-hello-world
```

Your output should look something like this:
```text
🐍 Hello from Python in Docker! 🐳
Current time: 2018-07-18 10:30:45.123456
Python version: 3.9.16
Platform: Linux-5.4.0-arm64
This script is running successfully inside a Docker container!
```

## Advanced Pro-Tips

### 1. Mount a Volume for Rapid Development
Avoid rebuilding the image every time you change your code by mounting your local directory:
```bash
docker run -v $(pwd):/app python-hello-world
```

### 2. Interactive Debugging
If you need to explore the containerized environment, run it interactively:
```bash
docker run -it python-hello-world bash
```

### 3. Managing Dependencies
For more complex projects, use a `requirements.txt` file and update your Dockerfile:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
CMD ["python", "app.py"]
```

## The Benefits of Docker on Pi

1. **Consistency**: Ensure the same environment across different Pi models (Zero, 3, 4, etc.).
2. **Isolation**: Keep system-wide libraries clean and avoid "hidden dependency" issues.
3. **Reproducibility**: Docker images provide a reliable "snapshot" of your working project.

## Conclusion

Combining Docker and Python provides a professional-grade foundation for Raspberry Pi development. This simple example is just the beginning—next time, we’ll dive into **Docker Compose** for managing multi-container applications!

<p align="center">
    <img src="/img/dockerpy.jpg" alt="Docker and Python logos combined">
</p>