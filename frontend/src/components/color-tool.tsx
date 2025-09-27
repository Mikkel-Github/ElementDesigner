"use client";

import { useEffect, useRef, useState } from "react";
import { type Color } from '../lib/color';
import colorjson from '../../public/colors.json';
import ColorComp from '../components/color';

import { toast } from "sonner"

function ColorTool({ onColorSelect }: { onColorSelect: (color: Color) => void }) {
    const [colors, setColors] = useState<Array<Color>>([]);

    const fetchColors = async () => {
        try {
            // TODO: When the color service is implemented
            // const response = await fetch("http://localhost:3000/api/v1/colors", {
            //     method: "GET",
            //     headers: { "Content-Type": "application/json" },
            // });

            const response = {
                ok: true,
                body: colorjson
            }

            if (!response.ok) {
                toast("Failed to get colors")
                return
            }
            toast("Got official colors!")
            setColors(response.body);
        } catch (error) {
            toast("Failed to get colors")
        }
    };

    useEffect(() => {
        // Fetch colors
        fetchColors();
    }, []);

    function ColorOptions() {
        const colorOptions = colors.map((color: Color) =>
            <ColorComp key={color.id} color={color} onClick={() => onColorSelect(color)} />
        );
        return colorOptions
    }

    return (
        <div className='flex flex-col w-full overflow-hidden'>
            <h4 className=''>Color</h4>
            <div className='flex flex-wrap gap-1 h-fit p-1 pl-3 pr-3 overflow-x-hidden overflow-y-scroll'>
                <ColorOptions ></ColorOptions>
            </div>
        </div>
    );
}

export default ColorTool

