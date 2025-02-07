<script lang="ts" setup>
import type { TextCorrectionBlock } from '~/assets/models/text-correction';

// definitions
interface CorrectionPanelProps {
    blocks: TextCorrectionBlock[];
    selectedBlock?: TextCorrectionBlock;
}

// input
const props = defineProps<CorrectionPanelProps>();

// output
const emit = defineEmits<{
    blockSelected: [block: TextCorrectionBlock]
    blockApplied: [block: TextCorrectionBlock, corrected: string]
}>();

defineExpose({ jumpToBlock });

// refs
const selectedBlock = ref<TextCorrectionBlock | null>(null);

// computed
const blocks = computed(() => props.blocks);

// functions
function jumpToBlock(block: TextCorrectionBlock) {
    selectBlock(block);

    const blockElement = document.getElementById(`block-${block.offset}`);
    if (blockElement) {
        scrollToBlock(blockElement);
    }
}

function selectBlock(block: TextCorrectionBlock) {
    selectedBlock.value = block;
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

function applyBlock(block: TextCorrectionBlock, corrected: string) {
    emit('blockApplied', block, corrected);
}
</script>

<template>
    <div class="overflow-y-scroll h-[90vh] scrollable-container">
        <template v-for="block in blocks">
            <UCard :id="`block-${block.offset}`">
                <div @click="selectBlock(block)">

                    {{ block.original }}
                </div>

                <div v-if="selectedBlock == block">
                    <div>
                        {{ block.explanation }}
                    </div>

                    <div class="flex gap-2 flex-wrap">
                        <UButton v-for="corrected in block.corrected.slice(0, 5)" @click="applyBlock(block, corrected)">
                            {{ corrected }}
                        </UButton>
                    </div>
                </div>
            </UCard>
        </template>
    </div>
</template>
