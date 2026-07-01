// ============================================
// ELEMENTOS PRINCIPALES
// ============================================

const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const notificationBtn = document.querySelector('.notification-btn');
const profileBtn = document.querySelector('.profile-btn');
const searchInputs = document.querySelectorAll('.search-input');
const navbar = document.querySelector('.navbar');

// ============================================
// NAVEGACIÓN ACTIVA
// ============================================

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ============================================
// TEMA OSCURO / CLARO
// ============================================

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

// Selecciona todos los botones de tema oscuro
document.querySelectorAll('.theme-toggle').forEach(btn => {
    if (btn !== themeToggle) {
        btn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }
});

function applyTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-sun"></i>';
        });
    } else {
        body.removeAttribute('data-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-moon"></i>';
        });
    }
}

// ============================================
// PERFIL
// ============================================

if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        showToast('Perfil del alumno');
    });
}

// ============================================
// BÚSQUEDA
// ============================================

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

searchInputs.forEach(searchInput => {
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

// ============================================
// EFECTO SCROLL NAVBAR
// ============================================

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px rgba(0,0,0,.05)';
    }
});

// ============================================
// CALENDARIO DINÁMICO (FECHA REAL)
// ============================================

const monthName = document.querySelector('.month-name');
const calendarGrid = document.querySelector('.calendar-grid');

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

function renderCalendar(month, year) {
    calendarGrid.innerHTML = `
        <div class="day-label">Lun</div>
        <div class="day-label">Mar</div>
        <div class="day-label">Mié</div>
        <div class="day-label">Jue</div>
        <div class="day-label">Vie</div>
        <div class="day-label">Sab</div>
        <div class="day-label">Dom</div>
    `;

    monthName.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay() || 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {
        calendarGrid.innerHTML += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        calendarGrid.innerHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                ${day}
            </div>
        `;
    }
}

renderCalendar(currentMonth, currentYear);

// ============================================
// TOAST (MENSAJES)
// ============================================

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #6D5DF6;
        color: #fff;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        box-shadow: 0 10px 15px rgba(0,0,0,.15);
        z-index: 9999;
    `;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// CONSOLE BRANDING
// ============================================

console.log(
    '%c🎓 Portal Académico - Universidad del Norte',
    'font-size:18px;font-weight:bold;color:#6D5DF6'
);