import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
//cau hinh react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//cau hinh mui dialog
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider defaultOptions={{
        allowClose: false,
        dialogProps:{ maxWidth:'sm' },
        confirmationButtonProps:{ color:'secondary', variant: 'outlined' },
        cancellationButtonProps:{ color:'inherit' },
        buttonOrder:['confirm', 'cancel']
      }}>
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-left' theme='colored' />
      </ConfirmProvider>
    </CssVarsProvider>
  </React.StrictMode>
)
