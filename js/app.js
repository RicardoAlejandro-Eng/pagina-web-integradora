// // app.js - manejo de navegación y denuncias en localStorage
// const StorageKey = "app_denuncias_v1";
// function saveDenuncias(list){ localStorage.setItem(StorageKey, JSON.stringify(list || [])); }
// function loadDenuncias(){ try{ const s = localStorage.getItem(StorageKey); return s ? JSON.parse(s) : []; }catch(e){ return []; } }
// function genId(){ return 'd_' + Date.now() + '_' + Math.floor(Math.random()*1000); }

// Login
const formLogin = document.getElementById('loginForm');
const labelErrorLogin = document.getElementById('loginError');

formLogin?.addEventListener('submit', async(e) => {
    e.preventDefault();
    const user = document.getElementById('user').value.trim();
    const pass = document.getElementById('pass').value.trim();
    try{
      const request = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({email: user, password: pass}),
        headers: { 'Content-Type': 'application/json' }
      }); 
      if(!request.ok) throw new Error('Failed request');
      const res = await request.json();
      localStorage.setItem('token', res.jwt); 
      localStorage.setItem('user_id', res.user_id); 
      window.location.href = 'menu.html';
    }catch(err){
      labelErrorLogin.textContent = 'Usuario o contraseña incorrectos.';
      labelErrorLogin.style.display = 'block';
    };
});


//Denuncias 
const form = document.getElementById('formDen');
const labelErrorReport = document.getElementById('ReportError');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    //En este punto determinar 
    const user_id = localStorage.getItem('user_id') ?? null;
    const token = localStorage.getItem('token');

    if(!user_id || !token){
      alert('No tienes permisos menso');
      return;
    };

    const titulo = document.getElementById('titulo');
    const categoria = document.getElementById('categoria');
    const descripcion = document.getElementById('descripcion');
      
    try{
      const response = await fetch("http://localhost:3000/api/report/create-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user_id,       
          title: titulo.value.trim(),
          category: categoria.value.trim(),
          descripcion: descripcion.value.trim(),
          location: 'Sabra dios donde vive'
        })
      });
      
      if(!response.ok) throw new Error('failed requested');

      titulo.value = '';
      categoria.value = '';
      descripcion.value = '';
      alert('Denuncia registrada exitosamente');
    }catch(err){
      labelErrorReport.textContent = 'No se pudo crear la denuncia';
      labelErrorReport.style.display = 'block';
    };
});
