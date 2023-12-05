import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { SignUp, LogIn, Home, Missing } from './pages'
import './scss/styles.scss'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/shared" element={<Home isHomePage={false} />} />
      <Route path="*" element={<Missing />} />
    </Routes>
  </BrowserRouter>
)

export default App
