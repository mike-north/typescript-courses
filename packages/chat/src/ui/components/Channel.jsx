import * as React from 'react'
import { getChannelMessages } from '../../data/messages'
import { useAsyncDataEffect } from '../../utils/api'
import ChannelFooter from './Channel/Footer'
import ChannelHeader from './Channel/Header'
import ChannelMessage from './Channel/Message'
import Loading from './Loading'

const Channel = ({ channel }) => {
  /**
   * @type {any[] | null}
   */
  const initialMessages = null
  const [messages, setMessages] = React.useState(initialMessages)
  useAsyncDataEffect(
    () => getChannelMessages(channel.teamId, channel.id),
    {
      setter: setMessages,
      stateName: 'messages',
      otherStatesToMonitor: [channel],
    },
  )
  if (!messages) return <Loading message="Loading messages" />
  if (messages.length === 0) return <Loading message="No messages" />
  console.log(
    `%c CHANNEL render: ${channel.name}`,
    'background-color: purple; color: white',
  )
  return (
    <main className="flex-1 flex flex-col bg-white overflow-hidden channel">
      <ChannelHeader
        title={channel.name}
        description={channel.description}
      />
      <div
        className="py-4 flex-1 overflow-y-scroll channel-messages-list"
        role="list"
      >
        {messages.map((m) => (
          <ChannelMessage
            key={m.id}
            body={m.body}
            date={new Date(m.createdAt)}
            user={m.user}
          />
        ))}
      </div>

      <ChannelFooter channel={channel} />
    </main>
  )
}
export default Channel
