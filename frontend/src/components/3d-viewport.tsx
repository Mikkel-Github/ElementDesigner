"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import { Grid2x2, Move3D } from "lucide-react"

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Color } from "@/lib/color";
import { Button } from "@/components/ui/button"

function Viewport({ selectedColor, rendererRef }: { selectedColor: Color | null; rendererRef: RefObject<THREE.WebGLRenderer | undefined>; }) {
    const refContainer = useRef(null);
    const [scene, setScene] = useState<THREE.Scene | null>();
    const [element, setElement] = useState<THREE.Object3D>();
    const [showAxisGuide, setShowAxisGuide] = useState<boolean>(false);
    const [axisGuide, setAxisGuide] = useState<THREE.AxesHelper | null>();
    const [showGridGuide, setShowGridGuide] = useState<boolean>(false);
    const [gridGuide, setGridGuide] = useState<THREE.GridHelper | null>();

    function setElementColor(color: Color) {
        if (!element) return;
        const mat_color = new THREE.Color(`rgb(${color.codes.rgb.r}, ${color.codes.rgb.g}, ${color.codes.rgb.b})`);
        // Traverse the scene and update material color on all meshes
        element.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                // If the material is an array (multi-material), handle accordingly
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => {
                        if ((mat as THREE.MeshStandardMaterial).color) {
                            (mat as THREE.MeshStandardMaterial).color = mat_color.clone();
                            mat.opacity = color.codes.hsv.a;
                            mat.transparent = color.codes.hsv.a < 1.0;
                        }
                        mat.needsUpdate = true; // Required to apply the changes
                    });
                } else {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    if (mat && mat.color) {
                        mat.color = mat_color.clone();
                        mat.opacity = color.codes.hsv.a;
                        mat.transparent = color.codes.hsv.a < 1.0;
                    }
                    mesh.material.needsUpdate = true; // Required to apply the changes
                }

            }
        });
    }

    useEffect(() => {
        if (selectedColor == null) return;
        setElementColor(selectedColor);
    }, [selectedColor]);

    function ToggleAxisArrows(show: boolean) {
        if (!scene) return;

        // Show if not already showing
        if (show && !axisGuide) {
            const axesHelper = new THREE.AxesHelper(5);
            scene.add(axesHelper);
            setAxisGuide(axesHelper);
        }
        // Hide if showing
        else if (!show && axisGuide) {
            scene.remove(axisGuide);
            setAxisGuide(null);
        }
    }

    function ToggleGrid(show: boolean) {
        if (!scene) return;

        // Show if not already showing
        if (show && !gridGuide) {
            // Grid
            const size = 10;
            const divisions = 10;
            const gridHelper = new THREE.GridHelper(size, divisions);
            scene.add(gridHelper);
            setGridGuide(gridHelper);
        }
        // Hide if showing
        else if (!show && gridGuide) {
            scene.remove(gridGuide);
            setGridGuide(null);
        }
    }

    useEffect(() => {
        if (!scene) return;

        // Axis arrows
        ToggleAxisArrows(showAxisGuide);
        // Grid
        ToggleGrid(showGridGuide);

    }, [showAxisGuide, showGridGuide]);

    useEffect(() => {
        // Scene
        const scene = new THREE.Scene();
        setScene(scene);

        // Viewport is always half the width and maximum 75% height
        const width = window.innerWidth / 2;
        const height = Math.min(width, window.innerHeight / 1.5);

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

        // Renderer
        // antialias looks blurry
        const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        if (refContainer.current) {
            refContainer.current.appendChild(renderer.domElement);
        }

        rendererRef.current = renderer;

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
        const hemi_intensity = 0.6;
        const hemi_light = new THREE.HemisphereLight(skyColor, groundColor, hemi_intensity);
        scene.add(hemi_light);

        // Right side directional light
        const right_dir_color = 0xFFFFFF;
        const right_dir_intensity = 2.0;
        const right_dir_light = new THREE.DirectionalLight(right_dir_color, right_dir_intensity);
        right_dir_light.castShadow = true;
        right_dir_light.position.set(0, 5, 0);
        right_dir_light.target.position.set(-5, 0, 0);
        scene.add(right_dir_light);
        scene.add(right_dir_light.target);

        //Set up shadow properties for the light
        right_dir_light.shadow.mapSize.width = 512; // default
        right_dir_light.shadow.mapSize.height = 512; // default
        right_dir_light.shadow.camera.near = 0.5; // default
        right_dir_light.shadow.camera.far = 500; // default

        // Front directional light
        const front_dir_color = 0xFFFFFF;
        const front_dir_intensity = 1.0;
        const front_dir_light = new THREE.DirectionalLight(front_dir_color, front_dir_intensity);
        front_dir_light.castShadow = true;
        front_dir_light.position.set(0, 0, 10);
        front_dir_light.target.position.set(-5, 0, 0);
        scene.add(front_dir_light);
        scene.add(front_dir_light.target);

        // Left side directional light
        const left_dir_color = 0xFFFFFF;
        const left_dir_intensity = 3.0;
        const left_dir_light = new THREE.DirectionalLight(left_dir_color, left_dir_intensity);
        left_dir_light.castShadow = true;
        left_dir_light.position.set(0, 10, 0);
        left_dir_light.target.position.set(5, 0, 0);
        scene.add(left_dir_light);
        scene.add(left_dir_light.target);

        // Load Element 3D Model
        const loader = new GLTFLoader();
        loader.load('/models/red-2x4-element.glb', function(gltf) {
            const model = gltf.scene;
            model.castShadow = true;
            model.receiveShadow = true;
            setElement(model);
            scene.add(model);
        }, undefined, function(error) {
            console.error(error);
        });

        // Top down corner angle
        camera.position.z = 3.5;
        camera.position.x = 3.5;
        camera.position.y = 3.5;

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
        <div className="flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-2 flex flex-row gap-2">
                <Button variant="outline" className="cursor-pointer" onClick={() => { setShowAxisGuide(!showAxisGuide) }}>
                    <Move3D />
                </Button>
                <Button variant="outline" className="cursor-pointer" onClick={() => { setShowGridGuide(!showGridGuide) }}>
                    <Grid2x2 />
                </Button>
            </div>
            <div ref={refContainer}></div>
            <div className="absolute bottom-0 flex flex-row gap-14 text-gray-400">
                <span>Left click: rotate</span>
                <span>Mouse wheel: zoom</span>
                <span>Ctrl & Left click: move</span>
            </div>
        </div>
    );
}

export default Viewport
