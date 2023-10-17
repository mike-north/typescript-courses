import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import TeamSidebar from './TeamSidebar'
import Channel from './Channel'

const Team = ({ team }) => {
  console.log(
    `%c TEAM render: ${team.name}`,
    'background-color: blue; color: white',
  )
  const { channels } = team
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
          children={({ match }) => {
            if (!channels) throw new Error('no channels')
            if (!match) throw new Error('no match')

            const { params } = match
            if (!match) return <p>No match params</p>
            const { channelId: selectedChannelId } = params
            if (!selectedChannelId) return <p>Invalid channelId</p>
            const selectedChannel = channels.find(
              (c) => c.id === selectedChannelId,
            )
            if (!selectedChannel)
              return (
                <div>
                  <p>Could not find channel with id {selectedChannelId}</p>
                  <pre>{JSON.stringify(channels, null, '  ')}</pre>
                </div>
              )
            return <Channel channel={selectedChannel} />
          }}
        />
      </Switch>
    </div>
  )
}
export default Team
