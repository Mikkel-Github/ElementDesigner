"use client";

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Button } from "./ui/button";
import { Object3D } from "three";

function ModelDownloadTool({ element }: { element: React.MutableRefObject<Object3D | undefined>; }) {
    function exportModel() {
        if (!element.current) return;

        const exporter = new GLTFExporter();

        exporter.parse(
            element.current,
            (result) => {
                let output: Blob;
                if (result instanceof ArrayBuffer) {
                    // binary .glb
                    output = new Blob([result], { type: 'application/octet-stream' });
                } else {
                    // .gltf JSON 
                    const text = JSON.stringify(result, null, 2);
                    output = new Blob([text], { type: 'application/json' });
                }
                const url = URL.createObjectURL(output);
                const link = document.createElement("a");
                link.href = url;
                link.download = "model.glb";
                link.click();
                URL.revokeObjectURL(url);
            },
            (error) => {
                console.error("Export failed: ", error);
            },
            {
                binary: true, // export as .glb
            }
        );
    }

    return (
        <div className='flex flex-col w-full overflow-hidden max-w-80'>
            <Button variant='default' disabled={!element} className="cursor-pointer" onClick={exportModel}>Download Model</Button>
        </div>
    )
}

export default ModelDownloadTool



