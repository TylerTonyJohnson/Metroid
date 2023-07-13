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

export class DangerType {
    static None = new DangerType('none');
    static Sensing = new DangerType('sensing');
    static Warning = new DangerType('warning');
    static Damage = new DangerType('damage');
}