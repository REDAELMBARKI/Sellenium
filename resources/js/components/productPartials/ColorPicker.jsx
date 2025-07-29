import { HexColorPicker } from "react-colorful";
import { useState } from "react";

function ColorPicker() {
    const [color, setColor] = useState("#aabbcc");

    return (
        <div className="flex flex-col items-center space-y-2">
            <HexColorPicker color={color} onChange={setColor} />
            <div
                className="w-12 h-12 rounded-full border border-gray-300 shadow"
                style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600">{color}</span>
        </div>
    );
}


export default ColorPicker


