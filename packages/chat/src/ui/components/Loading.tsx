import * as React from 'react'

interface Props {
  message: string
}

const Loading = ({ message = 'Loading...', children }: React.PropsWithChildren<Props> ) => (
  <h1>
    {message}...
    {children}
  </h1>
)
export default Loading
