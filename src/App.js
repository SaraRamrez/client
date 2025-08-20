import { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('login');
  const [canal, setCanal] = useState('');
  const [msg, setMsg] = useState('');

  // Función de login
  const login = async e => {
    e.preventDefault(); 

    const url = `/user/login?user=${user}&password=${pass}`;

    try {
      const resp = await fetch(url, { method: 'GET' });

      if (!resp.ok) {
        setError('Error en el servidor');
        return;
      }

      const res = await resp.json(); // true o false

      if (res === true) {
        setStep('activar');
        setError('');
      } else {
        setError('Error de credenciales');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
    }
  };

  // Función para activar el bot
  const activar = async e => {
    e.preventDefault(); 

  const urlBan = `/twitch/ban?canal=${canal}`;
    try {
      const resp = await fetch(urlBan, {
        method: 'GET',
      });

      if (!resp.ok) {
        setMsg('Error en el servidor');
        return;
      }

      const res = await resp.json(); // true o false
      // console.log(res);

      if (res === true) {
        setMsg('¡Bot activado!');
      } else {
        setMsg('No se pudo activar el bot');
      }
    } catch (err) {
      console.error(err);
      setMsg('No se pudo conectar con el servidor');
    }
  };

  return step === 'login' ? (
    <form onSubmit={login}>
      <h1>Login</h1>

      <input
        value={user}
        onChange={e => setUser(e.target.value)}
        placeholder="usuario"
        required
      />

      <input
        type="password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        placeholder="contraseña"
        required
      />

      <button type="submit">Entrar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  ) : (
    <form onSubmit={activar}>
      <h1>Activar Bot</h1>

      <input
        value={canal}
        onChange={e => setCanal(e.target.value)}
        placeholder="Nombre del canal"
        required
      />

      <button type="submit">Activar</button>

      {msg && <p>{msg}</p>}
    </form>
  );
}

export default App;
