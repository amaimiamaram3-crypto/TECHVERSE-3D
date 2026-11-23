
import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

export function createWorld(container) {

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080817");
    scene.fog = new THREE.FogExp2("#080817", 0.025);

    const camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(0, 8, 17);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 9;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0, 0);

    // LIGHTS
    const ambient = new THREE.AmbientLight("#a6a1ff", 1.8);
    scene.add(ambient);

    const mainLight = new THREE.PointLight("#9666ff", 100, 35);
    mainLight.position.set(0, 8, 2);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight("#39bfff", 70, 30);
    blueLight.position.set(-8, 3, -5);
    scene.add(blueLight);

    // FLOOR
    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(15, 100),
        new THREE.MeshStandardMaterial({
            color: "#11102b",
            roughness: 0.8,
            metalness: 0.3
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // CENTRAL PLATFORM
    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(3.4, 4, 0.6, 64),
        new THREE.MeshStandardMaterial({
            color: "#27204d",
            metalness: 0.8,
            roughness: 0.25
        })
    );

    platform.position.y = -1.5;
    scene.add(platform);

    const centerRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.035, 12, 100),
        new THREE.MeshBasicMaterial({ color: "#a16aff" })
    );

    centerRing.rotation.x = Math.PI / 2;
    centerRing.position.y = -1.15;
    scene.add(centerRing);

    // CENTRAL ENERGY CORE
    const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.15, 2),
        new THREE.MeshStandardMaterial({
            color: "#9060ff",
            emissive: "#5422bb",
            emissiveIntensity: 1.8,
            metalness: 0.6,
            roughness: 0.2
        })
    );

    core.position.y = 0.1;
    scene.add(core);

    // ORBITING RING
    const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.025, 12, 100),
        new THREE.MeshBasicMaterial({ color: "#47caff" })
    );

    orbit.position.y = 0.1;
    orbit.rotation.x = 1.1;
    scene.add(orbit);

    // STARS
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];

    for (let i = 0; i < 900; i++) {
        starPositions.push(
            (Math.random() - 0.5) * 80,
            Math.random() * 40 - 5,
            (Math.random() - 0.5) * 80
        );
    }

    starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
            color: "#c5b8ff",
            size: 0.055,
            transparent: true
        })
    );

    scene.add(stars);

    // SIX LEARNING WORLDS
    const worldData = [
        { id: "hardware", color: "#36c9ff", position: [-6, 0, -3] },
        { id: "software", color: "#9a65ff", position: [6, 0, -3] },
        { id: "programming", color: "#ff66bd", position: [-7, 0, 3] },
        { id: "network", color: "#42e5bc", position: [7, 0, 3] },
        { id: "security", color: "#ffb34d", position: [-3, 0, 7] },
        { id: "ai", color: "#ed75ff", position: [3, 0, 7] }
    ];

    const interactiveObjects = [];

    worldData.forEach((data, index) => {

        const group = new THREE.Group();

        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.65,
            metalness: 0.55,
            roughness: 0.2
        });

        const sphere = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.15, 2),
            material
        );

        group.add(sphere);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.55, 0.035, 10, 80),
            new THREE.MeshBasicMaterial({ color: data.color })
        );

        ring.rotation.x = 1.1;
        group.add(ring);

        const smallCore = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 20, 20),
            new THREE.MeshBasicMaterial({ color: "#ffffff" })
        );

        smallCore.position.set(0.5, 0.5, 0.8);
        group.add(smallCore);

        group.position.set(...data.position);
        group.userData.topic = data.id;
        group.userData.index = index;

        scene.add(group);
        interactiveObjects.push(group);
    });

    // CLICK DETECTION
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    renderer.domElement.addEventListener("pointerdown", (event) => {
        const rect = renderer.domElement.getBoundingClientRect();

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(
            interactiveObjects,
            true
        );

        if (hits.length > 0) {
            let selected = hits[0].object;

            while (selected.parent && !selected.userData.topic) {
                selected = selected.parent;
            }

            if (selected.userData.topic) {
                window.dispatchEvent(
                    new CustomEvent("itworld:topic", {
                        detail: selected.userData.topic
                    })
                );
            }
        }
    });

    // ANIMATION
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        core.rotation.y += 0.005;
        core.rotation.x += 0.002;

        core.position.y = 0.1 + Math.sin(time * 1.5) * 0.15;

        orbit.rotation.z += 0.003;
        centerRing.rotation.z += 0.002;

        interactiveObjects.forEach((object, index) => {
            object.rotation.y += 0.006;
            object.rotation.x += 0.002;

            object.position.y =
                Math.sin(time * 1.5 + index) * 0.25;
        });

        stars.rotation.y += 0.00015;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // RESPONSIVE
    window.addEventListener("resize", () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
}
