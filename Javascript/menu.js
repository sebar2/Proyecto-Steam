/**
 * ============================================
 * SCRIPT DEL MENÚ DE NAVEGACIÓN MEJORADO
 * Cerradura Smart RFID-BT
 * ============================================
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. EFECTO DE SCROLL EN EL NAVBAR
    // ========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Agregar clase cuando se hace scroll
        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // 2. CERRAR MENÚ MÓVIL AL HACER CLIC EN UN ENLACE
    // ========================================
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Si es un enlace de dropdown, no cerrar el menú
            if (!this.classList.contains('dropdown-toggle')) {
                // Cerrar el menú móvil
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // ========================================
    // 3. MARCAR PÁGINA ACTIVA EN EL MENÚ
    // ========================================
    function setActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remover todas las clases active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // Agregar clase active al enlace correspondiente
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === currentPage || href.includes(currentPage))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Manejar enlaces de dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && href.includes('#')) {
                const page = href.split('#')[0] || 'index.html';
                if (page === currentPage || (page === '' && currentPage === 'index.html')) {
                    // Marcar el dropdown como activo
                    const dropdownToggle = item.closest('.dropdown').querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        });
    }

    setActiveMenuItem();

    // ========================================
    // 4. SMOOTH SCROLL PARA ENLACES INTERNOS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces que solo son "#"
            if (href === '#' || href === '#!') {
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                
                // Cerrar menú móvil si está abierto
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }

                // Scroll suave al elemento
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Actualizar URL sin recargar la página
                history.pushState(null, null, href);
            }
        });
    });

    // ========================================
    // 5. ANIMACIÓN DE DROPDOWN
    // ========================================
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Agregar animación personalizada
            const dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                dropdown.style.animation = 'slideDown 0.3s ease';
            }
        });
    });

    // ========================================
    // 6. CERRAR DROPDOWN AL HACER CLIC FUERA
    // ========================================
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                const dropdown = new bootstrap.Dropdown(menu.previousElementSibling);
                dropdown.hide();
            });
        }
    });

    // ========================================
    // 7. INDICADOR DE CARGA DE PÁGINA
    // ========================================
    window.addEventListener('beforeunload', function() {
        document.body.style.opacity = '0.5';
    });

    // ========================================
    // 8. ACCESIBILIDAD - NAVEGACIÓN POR TECLADO
    // ========================================
    document.addEventListener('keydown', function(e) {
        // ESC para cerrar menú móvil
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }

        // ESC para cerrar dropdowns
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                const dropdown = new bootstrap.Dropdown(menu.previousElementSibling);
                dropdown.hide();
            });
        }
    });

    // ========================================
    // 9. BREADCRUMB DINÁMICO (OPCIONAL)
    // ========================================
    function updateBreadcrumb() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': 'Inicio',
            'avanze.html': 'Avances',
            'inicio.html': 'Administración'
        };

        const pageName = pageNames[currentPage] || 'Página';

        breadcrumbContainer.innerHTML = `
            <li class="breadcrumb-item"><a href="index.html">Inicio</a></li>
            <li class="breadcrumb-item active" aria-current="page">${pageName}</li>
        `;
    }

    // Llamar si existe un breadcrumb en la página
    if (document.querySelector('.breadcrumb')) {
        updateBreadcrumb();
    }

    // ========================================
    // 10. NOTIFICACIONES EN EL MENÚ (OPCIONAL)
    // ========================================
    function updateNotificationBadge(count) {
        const adminLink = document.querySelector('a[href="inicio.html"]');
        if (!adminLink) return;

        // Remover badge existente
        const existingBadge = adminLink.querySelector('.badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Agregar nuevo badge si hay notificaciones
        if (count > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge bg-danger';
            badge.textContent = count;
            badge.style.marginLeft = '0.5rem';
            adminLink.appendChild(badge);
        }
    }

    // Ejemplo de uso (puedes conectarlo con Firebase)
    // updateNotificationBadge(3);

    // ========================================
    // 11. RESALTAR SECCIÓN ACTUAL AL HACER SCROLL
    // ========================================
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = navbar.offsetHeight;

        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navbarHeight - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Actualizar enlaces del menú
            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href');
                if (href && href.includes('#' + current)) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Activar si estamos en la página principal con secciones
    if (document.querySelectorAll('section[id]').length > 0) {
        highlightCurrentSection();
    }

    // ========================================
    // 12. ANIMACIÓN DE ENTRADA DE ITEMS DEL MENÚ
    // ========================================
    function animateMenuItems() {
        const menuItems = document.querySelectorAll('.nav-item');
        
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Animar items del menú al cargar la página
    animateMenuItems();

    // ========================================
    // 13. MODO OSCURO (OPCIONAL)
    // ========================================
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    // Verificar preferencia guardada
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Agregar botón de modo oscuro si existe
    const darkModeToggle = document.querySelector('#darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // ========================================
    // 14. BÚSQUEDA EN EL MENÚ (OPCIONAL)
    // ========================================
    const searchInput = document.querySelector('#menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            document.querySelectorAll('.nav-item, .dropdown-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // ========================================
    // 15. LOGGING Y DEBUG (DESARROLLO)
    // ========================================
    console.log('✅ Menú de navegación inicializado correctamente');
    console.log('📄 Página actual:', window.location.pathname);
    console.log('🔗 Enlaces del menú:', document.querySelectorAll('.nav-link').length);
});

// ========================================
// FUNCIONES AUXILIARES EXPORTABLES
// ========================================

/**
 * Actualizar el contador de notificaciones en el menú
 * @param {number} count - Número de notificaciones
 */
function updateMenuNotifications(count) {
    const event = new CustomEvent('updateNotifications', { detail: { count } });
    document.dispatchEvent(event);
}

/**
 * Navegar a una sección específica
 * @param {string} sectionId - ID de la sección
 */
function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = element.offsetTop - navbarHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Resaltar un item del menú
 * @param {string} itemId - ID del item a resaltar
 */
function highlightMenuItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.classList.add('active');
        setTimeout(() => {
            item.classList.remove('active');
        }, 2000);
    }
}

// Exportar funciones si se usa como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateMenuNotifications,
        navigateToSection,
        highlightMenuItem
    };
}
