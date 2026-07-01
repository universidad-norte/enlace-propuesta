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
            // Si no es la contraseña por defecto, pedimos que al menos tenga 8 caracteres (asumiendo que si la cambió, es una contraseña real)
            if (password !== passwordPorDefecto && password.length < 8) {
                alert(`Error en la contraseña.\n\nRecuerda que si eres nuevo, tu contraseña es "Uv." seguido de tus 5 números (Ejemplo: ${passwordPorDefecto}).\nSi ya la cambiaste, asegúrate de escribirla correctamente.`);
                return; // Detiene la ejecución
            }

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

    // --- 3. BÚSQUEDA CON SUGERENCIAS ---
    const searchItems = [
        { label: 'Inicio', url: 'home.html', keywords: ['inicio', 'home'] },
        { label: 'Horarios', url: 'Horarios.html', keywords: ['horario', 'horarios', 'clases'] },
        { label: 'Calificaciones', url: 'calificaciones.html', keywords: ['calificacion', 'calificaciones', 'notas'] },
        { label: 'Kardex', url: 'kardex.html', keywords: ['kardex'] },
        { label: 'Estado de cuenta', url: 'estado.html', keywords: ['estado', 'cuenta', 'pago', 'pagos'] },
        { label: 'Tareas', url: 'home.html', keywords: ['tarea', 'tareas'] },
        { label: 'Exámenes', url: 'home.html', keywords: ['examen', 'examenes'] },
        { label: 'Mensajes', url: 'home.html', keywords: ['mensaje', 'mensajes'] }
    ];

    function normalizeText(value) {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function createSearchDropdown(input) {
        const container = input.closest('.search-container');
        if (!container) return null;

        let dropdown = container.querySelector('.search-suggestions');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'search-suggestions';
            dropdown.style.cssText = 'position:absolute;top:calc(100% + 6px);left:0;right:0;border-radius:10px;overflow:hidden;z-index:1000;box-shadow:0 10px 25px rgba(0,0,0,0.12);';
            container.appendChild(dropdown);
        }

        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        dropdown.style.background = isDarkTheme ? '#0f172a' : '#fff';
        dropdown.style.border = isDarkTheme ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0';

        return dropdown;
    }

    function showSearchSuggestions(input, query) {
        const dropdown = createSearchDropdown(input);
        if (!dropdown) return;

        const normalizedQuery = normalizeText(query);
        if (!normalizedQuery) {
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
            return;
        }

        const matches = searchItems.filter(item => {
            const haystack = `${item.label} ${item.keywords.join(' ')}`;
            return item.keywords.some(keyword => normalizeText(keyword).startsWith(normalizedQuery)) ||
                normalizeText(item.label).startsWith(normalizedQuery) ||
                normalizeText(haystack).includes(normalizedQuery);
        }).slice(0, 6);

        dropdown.innerHTML = '';

        if (matches.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.style.display = 'block';

        matches.forEach(item => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'search-suggestion-item';
            button.style.cssText = 'display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:transparent;color:inherit;cursor:pointer;font-size:14px;';
            button.innerHTML = `<span>${item.label}</span>`;
            button.addEventListener('mouseenter', () => {
                button.style.background = document.body.getAttribute('data-theme') === 'dark' ? '#132856' : '#f8fafc';
            });
            button.addEventListener('mouseleave', () => {
                button.style.background = 'transparent';
            });
            button.addEventListener('click', () => {
                window.location.href = item.url;
            });
            dropdown.appendChild(button);
        });
    }

    document.querySelectorAll('.search-input').forEach(searchInput => {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.boxShadow = '0 0 0 3px rgba(109, 93, 246, 0.15)';
            showSearchSuggestions(searchInput, searchInput.value);
        });

        searchInput.addEventListener('input', () => {
            showSearchSuggestions(searchInput, searchInput.value);
        });

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const query = normalizeText(searchInput.value);
                if (!query) return;

                const match = searchItems.find(item =>
                    item.keywords.some(keyword => normalizeText(keyword).startsWith(query)) ||
                    normalizeText(item.label).startsWith(query)
                );

                if (match) {
                    window.location.href = match.url;
                }
            }
        });

        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.boxShadow = 'none';
            setTimeout(() => {
                const dropdown = searchInput.closest('.search-container')?.querySelector('.search-suggestions');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }, 150);
        });
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