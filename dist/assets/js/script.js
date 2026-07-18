document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuIcn');
    const mainMenu = document.getElementById('mainMenu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });
    }
    
    // Handle ARIA attributes for submenu items
    const submenuItems = document.querySelectorAll('#main-menu li.has-sub > a');
    
    submenuItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const parentLi = this.parentElement;
            const submenu = parentLi.querySelector('ul');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other open submenus first
            submenuItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    const otherParentLi = otherItem.parentElement;
                    const otherSubmenu = otherParentLi.querySelector('ul');
                    if (otherSubmenu) {
                        otherSubmenu.style.display = 'none';
                        otherItem.setAttribute('aria-expanded', 'false');
                        otherParentLi.classList.remove('active');
                    }
                }
            });
            
            if (submenu) {
                if (isExpanded) {
                    submenu.style.display = 'none';
                    this.setAttribute('aria-expanded', 'false');
                    parentLi.classList.remove('active');
                } else {
                    submenu.style.display = 'block';
                    this.setAttribute('aria-expanded', 'true');
                    parentLi.classList.add('active');
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mainMenu && !mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mainMenu.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
