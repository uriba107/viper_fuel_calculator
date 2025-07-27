const aircraftData = {
    // Aircreaft drag includes 4 air to air weapons on 1/9 and 2/8 stations
    C: {
        fuel: 7100,
        drag: 7,
    },
    D: {
        fuel: 5400,
        drag: 11,
        onlyBMS: true,
    },
};
const ExternalFuelData = {
    CL300: {
        fuel: 2000,
        drag: 25,
    },
    W370: {
        fuel: 4800,
        drag: 70,
    },
    W600: {
        fuel: 7900,
        drag: 76,
        onlyBMS: true
    },
    CFT: {
        fuel: 2900,
        drag: 0,
        onlyBMS: true,
    }
};
const storesDrag = {
    AA: 24,
    AG: 48,
    CL300: 25,
    W370: 70,
    W600: 76,
};
// const flightProfiles = Object.freeze({
//     low_420: 0,
//     low_480: 1,
//     high: 2,
//     low_endurance: 3,
//     low_range: 4,
//     high_endurance: 5,
//     high_range: 6,
// });
const tasData = {
    low_420: 420,
    low_480: 480,
    high: 480,
}
// const maxEndurance = {
//     false: {
//         low: {
//             50: {
//                 tas: 265,
//                 fuelflow: 3700,
//             },
//             100: {
//                 tas: 270,
//                 fuelflow: 4000,
//             },
//             150: {
//                 tas: 265,
//                 fuelflow: 4200,
//             },
//             200: {
//                 tas: 265,
//                 fuelflow: 4600,
//             },
//         },
//         high: {
//             50: {
//                 tas: 400,
//                 fuelflow: 3400,
//             },
//             100: {
//                 tas: 380,
//                 fuelflow: 3600,
//             },
//             150: {
//                 tas: 380,
//                 fuelflow: 4100,
//             },
//             200: {
//                 tas: 370,
//                 fuelflow: 4300,
//             },
//         }
//     },
//     true: {
//         low: {
//             50: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             100: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             150: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             200: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//         },
//         high: {
//             50: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             100: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             150: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             200: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//         }
//     },
// }
// const maxRange = {
//     false: {
//         low: {
//             50: {
//                 tas: 360,
//                 fuelflow: 4600,
//             },
//             100: {
//                 tas: 335,
//                 fuelflow: 4600,
//             },
//             150: {
//                 tas: 330,
//                 fuelflow: 4800,
//             },
//             200: {
//                 tas: 320,
//                 fuelflow: 5000,
//             },
//         },
//         high: {
//             50: {
//                 tas: 450,
//                 fuelflow: 3550,
//             },
//             100: {
//                 tas: 445,
//                 fuelflow: 4000,
//             },
//             150: {
//                 tas: 450,
//                 fuelflow: 4400,
//             },
//             200: {
//                 tas: 440,
//                 fuelflow: 4700,
//             },
//         }
//     },
//     true: {
//         low: {
//             50: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             100: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             150: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             200: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//         },
//         high: {
//             50: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             100: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             150: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//             200: {
//                 tas: 420,
//                 fuelflow: 2000,
//             },
//         }
//     },
// }
const fuelFlowData = {
    // [CFT][profile][DragIndex] = FF(pph)
    // low_420: 420TAS@SL
    // low_480: 480TAS@SL
    // high: 480TAS@FL250(~M0.78)
    false: {
        low_420: { 
            50: 5900,
            100: 6600,
            150: 7250,
            200: 8000,
        },
        low_480: {
            50: 7400,
            100: 8350,
            150: 9300,
            200: 13000,
        },
        high: {
            50: 4400,
            100: 5200,
            150: 5700,
            200: 6200,
        },
    },
    true: {
        low_420: {
            50: 5700,
            100: 6500,
            150: 7100,
            200: 7800,
        },
        low_480: {
            50: 7200,
            100: 8200,
            150: 9200,
            200: 10100,
        },
        high: {
            50: 4100,
            100: 5100,
            150: 5500,
            200: 5800,
        }
    }
};

const FuelConst = {
    GroundOps: 2000,
    popup: 1500,
    threat: 1000,
    AAR: 500,
    refuelRate: 2000,
};

const getFuelFlow = (profile, drag, isCFT=false) => {
    let ffTbl = fuelFlowData[isCFT][profile]
    drag = Math.max(50, Math.min(200, drag))

    if (ffTbl[drag]) {
        return ffTbl[drag]
    }
    let stepUp = Math.ceil(drag/50)*50
    let stepDown = Math.floor(drag/50)*50
    let ffUp = ffTbl[stepUp]
    let ffDown = ffTbl[stepDown]
    let ff = ffDown + (ffUp - ffDown) * (drag - stepDown) / (stepUp - stepDown)
    return ff
};

const getFlightTime = (distance, profile) => {
    let tas = tasData[profile] || tasData.low_420;
    return distance / tas;
};

const getFuelConsumption = (distanceInput, profile, drag, isCFT=false,timeHours=0) => {
    let ff = getFuelFlow(profile, drag, isCFT);
    let time = getFlightTime(distanceInput, profile)+timeHours || 0;
    return ff * time;
};
const getDistanceFromFuel = (fuel,profile,drag,isCFT=false) => {
    let ff = getFuelFlow(profile, drag, isCFT)
    let time = fuel/ff
    let tas = tasData[profile] || tasData.low_420;
    return tas*time
}
const getDrag = (loadout) => {
    let drag = 0;
    for (const value of loadout) {
        drag += storesDrag[value] || 0;
    }
    return drag;
}
const getExternalFuel = (loadout) => {
    let fuel = 0;
    for (const value of loadout) {
        fuel += ExternalFuelData[value]?.fuel || 0;
    }
    return fuel;
}

const bingoTables = {
    //[CFT][Drag][Range]
    // speeds (climb/descend) in IAS
    false: {        
        55: {
            climb: 435,
            descend: 220,
            105:{
                fuel: 2000,
                alt: 35000,
                mach: 0.77,
                topOfDescend: 68
            },
            142:{
                fuel: 2200,
                alt: 35000,
                mach: 0.77,
                topOfDescend: 68
            },
            179:{
                fuel: 2400,
                alt: 40000,
                mach: 0.90,
                topOfDescend: 82
            },
            220:{
                fuel: 2600,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            262:{
                fuel: 2800,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            303:{
                fuel: 3000,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            345:{
                fuel: 3200,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            387:{
                fuel: 3400,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            428:{
                fuel: 3600,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            470:{
                fuel: 3800,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            },
            511:{
                fuel: 4000,
                alt: 42000,
                mach: 0.90,
                topOfDescend: 85
            }
        },
        92: {
            climb: 410,
            descend: 228,
            97:{
                fuel: 2000,
                alt: 30000,
                mach: 0.70,
                topOfDescend: 47
            },
            129:{
                fuel: 2200,
                alt: 30000,
                mach: 0.70,
                topOfDescend: 47
            },
            164:{
                fuel: 2400,
                alt: 35000,
                mach: 0.75,
                topOfDescend: 60
            },
            200:{
                fuel: 2600,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            240:{
                fuel: 2800,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            280:{
                fuel: 3000,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            319:{
                fuel: 3200,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            359:{
                fuel: 3400,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            398:{
                fuel: 3600,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            438:{
                fuel: 3800,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            },
            478:{
                fuel: 4000,
                alt: 41000,
                mach: 0.85,
                topOfDescend: 70
            }
        },
        122: {
            climb: 400,
            descend: 230,
            88:{
                fuel: 2000,
                alt: 20000,
                mach: 0.59,
                topOfDescend: 30
            },
            114:{
                fuel: 2200,
                alt: 20000,
                mach: 0.59,
                topOfDescend: 30
            },
            157:{
                fuel: 2400,
                alt: 35000,
                mach: 0.74,
                topOfDescend: 57
            },
            199:{
                fuel: 2600,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            237:{
                fuel: 2800,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            275:{
                fuel: 3000,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            313:{
                fuel: 3200,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            350:{
                fuel: 3400,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            388:{
                fuel: 3600,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            426:{
                fuel: 3800,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            },
            464:{
                fuel: 4000,
                alt: 41000,
                mach: 0.83,
                topOfDescend: 68
            }
        }

    },
    true: {
        55: {
            climb: 435,
            descend: 220,
            91:{
                fuel: 2000,
                alt: 25000,
                mach: 0.7,
                topOfDescend: 54
            },
            125:{
                fuel: 2200,
                alt: 30000,
                mach: 0.75,
                topOfDescend: 64
            },
            160:{
                fuel: 2400,
                alt: 35000,
                mach: 0.79,
                topOfDescend: 76
            },
            196:{
                fuel: 2600,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            233:{
                fuel: 2800,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            284:{
                fuel: 3000,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            325:{
                fuel: 3200,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            366:{
                fuel: 3400,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            407:{
                fuel: 3600,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            447:{
                fuel: 3800,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            },
            488:{
                fuel: 4000,
                alt: 39000,
                mach: 0.84,
                topOfDescend: 82
            }
        },
        92: {
            climb: 410,
            descend: 230,
            79:{
                fuel: 2000,
                alt: 20000,
                mach: 0.61,
                topOfDescend: 40
            },
            109:{
                fuel: 2200,
                alt: 25000,
                mach: 0.69,
                topOfDescend: 48
            },
            143:{
                fuel: 2400,
                alt: 35000,
                mach: 0.79,
                topOfDescend: 60
            },
            181:{
                fuel: 2600,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            214:{
                fuel: 2800,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            248:{
                fuel: 3000,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            281:{
                fuel: 3200,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            315:{
                fuel: 3400,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            348:{
                fuel: 3600,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            382:{
                fuel: 3800,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            },
            416:{
                fuel: 4000,
                alt: 40000,
                mach: 0.84,
                topOfDescend: 80
            }
        },
        122: {
            climb: 395,
            descend: 230,
            72:{
                fuel: 2000,
                alt: 15000,
                mach: 0.55,
                topOfDescend: 28
            },
            93:{
                fuel: 2200,
                alt: 15000,
                mach: 0.55,
                topOfDescend: 28
            },
            128:{
                fuel: 2400,
                alt: 25000,
                mach: 0.65,
                topOfDescend: 46
            },
            159:{
                fuel: 2600,
                alt: 30000,
                mach: 0.70,
                topOfDescend: 56
            },
            198:{
                fuel: 2800,
                alt: 35000,
                mach: 0.77,
                topOfDescend: 64
            },
            228:{
                fuel: 3000,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            },
            258:{
                fuel: 3200,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            },
            288:{
                fuel: 3400,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            },
            318:{
                fuel: 3600,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            },
            348:{
                fuel: 3800,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            },
            378:{
                fuel: 4000,
                alt: 40000,
                mach: 0.82,
                topOfDescend: 76
            }
        }

    }
}

const getBestMatchValue = (value, inputArr) => {
    let sortedArr = inputArr.map(key => parseInt(key, 10)).filter(item => typeof item === 'number' && Number.isFinite(item)).sort((a,b) => a-b)
    if (value <= sortedArr[0]) {
        return sortedArr[0];
    }
    if (value >= sortedArr[sortedArr.length - 1]) {
        return sortedArr[sortedArr.length - 1];
    }
    for (let i = sortedArr.length-1; i >= 0; i--) {
        if (sortedArr[i] < value) {
            return sortedArr[i+1];
        }
    }
    // Fallback: return the closest value (first element) if no match found
    return sortedArr[0];
}


const getBingoFuel = (distance, drag = 55, isCFT=false) => {
    let bestDrag = getBestMatchValue(drag, [55,92,122]);
    let bingoTable = bingoTables[isCFT][bestDrag];
    
    let bestDistance = getBestMatchValue(distance, Object.keys(bingoTable));
    // Create a copy to avoid mutating the original data
    let retval = {...bingoTable[bestDistance]};
    retval.climb = bingoTable.climb;
    retval.descend = bingoTable.descend;
    return retval; 
}

export { aircraftData, ExternalFuelData, storesDrag, FuelConst, getFuelFlow, getFlightTime, getFuelConsumption, getDrag, getExternalFuel,getBingoFuel, getDistanceFromFuel };