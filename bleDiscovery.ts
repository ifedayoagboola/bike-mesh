import { BleManager, State } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const APPLE_COMPANY_ID = 0x004c; // stock iBeacon frame

export type Beacon = { uuid: string; rssi: number };
type Listener = (beacon: Beacon) => void;

let manager: BleManager | null = null;
const listeners = new Set<Listener>();
let scanning = false;
let stateSub: { remove: () => void } | null = null;

// Created lazily so importing this file never touches Bluetooth.
function ble() {
    if (!manager) manager = new BleManager();
    return manager;
}

function parseBeacon(manufacturerData: string): string | null {
    const bytes = Buffer.from(manufacturerData, 'base64');
    if (bytes.length < 20) return null;
    // Apple company-ID (bytes[0]=0x4C LSB, bytes[1]=0x00 MSB)
    if (((bytes[1] << 8) | bytes[0]) !== APPLE_COMPANY_ID) return null;
    // iBeacon subtype 0x02 + length 0x15
    if (bytes[2] !== 0x02 || bytes[3] !== 0x15) return null;
    return bytes.slice(4, 20).toString('hex'); // 16-byte UUID, lowercase hex
}

function beginScan() {
    if (scanning || listeners.size === 0) return;
    scanning = true;
    ble().startDeviceScan(null, { allowDuplicates: true }, (err, dev) => {
        if (err) {
            // Bluetooth switched off or permission revoked mid-scan. The state
            // listener restarts the scan once the radio is back.
            scanning = false;
            return;
        }
        if (!dev?.manufacturerData) return;
        const uuid = parseBeacon(dev.manufacturerData);
        if (!uuid) return;
        const beacon = { uuid, rssi: dev.rssi ?? 0 };
        listeners.forEach((listener) => listener(beacon));
    });
}

function endScan() {
    if (!scanning) return;
    scanning = false;
    ble().stopDeviceScan();
}

/**
 * Listen for BikeMesh tags (iBeacon frames). Any number of callers can
 * subscribe; one radio scan is shared between them. Call only after the
 * Bluetooth permissions have been granted. Returns an unsubscribe function.
 */
export function subscribeToBeacons(listener: Listener): () => void {
    listeners.add(listener);
    if (!stateSub) {
        stateSub = ble().onStateChange((state) => {
            if (state === State.PoweredOn) beginScan();
            else endScan();
        }, true);
    } else {
        beginScan();
    }
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            endScan();
            stateSub?.remove();
            stateSub = null;
        }
    };
}

/** Resolves to true when the phone's Bluetooth radio is switched on. */
export async function isBluetoothOn(): Promise<boolean> {
    return (await ble().state()) === State.PoweredOn;
}

// Kept for the older single-listener screens.
let legacyUnsubscribe: (() => void) | null = null;
export function startDiscovery(onFound: Listener) {
    stopDiscovery();
    legacyUnsubscribe = subscribeToBeacons(onFound);
}
export function stopDiscovery() {
    legacyUnsubscribe?.();
    legacyUnsubscribe = null;
}
