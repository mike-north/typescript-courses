import * as React from 'react';
import { formatTimestamp } from '../../../utils/date';

const Message = ({ user, date, body }) => (
  <div
    className="flex items-start px-6 py-2 text-sm hover-target hover:bg-gray-100 message"
    role="listitem"
  >
    <figure className="w-10 h-10 rounded overflow-hidden mr-3">
      <img
        className="message__user-avatar"
        src={user.iconUrl}
        alt={user.name}
      />
    </figure>

    <div className="flex-1">
      <h5 className="text-sm">
        <a
          href="#"
          className="message__user-name text-black font-bold no-underline hover:underline"
        >
          {user.name}
        </a>
        <span className="sr-only">at</span>
        <time className="message__timestamp text-gray-500 text-xs font-normal ml-1">
          {formatTimestamp(date)}
        </time>
      </h5>

      <p className="message__body text-black leading-normal">
        {body}
      </p>
    </div>

    <button
      className="message__delete-button border-transparent hover:border-red-400 show-on-hover hover:bg-red-100 border-1 rounded mb-1 pl-3 pr-2 py-1"
      aria-label="permanently delete this message"
    >
      🗑
    </button>
  </div>
);

export default Message;
