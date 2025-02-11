import type { TextCorrectionBlock } from "./text-correction";
import type { Range } from "@tiptap/vue-3";

export type CommandType =
    "JumpToBlockCommand" |
    "ApplyCorrectionCommand" |
    "ApplyTextCommand" |
    "RewriteTextCommand";

export interface ICommand {
    readonly $type: CommandType;
}

export class JumpToBlockCommand implements ICommand {
    readonly $type = "JumpToBlockCommand";

    constructor(
        public block: TextCorrectionBlock) {
    }
}

export class ApplyCorrectionCommand implements ICommand {
    readonly $type = "ApplyCorrectionCommand";

    constructor(
        public block: TextCorrectionBlock,
        public corrected: string) {
    }
}

export class ApplyTextCommand implements ICommand {
    readonly $type = "ApplyTextCommand";

    constructor(
        public text: string,
        public range: Range) {
    }
}

export class RewriteTextCommand implements ICommand {
    readonly $type = "RewriteTextCommand";

    constructor(
        public text: string,
        public range: Range) {
    }
}

// Add this mapping
export type CommandMap = {
    "JumpToBlockCommand": JumpToBlockCommand;
    "ApplyCorrectionCommand": ApplyCorrectionCommand;
    "ApplyTextCommand": ApplyTextCommand;
    "RewriteTextCommand": RewriteTextCommand;
};
