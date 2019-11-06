export interface BrowserInfoRequest {
    device_os: DeviceOS;
    language: string;
    screen_resolution: string;
    time_zone: string;
}

export enum DeviceOS {
    Android =  'android',
    IOS =  'ios',
    Windows =  'windows',
    Other =  'other',
}
