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

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    //En este punto determinar 
    const user_id = localStorage.getItem('user_id');
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
          category: categoria,
          descripcion: descripcion.value  .trim(),
          location: 'Sabra dios donde vive'
        })
      });
      
      if(!response.ok) throw new Error('failed requested');

      titulo.value = '';
      categoria.value = '';
      descripcion.value = '';
    }catch(err){
      console.log('Error en la creacion de un reporte: ', err);
    };
});


// function renderDenuncias(filter){
//   const container = document.getElementById('listaDenuncias');
//   container.innerHTML = '';
//   let lista = loadDenuncias();
//   if(filter && filter !== 'Todas'){ lista = lista.filter(d => d.EstatusTexto === filter); }
//   if(lista.length === 0){ container.innerHTML = '<div class="card p-3"><p class="mb-0 text-muted">No hay denuncias que mostrar</p></div>'; return; }
//   lista.forEach(d => {
//     const div = document.createElement('div');
//     div.className = 'card p-3 mb-3';
//     div.innerHTML = `
//       <div class="d-flex align-items-start gap-3">
//         <div style="width:18px;height:18px;border-radius:50%;background:${d.EstatusColor};margin-top:6px"></div>
//         <div class="flex-grow-1">
//           <div class="d-flex align-items-center">
//             <h5 class="mb-0 me-2">${escapeHtml(d.Titulo)}</h5>
//             <small class="text-muted ms-auto">${escapeHtml(d.EstatusTexto)}</small>
//           </div>
//           <div class="text-muted small">${escapeHtml(d.Categoria || '')} • ${new Date(d.Fecha).toLocaleString()}</div>
//           <p class="mb-0 mt-2 text-body">${escapeHtml(truncate(d.Detalles, 160))}</p>
//         </div>
//         <div class="ms-3">
//           <a class="btn btn-primary" href="detalle_denuncia.html?id=${encodeURIComponent(d.id)}">Ver</a>
//         </div>
//       </div>
//     `;
//     container.appendChild(div);
//   });
// }

// function filterClick(f){ renderDenuncias(f); }

// function renderDetalle(){
//   const params = new URLSearchParams(location.search);
//   const id = params.get('id');
//   const area = document.getElementById('detalleArea');
//   if(!id || !area){ if(area) area.innerHTML = '<p>Denuncia no encontrada.</p>'; return; }
//   const lista = loadDenuncias();
//   const d = lista.find(x => x.id === id);
//   if(!d){ area.innerHTML = '<p>Denuncia no encontrada.</p>'; return; }
//   area.innerHTML = `
//     <div class="card p-3">
//       <div class="d-flex align-items-center gap-3 mb-2">
//         <div style="width:18px;height:18px;border-radius:50%;background:${d.EstatusColor}"></div>
//         <h4 class="mb-0">${escapeHtml(d.Titulo)}</h4>
//         <div class="ms-auto text-muted">${escapeHtml(d.EstatusTexto)}</div>
//       </div>
//       <hr>
//       <p><strong>Detalles:</strong></p>
//       <p style="white-space:pre-wrap">${escapeHtml(d.Detalles)}</p>
//       <p class="text-muted small mb-1">Categoría: ${escapeHtml(d.Categoria || 'No especificada')}</p>
//       <p class="text-muted small">Fecha: ${new Date(d.Fecha).toLocaleString()}</p>
//       <div class="mt-3 d-flex gap-2">
//         <button class="btn btn-primary" onclick="location.href='ver_denuncias.html'">Regresar</button>
//         <button class="btn btn-success" onclick="marcarAprobada('${d.id}')">Marcar Aprobada</button>
//         <button class="btn btn-danger" onclick="marcarRechazada('${d.id}')">Marcar Rechazada</button>
//       </div>
//     </div>
//   `;
// }

// function marcarAprobada(id){ const lista = loadDenuncias(); const d = lista.find(x=>x.id===id); if(!d) return; d.EstatusTexto = 'Aprobada'; d.EstatusColor = '#4caf50'; saveDenuncias(lista); alert('Estatus actualizado.'); renderDetalle(); }
// function marcarRechazada(id){ const lista = loadDenuncias(); const d = lista.find(x=>x.id===id); if(!d) return; d.EstatusTexto = 'Rechazada'; d.EstatusColor = '#f44336'; saveDenuncias(lista); alert('Estatus actualizado.'); renderDetalle(); }

// function escapeHtml(text){ if(!text) return ''; return text.replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
// function truncate(text,n){ if(!text) return ''; return text.length>n ? text.slice(0,n-1)+'…' : text; }
