"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ZyvenMark } from "./ZyvenMark";
import { cn } from "@/lib/utils";

export interface Zyven3DMarkProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

function checkWebGLSupport() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function Zyven3DMark({
  className,
  size = 180,
  interactive = true,
}: Zyven3DMarkProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGL] = useState(checkWebGLSupport);

  useEffect(() => {
    if (!hasWebGL) return;

    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Geometry: Dual geometric crystal prism
    const mainGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const wireframeGeometry = new THREE.OctahedronGeometry(1.25, 0);

    // Materials with Zyven violet/indigo accents
    const mainMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#5B5BF0"),
      metalness: 0.25,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#A78BFA"),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const crystal = new THREE.Mesh(mainGeometry, mainMaterial);
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

    const group = new THREE.Group();
    group.add(crystal);
    group.add(wireframe);
    scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0x8b5cf6, 3.5);
    primaryLight.position.set(3, 4, 3);
    scene.add(primaryLight);

    const rimLight = new THREE.DirectionalLight(0x4f46e5, 2.5);
    rimLight.position.set(-3, -3, -2);
    scene.add(rimLight);

    // Mouse tilt tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isIntersecting = true;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.2;
      targetRotationX = y * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Intersection Observer to pause rendering when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (isIntersecting) {
        const delta = clock.getDelta();
        if (!prefersReducedMotion) {
          group.rotation.y += delta * 0.45;
          group.rotation.x += delta * 0.2;
        }

        // Smooth damping toward mouse target
        group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      mainGeometry.dispose();
      wireframeGeometry.dispose();
      mainMaterial.dispose();
      wireframeMaterial.dispose();
    };
  }, [size, interactive, hasWebGL]);

  if (!hasWebGL) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        style={{ width: size, height: size }}
      >
        <ZyvenMark size={size * 0.6} />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        ref={mountRef}
        className={cn(
          "w-full h-full transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ZyvenMark size={size * 0.55} />
        </div>
      )}
    </div>
  );
}
