<script setup lang="ts">
import type { TextCorrectionBlock, TextCorrectionResponse } from '~/assets/models/text-correction';
import TextEditor from './text-editor.vue';

const inputText = ref('This is the input text');
const blocks = ref<TextCorrectionBlock[]>([]);
const selectedBlock = ref<TextCorrectionBlock | null>(null);

const { data, error, execute, status } = await useAsyncData(
    'text-correction',
    () => useApiFetch<TextCorrectionResponse>(
        '/text-correction',
        JSON.stringify({ text: inputText.value }),
        'POST',
        true),
    {
        immediate: false,
    });

watch(data, () => {
    if (data.value) {
        console.log(data.value);
        blocks.value = data.value.blocks.filter(block => block.original !== block.corrected);
        console.log(blocks.value);
    } else {
        blocks.value = [];
    }
});


function correctText() {
    execute();
}

function applyBlock(block: TextCorrectionBlock) {
    inputText.value = inputText.value.replace(block.original, block.corrected);
    correctText();
}

function handleBlockClick(block: TextCorrectionBlock) {
    selectedBlock.value = block;
}

</script>

<template>

    <div class="m-2">
        <UAlert v-if="error" color="red" variant="solid" title="Error" :description="error.message" />
        <div class="flex gap-4 w-full">
            <div class="w-3/4 h-[90vh]">
                <client-only>
                    <TextEditor v-model="inputText" :blocks="blocks" @block-click="handleBlockClick" />
                </client-only>
            </div>
            <div>
                <template v-for="block in blocks">
                    <UCard
                        :ui="{ ring: selectedBlock?.original == block.original ? 'ring-2 ring-blue-500' : 'ring-2 ring-transparent' }">
                        <div>
                            {{ selectedBlock?.original == block.original ? 'selected' : 'not selected' }}
                        </div>

                        <div>
                            Original: {{ block.original }}
                        </div>

                        <div>
                            Corrected: {{ block.corrected }}
                        </div>
                        <div>
                            Explanation: {{ block.explanation }}
                        </div>

                        <template #footer>
                            <UButton @click="applyBlock(block)">Correct</UButton>
                        </template>
                    </UCard>
                </template>
            </div>
        </div>

        <UIcon v-if="status === 'pending'" name="i-heroicons-arrow-path" class="animate-spin" />
        <UButton @click="correctText">Correct</UButton>
    </div>
</template>
