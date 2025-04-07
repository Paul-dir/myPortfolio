document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const aside = document.querySelector('.aside');
    const navToggler = document.querySelector('.nav-toggler');
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('.section');
    const mainContent = document.querySelector('.main-content');
    const scrollToggleBtn = document.querySelector('#scrollToggle');
    const progressBar = document.querySelector('.progress-bar');
    let isHorizontalScroll = false;

    // Function to handle aside visibility based on screen size
    function updateAsideVisibility() {
        const screenWidth = window.innerWidth;
        const largeScreenBreakpoint = 992;

        if (screenWidth >= largeScreenBreakpoint && !isHorizontalScroll) {
            aside.classList.add('open');
            navToggler.style.display = 'none';
        } else {
            aside.classList.remove('open');
            navToggler.style.display = 'flex';
        }
    }

    // Initial check for aside visibility
    updateAsideVisibility();

    // Update aside visibility on window resize
    window.addEventListener('resize', updateAsideVisibility);

    // Toggle Navigation
    navToggler.addEventListener('click', toggleAside);

    // Close Aside When Clicking Outside (mobile/normal screens)
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 992 && 
            !aside.contains(e.target) && 
            !navToggler.contains(e.target)) {
            aside.classList.remove('open');
        }
    });

    // Toggle Scroll Direction
    scrollToggleBtn.addEventListener('click', () => {
        isHorizontalScroll = !isHorizontalScroll;
        document.body.classList.toggle('horizontal-scroll');
        scrollToggleBtn.textContent = isHorizontalScroll ? 'Vertical Scroll' : 'Horizontal Scroll';
        updateAsideVisibility();

        // Reset scroll position to top/left when switching modes
        if (isHorizontalScroll) {
            window.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Navigation Click Handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Update Active States
            setActiveSection(targetSection);
            setActiveLink(this);

            // Smooth Scroll
            smoothScrollTo(targetSection);

            // Close Mobile Menu on smaller screens
            if (window.innerWidth < 992) {
                aside.classList.remove('open');
            }
        });
    });

    // Scroll Handler
    window.addEventListener('scroll', throttle(() => {
        if (isHorizontalScroll) {
            // Horizontal Scroll
            const currentPos = window.scrollX + (window.innerWidth / 2);
            sections.forEach(section => {
                const sectionLeft = section.offsetLeft;
                const sectionRight = sectionLeft + section.offsetWidth;

                if (currentPos >= sectionLeft && currentPos <= sectionRight) {
                    setActiveSection(section);
                    setActiveLink(document.querySelector(`a[href="#${section.id}"]`));
                }
            });

            // Update Progress Bar (Horizontal)
            const totalWidth = document.documentElement.scrollWidth - window.innerWidth;
            const scrollPosition = window.scrollX;
            const scrollPercentage = totalWidth > 0 ? (scrollPosition / totalWidth) * 100 : 0;
            progressBar.style.width = `${scrollPercentage}%`;
        } else {
            // Vertical Scroll
            const currentPos = window.scrollY + (window.innerHeight / 2);
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (currentPos >= sectionTop && currentPos <= sectionBottom) {
                    setActiveSection(section);
                    setActiveLink(document.querySelector(`a[href="#${section.id}"]`));
                }
            });

            // Update Progress Bar (Vertical)
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const scrollPercentage = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;
            progressBar.style.width = `${scrollPercentage}%`;
        }
    }, 100));

    // Initial Active State
    setActiveSection(sections[0]);
    setActiveLink(navLinks[0]);

    // Functions
    function toggleAside() {
        aside.classList.toggle('open');
    }

    function setActiveSection(section) {
        sections.forEach(s => s.classList.remove('active'));
        section.classList.add('active');
    }

    function setActiveLink(link) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    }

    function smoothScrollTo(target) {
        if (isHorizontalScroll) {
            // Horizontal Scroll
            let targetPosition = target.offsetLeft;
            // Adjust for nested structure by adding parent offsets if necessary
            let parent = target.offsetParent;
            while (parent) {
                targetPosition += parent.offsetLeft;
                parent = parent.offsetParent;
            }
            window.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Vertical Scroll
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }
});