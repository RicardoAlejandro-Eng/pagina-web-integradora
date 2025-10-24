// login
const formLogin = document.getElementById('loginForm');
const labelErrorLogin = document.getElementById('loginError');

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = document.getElementById('user').value.trim();
  const pass = document.getElementById('pass').value.trim();

  try {
    const request = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user, password: pass })
    });

    if (!request.ok) throw new Error('Failed request');

    const res = await request.json();

    // Guardar token y user_id
    localStorage.setItem('token', res.jwt);
    localStorage.setItem('user_id', res.user_id);

    window.location.href = 'menu.html';
  } catch (err) {
    labelErrorLogin.textContent = 'Usuario o contraseña incorrectos.';
    labelErrorLogin.style.display = 'block';
  }
});


//crear denuncias
const form = document.getElementById('formDen');
const labelErrorReport = document.getElementById('ReportError');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  if (!user_id || !token) {
    alert('No tienes permisos para crear una denuncia');
    return;
  }

  const titulo = document.getElementById('titulo').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/report/create-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id,
        title: titulo,
        category: categoria,
        descripcion,
        location: 'Ubicación desconocida'
      })
    });

    if (!response.ok) throw new Error('Error en la solicitud');

    document.getElementById('titulo').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('descripcion').value = '';

    alert('Denuncia registrada exitosamente');
  } catch (err) {
    labelErrorReport.textContent = 'No se pudo crear la denuncia.';
    labelErrorReport.style.display = 'block';
  }
});


//editar denuncia
async function editarDenuncia(id) {
  const nuevoTitulo = prompt("Nuevo título de la denuncia:");
  if (!nuevoTitulo) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/report/update-report/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: nuevoTitulo })
    });

    if (!response.ok) throw new Error('Error al editar la denuncia');
    alert('Denuncia actualizada correctamente');
    location.reload();
  } catch (error) {
    console.error(error);
    alert('No se pudo editar la denuncia');
  }
}


//eliminar denuncia
async function eliminarDenuncia(id) {
  const confirmar = confirm('¿Estás seguro de eliminar esta denuncia?');
  if (!confirmar) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/report/delete-report/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar la denuncia');
    alert('Denuncia eliminada correctamente');
    location.reload();
  } catch (error) {
    console.error(error);
    alert('No se pudo eliminar la denuncia');
  }
}
