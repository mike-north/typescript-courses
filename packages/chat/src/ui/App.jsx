import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { getAllTeams } from '../data/teams'
import { useAsyncDataEffect } from '../utils/api'
import Loading from './components/Loading'
import TeamSelector from './components/TeamSelector'
import Team from './components/Team'

const { useState } = React

const App = () => {
  const [teams, setTeams] = useState(null)

  useAsyncDataEffect(() => getAllTeams(), {
    setter: setTeams,
    stateName: 'teams',
  })
  if (teams === null) return <Loading message="Loading teams" />
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
            children={({ match }) => {
              if (!match) throw new Error('no match')

              const { params } = match
              if (!params) throw new Error('no match params')

              const { teamId: selectedTeamId } = params
              if (!selectedTeamId) throw new Error(`undefined teamId`)

              const selectedTeam = teams.find((t) => t.id === selectedTeamId)
              if (!selectedTeam)
                throw new Error(
                  `Invalid could not find team with id {selectedTeamId}`,
                )
              return <Team team={selectedTeam} />
            }}
          />
        </Switch>
      </div>
    </Router>
  )
}
export default App
