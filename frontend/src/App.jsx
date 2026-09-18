import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NovaPrijava from './pages/NovaPrijava';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prijava" element={<NovaPrijava />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
