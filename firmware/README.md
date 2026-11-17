# BikeMesh tag firmware (NXP QN9090 / DK6)

The tag is NXP's `beacon_bm` SDK example with four small changes, kept here as
`bikemesh-beacon.patch`. `bikemesh-tag-qn9090.bin` is the built image.

## What the tag does

- Broadcasts a standard iBeacon frame once a second. The app identifies a tag by
  the frame's 16-byte UUID.
- The UUID is a SHA-256 hash of the chip's own unique ID, so every chip flashed
  with the same image gets its own tag ID. No per-tag configuration.
- Starts broadcasting as soon as it has power.
- Cannot be switched off by a button press, and restarts broadcasting by itself
  if it ever stops.

## The four changes to the SDK example

| File | Change | Why |
|------|--------|-----|
| `source/app_preinclude.h` | `#define gIBeaconAdvData_c 1` | The example defaults to NXP's own beacon format, which the app ignores. |
| `source/beacon.c` | `BleApp_Start()` after `BleApp_Config()` | The example waits for a button press before broadcasting. |
| `source/beacon.c` | Button press no longer calls `Gap_StopAdvertising()` | A tracker must not be silenced by a knock. |
| `source/beacon.c` | `BleApp_Start()` when advertising reports it has stopped | Self-heal. |

## Build (without opening the IDE)

Project: `Documents\MCUXpressoIDE_25.6.136\workspace\qn9090dk6_beacon_bm`.

```sh
export PATH="/c/nxp/MCUXpressoIDE_25.6.136/ide/tools/bin:/c/nxp/MCUXpressoIDE_25.6.136/ide/plugins/com.nxp.mcuxpresso.tools.win32_25.6.0.202501151204/buildtools/bin:$PATH"
cd Debug
make -j8 main-build
python ../scripts/dk6_image_tool.py qn9090dk6_beacon_bm.axf   # needs pycryptodome
arm-none-eabi-objcopy -O binary qn9090dk6_beacon_bm.axf qn9090dk6_beacon_bm.bin
```

## Flash

The tag sleeps between broadcasts, and the debug probe cannot reach a sleeping
chip ("Could not connect to core"). Reset it into programming mode first, then
flash straight away:

```sh
LS=/c/nxp/LinkServer_25.6.131/LinkServer.exe
"$LS" probe '#1' runscript 'C:\nxp\LinkServer_25.6.131\binaries\Scripts\ISPResetConnect.scp'
"$LS" flash QN9090:QN9090DK6 load 'C:\path\to\qn9090dk6_beacon_bm.axf'
```

The board restarts and broadcasts by itself. In a development build of the app,
the log prints `[ble] tag <id> heard` every ten seconds for each tag in range.
