"use client";

import { useEffect, useRef, useState } from "react";

import Viewport from "@/components/3d-viewport";
import ColorTool from "@/components/color-tool";
import { Toaster } from "@/components/ui/sonner"
import { Color } from "@/lib/color";
import { Copyright } from "lucide-react";
import MaterialTool from "@/components/material-tool";

export default function Home() {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    return (
        <div className="max-h-dvh overflow-hidden font-sans grid grid-rows-[80px_1fr_20px] items-center justify-items-center min-h-screen pb-10 gap-16 sm:gap-2">
            <header className="flex bg-yellow-300 w-full h-full items-center pl-8">
                <h1 className="text-red-600 text-outline-white">ElementDesigner</h1>
            </header>
            <main className="flex flex-col max-h-full row-start-2 items-center sm:items-start overflow-hidden p-10">
                <Toaster />
                <div className="flex flex-row gap-4 max-h-full overflow-hidden">
                    <Viewport selectedColor={selectedColor} />
                    <ColorTool selectedColor={selectedColor} onColorSelect={setSelectedColor} />
                    <MaterialTool selectedColor={selectedColor} onColorSelect={setSelectedColor} />
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <p className="flex items-center gap-1 hover:underline hover:underline-offset-4 text-gray-500">
                    <Copyright className="h-4" />
                    Copyright ElementDesigner
                </p>
            </footer>
        </div>
    );
}
