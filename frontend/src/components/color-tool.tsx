"use client";

import { useEffect, useRef, useState } from "react";
import { type Color } from '../lib/color';
// import colorjson from '../../public/colors.json';
import ColorComp from '../components/color';
import { ColorPicker } from 'primereact/colorpicker';


import { toast } from "sonner"

function ColorTool({ onColorSelect }: { onColorSelect: (color: Color) => void }) {
    const [colors, setColors] = useState<Array<Color>>([]);
    const [selectedColor, setSelectedColor] = useState<Color>();

    const fetchColors = async () => {
        try {
            // TODO: When the color service is implemented
            const response = await fetch("http://localhost:80/colors", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            // const response = {
            //     ok: true,
            //     body: response.body
            // }

            if (!response.ok) {
                toast("Failed to get colors")
                return
            }
            toast("Got official colors!")
            const data = await response.json();
            setColors(data);
            setSelectedColor(data[0]);
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

    function setColor(color: { "b": number, "h": number, "s": number }) {
        if (!selectedColor) return;

        const temp_color: Color = selectedColor;
        temp_color.codes.hsv = {
            h: color.h,
            s: color.s,
            v: color.b,
            a: 1.0
        }
        setSelectedColor(temp_color);
    }

    return (
        <div className='flex flex-col w-full overflow-hidden max-w-80'>
            <h4 className=''>Color</h4>
            <h5>Sort colors</h5>
            <ColorPicker format="hsb" value={selectedColor?.codes.hsv} onChange={(e) => { setColor(e.value); }} inline />
            {/* {selectedColor != undefined && ( */}
            {/*     <ColorComp color={selectedColor} onClick={() => onColorSelect(selectedColor)} /> */}
            {/* )} */}
            <div className='flex flex-wrap gap-1 h-fit p-1 pl-3 pr-3 overflow-x-hidden overflow-y-scroll'>
                <ColorOptions ></ColorOptions>
            </div>
        </div>
    );
}

export default ColorTool

