// import 'regenerator-runtime/runtime';
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './ui/App'

function initializeReactApp() {
  const appContainer = document.getElementById('appContainer')
  if (appContainer === false)
    throw new Error('No #appContainer found in DOM')
  const root = createRoot(appContainer)
  root.render(React.createElement(App))
}

initializeReactApp()
