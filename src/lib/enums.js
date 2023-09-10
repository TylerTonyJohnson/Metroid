export class AppState {
    static None = new AppState('none');
    static Loading = new AppState('loading');
    static Ready = new AppState('ready');
    static Running = new AppState('running');
    static Paused = new AppState('paused');
    static ScanPaused = new AppState('scanPaused');
    static Dying = new AppState('dying');
}

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

export class DangerState {
    static None = new DangerState('none');
    static Sensing = new DangerState('sensing');
    static Warning = new DangerState('warning');
    static Damage = new DangerState('damage');
}

export class AmmoState {
    static Empty = new AmmoState('empty');
    static Low = new AmmoState('low');
    static High = new AmmoState('high');
    static Full = new AmmoState('full');
}

export class ScanningState {
    static None = new ScanningState('none');
    static Scanning = new ScanningState('scanning');
    static Complete = new ScanningState('complete');
}

export class BodyGroup {
    static Samus = 1;
    static Weapons = 2;
    static Enemies = 4;
    static Pickups = 8;
    static Walls = 16;
}

