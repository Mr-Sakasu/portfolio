// components/GeometricBackground.tsx (Client Component)
'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function GeometricBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // シーンの設定
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // 幾何学的オブジェクトの配列
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];
        const meshes: THREE.Mesh[] = [];

        // 複数の幾何学的形状を作成
        for (let i = 0; i < 20; i++) {
            let geometry: THREE.BufferGeometry;
            const shapeType = Math.floor(Math.random() * 5);

            switch (shapeType) {
                case 0:
                    geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
                    break;
                case 1:
                    geometry = new THREE.SphereGeometry(0.5, 12, 8);
                    break;
                case 2:
                    geometry = new THREE.ConeGeometry(0.4, 1.2, 8);
                    break;
                case 3:
                    geometry = new THREE.OctahedronGeometry(0.6);
                    break;
                default:
                    geometry = new THREE.TetrahedronGeometry(0.7);
            }

            // グラデーションカラーのマテリアル
            const hue = (i * 25) % 360;
            const isWireframe = Math.random() > 0.4;

            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(hue / 360, 0.8, isWireframe ? 0.7 : 0.5),
                wireframe: isWireframe,
                transparent: true,
                opacity: isWireframe ? 0.6 : 0.3
            });

            const mesh = new THREE.Mesh(geometry, material);

            // ランダムな位置に配置（画面全体に分散）
            mesh.position.x = (Math.random() - 0.5) * 30;
            mesh.position.y = (Math.random() - 0.5) * 30;
            mesh.position.z = (Math.random() - 0.5) * 25;

            // ランダムな初期回転
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.rotation.z = Math.random() * Math.PI * 2;

            // アニメーション用のデータを設定
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.015,
                    y: (Math.random() - 0.5) * 0.015,
                    z: (Math.random() - 0.5) * 0.015
                },
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatRange: Math.random() * 3 + 2,
                originalY: mesh.position.y
            };

            scene.add(mesh);
            geometries.push(geometry);
            materials.push(material);
            meshes.push(mesh);
        }

        // ライティング
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);

        camera.position.z = 20;

        // アニメーションループ
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            meshes.forEach((mesh) => {
                // 回転アニメーション
                mesh.rotation.x += mesh.userData.rotationSpeed.x;
                mesh.rotation.y += mesh.userData.rotationSpeed.y;
                mesh.rotation.z += mesh.userData.rotationSpeed.z;

                // 浮遊アニメーション
                mesh.position.y = mesh.userData.originalY +
                    Math.sin(time * mesh.userData.floatSpeed) * mesh.userData.floatRange;
            });

            renderer.render(scene, camera);
        };

        animate();

        // リサイズ処理
        const handleResize = () => {
            if (!mountRef.current) return;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // クリーンアップ
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            geometries.forEach(geometry => geometry.dispose());
            materials.forEach(material => material.dispose());
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 -z-10" />;
}