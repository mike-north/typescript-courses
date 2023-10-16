import * as React from 'react'

const Footer = ({ channel: { name: channelName } }) => (
  <footer className="pb-6 px-4 flex-none channel-footer">
    <form
      className="flex w-full rounded-lg border-2 border-gray overflow-hidden"
      aria-labelledby="message-label"
    >
      <p id="message-label" className="sr-only">
        Message Input
      </p>

      <button
        className="text-3xl text-gray border-r-2 border-gray p-2"
        aria-label="add a file to this message"
      >
        <svg
          aria-hidden="true"
          className="fill-current h-6 w-6 block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z"></path>
        </svg>
      </button>

      <label htmlFor="message-input" className="sr-only">
        Send a message to the channelName channel
      </label>

      <input
        id="message-input"
        className="channel-footer__message-input w-full px-4"
        placeholder={`Send a message to the #${channelName} channel`}
        type="text"
      />

      <button
        disabled
        className="channel-footer__message-send-button font-bold uppercase opacity-50 bg-gray-600 text-white border-teal-600 p-2"
      >
        SEND
      </button>
    </form>
  </footer>
)

export default Footer
