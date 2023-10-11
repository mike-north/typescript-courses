import * as React from 'react';

const Header = ({ title, description }) => (
  <header className="border-b flex px-6 py-2 items-center flex-row channel-header">
    <div className="flex-1">
      <h3 className="text-gray-800 mb-1 font-extrabold channel-header__title">
        <span aria-hidden="true">#</span>
        {title}
      </h3>
      <h4 className="text-gray-600 text-sm truncate channel-header__description">
        {description}
      </h4>
    </div>
  </header>
);

export default Header;
