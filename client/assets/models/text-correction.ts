export type TextCorrectionBlock = {
    original: string;
    corrected: string;
    explanation: string;
}

export type TextCorrectionResponse = {
    original: string;
    blocks: TextCorrectionBlock[];
}

