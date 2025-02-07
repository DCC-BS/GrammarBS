<script setup lang="ts">
import type { TextCorrectionBlock, TextCorrectionResponse } from '~/assets/models/text-correction';
import type { Range } from '@tiptap/vue-3';
import TextEditor from './text-editor.vue';
import type { CorrectionPanel } from '#components';

// refts
const inputText = ref('');
const blocks = ref<TextCorrectionBlock[]>([]);

const error = ref<Error | null>(null);
const textEditor = ref<InstanceType<typeof TextEditor>>();
const correctionPanel = ref<InstanceType<typeof CorrectionPanel>>();
const rewriteRange = ref<Range>();

let currentCorrectTextAbortController: AbortController | null = null;

// composables
const router = useRouter();
const { addProgress, removeProgress } = useUseProgressIndication();

// check if the query param clipboard is true
const clipboard = router.currentRoute.value.query.clipboard;

// life cycle
onMounted(async () => {
    // Wait for next tick to ensure text editor is fully mounted
    await nextTick();

    if (clipboard && inputText.value == '') {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
    }
});

// listeners
watch(inputText, () => {
    correctText();
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
        title: 'Correcting text'
    });
    try {
        const response = await $fetch<TextCorrectionResponse>('/api/correct', {
            body: { text: inputText.value },

            method: 'POST',
            signal: currentCorrectTextAbortController.signal
        });
        blocks.value = response.blocks;
    } catch (e: any) {
        if ("cause" in e && e.cause == "aborded") {
            return;
        }

        error.value = e as Error;
    } finally {
        currentCorrectTextAbortController = null;
        removeProgress('correcting');
    }
}

function applyBlock(block: TextCorrectionBlock, corrected: string) {
    textEditor.value?.applyCorrection(block, corrected);
}

function onCorrectionApplied(block: TextCorrectionBlock, corrected: string) {
    blocks.value = blocks.value.filter(b => b.offset !== block.offset);
}

function onRewriteText(text: string, range: Range) {
    rewriteRange.value = range;
}

function onBlockClick(block: TextCorrectionBlock) {
    correctionPanel.value?.jumpToBlock(block);
}

function applyRewrite(option: string) {
    if (!textEditor.value || !rewriteRange.value) return;
    textEditor.value.applyText(option, rewriteRange.value);
}
</script>

<template>
    <div class="m-2">

        <UAlert v-if="error" color="red" variant="solid" title="Error" :description="error.message" />
        <div class="flex gap-4 w-full">
            <div class="w-3/4 h-[90vh]">
                <client-only>
                    <TextEditor ref="textEditor" v-model="inputText" :blocks="blocks" @block-click="onBlockClick"
                        @rewrite-text="onRewriteText" @correction-applied="onCorrectionApplied" />
                </client-only>
            </div>

            <div class="w-1/4 flex flex-col gap-2">
                <RewriteView :range="rewriteRange" :text="inputText" @rewrite-applied="applyRewrite" />
                <CorrectionPanel ref="correctionPanel" :blocks="blocks" @block-applied="applyBlock" />
            </div>
        </div>
    </div>
    <div class="fixed bottom-0 left-0 right-0">
        <ProgressIndication />
    </div>
</template>
