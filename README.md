#  CareCircle

**Your Personal Health Companion for Better Care Management**

CareCircle is a comprehensive health management application designed to help patients, caregivers, and healthcare providers track vital health information, manage medications, log symptoms, and coordinate care tasks—all in one intuitive platform.

---

##  Key Features

###  **User Authentication & Profile Management**
- Secure user registration and login with JWT authentication
- Comprehensive patient profiles including age, gender, medical conditions
- Editable profile information with validation
- Secure session persistence with localStorage
- Caregiver contact information management

###  **Smart Medicine Tracker**
- **Voice Input Support**: Use the Web Speech API to add medicines by voice
  - Example: Say "Aspirin 100mg twice a day" and let AI parse the details
- Manual medicine entry with dosage and frequency
- Visual medicine schedule with status tracking (Pending, Taken, Missed)
- Real-time adherence rate calculation and visualization
- Medicine list with action buttons for quick status updates
- Persistent medicine data across sessions

###  **Symptom Logging & Health Monitoring**
- **Interactive Pain Level Slider**: Visual 1-10 scale with color-coded gradients (green → yellow → red)
  - Real-time numbered indicators showing exact pain level
- Temperature tracking in Fahrenheit
- Blood pressure monitoring (optional)
- Detailed notes for each symptom entry
- **Automated Triage Assessment**:
  - AI-powered health risk evaluation
  - Three-tier system: ✅ Normal | ⚠️ Monitor | 🚨 Consult Doctor
  - Intelligent symptom pattern recognition
  - Trend analysis across multiple symptom logs
- **Visual Health Trends**:
  - Pain level charts over time
  - Temperature trend visualization
  - Historical symptom data tracking
- **Doctor Report Generation**: Download detailed symptom reports (`.txt` format) for medical appointments

###  **Care Tasks Management**
- Create, manage, and track daily care tasks
- Categorized tasks:
  -  Vitals
  -  Exercise
  -  Diet
  -  Hygiene
  -  Medication Support
- Task status tracking (Pending, Completed, Overdue)
- Repeating task support (None, Daily, Weekly, Monthly)
- Search and filter functionality
- Completion rate analytics
- Category-based task analytics with missing task detection

###  **Comprehensive Dashboard**
- At-a-glance health overview
- Patient profile card with key demographics
- Today's medicine summary with statistics
- Recent symptom logs display
- Upcoming and overdue tasks alerts
- Color-coded status badges for quick identification
- Visual alerts for missed medications

###  **Intelligent Triage System**
- Backend AI logic evaluating symptoms
- Severity classification (Mild, Moderate, Severe)
- Automated medical advice generation
- Referral recommendations when needed
- Combines pain level and temperature data for assessment
- Fallback client-side triage if backend unavailable

###  **Responsive Design**
- Beautiful, modern UI with card-based layouts
- Color-coded components for easy navigation
- Mobile-friendly interface
- Smooth animations and transitions
- Accessibility-focused design

---

##  Tech Stack

### **Frontend**
- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Custom CSS with CSS Variables
- **Features**:
  - Web Speech API for voice input
  - LocalStorage for session persistence
  - Responsive design patterns
  - Component-based architecture

### **Backend**
- **Runtime**: Node.js 20.20.0
- **Framework**: Express 5.2.1
- **Database**: MongoDB with Mongoose 9.1.6
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs 3.0.3
- **HTTP Client**: Axios 1.13.4
- **CORS**: Enabled for cross-origin requests

### **Development Tools**
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency
- **Nodemon**: Hot-reload for backend development
- **Development Mode**: Concurrent frontend and backend servers

---

##  Getting Started

### **Prerequisites**
- Node.js (v20.x or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareCircle
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### **Environment Configuration**

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/carecircle
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

For MongoDB Atlas (cloud database):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/carecircle?retryWrites=true&w=majority
```

### **Running the Application**

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

4. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - Register a new account or login
   - Complete your profile setup
   - Start tracking your health!

---

##  Project Structure

```
CareCircle/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── env.js             # Environment config
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # User authentication
│   │   │   ├── medicine.controller.js  # Medicine CRUD
│   │   │   ├── patient.controller.js   # Patient management
│   │   │   ├── referral.controller.js  # Medical referrals
│   │   │   ├── reminder.controller.js  # Medication reminders
│   │   │   ├── symptom.controller.js   # Symptom logging
│   │   │   └── triage.controller.js    # Health triage
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # JWT verification
│   │   │   └── error.middleware.js     # Error handling
│   │   ├── models/
│   │   │   ├── Medicine.js        # Medicine schema
│   │   │   ├── Patient.js         # Patient schema
│   │   │   ├── Reminder.js        # Reminder schema
│   │   │   └── SymptomLog.js      # Symptom schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Authentication routes
│   │   │   ├── medicine.routes.js # Medicine routes
│   │   │   ├── patient.routes.js  # Patient routes
│   │   │   ├── referral.routes.js # Referral routes
│   │   │   ├── reminder.routes.js # Reminder routes
│   │   │   ├── symptom.routes.js  # Symptom routes
│   │   │   └── triage.routes.js   # Triage routes
│   │   ├── services/
│   │   │   ├── referral.service.js # Referral logic
│   │   │   ├── reminder.service.js # Reminder logic
│   │   │   └── triage.service.js   # Triage AI logic
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx           # Main dashboard
│   │   │   ├── MedicineTracker.tsx     # Medicine management
│   │   │   ├── SymptomLog.tsx          # Symptom tracking
│   │   │   ├── CareTasks.tsx           # Task management
│   │   │   ├── Profile.tsx             # User profile
│   │   │   ├── ProfileSetup.tsx        # Initial setup
│   │   │   ├── Login.tsx               # Authentication
│   │   │   ├── Card.tsx                # Reusable card
│   │   │   ├── Button.tsx              # Button component
│   │   │   ├── Badge.tsx               # Status badge
│   │   │   ├── StatCard.tsx            # Statistics card
│   │   │   ├── ListItem.tsx            # List item
│   │   │   ├── SideNav.tsx             # Navigation
│   │   │   └── data/
│   │   │       ├── medicineData.ts     # Medicine types
│   │   │       ├── symptomData.ts      # Symptom types
│   │   │       └── taskData.ts         # Task types
│   │   ├── services/
│   │   │   └── api.ts                  # API client
│   │   ├── App.tsx                     # Main app component
│   │   ├── main.tsx                    # App entry point
│   │   └── speech.d.ts                 # Speech API types
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### **Patient Management**
- `POST /api/patients` - Create patient profile
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient profile

### **Medicine Tracking**
- `POST /api/medicines` - Add new medicine
- `GET /api/medicines/patient/:patientId` - Get patient's medicines
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Remove medicine

### **Symptom Logging**
- `POST /api/symptoms` - Log new symptom
- `GET /api/symptoms/patient/:patientId` - Get patient's symptom history

### **Triage Assessment**
- `POST /api/triage` - Run triage analysis
- Request body: `{ painLevel: number, temperature: number }`

### **Reminders**
- `POST /api/reminders` - Create reminder
- `GET /api/reminders/patient/:patientId` - Get patient reminders

### **Referrals**
- `POST /api/referrals` - Create medical referral
- `GET /api/referrals/patient/:patientId` - Get patient referrals

---

##  How to Use

### **1. Registration & Setup**
1. Open the application and click "Sign Up"
2. Enter your email and password
3. Complete your profile with:
   - Full name
   - Age
   - Gender
   - Medical condition
   - Caregiver phone number

### **2. Medicine Tracking**
1. Navigate to **Medicines** tab
2. **Voice Input** (optional):
   - Click the microphone icon 🎤
   - Say: "Metformin 500mg twice a day"
   - The form auto-fills with parsed data
3. **Manual Input**:
   - Enter medicine name
   - Enter dosage (e.g., "500mg")
   - Select frequency (1-4 times per day)
4. Click "Add Medicine"
5. Mark medicines as Taken or Missed using action buttons
6. View adherence percentage in real-time

### **3. Symptom Logging**
1. Navigate to **Symptoms** tab
2. Adjust the pain level slider (1-10)
   - Watch the numbered scale highlight your selection
3. Enter temperature in Fahrenheit
4. (Optional) Enter blood pressure
5. Add detailed notes about symptoms
6. Click "Save Entry"
7. **Triage Assessment** appears automatically:
   - Review the health status (Normal/Monitor/Consult)
   - Read the automated advice
   - Generate a doctor report if needed
8. View symptom trends in the charts below

### **4. Care Tasks**
1. Navigate to **Tasks** tab
2. Click "➕ Add New Task"
3. Fill in task details:
   - Title (e.g., "Take blood pressure")
   - Category (Vitals, Exercise, Diet, etc.)
   - Due date and time
   - Repeat frequency
   - Notes
4. Click "Create Task"
5. Mark tasks complete with the checkmark
6. Delete tasks with the trash icon
7. Use filters to view specific task types

### **5. Dashboard Overview**
- View all health metrics in one place
- See alerts for missed medications
- Quick access to today's medicines
- Recent symptom logs
- Upcoming care tasks

### **6. Profile Management**
1. Navigate to **Profile** tab
2. Click "Edit Profile" to update information
3. Save changes or cancel
4. Logout when finished

---

##  Features Showcase

### **Voice-Powered Medicine Entry**
The Medicine Tracker uses the Web Speech API to convert spoken medicine information into structured data. Simply speak naturally, and the AI parser extracts:
- Medicine name (with proper capitalization)
- Dosage with units (mg, ml, IU, tablets, etc.)
- Frequency (once, twice, three times, four times per day)

### **Intelligent Pain Tracking**
The pain level slider features:
- Smooth color gradient (green → yellow → red)
- Numbered scale visible below the slider
- Active number highlighted in bold
- Visual feedback as you adjust the slider

### **Smart Triage System**
The automated triage evaluates:
- Current pain level and temperature
- Historical symptom patterns
- Trend analysis (increasing pain over time)
- Blood pressure readings
- Combination risk factors

Provides actionable recommendations:
- ✅ **Normal**: Continue monitoring at home
- ⚠️ **Monitor**: Watch symptoms closely, may need doctor visit
- 🚨 **Consult**: Seek medical attention immediately

### **Task Analytics**
Track care task completion with:
- Overall completion rate percentage
- Category breakdown (which tasks are missed most)
- Time-based organization
- Search and filter capabilities

---

##  Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes with auth middleware
- Secure session management
- Environment variable protection for sensitive data
- Input validation on forms
- XSS protection through React

---

##  Future Enhancements

- Email/SMS notifications for medication reminders
-  Mobile app (React Native)
-  Advanced analytics and ML predictions
-  Calendar integration for appointments
-  In-app messaging with caregivers
-  Multi-language support
-  Push notifications


---

##  Troubleshooting

### **Backend won't start**
- Ensure MongoDB is running
- Check `.env` file configuration
- Run `npm install` in backend directory
- Verify port 5000 is not in use

### **Frontend can't connect to backend**
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Review API base URL in `frontend/src/services/api.ts`

### **Voice input not working**
- Use Chrome, Edge, or Safari (Firefox doesn't support Web Speech API)
- Allow microphone permissions when prompted
- Ensure you're using HTTPS in production

### **Database connection errors**
- Verify MongoDB connection string in `.env`
- Check network connectivity
- Ensure database user has proper permissions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



---

## 👥 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**CareCircle** - *Making healthcare management simple, accessible, and effective.*
