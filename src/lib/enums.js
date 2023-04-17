export class VisorType {
    static None = new VisorType('none');
    static Combat = new VisorType('combat');
    static Scan = new VisorType('scan');
    static Thermal = new VisorType('thermal');
    static Xray = new VisorType('visor');
}

export class SelectorType {
    static Visor = new SelectorType('visor');
    static Beam = new SelectorType('beam');
}

export class BeamType {
    static Power = new BeamType('power');
    static Wave = new BeamType('wave');
    static Ice = new BeamType('ice');
    static Plasma = new BeamType('plasma');
}