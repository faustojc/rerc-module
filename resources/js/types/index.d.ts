import { Config } from 'ziggy-js';
import { ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    role: string;
    email: string;
    email_verified_at: string;
}

export interface Application {
    id: string,
    firstname: string,
    lastname: string,
    research_title: string,
    date_applied: string,
    protocol_code: string,
    protocol_date_updated: string,
    review_type: string,
    proof_of_payment_url: string,
    payment_date: string,
    payment_details: string,
    created_at?: string,
    updated_at?: string,
    members: Member[],
    meeting: Meeting,
    documents: AppDocument[],
    statuses: AppStatus[],
    requirements: Requirement[],
    review_results: AppReviewResult[],
    decision_letter: DecisionLetter | null,
    panels: PanelMember[],
    ethics_clearance: EthicsClearance | null,
    [key: string]: any;
}

export interface AppStatus {
    id: string;
    app_profile_id: string;
    name: string;
    sequence: number;
    status: string;
    start: string;
    end: string;
    created_at?: string;
    updated_at?: string;
    messages: MessageThread[];
    [key: string]: any;
}

export interface Member {
    id: string;
    app_profile_id: string;
    firstname: string;
    lastname: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export interface Meeting {
    id: string;
    app_profile_id: string;
    meeting_date: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export interface MessageThread {
    id: string;
    app_profile_id: string;
    app_status_id: string;
    remarks: string;
    by: string;
    read_status?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export interface AppDocument {
    id: string;
    app_profile_id: string;
    review_result_id?: string;
    file_url: string;
    remarks?: string;
    created_at?: string;
    updated_at?: string;
    review_result?: AppReviewResult;
    version?: number;
    original_document_id?: string;
    status: string;
    [key: string]: any;
}


export interface DecisionLetter {
    id: string,
    app_profile_id: string,
    file_name: string,
    file_url: string,
    is_signed: number,
    date_uploaded: string,
    created_at?: string,
    updated_at?: string,
    [key: string]: any;
}

export interface Requirement {
    id: string;
    app_profile_id: string;
    name: string;
    file_url: string;
    date_uploaded: string;
    status: string;
    is_additional: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export interface AppReviewResult {
    id: string;
    app_profile_id: string;
    name: string;
    file_url: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    documents?: AppDocument[];
    reviewed_document_ids?: string[];
    feedback?: string;
    [key: string]: any;
}

export interface PanelMember {
    id: string,
    app_profile_id: string,
    firstname: string,
    lastname: string,
    created_at?: string,
    updated_at?: string,
    [key: string]: any;
}

export interface EthicsClearance {
    id: string;
    app_profile_id: string;
    file_url: string;
    date_clearance: string;
    date_uploaded: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface PaginationProps<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: null | string;
        label: string;
        active: boolean;
    }[];
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
}

export interface ReviewTypeInfo {
    value: 'exempt' | 'expedited' | 'full board';
    label: string;
    description: string;
    processingTime: string;
    criteria: string[];
    icon: ReactNode;
}

export interface ApplicationFormProps {
    user: User;
    application: Application;
    status: AppStatus;
    handleUpdateApplication: (data: ApplicationUpdatedEvent) => void;
    handleMessage: (status: AppStatus, messageContent: string, userName: string) => Promise<void>
}

export interface ApplicationUpdatedEvent {
    message?: string;
    application: Partial<Application>;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    errors: Record<string, string>;
};
