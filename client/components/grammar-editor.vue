<script setup lang="ts">
import type { TextCorrectionBlock, TextCorrectionResponse } from '~/assets/models/text-correction';

const inputText = ref('This is the input text');
const blocks = ref<TextCorrectionBlock[]>([]);

const { data, error, execute, status } = await useAsyncData(
    'text-correction',
    () => useApiFetch<string>(
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
        const parsedData = JSON.parse(data.value) as TextCorrectionResponse;
        blocks.value = parsedData.blocks;
    } else {
        blocks.value = [];
    }
});


function correctText() {
    execute();
}

</script>

<template>
    <div>
        <UAlert v-if="error" color="red" variant="solid" title="Error" :description="error.message" />
        <div class="flex gap-4 w-full">
            <UTextarea v-model="inputText" />
            <div>
                <UIcon v-if="status === 'pending'" name="i-heroicons-arrow-path" class="animate-spin" />
                <div v-else>
                    <template v-for="block in blocks">
                        <UTooltip :text="block.explanation" v-if="block.explanation">
                            <span :class="{ 'text-blue-500 underline': block.explanation }">{{ block.corrected ||
                                block.original }}</span>
                        </UTooltip>
                        <span v-else>{{ block.corrected || block.original }}</span>
                    </template>
                </div>
            </div>
        </div>


        <UButton @click="correctText">Correct</UButton>
    </div>
</template>
