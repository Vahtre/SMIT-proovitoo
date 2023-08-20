import './App.css';
import RegisterView from './views/RegisterView';
import LoginView from './views/LoginView';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Public from './views/Public';
import RequireAuth from './features/auth/RequireAuth';
import Welcome from './features/auth/Welcome';
import ValuutaView from './views/ValuutaView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}></Route>
        <Route path="login" element={<LoginView />}></Route>
        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="admin" element={<ValuutaView />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
