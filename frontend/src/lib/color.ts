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
        hsl: {
            h: number;
            s: number;
            l: number;
            a: number;
        }
    }
}
