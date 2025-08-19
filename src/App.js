// Importamos la función useState de React, que nos permite guardar datos dentro del componente
import { useState } from 'react';
// Importamos el estilo de la aplicación
import './App.css';

function App() {
  // Guardamos lo que el usuario escriba en los campos
  const [user, setUser] = useState('');

    const [pass, setPass] = useState('');

  const [error, setError] = useState('');
  // Mostramos la pantalla de login
  const [step, setStep] = useState('login');
  // Guardamos el nombre del canal que se escriba
  const [canal, setCanal] = useState('');
  // Guardamos un mensaje de resultado después de intentar activar el bot
  const [msg, setMsg] = useState('');

  // Función que se ejecuta cuando se intenta iniciar sesión
  const login = async e => {
    e.preventDefault(); // Evitamos que la página se recargue al enviar el formulario

    // Enviamos al servidor el usuario y contraseña para comprobar si son correctos
    const resp = await fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass }) 
    });

    const res = await resp.json();
    if (res.success) setStep('activar');
    else setError(res.message); 
  };

  // Función que se ejecuta cuando se intenta activar el bot
  const activar = async e => {
    e.preventDefault(); 

    // Enviamos al servidor el nombre del canal para activar el bot
    const resp = await fetch('/twitch/activar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canal })
    });

    const res = await resp.json();

    setMsg(res.activated ? '¡Bot activado!' : res.message);
  };


  return step === 'login' ? (
    <form onSubmit={login}>
      <h1>Login</h1>

      <input value={user} onChange={e=>setUser(e.target.value)} placeholder="usuario" required />

      <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="contraseña" required />
      <button type="submit">Entrar</button>

      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  ) : (
    <form onSubmit={activar}> 
      <h1>Activar Bot</h1>

      <input value={canal} onChange={e=>setCanal(e.target.value)} placeholder="Nombre del canal" required />
      <button type="submit">Activar</button>

      {msg && <p>{msg}</p>}
    </form>
  );
}


export default App;
