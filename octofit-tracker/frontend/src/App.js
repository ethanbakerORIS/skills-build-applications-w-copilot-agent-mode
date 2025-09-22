

import React from 'react';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const App = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/activities', label: 'Activities', icon: '🏃' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/teams', label: 'Teams', icon: '👥' },
    { path: '/users', label: 'Users', icon: '🦸' },
    { path: '/workouts', label: 'Workouts', icon: '💪' },
  ];

  // Fetch leaderboard and users for home page recognition
  const [topTeam, setTopTeam] = React.useState(null);
  const [topUsers, setTopUsers] = React.useState([]);
  React.useEffect(() => {
    const codespace = process.env.REACT_APP_CODESPACE_NAME;
    const leaderboardEndpoint = codespace
      ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
      : `http://localhost:8000/api/leaderboard/`;
    const usersEndpoint = codespace
      ? `https://${codespace}-8000.app.github.dev/api/users/`
      : `http://localhost:8000/api/users/`;
    fetch(leaderboardEndpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        if (results && results.length > 0) {
          setTopTeam(results[0].team);
        }
      });
    fetch(usersEndpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        if (results && results.length > 0 && topTeam) {
          setTopUsers(results.filter(u => u.team === topTeam));
        }
      });
  }, [topTeam]);

  return (
    <div className="container">
      {/* ...existing code... */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img src={process.env.PUBLIC_URL + '/octofitapp-small.png'} alt="Octofit Logo" className="App-logo" />
          Octofit Tracker
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {menuItems.map(item => (
              <li className={`nav-item${location.pathname === item.path ? ' active' : ''}`} key={item.path}>
                <NavLink className="nav-link d-flex align-items-center" to={item.path}>
                  <span className="mr-2">{item.icon}</span> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <Routes>
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/" element={
              <div className="card mx-auto" style={{maxWidth: '600px', marginTop: '40px'}}>
                <div className="card-body">
                  <h2 className="display-4 text-center mb-3">Welcome to Octofit Tracker!</h2>
                  <p className="lead text-center mb-2">Track your fitness activities, join teams, and compete on the leaderboard.</p>
                  <div className="d-flex justify-content-center mb-3">
                    <img src={process.env.PUBLIC_URL + '/octofitapp-small.png'} alt="Octofit Logo" style={{height: '80px'}} />
                  </div>
                  {topTeam && topUsers.length > 0 && (
                    <div className="alert alert-success text-center">
                      <strong>Top Team: {topTeam}</strong><br />
                      <span>Congratulations to our top users:</span>
                      <ul className="list-inline mt-2">
                        {topUsers.map(u => (
                          <li key={u.email} className="list-inline-item badge badge-pill badge-primary mx-1 p-2">
                            {u.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-3 text-center">
                    <a href="/activities" className="btn btn-primary mx-2">View Activities</a>
                    <a href="/leaderboard" className="btn btn-success mx-2">Leaderboard</a>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
