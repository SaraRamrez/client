import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Esto indica si el usuario ya ha iniciado sesión
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState(null); //Aquí se guardan los datos del array que hemos visto que devuelve Twitch
  const [msg, setMsg] = useState('');

  // Datos de la app de twitch (la consola dev)
  const CLIENT_ID = 'enr7qpasu333kkml5l5g3x5fks2rgd';
  const REDIRECT_URI = 'http://localhost:3000/callback';
  const SCOPES = ['chat:read', 'chat:edit', 'user:edit'];


  useEffect(() => {
  const run = async () => {
    if (!window.location.hash.includes('access_token')) return;

    const params = new URLSearchParams(window.location.hash.substring(1));
    console.log("hola " + params);
    
    const token = params.get('access_token');

    try {

      const res = await fetch('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Client-ID': CLIENT_ID
        }
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`helix/users ${res.status}: ${t}`);
      }

      const { data } = await res.json();
      setUsuario(data?.[0]);
      setLogueado(true);
    } catch (e) {
      console.error(e);
    } finally {
      window.location.hash = '';
    }
  };

  run();
}, []);

  // Función para iniciar sesión con Twitch
  const loginConTwitch = () => {
    const urlAuth = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES.join('+')}`;
    window.location.href = urlAuth; // redirige al login de Twitch
  };

  // Función para activar el bot
  const activarBot = async (e) => {
    e.preventDefault();

    const urlBan = `/twitch/ban?canal=${usuario.login}`;
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


  // Si ya está logueado, mostramos el formulario de activar bot
  return (
    
    <form onSubmit={activarBot}>

        {usuario?.profile_image_url && (
    <img
      src={usuario.profile_image_url}
      alt={`Avatar de ${usuario.display_name}`}
      style={{ width: 80, height: 80, borderRadius: '50%' }}
    />
  )}

{/* // Aquí le decismos de mostrar el display name del array que hemos visto en consola */}

      <label>Canal: {usuario?.display_name}</label> 

      <button type="submit">Activar</button>

      {msg && <p>{msg}</p>}
    </form>
  );
}

export default App;