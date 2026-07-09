document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LÓGICA DEL BOTÓN DE INGRESO (FORMULARIO Y VALIDACIONES) ---
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            // Evita que la página se recargue automáticamente
            event.preventDefault(); 

            // Obtiene los valores limpiando espacios al inicio y al final
            const username = document.getElementById("usernameInput").value.trim();
            const password = document.getElementById("passwordInput").value.trim();

            // VALIDACIÓN 1: Formato estricto del correo
            // ^al : debe empezar con "al"
            // (\d{5}) : debe contener exactamente 5 dígitos numéricos (los capturamos)
            // @un\.edu\.mx$ : debe terminar exactamente con "@un.edu.mx"
            const emailRegex = /^al(\d{5})@un\.edu\.mx$/;
            const matchCorreo = username.match(emailRegex);

            if (!matchCorreo) {
                alert("Error: El usuario debe empezar con 'al', seguido de exactamente 5 números y terminar en '@un.edu.mx'.\n\nEjemplo válido: al34567@un.edu.mx");
                return; // Detiene la ejecución
            }

            // Extraemos los 5 números (matrícula) que guardamos gracias a (\d{5})
            const matricula = matchCorreo[1]; 
            const passwordPorDefecto = "Uv." + matricula; // Construimos la contraseña que debería ser

            // VALIDACIÓN 2: Contraseña por defecto o contraseña cambiada
            const storedPassword = localStorage.getItem("enlaceCurrentPassword") || "";
            const isValidPassword = password === passwordPorDefecto || password === storedPassword || password.length >= 8;

            if (!isValidPassword) {
                alert(`Error en la contraseña.\n\nRecuerda que si eres nuevo, tu contraseña es "Uv." seguido de tus 5 números (Ejemplo: ${passwordPorDefecto}).\nSi ya la cambiaste, asegúrate de escribirla correctamente.`);
                return; // Detiene la ejecución
            }

            // Guardamos la contraseña vigente para usarla en la página de cambio de contraseña
            localStorage.setItem("enlaceCurrentPassword", password);

            // Si pasa todas las validaciones, procedemos con la simulación
            const btn = loginForm.querySelector(".btn-primary");
            const btnOriginalText = btn.innerHTML;
            
            btn.innerHTML = "Verificando credenciales...";
            btn.style.opacity = "0.7";
            btn.style.cursor = "wait";

            // Simula un tiempo de espera de conexión con el servidor (1.5 segundos)
            setTimeout(() => {
                // Mensaje dinámico dependiendo de si usó la contraseña por defecto o una personalizada
                if (password === passwordPorDefecto) {
                    alert(`¡Bienvenido al sistema ENLACE!\n\n ${username}`);
                }
                // Restaura el botón a su estado normal
                btn.innerHTML = btnOriginalText;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                
                // Redirige a la página de inicio del estudiante
                window.location.href = "home.html"; 
                
            }, 1500); 
        });
    }

    // --- 2. LÓGICA PARA ILUMINAR EL BOTÓN ACTIVO EN EL MENÚ DE NAVEGACIÓN ---
    const currentLocation = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Identifica si estamos en la ruta actual o en la raíz (index)
        if (linkPath === currentLocation || (currentLocation === "" && linkPath === "index.html")) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

     function actualizarFechaHora() {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const hora = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById('currentDate').textContent = fecha;
    document.getElementById('currentTime').textContent = hora + ' hrs';
}

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);
});

// ============================================
// TEMA OSCURO / CLARO (Global)
// ============================================

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

applyTheme(initialTheme);

// Selecciona todos los botones de tema oscuro
document.querySelectorAll('.theme-toggle').forEach(themeToggle => {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
});

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        });
    } else {
        document.body.removeAttribute('data-theme');
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
        });
    }
}