import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Esto indica si el usuario ya ha iniciado sesión
  const [logueado, setLogueado] = useState(false);

  // Estado para el formulario de activar bot
  const [canal, setCanal] = useState('');
  const [msg, setMsg] = useState('');

  // Datos de la app de twitch (la consola dev)
  const CLIENT_ID = 'enr7qpasu333kkml5l5g3x5fks2rgd';
  const REDIRECT_URI = 'http://localhost:3000/callback';
  const SCOPES = ['chat:read', 'chat:edit'];

  // Al cargar la app, verificamos si Twitch devolvió un token en la URL
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      setLogueado(true); // el usuario ya hizo login
      window.location.hash = ''; // limpiamos la URL para que quede más bonita
    }
  }, []);

  // Función para iniciar sesión con Twitch
  const loginConTwitch = () => {
    const urlAuth = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES.join('+')}`;
    window.location.href = urlAuth; // redirige al login de Twitch
  };

  // Función para activar el bot
  const activarBot = async (e) => {
    e.preventDefault();

    const urlBan = `/twitch/ban?canal=${canal}`;
    try {
      const resp = await fetch(urlBan, { method: 'GET' });

      if (!resp.ok) {
        setMsg('Error en el servidor');
        return;
      }

      const res = await resp.json();
      setMsg(res === true ? '¡Bot activado!' : 'No se pudo activar el bot');
    } catch (err) {
      console.error(err);
      setMsg('No se pudo conectar con el servidor');
    }
  };

  // Si no está logueado, mostramos el botón de login con Twitch
  if (!logueado) {
    return (
      <div>
        <h1>Login con Twitch</h1>
        <button onClick={loginConTwitch}>Iniciar sesión</button>
      </div>
    );
  }

  // Función para cerrar sesión
const cerrarSesion = () => {
  setLogueado(false); // resetea el estado de login
  setCanal('');
  setMsg('');
};

  // Si ya está logueado, mostramos el formulario de activar bot
  return (
    
    <form onSubmit={activarBot}>


      <input
        value={canal}
        onChange={(e) => setCanal(e.target.value)}
        placeholder="Nombre del canal"
        required
      />

      <button type="submit">Activar</button>

      {msg && <p>{msg}</p>}
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </form>
  );
}

export default App;
