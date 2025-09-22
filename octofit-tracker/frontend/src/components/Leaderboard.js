import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespace
    ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
    : `http://localhost:8000/api/leaderboard/`;

  useEffect(() => {
    console.log('Fetching from:', endpoint);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaderboard(results);
        console.log('Fetched leaderboard:', results);
      });
  }, [endpoint]);

  // Sort leaderboard by points descending
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);

  // Top 3 teams
  const topTeams = sortedLeaderboard.slice(0, 3);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title text-success mb-4">Leaderboard</h2>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Team</th>
              <th>Points</th>
              <th>Indicator</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry, idx) => {
              let indicator = null;
              if (idx === 0) indicator = <span className="badge badge-warning">🥇 1st</span>;
              else if (idx === 1) indicator = <span className="badge badge-secondary">🥈 2nd</span>;
              else if (idx === 2) indicator = <span className="badge badge-info">🥉 3rd</span>;
              return (
                <tr key={idx}>
                  <td>{entry.team}</td>
                  <td>{entry.points}</td>
                  <td>{indicator}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {topTeams.length > 0 && (
          <div className="mt-4">
            <h5 className="text-center">Top Teams</h5>
            <div className="d-flex justify-content-center">
              {topTeams.map((team, idx) => (
                <div key={team.team} className="card mx-2" style={{minWidth: '120px'}}>
                  <div className="card-body text-center">
                    <h6 className="card-title mb-2">{team.team}</h6>
                    <span className="badge badge-success mb-2">{team.points} pts</span>
                    {idx === 0 && <div className="mt-2"><span className="badge badge-warning">🥇</span></div>}
                    {idx === 1 && <div className="mt-2"><span className="badge badge-secondary">🥈</span></div>}
                    {idx === 2 && <div className="mt-2"><span className="badge badge-info">🥉</span></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
