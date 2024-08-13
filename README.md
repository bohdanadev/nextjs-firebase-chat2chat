# NEXTJS-FIREBASE-CHAT2CHAT

## Overview

**NEXTJS-FIREBASE-CHAT2CHAT** is a real-time chat application built using **Next.js**, **TypeScript**, and **Firebase**. The application allows users to register, log in, create new chat rooms, or join existing ones and engage in conversations. The chat supports sending text messages, emojis, and images.

## Table of Contents

- [Project Setup](#project-setup)
- [Technologies Used](#technologies-used)
- [Next.js](#nextjs)
- [TypeScript](#typescript)
- [Firebase](#firebase)
- [Features](#features)
- [Running the App](#running-the-app)

## Project Setup

Before you can run this project locally, ensure you have the following tools installed:

- **Node.js** (v14 or higher)
- **npm**
- A **Firebase** project setup

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bohdanadev/nextjs-firebase-chat2chat.git
   ```

2. Navigate into the project directory:

   ```bash
   cd nextjs-firebase-chat2chat
   ```

3. Install the dependencies:

   ```bash
   npm ci

   ```

4. Set up Firebase configuration:

- Create a `.env` file in the root of your project.
- Add your Firebase project credentials to this file

## Technologies Used

### Next.js

**Next.js** is a React framework that enables functionality such as server-side rendering and generating static websites. It is known for its performance, scalability, and ease of use.

- **Features**:
  - Hybrid Static & Server Rendering
  - Automatic Code Splitting
  - API Routes
  - Optimized for SEO

### TypeScript

**TypeScript** is a strongly typed programming language that builds on JavaScript by adding static types. It helps catch errors early through its type system, enhancing the overall development experience.

- **Benefits**:
  - Static type definitions
  - Enhanced IDE support and refactoring
  - Prevents runtime type errors

### Firebase

**Firebase** is a platform developed by Google for creating mobile and web applications. It offers various tools and services like databases, authentication, and hosting.

- **Firebase Services Used**:
  - **Firestore**: A NoSQL cloud database to store and sync data in real-time.
  - **Firebase Authentication**: Handles user authentication processes, including registration and login.
  - **Firebase Storage**: Used for storing and retrieving user-generated content like images.

## Features

- **User Registration & Login**: Users can sign up and log in using their email and password.
- **Chat Rooms**: Users can create new chat rooms or join existing ones.
- **Real-time Messaging**: Messages are instantly reflected across all connected users.
- **Emojis**: Users can express themselves using a wide range of emojis.
- **Image Sharing**: Users can send images within chat rooms.

## Running the App

To start the app:

```bash
npm run start

```

The application will be accessible at http://localhost:3000
