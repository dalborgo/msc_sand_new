import 'react-perfect-scrollbar/dist/css/styles.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'src/utils/wdyr'
import React from 'react'
import ReactDOM from 'react-dom'
import { SettingsProvider } from 'src/contexts/SettingsContext'
import App from 'src/App'
import './init'

ReactDOM.render(
  <SettingsProvider>
    <App/>
  </SettingsProvider>,
  document.getElementById('root')
)

/*
ReactDOM.render(
  <React.StrictMode>
      <SettingsProvider>
        <App/>
      </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
*/
