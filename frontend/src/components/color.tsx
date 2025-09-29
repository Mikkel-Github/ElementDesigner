"use client";

import { useState } from "react";
import { type Color } from '../lib/color';


const ColorComp: React.FC<{ color: Color, onClick: () => void, highlight: boolean }> = ({ color, onClick, highlight }) => {
    const [expand, setExpand] = useState<boolean>(false);

    return (
        <button
            onClick={() => {
                onClick();
                setExpand(!expand);
            }}
            onMouseEnter={() => { }}
            className='w-fit h-fit'>
            <div className={`flex flex-col w-fit h-fit p-0.5 text-sm font-bold rounded-sm ${highlight && 'border-4 border-black m-[-4px]'}`}>
                {/* Color Preview */}
                <span
                    className="w-8 h-8 m-auto border-black border-2"
                    style={{ backgroundColor: `rgb(${color.codes.rgb.r}, ${color.codes.rgb.g}, ${color.codes.rgb.b}, ${color.codes.rgb.a})` }}
                >
                </span>
                {expand && (
                    <div>
                        {/* Color codes */}
                        <p>{color.codes.hex}</p>
                        <p>({color.codes.rgb.r}, {color.codes.rgb.g}, {color.codes.rgb.b}, {color.codes.rgb.a})</p>
                        <p>({color.codes.hsv.h}, {color.codes.hsv.s}, {color.codes.hsv.v}, {color.codes.hsv.a})</p>
                    </div>
                )}
            </div>
        </button >
    );
};

export default ColorComp

