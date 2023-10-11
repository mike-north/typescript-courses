import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { getAllTeams } from '../data/teams';
import { useAsyncDataEffect } from '../utils/api';
import Loading from './components/Loading';
import SelectedTeam from './components/SelectedTeam';
import TeamSelector from './components/TeamSelector';

const { useState } = React;

const App = () => {
  const [teams, setTeams] = useState();

  useAsyncDataEffect(() => getAllTeams(), {
    setter: setTeams,
    stateName: 'teams',
  });
  if (!teams) return <Loading message="Loading teams" />;
  return (
    <Router>
      <div className="flex flex-col sm:flex-row w-full h-full">
        <TeamSelector teams={teams} />
        <Switch>
          <Route exact path="/">
            <section className="m-12 text-xl">
              <h3>Please select a team</h3>
            </section>
          </Route>
          <Route exact path="/team">
            <section className="m-12 text-xl">
              <h3>Please select a team</h3>
            </section>
          </Route>
          <Route
            path="/team/:teamId"
            children={({ match }) => (
              <SelectedTeam match={match} teams={teams} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};
export default App;
