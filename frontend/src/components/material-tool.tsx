"use client";

import { useEffect, useRef, useState } from "react";

import { Color } from "@/lib/color";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const materials = [
    {
        value: "standard",
        label: "Standard",
    },
    {
        value: "transparent",
        label: "Transparent",
    },
]

function MaterialTool({
    selectedColor,
    onColorSelect,
}: {
    selectedColor: Color | null;
    onColorSelect: (color: Color) => void;
}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(() => {
        if (!selectedColor) return;
        if (selectedColor?.codes.hsv.a < 1.0) {
            setValue("transparent")
            return
        }
        setValue("standard")
    }, [selectedColor]);

    function setMaterial(materialValue: string) {
        if (!selectedColor) return;
        let temp_color = { ...selectedColor };

        if (materialValue === "transparent") {
            temp_color = {
                id: selectedColor.id,
                codes: {
                    hex: selectedColor.codes.hex.slice(0, 7) + "50",
                    rgb: { ...selectedColor.codes.rgb, a: 127 },
                    hsv: { ...selectedColor.codes.hsv, a: 0.5 },
                }
            };

            onColorSelect(temp_color);
        }
        else {
            temp_color = {
                id: selectedColor.id,
                codes: {
                    hex: selectedColor.codes.hex.slice(0, 7),
                    rgb: { ...selectedColor.codes.rgb, a: 255 },
                    hsv: { ...selectedColor.codes.hsv, a: 1.0 },
                }
            };

            onColorSelect(temp_color);
        }
    }

    return (
        <div className='flex flex-col w-full min-h-fit overflow-hidden max-w-80'>
            <h4 className='w-full text-center'>Material</h4>
            <hr />
            <div className='flex flex-wrap gap-1 h-fit mt-4 p-1 pl-3 pr-3 overflow-x-hidden overflow-y-scroll justify-center'>
                <Popover open={open} onOpenChange={setOpen} >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between cursor-pointer"
                        >
                            {value
                                ? materials.find((materials) => materials.value === value)?.label
                                : "Select material..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            {/* <CommandInput placeholder="Search material..." className="h-9" /> */}
                            <CommandList>
                                <CommandEmpty>No materials found.</CommandEmpty>
                                <CommandGroup>
                                    {materials.map((materials) => (
                                        <CommandItem
                                            key={materials.value}
                                            value={materials.value}
                                            onSelect={(currentValue) => {
                                                setMaterial(currentValue);
                                                setOpen(false)
                                            }}
                                            className="cursor-pointer"
                                        >
                                            {materials.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === materials.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div >

    )
}

export default MaterialTool


