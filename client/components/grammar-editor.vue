<script setup lang="ts">
import type { TextCorrectionBlock, TextCorrectionResponse } from '~/assets/models/text-correction';
import type { Range } from '@tiptap/vue-3';
import TextEditor from './text-editor.vue';
import ToolPanel from './tool-panel.vue';
import { JumpToBlockCommand, RewriteTextCommand } from '~/assets/models/commands';

// refs
const userText = ref('');
const blocks = ref<TextCorrectionBlock[]>([]);

const rewriteRange = ref<Range>();

let currentCorrectTextAbortController: AbortController | null = null;

// composables
const router = useRouter();
const { addProgress, removeProgress } = useUseProgressIndication();
const { t } = useI18n();
const { executeCommand } = useCommandBus();
const { sendError } = useUseErrorDialog();

// check if the query param clipboard is true
const clipboard = router.currentRoute.value.query.clipboard;

// life cycle
onMounted(async () => {
    // Wait for next tick to ensure text editor is fully mounted
    await nextTick();

    if (clipboard && userText.value == '') {
        const text = await navigator.clipboard.readText();
        userText.value = text;
    }
});

// listeners
watch(userText, () => {
    correctText();
    rewriteRange.value = undefined;
});

// functions
async function correctText() {
    // Cancel any ongoing request
    if (currentCorrectTextAbortController) {
        currentCorrectTextAbortController.abort("aborded");
    }

    // Create new abort controller for this request
    currentCorrectTextAbortController = new AbortController();

    addProgress('correcting', {
        icon: 'i-heroicons-pencil',
        title: t('status.correctingText')
    });
    try {
        const response = await $fetch<TextCorrectionResponse>('/api/correct', {
            body: { text: userText.value },

            method: 'POST',
            signal: currentCorrectTextAbortController.signal
        });
        blocks.value = response.blocks;
    } catch (e: any) {
        if ("cause" in e && e.cause == "aborded") {
            return;
        }

        sendError(e.message);
    } finally {
        currentCorrectTextAbortController = null;
        removeProgress('correcting');
    }
}

function onCorrectionApplied(block: TextCorrectionBlock, corrected: string) {
    blocks.value = blocks.value.filter(b => b.offset !== block.offset);
}

function onRewriteText(text: string, range: Range) {
    executeCommand(new RewriteTextCommand(text, range));
}

function onBlockClick(block: TextCorrectionBlock) {
    executeCommand(new JumpToBlockCommand(block));
}
</script>

<template>
    <div>
        <div class="flex flex-col md:flex-row w-full h-[100vh]">
            <div class="w-full h-[60vh] p-2 md:w-[75%] md:h-[90vh]">
                <client-only>
                    <TextEditor v-model="userText" :blocks="blocks" @block-click="onBlockClick"
                        @rewrite-text="onRewriteText" @correction-applied="onCorrectionApplied" />
                </client-only>
            </div>

            <div class="w-full h-[40vh] overflow-y-hidden md:w-[25%] p-2 md:h-full flex flex-col gap-2">
                <ToolPanel :blocks="blocks" :text="userText" />
            </div>
        </div>
    </div>
    <div class="fixed bottom-5 left-0 right-0">
        <ProgressIndication />
    </div>
</template>
