
## **MERN Tinder Backend**

This project is a backend application developed using Node.js, MongoDB, Express.js, and Socket.io. It features TensorFlow.js, a powerful JavaScript library for machine learning, which is used to filter chat messages and ensure safe communication. As part of a MERN stack application, it enables users to interact with each other in real-time. Below is a detailed description of the features and functionalities provided by this project

    Log in to the application.
    Navigate to the feed to see all logged-in users.
    Send interest or ignore users as desired.
    Manage connection requests by accepting or rejecting them.
    Communicate in real-time with connected users on accepting the connection request using socket.io. TensorFlow.js is used to filter inappropriate messages to ensure safe communication.

---

### **Core Features**
- **Node.js**: Runtime for server-side JavaScript.
- **MongoDB**: Database to manage user and chat data.
- **Socket.io**: Enables real-time communication.
- **TensorFlow.js**: Facilitates machine learning integrations.
- **JWT Authentication**: Secures user access with JSON Web Tokens.
- **Mongoose**: Simplifies MongoDB object modeling.
- **Pagination**: Limits user feeds to 10 items per page for performance.
- **Rate Limiting**: Protects the login route with rate limiting to prevent brute-force attacks.This approach helps protect user accounts from unauthorized access and reduces the load on the server from brute-force login attempts.

---

### **Installation Steps**
1. **Clone the Repository**  

2. **Install Dependencies**:
   ```bash
   npm install
   npm install socket.io
   ```

3. **Environment Configuration**:
   - Create a `.env` file with the following:
     ```env
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. **Start the Server**:
   ```bash
   npm start
   ```

---

### **API Endpoints**

#### **Authentication**
- `POST /api/auth/register`: Register a user.
- `POST /api/auth/login`: Authenticate and login.
-  `POST /api/auth/logout`: User Logout

### **Password Management**
- `POST /user/forgotpw`: Initiate a password reset by generating and sending an OTP to the user's email.
- `POST /user/changepw`: Change the password using the OTP and new credentials.

### **OTP Verification**

- `POST /api/user/verifyOtp`: Verify an OTP to confirm user email.
- `POST /api/user/resendOtp`: Resend a new OTP for email verification.

#### **Users**
- `GET /api/users`: Fetch paginated users.
- `GET /api/users/:id`: Retrieve user details.
- `PATCH /api/user/:userId`: Update user information.

#### **Profile**
- `GET /profile/view`: Fetch profile details.
- `PATCH /profile/edit`: Edit profile information.

#### **Requests**
- `POST /request/send/:status/:toUserId`: Send connection requests.
- `POST /request/review/:status/:requestId`: Approve/decline requests.
- `GET /user/requests/received`: Fetch all received requests.
- `GET /user/connections`: Retrieve active connections.

#### **Chat**
- `GET /api/chat/:id`: Retrieve chat messages by user ID.
- `POST /api/chat`: Send a chat message.


### **Key Features**

#### **User Authentication**
- User registration, login, logout.
- Password hashing with `bcrypt`.
- Secure JWT token generation.

#### **Real-Time Chat**
- Dynamic messaging with Socket.io.
- WebSocket support for seamless communication.

#### **OTP-Based Verification**
- Generates OTPs for email verification and password resets.
- Sends OTP via `nodemailer`.

#### **Middleware**
- **Authentication Middleware**: Restricts route access to authenticated users.
- **Error Handling Middleware**: Provides robust error management.

---

### **Additional Features**

1. **Password Reset**:
   - Reset forgotten passwords with OTP.
   - Password confirmation during reset ensures data integrity.

2. **User Feed**:
   - Paginated feeds tailored to user preferences.
   - "Interested" or "Not Interested" functionality for each user profile.

3. **Connection Management**:
   - Send, accept, or decline connection requests.
   - View and manage active connections.

---

### **Code Structure**

#### **Authentication Routes**
Handles user registration, login, logout, and OTP-based verification.
- Password encryption using `bcrypt`.
- JWT-based authentication ensures security.

#### **Profile Routes**
Manages profile-related functionalities:
- Fetch profile details.
- Edit personal information.

#### **Chat Routes**
Integrates chat-related operations:
- Fetch historical messages.
- Real-time messaging with Socket.io.

---

Let me know if you'd like further refinements, detailed explanations, or additional examples!
