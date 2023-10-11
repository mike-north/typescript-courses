import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import SelectedChannel from './SelectedChannel';
import TeamSidebar from './TeamSidebar';

const Team  = ({ team }) => {
  console.log(
    `%c TEAM render: ${team.name}`,
    'background-color: blue; color: white',
  );
  const { channels } = team;
  return (
    <div className="flex-1 flex">
      <TeamSidebar team={team} />
      <Switch>
        <Route exact path={`/team/${team.id}`}>
          <h3>Please select a channel</h3>
        </Route>
        <Route
          exact
          path={`/team/${team.id}/channel/:channelId`}
          children={({ match }) => (
            <SelectedChannel match={match} channels={channels} />
          )}
        />
      </Switch>
    </div>
  );
};
export default Team;
