import colorsys
from dataclasses import asdict, dataclass


@dataclass
class RGB:
    r: int
    g: int
    b: int
    a: int = 255


@dataclass
class HSL:
    h: float
    s: float
    l: float
    a: float = 1.0


@dataclass
class ColorCodes:
    hex: str
    rgb: RGB
    hsl: HSL


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


def rgb_to_hsl(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360, s * 100, l * 100


def hsl_to_rgb(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return int(r * 255), int(g * 255), int(b * 255)


def hsl_to_hex(h, s, l):
    r, g, b = hsl_to_rgb(h, s, l)
    return rgb_to_hex(r, g, b)


def hex_to_hsl(hex_color):
    r, g, b = hex_to_rgb(hex_color)
    return rgb_to_hsl(r, g, b)


def create_color_object(hex_color=None, rgb_color=None, hsl_color=None) -> Color:
    if hex_color:
        r, g, b = hex_to_rgb(hex_color)
        h, s, l = rgb_to_hsl(r, g, b)
    elif rgb_color:
        r, g, b = rgb_color
        h, s, l = rgb_to_hsl(r, g, b)
        hex_color = rgb_to_hex(r, g, b)
    elif hsl_color:
        h, s, l = hsl_color
        r, g, b = hsl_to_rgb(h, s, l)
        hex_color = rgb_to_hex(r, g, b)
    else:
        raise ValueError("Must provide hex_color, rgb_color, or hsl_color")

    return Color(
        id=-1,  # color is not from database/json so it does not have an official id
        codes=ColorCodes(hex=hex_color, rgb=RGB(r=r, g=g, b=b), hsl=HSL(h=h, s=s, l=l)),
    )


# Color tools
def hsl_distance(c1: HSL, c2: HSL) -> float:
    dh = min(abs(c1.h - c2.h), 360 - abs(c1.h - c2.h)) / 180.0  # hue is circular
    ds = abs(c1.s - c2.s) / 100.0
    dl = abs(c1.l - c2.l) / 100.0
    return (dh**2 + ds**2 + dl**2) ** 0.5


def get_related_colors(
    target: Color, colors: list[Color], num_related: int = 5
) -> list[Color]:
    def similarity(c: Color) -> float:
        return hsl_distance(target.codes.hsl, c.codes.hsl)

    # ignore the provided color
    filtered = [c for c in colors if c.id != target.id]

    # sort by HSL similarity
    sorted_colors = sorted(filtered, key=similarity)

    return sorted_colors[:num_related]
