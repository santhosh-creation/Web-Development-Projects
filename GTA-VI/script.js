document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- Mobile Burger Menu ---
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.querySelector('.main-nav .nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    burgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Toggle burger icon (bars to times)
        burgerMenu.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // --- Smooth Scroll for Navigation ---
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // --- Dynamic Content Loading for Features ---
    const featuresData = [
        {
            icon: 'fa-solid fa-car',
            title: 'Expansive Vehicle Roster',
            description: 'Steal, buy, and customize a massive array of vehicles, from supercars to military hardware.'
        },
        {
            icon: 'fa-solid fa-gamepad',
            title: 'Endless Activities',
            description: 'Engage in heists, sports, races, and stock market trading in a living, breathing world.'
        },
        {
            icon: 'fa-solid fa-globe',
            title: 'GTA Online',
            description: 'Forge your criminal empire online with friends in an ever-expanding shared universe.'
        }
    ];

    const featuresGrid = document.getElementById('features-grid');
    if (featuresGrid) {
        featuresGrid.innerHTML = featuresData.map(feature => `
            <div class="feature-card">
                <i class="fas ${feature.icon}"></i>
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }

    // --- Custom Video Controls ---
    const video = document.querySelector('.hero-video');
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (video && playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // --- Change header background on scroll ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(0,0,0,0.9)';
        } else {
            header.style.backgroundColor = 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)';
        }
    });

});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- Mobile Burger Menu ---
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.querySelector('.main-nav .nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    burgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burgerMenu.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // --- Smooth Scroll for Navigation ---
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // --- Dynamic Content Loading for Features ---
    const featuresData = [
        { icon: 'fa-solid fa-car', title: 'Expansive Vehicle Roster', description: 'Steal, buy, and customize a massive array of vehicles, from supercars to military hardware.' },
        { icon: 'fa-solid fa-gamepad', title: 'Endless Activities', description: 'Engage in heists, sports, races, and stock market trading in a living, breathing world.' },
        { icon: 'fa-solid fa-globe', title: 'GTA Online', description: 'Forge your criminal empire online with friends in an ever-expanding shared universe.' }
    ];

    const featuresGrid = document.getElementById('features-grid');
    if (featuresGrid) {
        featuresGrid.innerHTML = featuresData.map(feature => `
            <div class="feature-card">
                <i class="fas ${feature.icon}"></i>
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }

    // --- Custom Video Controls ---
    const video = document.querySelector('.hero-video');
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (video && playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // --- Header background on scroll ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(0,0,0,0.9)';
        } else {
            header.style.backgroundColor = 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)';
        }
    });

    // --- 3D Model Viewer Logic ---
    const launchViewerBtn = document.getElementById('launch-viewer-btn');
    const modal = document.getElementById('model-viewer-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modelContainer = document.getElementById('model-container');
    const viewerLoader = document.getElementById('viewer-loader');
    let viewerInitialized = false;

    // Declare three.js variables in a broader scope
    let scene, camera, renderer, controls;

    function init3DViewer() {
        viewerLoader.style.display = 'block';

        // 1. Scene
        scene = new THREE.Scene();

        // 2. Camera
        camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        modelContainer.appendChild(renderer.domElement);

        // 4. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // 5. Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;

        // 6. Model Loader
        const loader = new THREE.GLTFLoader();
        // Replace with your .glb model URL
        loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', (gltf) => {
            const model = gltf.scene;
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center); 
            scene.add(model);
            viewerLoader.style.display = 'none'; // Hide loader on success
        }, undefined, (error) => {
            console.error(error);
            viewerLoader.style.display = 'none'; // Hide loader on error
        });

        // 7. Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        viewerInitialized = true;
    }

    function onWindowResize() {
        if (viewerInitialized) {
            camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        }
    }

    launchViewerBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        if (!viewerInitialized) {
            init3DViewer();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    });

    window.addEventListener('resize', onWindowResize);
});


// 6. Model Loader
const loader = new THREE.GLTFLoader();

// Replace with your .glb model URL
loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', (gltf) => {
    const model = gltf.scene;
    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); 
    scene.add(model);
    viewerLoader.style.display = 'none'; // Hide loader on success
}, undefined, (error) => {
    console.error(error);
    viewerLoader.style.display = 'none'; // Hide loader on error
});