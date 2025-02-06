<script setup lang="ts">
import type { TextCorrectionBlock, TextCorrectionResponse } from '~/assets/models/text-correction';
import type { Range } from '@tiptap/vue-3';
import TextEditor from './text-editor.vue';


const inputText = ref('This is the input text');
const blocks = ref<TextCorrectionBlock[]>([]);
const selectedBlock = ref<TextCorrectionBlock | null>(null);
const error = ref<Error | null>(null);
const status = ref<'pending' | 'success' | 'error' | 'idle'>('idle');
const textEditor = ref<InstanceType<typeof TextEditor>>();
const rewriteRange = ref<Range>();

let currentCorrectTextAbortController: AbortController | null = null;

watch(inputText, () => {
    correctText();
});

async function correctText() {
    // Cancel any ongoing request
    if (currentCorrectTextAbortController) {
        currentCorrectTextAbortController.abort("aborded");
    }

    // Create new abort controller for this request
    currentCorrectTextAbortController = new AbortController();

    status.value = 'pending';
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
        status.value = 'idle';
        currentCorrectTextAbortController = null;
    }
}

function applyBlock(block: TextCorrectionBlock, corrected: string) {
    textEditor.value?.applyCorrection(block, corrected);
}

function onCorrectionApplied(block: TextCorrectionBlock, corrected: string) {
    blocks.value = blocks.value.filter(b => b.offset !== block.offset);
}

function handleBlockClick(block: TextCorrectionBlock) {
    selectedBlock.value = block;

    const blockElement = document.getElementById(`block-${block.offset}`);
    if (blockElement) {
        console.log("scroll to block");
        scrollToBlock(blockElement);
    }

}

function scrollToBlock(blockElement: HTMLElement) {
    // Get the scrollable container
    const container = blockElement.closest('.scrollable-container');
    if (!container) return;

    // Calculate the scroll position
    const containerRect = container.getBoundingClientRect();
    const elementRect = blockElement.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top;

    // Scroll the container
    container.scrollTop = container.scrollTop + relativeTop - (containerRect.height / 2) + (elementRect.height / 2);
}


function onRewriteText(text: string, range: Range) {
    rewriteRange.value = range;
}

</script>

<template>

    <div class="m-2">
        <UAlert v-if="error" color="red" variant="solid" title="Error" :description="error.message" />
        <div class="flex gap-4 w-full">
            <div class="w-3/4 h-[90vh]">
                <client-only>
                    <TextEditor ref="textEditor" v-model="inputText" :blocks="blocks" @block-click="handleBlockClick"
                        @rewrite-text="onRewriteText" @correction-applied="onCorrectionApplied" />
                </client-only>
            </div>

            <div class="w-1/4 flex flex-col gap-2">
                <RewriteView v-if="textEditor" :text-editor="textEditor" :range="rewriteRange" :text="inputText" />

                <div class="overflow-y-scroll h-[90vh] scrollable-container">
                    <template v-for="block in blocks">
                        <UCard :id="`block-${block.offset}`">
                            <div @click="handleBlockClick(block)">

                                {{ block.original }}
                            </div>

                            <div v-if="selectedBlock == block">
                                <div>
                                    {{ block.explanation }}
                                </div>

                                <div class="flex gap-2 flex-wrap">
                                    <UButton v-for="corrected in block.corrected.slice(0, 5)"
                                        @click="applyBlock(block, corrected)">
                                        {{ corrected }}
                                    </UButton>
                                </div>
                            </div>
                        </UCard>
                    </template>
                </div>
            </div>
        </div>

        <UIcon v-if="status === 'pending'" name="i-heroicons-arrow-path" class="animate-spin" />
    </div>
</template>
