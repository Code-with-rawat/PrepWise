# 🚀 AI Interview Preparation Platform (MERN + Gemini API)

An intelligent AI-powered web application that helps users prepare for job interviews by analyzing their resume, job description, and personal profile. The platform generates a personalized interview strategy, including technical questions, behavioral questions, skill gaps, and a preparation roadmap.

---

## 📌 Features

* 🔐 **User Authentication**

  * Secure Register & Login system
  * JWT-based authentication

* 📄 **Resume Upload & Analysis**

  * Upload resume (PDF supported)
  * Extract and analyze key information

* 🧠 **AI-Powered Insights (Gemini API - Flash Mode)**

  * Personalized interview strategy
  * Resume vs Job Description **Match Score**
  * Skill gap identification
  * AI-generated preparation roadmap

* ❓ **Interview Questions Generation**

  * Technical Questions based on job role
  * Behavioral Questions tailored to profile

* 📊 **Smart Analysis Dashboard**

  * Match score visualization
  * Skills gap breakdown
  * Suggested improvements

* 📥 **PDF Export**

  * Download full interview report as PDF

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Scss 
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### AI Integration

* Google Gemini API (Flash Model)

### Other Tools

* JWT Authentication
* Multer (File Upload)
* Puppeteer (PDF Generation)

---

## ⚙️ How It Works

1. User registers/login into the platform
2. Uploads:

   * Resume
   * Job Description
   * Self Description
3. Data is sent to backend
4. Gemini API processes the data
5. AI generates:

   * Match Score
   * Technical Questions
   * Behavioral Questions
   * Skill Gaps
   * Preparation Plan
6. Results are displayed on dashboard
7. User can download full report as PDF

---

## 📂 Project Structure

```
PrepWise/
│
├── frontend/       # React Application
├── backend/        # Node + Express API
├── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_google_api_key
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 📈 Future Improvements

* 🎯 Real-time mock interview (voice/video)
* 📊 Advanced analytics dashboard
* 🌍 Multi-language support
* 🧾 ATS Resume optimization suggestions

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Himanshu Rawat**
Aspiring Software Engineer | MERN Stack Developer

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!
