"use client";

import { useEffect, useRef, useState } from "react";

import Viewport from "@/components/3d-viewport";
import ColorTool from "@/components/color-tool";
import { Toaster } from "@/components/ui/sonner"
import { Color } from "@/lib/color";
import Image from "next/image";

export default function Home() {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    return (
        <div className="max-h-dvh overflow-hidden font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10">
            {/* <header> */}
            {/*     <h1>ElementDesigner</h1> */}
            {/* </header> */}
            <main className="flex flex-col gap-[32px] h-full w-full row-start-2 items-center sm:items-start overflow-hidden">
                <Toaster />
                <div className="flex flex-row gap-4 w-full h-full">
                    <Viewport selectedColor={selectedColor} />
                    <ColorTool onColorSelect={setSelectedColor} />
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
