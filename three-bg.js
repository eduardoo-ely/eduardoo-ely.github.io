// ========================================
// FUNDO 3D - "Rede de Dados" com Three.js
// Partículas conectadas (constelação de dados)
// com parallax do mouse e rotação suave.
// ========================================
import * as THREE from 'three';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bg-canvas');

if (canvas) {
    initBackground(canvas);
}

function initBackground(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    // Quantidade adaptada ao dispositivo (custo das linhas é O(n²))
    const COUNT = window.innerWidth < 768 ? 55 : 110;
    const RANGE = 80;
    const LINK_DIST = 18;

    // Paleta alinhada ao tema (verde / ciano / azul)
    const palette = [
        new THREE.Color(0x22c55e),
        new THREE.Color(0x22d3ee),
        new THREE.Color(0x3b82f6),
    ];

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const velocities = [];

    for (let i = 0; i < COUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * RANGE;
        positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE * 0.6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE * 0.5;

        velocities.push(new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
        ));

        const c = palette[i % palette.length];
        colors[i * 3]     = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    // --- Pontos (nós da rede) ---
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
        size: 1.8,
        map: makeGlowSprite(),
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        opacity: 0.9,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // --- Linhas (conexões entre nós próximos) ---
    const maxVerts = COUNT * COUNT; // limite folgado de vértices de segmentos
    const linePositions = new Float32Array(maxVerts * 3);
    const lineColors = new Float32Array(maxVerts * 3);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // --- Parallax do mouse ---
    const mouse = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX / window.innerWidth - 0.5;
        mouse.y = e.clientY / window.innerHeight - 0.5;
    });

    function makeGlowSprite() {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.75)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    function updateLines() {
        const pos = pointsGeo.attributes.position.array;
        let v = 0;
        for (let i = 0; i < COUNT; i++) {
            for (let j = i + 1; j < COUNT; j++) {
                const dx = pos[i * 3]     - pos[j * 3];
                const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (d < LINK_DIST) {
                    const a = 1 - d / LINK_DIST; // mais perto = mais opaco
                    linePositions[v]     = pos[i * 3];
                    linePositions[v + 1] = pos[i * 3 + 1];
                    linePositions[v + 2] = pos[i * 3 + 2];
                    linePositions[v + 3] = pos[j * 3];
                    linePositions[v + 4] = pos[j * 3 + 1];
                    linePositions[v + 5] = pos[j * 3 + 2];
                    for (let k = 0; k < 2; k++) {
                        lineColors[v + k * 3]     = 0.13 * a;
                        lineColors[v + k * 3 + 1] = 0.83 * a;
                        lineColors[v + k * 3 + 2] = 0.93 * a;
                    }
                    v += 6;
                }
            }
        }
        lineGeo.setDrawRange(0, v / 3);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
    }

    let running = true;
    const clock = new THREE.Clock();

    function animate() {
        if (!running) return;
        requestAnimationFrame(animate);

        const pos = pointsGeo.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
            pos[i * 3]     += velocities[i].x;
            pos[i * 3 + 1] += velocities[i].y;
            pos[i * 3 + 2] += velocities[i].z;
            // ricochete nas bordas da caixa
            const limits = [RANGE / 2, RANGE * 0.3, RANGE * 0.25];
            for (let a = 0; a < 3; a++) {
                if (pos[i * 3 + a] > limits[a] || pos[i * 3 + a] < -limits[a]) {
                    velocities[i].setComponent(a, -velocities[i].getComponent(a));
                }
            }
        }
        pointsGeo.attributes.position.needsUpdate = true;
        updateLines();

        const t = clock.getElapsedTime();
        scene.rotation.y = t * 0.03 + mouse.x * 0.4;
        scene.rotation.x = mouse.y * 0.25;

        renderer.render(scene, camera);
    }

    // Acessibilidade: sem animação, renderiza um quadro estático
    if (prefersReduced) {
        updateLines();
        renderer.render(scene, camera);
    } else {
        animate();
    }

    // Pausa quando a aba não está visível (economia de bateria/CPU)
    document.addEventListener('visibilitychange', () => {
        if (prefersReduced) return;
        running = !document.hidden;
        if (running) animate();
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
