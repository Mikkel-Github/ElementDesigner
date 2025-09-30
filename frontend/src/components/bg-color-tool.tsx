"use client";

import { useEffect, useRef, useState } from "react";
import { type Color } from '../lib/color';
import { ColorPicker } from 'primereact/colorpicker';

import { hsvToRgb, rgbToHex } from "@/app/utils/color_utils";

function BGColorTool({ onBgColorSelect }: { onBgColorSelect: (color: Color) => void; }) {
    const [bgColor, setBGColor] = useState<Color | null>(null);

    function setColor(color: { b: number; h: number; s: number }) {
        const rgb = hsvToRgb(color.h, color.s, color.b);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

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

        setBGColor(temp_color)
        onBgColorSelect(temp_color)
    }

    useEffect(() => {
        // Set initial bg color
        setColor({ b: 0, h: 0, s: 0 });
    }, []);

    return (
        <div className='flex flex-col w-full min-h-fit overflow-hidden min-w-80 max-w-80'>
            <h4 className='w-full text-center'>Background Color</h4>
            <div className='flex w-full justify-center'>
                <ColorPicker format="hsb" value={bgColor?.codes.hex} onChange={(e) => { setColor(e.value); }} />
            </div>
        </div >
    );
}

export default BGColorTool


