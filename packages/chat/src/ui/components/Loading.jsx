import * as React from 'react';

const Loading = ({ message = 'Loading...', children }) => (
  <h1>
    {message}...
    {children}
  </h1>
);
export default Loading;
