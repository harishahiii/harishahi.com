document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds (simulate loading)
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Initialize 3D background
    initThreeJS();
    
    // Initialize animations
    initScrollAnimations();
    
    // Initialize gallery
    initGallery();
    
    // Initialize documents
    initDocuments();
    
    // Initialize admin panel functionality
    initAdminPanel();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize form submissions
    initForms();
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Initialize scroll reveal
    initScrollReveal();
});

// Three.js Background Setup
let scene, camera, renderer, particles;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bg-canvas'),
        alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x2196f3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 3;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate skill bars if in profile section
                if (entry.target.id === 'profile') {
                    animateSkillBars();
                }
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => observer.observe(section));
}

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-width');
        const progressBar = bar.querySelector('.progress-bar');
        progressBar.style.width = progress;
    });
}

// File upload functionality
function initFileUpload() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFiles(files, area.getAttribute('data-type'));
        });
        
        // Click to upload
        area.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = getAcceptedFileTypes(area.getAttribute('data-type'));
            input.multiple = true;
            
            input.onchange = (e) => {
                handleFiles(e.target.files, area.getAttribute('data-type'));
            };
            
            input.click();
        });
    });
}

function getAcceptedFileTypes(type) {
    switch(type) {
        case 'image':
            return 'image/*';
        case 'video':
            return 'video/*';
        case 'document':
            return '.pdf,.doc,.docx';
        default:
            return '*/*';
    }
}

function handleFiles(files, type) {
    Array.from(files).forEach(file => {
        // Create preview if it's an image or video
        if (type === 'image' || type === 'video') {
            createMediaPreview(file, type);
        } else {
            // Handle document upload
            createDocumentItem(file);
        }
        
        // Here you would typically upload the file to a server
        uploadFile(file);
    });
}

function createMediaPreview(file, type) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const galleryGrid = document.querySelector('.gallery-grid');
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        if (type === 'image') {
            item.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
        } else {
            item.innerHTML = `
                <video controls>
                    <source src="${e.target.result}" type="${file.type}">
                </video>
            `;
        }
        
        galleryGrid.appendChild(item);
    };
    reader.readAsDataURL(file);
}

function createDocumentItem(file) {
    const documentsList = document.querySelector('.documents-list');
    const item = document.createElement('div');
    item.className = 'document-item';
    item.innerHTML = `
        <i class="far fa-file-pdf"></i>
        <span>${file.name}</span>
        <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
    `;
    documentsList.appendChild(item);
}

function uploadFile(file) {
    // Implement your file upload logic here
    console.log(`Uploading file: ${file.name}`);
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initGallery() {
    // Sample gallery data (in a real app, this would come from a server)
    const galleryData = [
        { id: 1, type: 'photos', title: 'Nature Photo', description: 'Beautiful nature landscape', url: 'nature.jpg', url: 'nature1.jpg', url: 'nature2.jpg', thumbnail: 'nt.jpg' },
        { id: 2, type: 'photos', title: 'City View', description: 'Skyline at night', url: 'city.jpg', thumbnail: 'ct.jpg' },
        { id: 3, type: 'videos', title: 'Travel Video', description: 'My recent travel adventure', url: 'travel.mp4', thumbnail: 'tv.jpg' },
        { id: 4, type: 'photos', title: 'Portrait', description: 'Professional portrait shot', url: 'portrait.jpg', thumbnail: 'pot.jpg' },
        { id: 5, type: 'videos', title: 'Tutorial', description: 'How to use this website comming soon...', url: 'tutorial.mp4', thumbnail: 'tt.png' },
        { id: 6, type: 'photos', title: 'my edits', description: 'Latest edit', url: 'edit.jpg', thumbnail: 'ed.jpg' }
    ];
    
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Render gallery items
    function renderGallery(items) {
        galleryGrid.innerHTML = '';
        
        items.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.type}`;
            galleryItem.setAttribute('data-id', item.id);
            
            galleryItem.innerHTML = `
                <div class="gallery-item-inner">
                    ${item.type === 'photos' ? 
                        `<img src="${item.thumbnail}" alt="${item.title}">` : 
                        `<video src="${item.url}" poster="${item.thumbnail}"></video>`}
                    <div class="gallery-item-overlay">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
            
            // Add click event to open media viewer
            galleryItem.addEventListener('click', () => openMediaViewer(item));
        });
        
        // Initialize hover effects
        gsap.set('.gallery-item-overlay', { y: '100%' });
        
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item.querySelector('.gallery-item-overlay'), {
                    y: '0%',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item.querySelector('.gallery-item-overlay'), {
                    y: '100%',
                    duration: 0.3,
                    ease: 'power2.in'
                });
            });
        });
    }
    
    // Filter gallery items
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const filteredItems = filter === 'all' ? 
                galleryData : 
                galleryData.filter(item => item.type === filter);
            
            renderGallery(filteredItems);
        });
    });
    
    // Initial render
    renderGallery(galleryData);
}

function initDocuments() {
    // Sample documents data (in a real app, this would come from a server)
    const documentsData = [
        { id: 1, title: 'Resume', description: 'My professional resume', url: 'https://example.com/sample.pdf', date: '2023-05-15' },
        { id: 2, title: 'Portfolio', description: 'Collection of my works', url: 'https://example.com/portfolio.pdf', date: '2023-06-20' },
        { id: 3, title: 'Certification', description: 'Professional certification', url: 'https://example.com/certificate.pdf', date: '2023-04-10' }
    ];
    
    const documentsList = document.querySelector('.documents-list');
    
    // Render documents
    function renderDocuments() {
        documentsList.innerHTML = '';
        
        documentsData.forEach(doc => {
            const docItem = document.createElement('div');
            docItem.className = 'document-item';
            
            docItem.innerHTML = `
                <div class="document-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="document-info">
                    <h4>${doc.title}</h4>
                    <p>${doc.description}</p>
                    <span class="document-date">${doc.date}</span>
                </div>
                <div class="document-actions">
                    <button class="download-btn" data-url="${doc.url}">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="view-btn" data-url="${doc.url}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            `;
            
            documentsList.appendChild(docItem);
            
            // Add download event
            docItem.querySelector('.download-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadDocument(doc.url, doc.title);
            });
            
            // Add view event
            docItem.querySelector('.view-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(doc.url, '_blank');
            });
        });
    }
    
    // Download document function
    function downloadDocument(url, filename) {
        // In a real app, this would trigger a proper download
        // For demo purposes, we'll just simulate it
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show download notification
        showNotification('Download started: ' + (filename || 'document'));
    }
    
    // Initial render
    renderDocuments();
}

function initAdminPanel() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const adminPanel = document.getElementById('adminPanel');
    
    // Login button click
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
        gsap.from(loginModal.querySelector('.modal-content'), {
            duration: 0.3,
            scale: 0.9,
            opacity: 0,
            ease: 'back.out(1.7)'
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Logout button click
    logoutBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
        loginBtn.style.display = 'block';
        localStorage.removeItem('isAdminLoggedIn');
    });
    
    // Check if already logged in
    if (localStorage.getItem('isAdminLoggedIn')) {
        adminPanel.style.display = 'block';
        loginBtn.style.display = 'none';
    }
    
    // Admin tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-tab-content') === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function initSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(lnk => lnk.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

function initForms() {
    // Contact form submission
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Create message object
        const newMessage = {
            id: Date.now(), // Use timestamp as unique ID
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            device: navigator.userAgent // Add device information
        };
        
        // Get existing messages or initialize empty array
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Add new message
        messages.push(newMessage);
        
        // Save back to localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // Show success notification and reset form
        showNotification('Message sent successfully!');
        this.reset();
    });
    
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would validate credentials with a server
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // Simple validation for demo
        if (username && password) {
            localStorage.setItem('isAdminLoggedIn', 'true');
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('loginBtn').style.display = 'none';
            showNotification('Logged in successfully as admin');
        } else {
            showNotification('Please enter both username and password', 'error');
        }
    });
    
    // Media upload form
    document.getElementById('mediaUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would upload the file to a server
        const file = document.getElementById('mediaFile').files[0];
        if (file) {
            showNotification(`Media "${file.name}" uploaded successfully`);
            this.reset();
        } else {
            showNotification('Please select a file to upload', 'error');
        }
    });
    
    // Document upload form
    document.getElementById('documentUploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would upload the file to a server
        const file = document.getElementById('documentFile').files[0];
        if (file) {
            showNotification(`Document "${file.name}" uploaded successfully`);
            this.reset();
        } else {
            showNotification('Please select a file to upload', 'error');
        }
    });
    
    // Profile edit form
    document.getElementById('profileEditForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would save the profile data to a server
        showNotification('Profile updated successfully');
    });
}

function openMediaViewer(media) {
    const viewer = document.getElementById('mediaViewer');
    const viewerImage = document.getElementById('viewerImage');
    const viewerVideo = document.getElementById('viewerVideo');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerDescription = document.getElementById('viewerDescription');
    const downloadBtn = document.getElementById('downloadMedia');
    
    if (media.type === 'photos') {
        viewerImage.src = media.url;
        viewerImage.style.display = 'block';
        viewerVideo.style.display = 'none';
        viewerVideo.pause();
    } else {
        viewerVideo.src = media.url;
        viewerVideo.style.display = 'block';
        viewerImage.style.display = 'none';
    }
    
    viewerTitle.textContent = media.title;
    viewerDescription.textContent = media.description;
    
    // Set download button
    downloadBtn.onclick = function() {
        const a = document.createElement('a');
        a.href = media.url;
        a.download = media.title || (media.type === 'photos' ? 'image.jpg' : 'video.mp4');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    viewer.style.display = 'flex';
    gsap.from(viewer.querySelector('.viewer-content'), {
        duration: 0.3,
        scale: 0.9,
        opacity: 0,
        ease: 'back.out(1.7)'
    });
    
    // Close viewer
    document.querySelector('.close-viewer').onclick = function() {
        viewer.style.display = 'none';
        viewerVideo.pause();
    };
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    gsap.from(notification, {
        duration: 0.3,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.3,
            y: -20,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => notification.remove()
        });
    }, 3000);
}

// Performance Optimizer
const PerformanceOptimizer = {
    isLowPerformance: false,
    fpsHistory: [],
    fpsThreshold: 30,
    qualityLevels: ['low', 'medium', 'high'],
    currentQualityLevel: 2, // Start with high quality

    init() {
        this.checkDeviceCapabilities();
        this.startFPSMonitoring();
    },

    checkDeviceCapabilities() {
        // Check for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.isLowPerformance = true;
            this.currentQualityLevel = 0; // Start with low quality on mobile
        }

        // Check for hardware concurrency
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            this.isLowPerformance = true;
            this.currentQualityLevel = 0;
        }
    },

    optimizeRenderer(renderer, canvas) {
        if (this.isLowPerformance) {
            renderer.setPixelRatio(1);
            renderer.setSize(canvas.clientWidth / 2, canvas.clientHeight / 2, false);
        } else {
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        }
    },

    updateFPS() {
        const now = performance.now();
        if (!this.lastTime) {
            this.lastTime = now;
            return;
        }

        const delta = now - this.lastTime;
        this.lastTime = now;
        const fps = 1000 / delta;

        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }

        const avgFPS = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length;
        this.adjustQuality(avgFPS);
    },

    adjustQuality(avgFPS) {
        if (avgFPS < this.fpsThreshold && this.currentQualityLevel > 0) {
            this.currentQualityLevel--;
            this.applyQualitySettings();
        } else if (avgFPS > this.fpsThreshold * 1.5 && this.currentQualityLevel < 2) {
            this.currentQualityLevel++;
            this.applyQualitySettings();
        }
    },

    applyQualitySettings() {
        // Apply quality settings based on currentQualityLevel
        // This will be called by individual animation systems
    },

    disposeObject(obj) {
        if (obj.geometry) {
            obj.geometry.dispose();
        }
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose());
            } else {
                obj.material.dispose();
            }
        }
        if (obj.texture) {
            obj.texture.dispose();
        }
    }
};

// Initialize PerformanceOptimizer
document.addEventListener('DOMContentLoaded', () => {
    PerformanceOptimizer.init();
});

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Particle Animation
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.querySelector('.three-d-background').appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation duration
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        
        // Random delay
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Mouse parallax effect
function initParallaxEffect() {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.project-card, .blog-card');
    const nav = document.querySelector('.floating-nav');
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
    });
    
    function updateParallax() {
        targetX += (mouseX - targetX) * 0.1;
        targetY += (mouseY - targetY) * 0.1;
        
        // Parallax effect for sections
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const depth = 0.05;
                section.style.transform = `
                    translateX(${targetX * depth}px)
                    translateY(${targetY * depth}px)
                    translateZ(0)
                `;
            }
        });
        
        // Parallax effect for cards
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const depth = 0.1;
                card.style.transform = `
                    translateX(${targetX * depth}px)
                    translateY(${targetY * depth}px)
                    translateZ(30px)
                    rotateX(${-targetY * 0.05}deg)
                    rotateY(${targetX * 0.05}deg)
                `;
            }
        });
        
        // Parallax effect for navigation
        if (nav) {
            const depth = 0.02;
            nav.style.transform = `
                translateX(${targetX * depth}px)
                translateY(${targetY * depth}px)
                translateZ(50px)
            `;
        }
        
        requestAnimationFrame(updateParallax);
    }
    
    updateParallax();
}

// Add smooth scroll reveal effect
function initScrollReveal() {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.project-card, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateZ(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px) translateZ(0)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) translateZ(30px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

window.addEventListener('resize', onWindowResize);