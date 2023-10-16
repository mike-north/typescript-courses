import * as React from 'react'
import Team from './Team'

const SelectedTeam: React.FC<{ teamId: string , teams: any[]}> = ({ teamId, teams }) => {

  const selectedTeam = teams.find((t) => t.id === teamId)

  if (!selectedTeam)
    throw new Error(
      `Invalid could not find team with id {teamId}`,
    )

  return <Team team={selectedTeam} />
}

export default SelectedTeam
