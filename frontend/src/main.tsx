import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import AppWrapper from '@/components/AppWrapper.tsx'

import 'leaflet/dist/leaflet.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css'
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'
import 'datatables.net-select-bs5/css/select.bootstrap5.min.css'
import 'react-quill-new/dist/quill.core.css'
import 'react-quill-new/dist/quill.snow.css'
import 'react-quill-new/dist/quill.bubble.css'
import 'flatpickr/dist/flatpickr.min.css'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import '@/assets/scss/app.scss'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AppWrapper>
                <App/>
            </AppWrapper>
        </BrowserRouter>
    </StrictMode>,
)
