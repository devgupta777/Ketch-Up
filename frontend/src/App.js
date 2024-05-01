
import './App.css';
import { Route,Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='chats' element={<ChatPage/>}/>
      </Routes>
    
      
    
    </div>
  );
}

export default App;
