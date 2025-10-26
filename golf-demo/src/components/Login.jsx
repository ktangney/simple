import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login } = useAuth();

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Golf Score Tracker</h1>
        <p className="login-subtitle">Track your golf card game scores and stats</p>

        <div className="login-content">
          <div className="login-features">
            <h3>Features:</h3>
            <ul>
              <li>Track scores for 9-hole games</li>
              <li>Save game history</li>
              <li>View player statistics</li>
              <li>Track wins and performance</li>
            </ul>
          </div>

          <button onClick={login} className="google-login-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="login-privacy">
            We only access your basic profile information (name and email)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
