🎓** E-Tech Learning Platform**

A full-stack E-Learning Platform built with React (Vite), Node.js/Express, Firebase Firestore, and Stripe.
The platform offers secure authentication (Email, Google, Facebook), course management for admins, and paid course enrollment for students — all powered by Firebase and a custom backend API.


🌐** Overview**

E-Tech provides an online learning environment where:
Admins manage courses, teachers, and students.
Students can browse, enroll, and pay for courses.
Guests can explore free courses and general site content.


👨‍🏫 **User Roles**


Admin	        admin@etech.com	            ADMIN1   ---
Student 1	    ameerhamza68@gmail.com	    AMEER1	 ---
Student 2	    mominsheikh718@gmail.com	  MOMIN1	 ---

You can also register new accounts using Email, Google, or Facebook.




🚀** Core Features**


🔐** Authentication**

Email + Password registration/login
Google and Facebook Sign-In (via Firebase Auth)
Automatic provider switching for duplicate emails
Backend protected via JWT tokens


🧑‍💼 **Admin Dashboard**

Restricted to admin@etech.com
Add / Edit / Delete Courses and Teachers
View all Users, Enrollments, and Transactions
Cannot enroll in paid courses
Can browse public site pages


🎓** Student Features**

Browse free and paid courses
Enroll in up to 6 paid courses
Pay securely through Stripe Checkout
Enrollments saved in Firestore
Submit feedback and contact forms


Screenshots:

<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/3fccaa94-09e5-466b-905f-64ab9d0ddb04" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/8ccc0632-ba26-4357-9a0e-5d0605f8877b" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/973b7757-9d1c-46be-b468-ab16dfabbf87" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/d72e463e-22b6-43ef-9aa9-45c338bf0bee" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/d83ea56e-24e8-4a07-a87d-5df92ed4c93b" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/0bf0dcd9-02ab-4082-88d4-b147bdec37a3" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/5399f4ee-cc54-40e1-aa6e-0af5053d9854" />

<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/677cd292-f721-4aa2-ab7a-653c801734cf" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/465e810c-43dd-4e77-be0b-14e926d15267" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/c5f7e8d3-581a-4722-84ce-c3176477c5a6" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/17213072-67da-4419-b750-19902f09e868" />
<img width="700" height="470" alt="image" src="https://github.com/user-attachments/assets/8a251a5a-801a-476e-a476-7b8f3dac85b7" />




🖼️ File Uploads (Multer + Cloudinary)

Admins can upload course thumbnails, teacher photos, or other assets directly from the dashboard.--
Files are first handled via Multer (for parsing multipart/form-data).--
Images are then uploaded securely to Cloudinary CDN, and URLs are stored in Firestore for fast retrieval.--
This ensures optimized and reliable image hosting across the app.--

🏠** Public Pages**

Home, About, Courses, Free Courses, and Contact
Feedback stored in Firestore
Fully responsive and clean UI 


🧰** Tech Stack**


Frontend	     |  React (Vite) + TypeScript, React Router, React Query ---
Styling	       |  CSS ---
Backend	       |  Node.js + Express ---
Database	     |  Firebase Firestore ---
Authentication |	Firebase Auth (Email, Google, Facebook) ---
Payments	     |  Stripe ---



🔄 **Authentication & Enrollment Flow**

User signs in using Firebase Auth (Email, Google, or Facebook).
Firebase returns an ID Token, which is sent to the Express backend.
Backend verifies it using Firebase Admin SDK and issues a JWT.
JWT is used for all secure routes.
Stripe handles payments, and Firestore stores the enrollment details.


💳 **Payment Integration (Stripe)**

Paid courses use Stripe Checkout for payment.
Students can enroll in up to 6 courses maximum.
On successful payment:
A transaction document is stored in Firestore.
The student’s enrollment list updates automatically.


⚙️ **Setup Instructions**

1️⃣** Clone Repository**
git clone https://github.com/mahad-sheikh-30/my-project-firestore.git ---
cd my-project-firestore

2️⃣ **Backend Setup**
cd backend
npm install
npx nodemon server.js

Runs on → http://localhost:8080

3️⃣** Frontend Setup**
cd frontend
npm install
npm run dev

Runs on → http://localhost:5173

⚠️ Ensure .env files are properly configured in both frontend and backend.

🧾 .env Example Files

🔙** Backend .env**
PORT=8080
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_sdk_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret

🎨** Frontend .env**
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
VITE_BACKEND_URL=http://localhost:8080


🔗 **API Routes (Express Backend)**


GET	          /api/courses	        Fetch all courses	          Public  ---
POST	        /api/courses	        Add a new course	          Admin   ---
PUT	          /api/courses/:id	    Edit a course	              Admin   ---
DELETE	      /api/courses/:id	    Delete a course	            Admin   ---
POST	        /api/enroll	          Enroll in course (Stripe)	  Student ---
GET	          /api/enrollments	    Get user enrollments	      Student ---
POST	        /api/contact	        Submit contact form	        Public ---


🔮 **Future Enhancements**

✅ Course progress tracking
✅ Email verification & password reset
✅ Teacher dashboard for managing own courses
✅ Real-time notifications (Firebase Cloud Messaging)
✅ Dark mode and enhanced UI


👨‍💻** Developer**

Mahad Ishfaq
Full-Stack Developer (MERN + Firebase + Stripe)
📧 mahadishfaq68@gmail.com


👨‍🏫** Instructor**

Asad Ali
JavaScript Engineer / Internship Mentor


🏁 **Conclusion**

This project was developed as part of an internship evaluation, demonstrating a complete production-ready MERN-style web app integrated with Firebase Firestore, Firebase Authentication, and Stripe Payments.
It showcases full-stack development, authentication, payment flow, and admin management — a complete modern web application architecture.
