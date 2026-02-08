import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLogin(false);
    else setIsLogin(true);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const signupData = { user: { email, password, password_confirmation: password } };
    const loginData = { email, password };

    try {
      let response;
      if (!isLogin) {
        response = await axios.post('https://gameshopterminado.onrender.com/api/signup', signupData);
        alert("¡PILOTO REGISTRADO!");
      } else {
        response = await axios.post('https://gameshopterminado.onrender.com/api/login', loginData);
      }

      // IMPORTANTE: Guardamos con la misma clave que busca App.tsx
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('gamer_user', JSON.stringify(response.data.user));
      
      alert(isLogin ? "¡ACCESO CONCEDIDO!" : "¡CUENTA CREADA!");
      navigate('/');
      window.location.reload(); 
    } catch (error: any) {
      alert("ERROR: " + (error.response?.data?.error || "Fallo de conexión"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ 
      paddingTop: '140px', minHeight: '100vh', display: 'flex', 
      justifyContent: 'center', background: 'radial-gradient(circle at center, #0d0221 0%, #050110 100%)'
    }}>
      <div className="auth-card glass" style={{
        padding: '40px', width: '400px', borderRadius: '15px',
        border: '1px solid var(--neon-blue)', boxShadow: '0 0 20px rgba(0, 210, 255, 0.1)',
        height: 'fit-content'
      }}>
        <h2 className="glitch-small" style={{ textAlign: 'center', marginBottom: '30px', color: 'white' }}>
          {isLogin ? 'SESSION_LOGIN' : 'USER_REGISTER'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: 'var(--neon-blue)', fontSize: '10px', fontFamily: 'Press Start 2P' }}>EMAIL_ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="gamer-input" style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: 'var(--neon-blue)', fontSize: '10px', fontFamily: 'Press Start 2P' }}>ACCESS_CODE</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="gamer-input" style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: '1px solid #333' }} />
          </div>
          <button type="submit" disabled={loading} className="buy-button glass" style={{ width: '100%', padding: '15px' }}>
            {loading ? 'SINCRONIZANDO...' : (isLogin ? '[ EJECUTAR_ACCESO ]' : '[ CREAR_NUEVA_CUENTA ]')}
          </button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '20px', textAlign: 'center', color: 'var(--neon-pink)', cursor: 'pointer', fontSize: '11px' }}>
          {isLogin ? '> ¿SIN CREDENCIALES? REGÍSTRATE' : '> ¿PILOTO EXISTENTE? LOGUEATE'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;