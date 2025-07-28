import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const ble = new BleManager();
const APPLE_COMPANY_ID = 0x004C;               // stock iBeacon frame

export function startDiscovery(onFound: (d: { uuid: string, rssi: number }) => void) {
    ble.startDeviceScan(null, { allowDuplicates: false }, (err, dev) => {
        if (err || !dev?.manufacturerData) return;

        const bytes = Buffer.from(dev.manufacturerData, 'base64');

        // Check Apple company-ID (bytes[0]=0x4C LSB, bytes[1]=0x00 MSB)
        if ((bytes[1] << 8 | bytes[0]) !== APPLE_COMPANY_ID) return;

        // iBeacon subtype 0x02 + length 0x15
        if (bytes[2] !== 0x02 || bytes[3] !== 0x15) return;

        const uuid = bytes.slice(4, 20).toString('hex');    // 16-byte UUID
        onFound({ uuid, rssi: dev.rssi ?? 0 });
    });
}

export function stopDiscovery() {
    ble.stopDeviceScan();
}
