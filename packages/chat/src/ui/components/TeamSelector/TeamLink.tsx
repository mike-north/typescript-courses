import * as React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

const TeamLink = ({ team }) => {
  const match = useRouteMatch({
    path: `/team/${team.id}`,
    exact: false,
  })

  return (
    <Link
      to={`/team/${team.id}/channel/${team.channels[0].id}`}
      className={
        'team-selector__team-button cursor-pointer rounded-lg p-2 pl-4 inline-block sm:block no-underline opacity-25 ' +
        (match ? 'opacity-100' : '')
      }
    >
      <div className="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-lg mb-1 overflow-hidden">
        <img
          className="team-selector__team-logo"
          src={team.iconUrl}
          alt={`Join the ${name} chat`}
        />
      </div>
    </Link>
  )
}

export default TeamLink
