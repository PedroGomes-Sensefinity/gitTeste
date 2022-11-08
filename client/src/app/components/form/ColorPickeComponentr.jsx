import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
export const ColorPickerComponent = ({label, onChange}) => {
    const [color, setColor] = useState(label);
    const handleChange = color => {
        setColor(color.hex);
    };

    return <SketchPicker
        color={color}
        onChange={handleChange}
        onChangeComplete={ color => {
                onChange(color.hex)
            }
        }
    />;
}