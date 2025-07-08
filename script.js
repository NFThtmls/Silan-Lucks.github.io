// ===== 3D КОСМИЧЕСКИЙ ФОН (Three.js) =====
const initSpaceBackground = () => {
    const spaceCanvas = document.getElementById('space-canvas');
    const renderer = new THREE.WebGLRenderer({
        canvas: spaceCanvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Звёзды с разными размерами и цветами
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
        // Позиции
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        // Цвета (некоторые звёзды с голубым/красным оттенком)
        const color = Math.random() > 0.8 ? 
            (Math.random() > 0.5 ? 
                [0.8 + Math.random() * 0.2, 0.8 + Math.random() * 0.2, 1] : // Голубой
                [1, 0.8 + Math.random() * 0.2, 0.8 + Math.random() * 0.2]) : // Красный
            [1, 1, 1]; // Белый
        
        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];

        // Размеры
        sizes[i] = Math.random() * 2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Анимация звёзд
    const animateStars = () => {
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
        requestAnimationFrame(animateStars);
    };
    animateStars();

    // Обработка изменения размера окна
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    };
};

// ===== СОЗДАНИЕ ЗВЁЗД НА ФОНЕ =====
const createStars = () => {
    const starsContainer = document.getElementById('stars');
    const starCount = 300;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Разные скорости мерцания
        const duration = Math.random() * 5 + 3;
        star.style.setProperty('--duration', `${duration}s`);
        
        // Некоторые звёзды с цветным оттенком
        if (Math.random() > 0.7) {
            star.style.backgroundColor = Math.random() > 0.5 ? 
                `rgba(100, 200, 255, ${Math.random() * 0.5 + 0.5})` : 
                `rgba(255, 100, 200, ${Math.random() * 0.5 + 0.5})`;
        }
        
        starsContainer.appendChild(star);
    }
};

// ===== КОЛЕСО РУЛЕТКИ =====
const initWheel = () => {
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const claimBtn = document.getElementById('claim-btn');
    const resultDisplay = document.getElementById('result');
    const colorLegend = document.getElementById('color-legend');
    
    const segments = 8;
    const prizes = [
        { text: "1D", days: "1 день", emoji: "🗝️", color1: "#FF5252", color2: "#FF8A80" },
        { text: "3D", days: "3 дня", emoji: "🗝️", color1: "#FF4081", color2: "#FF80AB" },
        { text: "7D", days: "7 дней", emoji: "🗝️", color1: "#E040FB", color2: "#EA80FC" },
        { text: "14D", days: "14 дней", emoji: "🗝️", color1: "#7C4DFF", color2: "#B388FF" },
        { text: "30D", days: "