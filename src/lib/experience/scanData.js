export class ScanType {
    static SmallEnergy = 'smallEnergy';
    static MediumEnergy = 'mediumEnergy';
    static LargeEnergy = 'largeEnergy';
    static Metroid = 'metroid';
    static BetaMetroid = 'betaMetroid';
    static MissileAmmo = 'missileAmmo';
    static EnergyTank = 'energyTank';
    static MissileExpansion = 'missileExpansion';
    static Fire = 'fire';
}

export const scanData = [
    {
        type: ScanType.SmallEnergy,
        message: "Small Energy. Replenishes 10 energy units.",
        left: 'Scan Energy 1.png', 
        right: 'Scan Energy 2.png',
    },
    {
        type: ScanType.MediumEnergy,
        message: "Medium Energy. Replenishes 20 energy units.",
        left: 'Scan Energy 1.png', 
        right: 'Scan Energy 2.png',
    },
    {
        type: ScanType.LargeEnergy,
        message: "Large Energy. Replenishes 100 energy units.",
        left: 'Scan Energy 1.png', 
        right: 'Scan Energy 2.png',
    },
    {
        type: ScanType.Metroid,
        message: "Metroid. A mysterious lifeform from Zebes sought after by space pirates and the Galactic Federation alike.",
        left: 'Scan Metroid 1.png', 
        right: 'Scan Metroid 2.png',
    },
    {
        type: ScanType.BetaMetroid,
        message: "Beta Metroid. A fierce, evolved Metroid form with enhanced range and sensing capabilities.",
        left: 'Scan Beta Metroid 1.png', 
        right: 'Scan Beta Metroid 2.png',
    },
    {
        type: ScanType.MissileAmmo,
        message: "Missile Ammo. Replenishes 5 missiles.",
        left: 'Scan Missile Ammo 1.png', 
        right: 'Scan Missile Ammo 2.png',
    },
    {
        type: ScanType.MissileExpansion,
        message: "Missile Expansion. Increases suit missile capacity by 5.",
        left: 'Scan Missile Expansion 1.png', 
        right: 'Scan Missile Expansion 2.png',

    },
    {
        type: ScanType.EnergyTank,
        message: "Energy Tank. Increases suit energy capacity by 100.",
        left: 'Scan Energy Tank 1.png', 
        right: 'Scan Energy Tank 2.png',
    },
    {
        type: ScanType.Fire,
        message: "An open flame caused by electrical shortages nearby. Avoid contact."
    },
]