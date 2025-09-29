export interface Color {
    id: number;
    codes: {
        hex: string;
        rgb: {
            r: number;
            g: number;
            b: number;
            a: number;
        }
        hsv: {
            h: number;
            s: number;
            v: number;
            a: number;
        }
    }
}
