import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0B2B5C',
          secondary: '#00AEEF',
          success: '#2E7D32',
          warning: '#F57C00',
          error: '#C62828',
          background: '#F5F7FA',
          surface: '#FFFFFF',
        }
      }
    }
  }
})