# Golf Score Tracker - React Learning Project

A full-stack web application for tracking scores in the Golf card game. This project demonstrates fundamental React concepts along with backend integration using Express and SQLite.

## Features

- **Google Authentication**: Secure login with Google OAuth 2.0
- **User Accounts**: Each user has their own private games and statistics
- **Score Tracking**: Track scores for up to 9 rounds (holes) for multiple players
- **Game History**: View all past games with detailed scores
- **Player Statistics**: See win rates, average scores, and performance metrics
- **Database Persistence**: All games are saved to a SQLite database
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

### Frontend
- React 18 with Hooks (useState, useEffect)
- Vite for fast development and building
- CSS3 for styling

### Backend
- Node.js & Express for REST API
- SQLite (via better-sqlite3) for database
- Passport.js with Google OAuth 2.0 for authentication
- Express Sessions for session management
- CORS for cross-origin requests

## React Concepts Demonstrated

1. **useState Hook** - Managing component state
2. **useEffect Hook** - Fetching data and side effects
3. **React Context** - Global authentication state management
4. **Custom Hooks** - useAuth for authentication logic
5. **Event Handlers** - Responding to user interactions
6. **Conditional Rendering** - Showing/hiding UI elements
7. **Array Mapping** - Rendering lists of data
8. **Component Composition** - Breaking UI into reusable components
9. **Async/Await** - Making API calls with fetch
10. **Protected Routes** - Authentication-based UI rendering

## Project Structure

```
golf-score-tracker/
├── backend/
│   ├── server.js          # Express API server
│   ├── database.js        # SQLite database setup
│   ├── package.json       # Backend dependencies
│   └── golf-scores.db     # SQLite database (created on first run)
├── src/
│   ├── components/
│   │   ├── GameHistory.jsx    # Game history component
│   │   └── PlayerStats.jsx    # Player statistics component
│   ├── App.jsx            # Main app component
│   ├── App.css            # Styles
│   └── main.jsx           # React entry point
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- A Google account for OAuth setup

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

3. **Set up Google OAuth credentials:**

   **Important:** You must set up Google OAuth to run this app.

   Follow the detailed instructions in [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

   Quick summary:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Update `backend/.env` with your credentials

### Running the Application

You need to run both the frontend and backend servers:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```
The backend API will start on http://localhost:3001

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
The frontend will start on http://localhost:5173

Open http://localhost:5173 in your browser to use the application.

## API Endpoints

- `POST /api/games` - Save a completed game
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get a specific game with details
- `DELETE /api/games/:id` - Delete a game
- `GET /api/players/stats` - Get player statistics

## How to Use

1. **Start a Game**: Add players using the input field
2. **Track Scores**: Enter scores for each round (1-9)
3. **Save Game**: Click "Save Game" to persist to database
4. **View History**: Click "Game History" tab to see past games
5. **See Stats**: Click "Player Stats" tab to view player performance

## Learning Exercises

Try these to practice React skills:

1. Add a feature to edit player names after adding them
2. Implement a "Reset Scores" button for the current round
3. Add a date picker to record when games were played
4. Create a chart visualization for player statistics
5. Add search/filter functionality to game history
6. Implement pagination for the game history list

## Database Schema

### games
- id (Primary Key)
- date (ISO DateTime)
- completed (Boolean)
- created_at (Timestamp)

### players
- id (Primary Key)
- name (Unique)
- created_at (Timestamp)

### game_participants
- id (Primary Key)
- game_id (Foreign Key)
- player_id (Foreign Key)
- total_score
- round_1 through round_9
- won (Boolean)

## License

This is a learning project - feel free to use and modify as needed!
