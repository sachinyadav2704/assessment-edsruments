import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import InvoiceForm from './components/InvoiceForm';
import './styles/App.css';

function App() {
   const { user } = useAuth();

   return (
      <Router>
         <Routes>
            <Route path="/login" element={user ? <Navigate to="/invoice" /> : <Login />} />
            <Route path="/invoice" element={user ? <InvoiceForm /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? '/invoice' : '/login'} />} />
         </Routes>
      </Router>
   );
}

export default App;
