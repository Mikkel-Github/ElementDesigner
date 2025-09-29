import colorsys
from dataclasses import asdict, dataclass


@dataclass
class RGB:
    r: int
    g: int
    b: int
    a: int = 255


@dataclass
class HSV:
    h: float
    s: float
    v: float
    a: float = 1.0


@dataclass
class ColorCodes:
    hex: str
    rgb: RGB
    hsv: HSV


@dataclass
class Color:
    id: int
    codes: ColorCodes

    def to_dict(self):
        return asdict(self)


# Conversion functions
def rgb_to_hex(r, g, b):
    return f"#{r:02x}{g:02x}{b:02x}".upper()


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    return r, g, b


def rgb_to_hsv(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    return h * 360, s * 100, v * 100


def hsv_to_rgb(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h / 360.0, s / 100.0, v / 100.0)
    return int(r * 255), int(g * 255), int(b * 255)


def create_color_object(hex_color=None, rgb_color=None, hsv_color=None) -> Color:
    if hex_color:
        r, g, b = hex_to_rgb(hex_color)
        h, s, v = rgb_to_hsv(r, g, b)
    elif rgb_color:
        r, g, b = rgb_color
        h, s, v = rgb_to_hsv(r, g, b)
        hex_color = rgb_to_hex(r, g, b)
    elif hsv_color:
        h, s, v = hsv_color
        r, g, b = hsv_to_rgb(h, s, v)
        hex_color = rgb_to_hex(r, g, b)
    else:
        raise ValueError("Must provide hex_color, rgb_color, or hsv_color")

    return Color(
        id=-1,
        codes=ColorCodes(
            hex=hex_color,
            rgb=RGB(r=r, g=g, b=b),
            hsv=HSV(h=h, s=s, v=v),
        ),
    )


# Color tools
def hsv_distance(c1: HSV, c2: HSV) -> float:
    dh = min(abs(c1.h - c2.h), 360 - abs(c1.h - c2.h)) / 180.0
    ds = abs(c1.s - c2.s) / 100.0
    dv = abs(c1.v - c2.v) / 100.0
    return (dh**2 + ds**2 + dv**2) ** 0.5


def get_related_colors(
    target: Color, colors: list[Color], threshold: float = 0.3, min_results: int = 5
) -> list[Color]:
    def similarity(c: Color) -> float:
        return hsv_distance(target.codes.hsv, c.codes.hsv)

    # ignore the provided color
    filtered = [c for c in colors if c.id != target.id]

    # sort by distance
    sorted_colors = sorted(filtered, key=similarity)

    # filter the colors by the threshold
    relevant_colors = [c for c in filtered if similarity(c) <= threshold]

    if len(relevant_colors) >= min_results:
        return relevant_colors
    else:
        # if not enough similar colors, fill in with closest others
        return sorted_colors[:min_results]
