import type { SVGProps } from 'react';
import React from 'react';

export const MoonIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SunIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <g fill="currentColor">
                <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
                <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
            </g>
        </svg>
    );
};

export function MdiSearch(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5"></path></svg>);
}

export function MdiAccountAdd(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4"></path></svg>);
}

export function MdiDeleteForever(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>);
}

export function MdiArrowLeft(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z"></path></svg>);
}

export function MdiCalendar(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9 10v2H7v-2zm4 0v2h-2v-2zm4 0v2h-2v-2zm2-7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V1h2v2h8V1h2v2zm0 16V8H5v11zM9 14v2H7v-2zm4 0v2h-2v-2zm4 0v2h-2v-2z"></path></svg>);
}

export function MdiDotsVertical(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"></path></svg>);
}

export function MdiFileDocumentArrowRight(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m23 19l-3-3v2h-4v2h4v2zm-10 0c0-.3 0-.7.1-1H6v-2h7.8c.5-.8 1.1-1.5 1.9-2H6v-2h12v1.1c.3-.1.7-.1 1-.1s.7 0 1 .1V8l-6-6H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h7.8c-.5-.9-.8-1.9-.8-3m0-15.5L18.5 9H13z"></path></svg>);
}

export function Check(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M17.517 7.957c.3.286.312.76.026 1.06l-6.667 7a.75.75 0 0 1-1.086 0l-3.333-3.5a.75.75 0 1 1 1.086-1.034l2.79 2.93l6.124-6.43a.75.75 0 0 1 1.06-.026"></path></svg>);
}

export function CloudArrowDown(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 5.75c-2.674 0-4.881 2-5.208 4.584l-.059.464l-.443.151A3.752 3.752 0 0 0 6.5 18.25a.75.75 0 0 1 0 1.5a5.23 5.23 0 0 1-3.3-1.167a5.25 5.25 0 0 1 1.176-8.885A6.752 6.752 0 0 1 17.52 9.25a5.25 5.25 0 0 1-.021 10.5a.75.75 0 0 1 0-1.5c.894 0 1.713-.312 2.357-.833a3.75 3.75 0 0 0-2.839-6.636l-.72.092l-.115-.717A5.25 5.25 0 0 0 11 5.75"></path><path fill="currentColor" d="m12.53 21.53l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.22 1.22V13a.75.75 0 0 0-1.5 0v6.19l-1.22-1.22a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0" opacity={0.5}></path></svg>);
}

export function ArrowsSwitch(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M13.685 5.25h.03a.75.75 0 0 1 0 1.5c-1.292 0-2.275 0-3.058.063c-.785.063-1.283.183-1.636.371a3.94 3.94 0 0 0-1.677 1.764c-.19.394-.304.88-.363 1.638c-.06.764-.06 1.738-.06 3.094v.11l1.12-1.12a.75.75 0 0 1 1.06 1.06l-2.4 2.4a.75.75 0 0 1-1.086-.027l-2.171-2.4a.75.75 0 0 1 1.112-1.006l.865.956v-.005c0-1.317 0-2.35.065-3.179c.066-.844.202-1.542.509-2.176a5.44 5.44 0 0 1 2.319-2.431c.625-.335 1.37-.476 2.224-.544c.85-.068 1.891-.068 3.147-.068"></path><path fill="currentColor" d="M17.847 7.65a.75.75 0 0 1 .538.247l2.171 2.4a.75.75 0 0 1-1.112 1.006l-.866-.956v.005c0 1.317 0 2.35-.064 3.179c-.066.844-.202 1.542-.509 2.176a5.44 5.44 0 0 1-2.319 2.431c-.625.335-1.37.476-2.224.544c-.85.068-1.891.068-3.147.068h-.03a.75.75 0 0 1 0-1.5c1.292 0 2.275 0 3.058-.063c.784-.063 1.283-.183 1.636-.372a3.94 3.94 0 0 0 1.677-1.763c.19-.394.304-.88.363-1.637c.059-.765.06-1.74.06-3.095v-.11l-1.12 1.12a.75.75 0 0 1-1.06-1.06l2.4-2.4a.75.75 0 0 1 .548-.22" opacity={0.5}></path></svg>);
}

export function ClockRotateRight(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M12 6v6h6"></path><path d="M21.888 10.5C21.164 5.689 17.013 2 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c4.1 0 7.625-2.468 9.168-6"></path><path d="M17 16h4.4a.6.6 0 0 1 .6.6V21"></path></g></svg>);
}

export function UserAlt(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><circle cx={12} cy={8} r={4} fill="currentColor"></circle><path fill="currentColor" fillOpacity={0.25} d="M5.338 17.32C5.999 14.528 8.772 13 11.643 13h.714c2.871 0 5.644 1.527 6.305 4.32c.128.541.23 1.107.287 1.682c.055.55-.397.998-.949.998H6c-.552 0-1.004-.449-.949-.998c.057-.575.159-1.14.287-1.681"></path></svg>);
}

export function SendFill(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M3.402 6.673c-.26-2.334 2.143-4.048 4.266-3.042l11.944 5.658c2.288 1.083 2.288 4.339 0 5.422L7.668 20.37c-2.123 1.006-4.525-.708-4.266-3.042L3.882 13H12a1 1 0 1 0 0-2H3.883z" clipRule="evenodd"></path></svg>);
}

export function FeDocument(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15 4H6v16h12V7h-3zM6 2h10l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m2 9h8v2H8zm0 4h8v2H8z"></path></svg>);
}

export function LightUploadRounded(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.616 19q-.691 0-1.153-.462T5 17.384v-1.923q0-.213.143-.356t.357-.144t.357.144t.143.356v1.923q0 .231.192.424t.423.192h10.77q.23 0 .423-.192t.192-.424v-1.923q0-.213.143-.356t.357-.144t.357.144t.143.356v1.923q0 .691-.462 1.153T17.384 19zM11.5 6.927L9.529 8.898q-.146.146-.347.153t-.366-.159q-.16-.165-.163-.353q-.003-.189.163-.354l2.618-2.62q.132-.13.268-.183q.137-.053.298-.053t.298.053t.268.184l2.618 2.619q.147.146.154.344q.006.198-.153.363q-.166.166-.357.169t-.357-.163L12.5 6.927v8.15q0 .214-.143.357t-.357.143t-.357-.143t-.143-.357z"></path></svg>);
}

export function DocumentCheckOutline(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v4.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z"></path></svg>);
}

export function FlowbiteUsersSolid(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M8 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4zm7.25-2.095c.478-.86.75-1.85.75-2.905a6 6 0 0 0-.75-2.906a4 4 0 1 1 0 5.811M15.466 20c.34-.588.535-1.271.535-2v-1a5.98 5.98 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2z" clipRule="evenodd"></path></svg>);
}

export function MdiLightClock(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z"></path></svg>);
}

export function ClipboardListLine(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M16 4.002c2.175.012 3.353.109 4.121.877C21 5.758 21 7.172 21 10v6c0 2.829 0 4.243-.879 5.122C19.243 22 17.828 22 15 22H9c-2.828 0-4.243 0-5.121-.878C3 20.242 3 18.829 3 16v-6c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877" opacity={0.5}></path><path strokeLinecap="round" d="M10.5 14H17M7 14h.5M7 10.5h.5m-.5 7h.5m3-7H17m-6.5 7H17"></path><path d="M8 3.5A1.5 1.5 0 0 1 9.5 2h5A1.5 1.5 0 0 1 16 3.5v1A1.5 1.5 0 0 1 14.5 6h-5A1.5 1.5 0 0 1 8 4.5z"></path></g></svg>);
}

export function ClipboardError(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}><path fill="currentColor" d="M7.085 3A1.5 1.5 0 0 1 8.5 2h3a1.5 1.5 0 0 1 1.415 1H14.5A1.5 1.5 0 0 1 16 4.5v4.707a5.5 5.5 0 0 0-1-.185V4.5a.5.5 0 0 0-.5-.5h-1.585A1.5 1.5 0 0 1 11.5 5h-3a1.5 1.5 0 0 1-1.415-1H5.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h4.1q.276.538.657 1H5.5A1.5 1.5 0 0 1 4 16.5v-12A1.5 1.5 0 0 1 5.5 3zM8.5 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM19 14.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0M14.5 12a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-2a.5.5 0 0 0-.5-.5m0 5.125a.625.625 0 1 0 0-1.25a.625.625 0 0 0 0 1.25"></path></svg>);
}

export function ClearRound(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"></path></svg>);
}

export function LinkBold(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M15.728 3.884c1.434-1.44 3.532-1.47 4.694-.304c1.164 1.168 1.132 3.28-.303 4.72l-2.424 2.433a.75.75 0 0 0 1.063 1.059l2.424-2.433c1.91-1.919 2.15-4.982.303-6.838c-1.85-1.857-4.907-1.615-6.82.304L9.818 7.692c-1.912 1.919-2.152 4.982-.303 6.837a.75.75 0 1 0 1.062-1.058c-1.163-1.168-1.132-3.28.303-4.72z"></path><path fill="currentColor" d="M14.485 9.47a.75.75 0 0 0-1.063 1.06c1.164 1.168 1.132 3.279-.303 4.72L8.27 20.116c-1.434 1.44-3.532 1.47-4.694.304c-1.163-1.168-1.132-3.28.303-4.72l2.424-2.433a.75.75 0 1 0-1.062-1.059l-2.424 2.433C.906 16.56.666 19.623 2.515 21.48c1.85 1.858 4.907 1.615 6.819-.304l4.848-4.867c1.91-1.918 2.15-4.982.303-6.837" opacity={0.5}></path></svg>);
}

export function CloseToMenuTransition(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M5 5L19 19M5 19L19 5"><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 5L19 19M5 19L19 5;M5 5L19 5M5 19L19 19"></animate></path><path d="M12 12H12" opacity={0}><animate fill="freeze" attributeName="d" begin="0.2s" dur="0.4s" values="M12 12H12;M5 12H19"></animate><set fill="freeze" attributeName="opacity" begin="0.2s" to={1}></set></path></g></svg>);
}

export function MenuToCloseTransition(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M5 12H19"><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 12H19;M12 12H12"></animate><set fill="freeze" attributeName="opacity" begin="0.4s" to={0}></set></path><path d="M5 5L19 5M5 19L19 19" opacity={0}><animate fill="freeze" attributeName="d" begin="0.2s" dur="0.4s" values="M5 5L19 5M5 19L19 19;M5 5L19 19M5 19L19 5"></animate><set fill="freeze" attributeName="opacity" begin="0.2s" to={1}></set></path></g></svg>);
}

export function DotsFill(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M9 4a2 2 0 1 1 0 4a2 2 0 0 1 0-4m2 8a2 2 0 1 0-4 0a2 2 0 0 0 4 0m0 6a2 2 0 1 0-4 0a2 2 0 0 0 4 0m6-6a2 2 0 1 0-4 0a2 2 0 0 0 4 0m-2 4a2 2 0 1 1 0 4a2 2 0 0 1 0-4m2-10a2 2 0 1 0-4 0a2 2 0 0 0 4 0"></path></g></svg>);
}

export function AddRounded(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"></path></svg>);
}

export function Slash(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 5L7 19"></path></svg>);
}

export function Empty(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><g fill="currentColor"><path d="M216 128a88 88 0 1 1-88-88a88 88 0 0 1 88 88" opacity={0.2}></path><path d="m198.24 62.63l15.68-17.25a8 8 0 0 0-11.84-10.76L186.4 51.86A95.95 95.95 0 0 0 57.76 193.37l-15.68 17.25a8 8 0 1 0 11.84 10.76l15.68-17.24A95.95 95.95 0 0 0 198.24 62.63M48 128a80 80 0 0 1 127.6-64.25l-107 117.73A79.63 79.63 0 0 1 48 128m80 80a79.55 79.55 0 0 1-47.6-15.75l107-117.73A79.95 79.95 0 0 1 128 208"></path></g></svg>);
}

export function Key(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillOpacity={0.25} d="M18.896 10H8v4h6.732a.5.5 0 0 0 .416-.223l.436-.653a.5.5 0 0 1 .832 0l.376.564a.25.25 0 0 0 .416 0l.376-.564a.5.5 0 0 1 .832 0l.415.622a.25.25 0 0 0 .385.038l1.607-1.607a.25.25 0 0 0 0-.354l-1.75-1.75a.25.25 0 0 0-.177-.073"></path><rect width={6} height={1} x={10} y={11} fill="currentColor" rx={0.5}></rect><path fill="currentColor" fillRule="evenodd" d="M3.586 8.586C3 9.172 3 10.114 3 12s0 2.828.586 3.414S5.114 16 7 16s2.828 0 3.414-.586S11 13.886 11 12s0-2.828-.586-3.414S8.886 8 7 8s-2.828 0-3.414.586M6 10a1 1 0 1 0 0 2a1 1 0 0 0 0-2" clipRule="evenodd"></path></svg>);
}

export function DocumentAdd(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={64} strokeDashoffset={64} d="M13 3l6 6v12h-14v-18h8"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate></path><path strokeDasharray={14} strokeDashoffset={14} strokeWidth={1} d="M12.5 3v5.5h6.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="14;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M9 14h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="8;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M12 11v6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" values="8;0"></animate></path></g></svg>);
}

export function QuillInfo(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" {...props}><g fill="none" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 14h1v9h1m12-7a13 13 0 1 1-26 0a13 13 0 0 1 26 0"></path><path fill="currentColor" d="M17 9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"></path></g></svg>);
}

export function ShieldCheckLine(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" opacity={0.5}></path><path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12.4l1.429 1.6l3.571-4"></path></g></svg>);
}

export function LineLogIn(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}><path strokeDasharray={48} strokeDashoffset={48} d="M8 5v-1c0 -0.55 0.45 -1 1 -1h9c0.55 0 1 0.45 1 1v16c0 0.55 -0.45 1 -1 1h-9c-0.55 0 -1 -0.45 -1 -1v-1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"></animate></path><path strokeDasharray={12} strokeDashoffset={12} d="M4 12h11"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0"></animate></path><path strokeDasharray={6} strokeDashoffset={6} d="M15 12l-3.5 -3.5M15 12l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="6;0"></animate></path></g></svg>);
}

export function Dashboard(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M19 11a2 2 0 0 1 1.995 1.85L21 13v6a2 2 0 0 1-1.85 1.995L19 21h-4a2 2 0 0 1-1.995-1.85L13 19v-6a2 2 0 0 1 1.85-1.995L15 11zm0-8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" className="duoicon-secondary-layer" opacity={0.3}></path><path fill="currentColor" fillRule="evenodd" d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" className="duoicon-primary-layer"></path><path fill="currentColor" fillRule="evenodd" d="M9 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" className="duoicon-secondary-layer" opacity={0.3}></path></svg>);
}

export function IconMessage(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1z" className="duoicon-secondary-layer" opacity={0.3}></path><path fill="currentColor" fillRule="evenodd" d="M8 12a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2zM7 9a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1" className="duoicon-primary-layer"></path></svg>);
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={21.34} height={12} viewBox="0 0 16 9" {...props}><path fill="currentColor" d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5"></path><path fill="currentColor" d="M10 8.5a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71l3.15-3.15l-3.15-3.15c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.5 3.5c.2.2.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z"></path></svg>);
}

export function IconPending(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m11-9c0 6.075-4.925 11-11 11S1 18.075 1 12S5.925 1 12 1s11 4.925 11 11m-9.996 1.004H11V11h2.004zm-5 0H6V11h2.004zm10 0H16V11h2.004z"></path></svg>);
}

export function IconMessagePreview(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor"><path d="M10.5 3q-.337.016-.67.037c-4.184.279-7.516 3.664-7.79 7.914a20 20 0 0 0 0 2.525c.1 1.548.783 2.98 1.588 4.19c.467.848.159 1.906-.328 2.83c-.35.665-.526.998-.385 1.239c.14.24.455.248 1.084.263c1.245.03 2.084-.323 2.75-.815c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.308 1.485.34c1.425.095 2.914.096 4.342 0c4.183-.278 7.515-3.663 7.789-7.913a20 20 0 0 0 0-2.525q-.032-.484-.114-.951M17.5 5h.009"></path><path d="M21.795 4.59c.137.183.205.275.205.41s-.068.227-.205.41C21.18 6.23 19.61 8 17.5 8s-3.68-1.77-4.295-2.59C13.068 5.226 13 5.134 13 5s.068-.227.205-.41C13.82 3.77 15.39 2 17.5 2s3.68 1.77 4.295 2.59m-9.8 7.91h.01m3.986 0H16m-8 0h.009"></path></g></svg>);
}

export function IconAssignmentOutline(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.2q.325-.9 1.088-1.45T12 1t1.713.55T14.8 3H19q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm0-2h14V5H5zm2-2h7v-2H7zm0-4h10v-2H7zm0-4h10V7H7zm5-4.75q.325 0 .538-.213t.212-.537t-.213-.537T12 2.75t-.537.213t-.213.537t.213.538t.537.212M5 19V5z"></path></svg>);
}

export function IconDocumentUpload(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeWidth={2} d="M2.998 1H17.5L21 4.5V23H3zM16 1v5h5m-9 14v-9m-4 3l4-4l4 4"></path></svg>);
}

export function IconReceipt(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><path fill="currentColor" d="M6 10.25A4.25 4.25 0 0 1 10.25 6h19.5A4.25 4.25 0 0 1 34 10.25V28h8v7.75A6.25 6.25 0 0 1 35.75 42h-23.5A6.25 6.25 0 0 1 6 35.75zM34 39.5h1.75a3.75 3.75 0 0 0 3.75-3.75V30.5H34zm-2.5-29.25a1.75 1.75 0 0 0-1.75-1.75h-19.5a1.75 1.75 0 0 0-1.75 1.75v25.5a3.75 3.75 0 0 0 3.75 3.75H31.5zM14.25 14a1.25 1.25 0 1 0 0 2.5h11.5a1.25 1.25 0 1 0 0-2.5zM13 24.25c0-.69.56-1.25 1.25-1.25h11.5a1.25 1.25 0 1 1 0 2.5h-11.5c-.69 0-1.25-.56-1.25-1.25M14.25 32a1.25 1.25 0 1 0 0 2.5h5.5a1.25 1.25 0 1 0 0-2.5z"></path></svg>);
}

export function IconWrite(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="-2 -2 24 24" {...props}><path fill="currentColor" d="m5.72 14.456l1.761-.508l10.603-10.73a.456.456 0 0 0-.003-.64l-.635-.642a.443.443 0 0 0-.632-.003L6.239 12.635zM18.703.664l.635.643c.876.887.884 2.318.016 3.196L8.428 15.561l-3.764 1.084a.9.9 0 0 1-1.11-.623a.9.9 0 0 1-.002-.506l1.095-3.84L15.544.647a2.215 2.215 0 0 1 3.159.016zM7.184 1.817c.496 0 .898.407.898.909a.903.903 0 0 1-.898.909H3.592c-.992 0-1.796.814-1.796 1.817v10.906c0 1.004.804 1.818 1.796 1.818h10.776c.992 0 1.797-.814 1.797-1.818v-3.635c0-.502.402-.909.898-.909s.898.407.898.91v3.634c0 2.008-1.609 3.636-3.593 3.636H3.592C1.608 19.994 0 18.366 0 16.358V5.452c0-2.007 1.608-3.635 3.592-3.635z"></path></svg>);
}

export function IconMeetingRoom(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" d="M5 13.5h14m-7 0V24M6.5 11V6.5H5.328a3 3 0 0 0-2.906 2.255L.5 16.25v.25h7V18c0 1.5 0 2.5.75 4c0 0 .75 1.5 1.75 1.5M17.5 11V6.5h1.172a3 3 0 0 1 2.906 2.255L23.5 16.25v.25h-7V18c0 1.5 0 2.5-.75 4c0 0-.75 1.5-1.75 1.5m-7.65-19s-1.6-1-1.6-2.25a1.747 1.747 0 1 1 3.496 0C8.246 3.5 6.65 4.5 6.65 4.5zm11.3 0s1.6-1 1.6-2.25A1.75 1.75 0 0 0 17.5.5c-.966 0-1.746.784-1.746 1.75c0 1.25 1.596 2.25 1.596 2.25z" strokeWidth={1}></path></svg>);
}

export function IconLightBalance(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M3 20v-1h8.5V7.94q-.708-.129-1.25-.642T9.56 6H6.116L9 13.212q-.058 1-.929 1.702T6 15.616t-2.071-.702T3 13.212L5.885 6H4V5h5.56q.165-.836.834-1.418T12 3t1.606.582T14.44 5H20v1h-1.884L21 13.212q-.058 1-.929 1.702T18 15.616t-2.071-.702T15 13.212L17.884 6h-3.443q-.149.785-.691 1.298t-1.25.643V19H21v1zm12.99-6.884h4.02L18 8.092zm-12 0h4.02L6 8.092zM12 7q.617 0 1.059-.441q.441-.442.441-1.059t-.441-1.059Q12.617 4 12 4t-1.059.441T10.5 5.5t.441 1.059Q11.383 7 12 7"></path></svg>);
}

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m4.497 20.835l16.51-7.363c1.324-.59 1.324-2.354 0-2.944L4.497 3.164c-1.495-.667-3.047.814-2.306 2.202l3.152 5.904c.245.459.245 1 0 1.458l-3.152 5.904c-.74 1.388.81 2.87 2.306 2.202"></path></svg>);
}

export function IconFileTypeExcel(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 32 32" {...props}><defs><linearGradient id="vscodeIconsFileTypeExcel0" x1={4.494} x2={13.832} y1={-2092.086} y2={-2075.914} gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset={0} stopColor="#18884f"></stop><stop offset={0.5} stopColor="#117e43"></stop><stop offset={1} stopColor="#0b6631"></stop></linearGradient></defs><path fill="#185c37" d="M19.581 15.35L8.512 13.4v14.409A1.19 1.19 0 0 0 9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5Z"></path><path fill="#21a366" d="M19.581 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z"></path><path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z"></path><path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity={0.1}></path><path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path><path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path><path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity={0.2}></path><path fill="url(#vscodeIconsFileTypeExcel0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"></path><path fill="#fff" d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017q.123-.281.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.4 2.4 0 0 1 9.2 16.8h-.024a1.7 1.7 0 0 1-.168.351l-1.493 2.722Z"></path><path fill="#33c481" d="M28.806 3h-9.225v6.5H30V4.191A1.19 1.19 0 0 0 28.806 3"></path><path fill="#107c41" d="M19.581 16H30v6.5H19.581Z"></path></svg>);
}
