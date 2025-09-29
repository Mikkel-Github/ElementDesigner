"use client";

import { useEffect, useRef, useState } from "react";
import { type Color } from '../lib/color';
import ColorComp from '../components/color';
import { ColorPicker } from 'primereact/colorpicker';


import { toast } from "sonner"
import { hsvToRgb, rgbToHex } from "@/app/utils/color_utils";
import { Button } from "./ui/button";

function ColorTool({
    selectedColor,
    onColorSelect,
}: {
    selectedColor: Color | null;
    onColorSelect: (color: Color) => void;
}) {
    const [colors, setColors] = useState<Array<Color>>([]);
    const [sortingColor, setSortingColor] = useState<Color | null>();


    const fetchColors = async () => {
        try {
            const response = await fetch("http://localhost:80/colors", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                toast("Failed to get colors")
                return
            }
            toast("Got official colors!")
            const data = await response.json();
            setColors(data);
        } catch (error) {
            toast("Failed to get colors")
        }
    };

    useEffect(() => {
        // Fetch colors on page load
        fetchColors();
    }, []);

    const fetchRelatedColors = async (color: Color) => {
        try {
            const response = await fetch(`http://localhost:80/color/similar?r=${color.codes.rgb.r}&g=${color.codes.rgb.g}&b=${color.codes.rgb.b}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                toast("Failed to get colors")
                return
            }
            const data = await response.json();
            setColors(data);
        } catch (error) {
            toast("Failed to get colors")
        }
    };

    useEffect(() => {
        if (sortingColor != null) {
            fetchRelatedColors(sortingColor);
            return;
        }

        // Reset sorting
        fetchColors();
    }, [sortingColor]);

    function ColorOptions() {
        const colorOptions = colors.map((color: Color) =>
            <ColorComp
                key={color.id}
                color={color}
                onClick={() => onColorSelect(color)}
                highlight={(selectedColor && selectedColor.id == color.id) ? true : false} />
        );
        return colorOptions
    }

    function setColor(color: { b: number; h: number; s: number }) {
        console.log(color)
        const rgb = hsvToRgb(color.h, color.s, color.b);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        console.log(rgb)
        console.log(hex)

        const temp_color: Color = {
            id: -1,
            codes: {
                hex: hex,
                rgb: { ...rgb, a: 255 },
                hsv: {
                    h: color.h,
                    s: color.s,
                    v: color.b,
                    a: 1.0,
                }
            }
        };

        setSortingColor(temp_color);
    }

    return (
        <div className='flex flex-col w-full overflow-hidden min-w-80 max-w-80'>
            <h4 className='w-full text-center'>Color</h4>
            <div className='flex flex-col items-center gap-2 mb-4'>
                <ColorPicker format="hsb" onChange={(e) => { setColor(e.value); }} inline />
                {sortingColor != undefined && (
                    <div className='flex flex-row gap-2 items-center'>
                        <ColorComp color={sortingColor} />
                        <Button className='cursor-pointer' onClick={() => setSortingColor(null)}>Reset</Button>
                    </div>
                )}
            </div>
            <hr />
            <div className='flex flex-wrap gap-1 h-fit mt-4 p-1 pl-3 pr-3 overflow-x-hidden overflow-y-scroll'>
                <ColorOptions ></ColorOptions>
            </div>
        </div >
    );
}

export default ColorTool

