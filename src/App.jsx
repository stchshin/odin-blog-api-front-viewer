import { Routes, Route } from 'react-router';
import './App.css'
import MainPage from './pages/MainPage';
import PostPage from './pages/PostPage'

function App() {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path='/posts/:postId' element={<PostPage />} />
      </Routes>
  )
}

export default App
