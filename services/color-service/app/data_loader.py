import json

from color_utils import HSV, RGB, Color, ColorCodes


def load_colors_from_json(path: str) -> list[Color]:
    with open(path, "r") as f:
        raw_colors = json.load(f)

    colors = []
    for c in raw_colors:
        rgb = c["codes"]["rgb"]
        hsv = c["codes"]["hsv"]
        color = Color(
            id=c["id"],
            codes=ColorCodes(
                hex=c["codes"]["hex"],
                rgb=RGB(r=rgb["r"], g=rgb["g"], b=rgb["b"], a=rgb.get("a", 255)),
                hsv=HSV(h=hsv["h"], s=hsv["s"], v=hsv["v"], a=hsv.get("a", 1.0)),
            ),
        )
        colors.append(color)
    return colors
