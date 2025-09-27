"use client";

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { useEffect, useRef } from "react";

function MyThree() {
    const refContainer = useRef(null);

    useEffect(() => {
        // === THREE.JS CODE START ===
        const scene = new THREE.Scene();

        // Viewport is always half the width and maximum 75% height
        const width = window.innerWidth / 2;
        const height = Math.min(width, window.innerHeight / 1.5);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);

        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        // Camera controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Ambient light
        const ambi_color = 0xFFFFFF;
        const ambi_intensity = 1;
        const ambi_light = new THREE.AmbientLight(ambi_color, ambi_intensity);
        scene.add(ambi_light);

        // Hemisphere light
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const hemi_intensity = 1;
        const hemi_light = new THREE.HemisphereLight(skyColor, groundColor, hemi_intensity);
        scene.add(hemi_light);

        // Right side directional light
        const right_dir_color = 0xFFFFFF;
        const right_dir_intensity = 1;
        const right_dir_light = new THREE.DirectionalLight(right_dir_color, right_dir_intensity);
        right_dir_light.position.set(0, 10, 0);
        right_dir_light.target.position.set(-5, 0, 0);
        scene.add(right_dir_light);
        scene.add(right_dir_light.target);

        // Left side directional light
        const left_dir_color = 0xFFFFFF;
        const left_dir_intensity = 0.2;
        const left_dir_light = new THREE.DirectionalLight(left_dir_color, left_dir_intensity);
        left_dir_light.position.set(0, 0, 10);
        left_dir_light.target.position.set(-5, 0, 0);
        scene.add(left_dir_light);
        scene.add(left_dir_light.target);

        // Load Element 3D Model
        const loader = new GLTFLoader();
        let element: THREE.Object3D;
        loader.load('/models/red-2x4-element.glb', function(gltf) {
            element = gltf.scene;
            scene.add(element);
        }, undefined, function(error) {
            console.error(error);
        });

        // Top down corner angle
        camera.position.z = 2.5;
        camera.position.x = 2.5;
        camera.position.y = 1.5;

        // Rendering
        const animate = function() {
            requestAnimationFrame(animate);

            // Update the camera controls
            controls.update()

            // Render next frame
            renderer.render(scene, camera);
        };
        animate();

    }, []);
    return (
        <div className='' ref={refContainer}></div>
    );
}

export default MyThree
