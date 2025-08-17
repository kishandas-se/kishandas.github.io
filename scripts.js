// Expose submission flag globally so iframe onload attribute can access it
window.submitted = false;

// Show success toast (internal helper)
function showSuccessToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-spring to-citrus text-white px-6 py-4 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="font-semibold">Message sent successfully!</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Expose showSuccessMessage globally for iframe onload attribute
window.showSuccessMessage = function() {
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');
    
    // Reset button state
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
    if (submitText) submitText.textContent = 'Send Message';
    if (submitIcon) {
        submitIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        `;
    }
    
    // Show success toast
    showSuccessToast();
    
    // Reset form
    const form = document.getElementById('contact-form');
    if (form) form.reset();
    const charCount = document.getElementById('char-count');
    if (charCount) charCount.textContent = '0';
    
    // Reset submitted flag
    window.submitted = false;
};

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });

    // Scroll spy for navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Theme toggle (placeholder functionality)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Theme toggle functionality would go here
            console.log('Theme toggle clicked');
        });
    }

    // Character counter for message field
    // Note: original textarea uses Google Forms field name; keep previous selector fallback
    const messageField = document.querySelector('textarea[name="message"]') || document.querySelector('textarea[name="entry.MESSAGE_FIELD_ID"]');
    const charCount = document.getElementById('char-count');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', () => {
            const count = messageField.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                charCount.style.color = '#ef4444';
                messageField.style.borderColor = '#ef4444';
            } else {
                charCount.style.color = '';
                messageField.style.borderColor = '';
            }
        });
    }

    // Enhanced form submission with Google Forms integration
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitIcon = document.getElementById('submit-icon');
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            }
            if (submitText) submitText.textContent = 'Sending...';
            if (submitIcon) {
                submitIcon.innerHTML = `
                    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                `;
            }
            
            // Set submitted flag (global)
            window.submitted = true;
            
            // Form will submit to Google Forms via the action attribute
            // The hidden iframe will handle the response
        });
    }

    // Service proposal buttons: scroll to contact when clicked
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent && button.textContent.includes('Request Proposal')) {
            button.addEventListener('click', () => {
                const contactSection = document.getElementById('contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });

    // Add parallax effect to hero illustration
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.animate-float');
        if (parallax) {
            const speed = scrolled * 0.2;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
});

// Cloudflare/iframe snippet moved from original inline script (keeps same behaviour)
(function(){
    function c(){
        var b=a.contentDocument||a.contentWindow.document;
        if(b){
            var d=b.createElement('script');
            d.innerHTML="window.__CF$cv$params={r:'9702594461dc31b1',t:'MTc1NTM2MjE2Ny4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d);
        }
    }
    if(document.body){
        var a=document.createElement('iframe');
        a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';
        document.body.appendChild(a);
        if('loading'!==document.readyState) c();
        else if(window.addEventListener) document.addEventListener('DOMContentLoaded',c);
        else{
            var e=document.onreadystatechange||function(){};
            document.onreadystatechange=function(b){ e(b); 'loading'!==document.readyState&&(document.onreadystatechange=e,c())};
        }
    }
})();
