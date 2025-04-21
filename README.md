# LifeHub Dashboard

A modern, feature-rich productivity dashboard built with React, TypeScript, and Firebase.

![LifeHub Dashboard](task-master-phi-five.vercel.app)

## 🌟 Features

- **Task Management**: Create, organize, and track tasks with priorities and due dates
- **Habit Tracking**: Build and maintain daily, weekly, and monthly habits with streak tracking
- **Notes**: Create and organize notes with tags and pinning functionality
- **AI-Powered Suggestions**: Get personalized productivity suggestions based on your tasks and habits
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication**: Secure login and signup with email/password and Google authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Cloud account (for Gemini API)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/parthtaneja0001/TaskMaster.git
   cd lifehub-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Firebase** - Authentication and data storage
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Google Gemini API** - AI-powered suggestions
- **Lucide React** - Icons

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=Dashboard)

### Tasks
![Tasks](https://via.placeholder.com/800x450?text=Tasks)

### Habits
![Habits](https://via.placeholder.com/800x450?text=Habits)

### Notes
![Notes](https://via.placeholder.com/800x450?text=Notes)

## 🔒 Authentication

The application uses Firebase Authentication for secure user management. Users can:
- Sign up with email and password
- Sign in with Google
- Reset password
- Sign out

## 🧠 AI Suggestions

The dashboard provides AI-powered productivity suggestions based on:
- Incomplete tasks
- Daily habits
- Task priorities
- Habit streaks

When the AI API is unavailable, the system automatically falls back to rule-based suggestions.

## 🎨 Theming

The application supports both dark and light themes, which can be toggled using the theme switch in the sidebar. The theme preference is persisted across sessions.

## 📦 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── habits/       # Habit-related components
│   ├── layout/       # Layout components (Sidebar, etc.)
│   ├── notes/        # Note-related components
│   ├── tasks/        # Task-related components
│   └── ui/           # UI components (Button, Card, etc.)
├── config/           # Configuration files
├── lib/              # Utility functions
├── pages/            # Page components
├── store/            # Zustand stores
└── types/            # TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- [Firebase](https://firebase.google.com/) for authentication and data storage
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons 
