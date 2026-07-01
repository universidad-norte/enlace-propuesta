// ============================================
// ELEMENTOS PRINCIPALES
// ============================================

const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const notificationBtn = document.querySelector('.notification-btn');
const profileBtn = document.querySelector('.profile-btn');
const searchInput = document.querySelector('.search-input');
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

if (searchInput) {
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.style.boxShadow =
            '0 0 0 3px rgba(109, 93, 246, 0.15)';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.style.boxShadow = 'none';
    });
}

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