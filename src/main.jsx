import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout.jsx'
import RouteLoading from './Components/RouteLoading.jsx'
import { CPProvider } from './context/CPContext.jsx'

const Leetcode = lazy(() => import('./Components/Leetcode/Leetcode.jsx'))
const Codeforce = lazy(() => import('./Components/Codeforce/Codeforce.jsx'))

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element = {<Layout/>}>
    <Route path='' element = {<App/>} />
   <Route path='Leetcode' element = {<Suspense fallback={<RouteLoading/>}><Leetcode/></Suspense>}/>

   <Route path='Codeforce' element = {<Suspense fallback={<RouteLoading/>}><Codeforce/></Suspense>}/>
  </Route>
))
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <CPProvider>
      <RouterProvider router={router}/>
    </CPProvider>

  </StrictMode>,
)
