export type TextCorrectionBlock = {
    original: string;
    corrected?: string;
    explanation?: string;
}

export type TextCorrectionResponse = {
    blocks: TextCorrectionBlock[];
}

