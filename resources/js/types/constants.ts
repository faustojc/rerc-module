import { ReviewTypeInfo } from "@/types/index";
import { ClipboardListLine, FlowbiteUsersSolid, MdiLightClock } from "@/Components/Icons";

export const REVIEW_TYPES: ReviewTypeInfo[] = [
    {
        value: 'exempt',
        label: 'Exempted Review',
        description: 'For minimal risk research involving standard procedures.',
        processingTime: '14 weekdays',
        icon: ClipboardListLine({className: 'w-6 h-6'}),
        criteria: [
            'Research involves minimal risk to participants',
            'Uses standard educational tests or surveys',
            'Involves existing publicly available data',
            'Evaluates public benefit service programs',
        ],
    },
    {
        value: 'expedited',
        label: 'Expedited Review',
        description: 'For research with moderate risk requiring quick review.',
        processingTime: '21 weekdays',
        icon: MdiLightClock({className: 'w-6 h-6'}),
        criteria: [
            'Research presents no more than minimal risk',
            'Minor changes to previously approved research',
            'Collection of non-invasive biological specimens',
            'Research on individual or group behavior',
        ],
    },
    {
        value: 'full board',
        label: 'Full Board Review',
        description: 'For complex research requiring comprehensive evaluation.',
        processingTime: '15-21 weekdays',
        icon: FlowbiteUsersSolid({className: 'w-6 h-6'}),
        criteria: [
            'Research involving vulnerable populations',
            'Studies with more than minimal risk',
            'Clinical trials or interventional studies',
            'Research with sensitive topics or procedures',
        ],
    },
];

export const STEPS = [
    { sequence: 1, name: 'Application Submission' },
    { sequence: 2, name: 'Protocol Assignment' },
    { sequence: 3, name: 'Initial Review' },
    { sequence: 4, name: 'Review Type' },
    { sequence: 5, name: 'Decision Letter' },
    { sequence: 6, name: 'Payment Made' },
    { sequence: 7, name: 'Assignment of Panel & Meeting Schedule' },
    { sequence: 8, name: 'Review Results' },
    { sequence: 9, name: 'Additional Requirements' },
    { sequence: 10, name: 'Ethics Clearance' },
];
