"use client";

import { Button } from "./ui/button";
import { WebGLRenderer } from "three";

function ImageRenderTool({ rendererRef }: { rendererRef: React.MutableRefObject<WebGLRenderer | undefined> }) {
    function renderImage() {
        const renderer = rendererRef.current;
        if (!renderer) return;

        const canvas = renderer.domElement;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Failed to convert canvas to blob");
                return;
            }
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.download = "snapshot.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, "image/png");
    }

    return (
        <div className='flex flex-col w-full overflow-hidden max-w-80'>
            <Button variant='default' disabled={!rendererRef} className="cursor-pointer" onClick={renderImage}>Render Image</Button>
        </div>
    )
}

export default ImageRenderTool


