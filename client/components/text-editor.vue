<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { TextCorrectionBlock } from '~/assets/models/text-correction'
import type { Node } from '@tiptap/pm/model';
import { CorrectionMark } from '~/utils/correction-mark';

const props = defineProps<{
    blocks: TextCorrectionBlock[]
}>()

const emit = defineEmits<{
    blockClick: [block: TextCorrectionBlock]
    blockSelected: [block: TextCorrectionBlock]
}>()

const model = defineModel<string>('modelValue', { required: true })

const editor = useEditor({
    content: '',
    extensions: [
        StarterKit,
        CorrectionMark.configure({
            onClick: (event: MouseEvent, node: Node) => {
                const block = props.blocks.find(b => b.original === node.textContent);
                console.log('clicked on Block:', block);
                if (!block) return;

                emit('blockClick', block);
            },
        })

    ],
    onUpdate: ({ editor }) => {
        model.value = editor.getText()
    },
})

watch(model, (value) => {
    if (!editor.value) return;

    if (editor.value.getText() === value) {
        return
    }

    editor.value.commands.setContent(value)
});

watch(() => props.blocks, (value) => {
    if (!editor.value) return;

    for (const block of value) {
        const start = model.value.indexOf(block.original) + 1;
        const end = start + block.original.length;

        console.log('Updating block:', start, end, value);

        editor.value
            .chain()
            .setTextSelection({ from: start, to: end })
            .setMark('correction', {
                'data-block-id': block.original,
            })
            .run();
    }
});

onUnmounted(() => {
    editor.value?.destroy()
})

</script>

<template>
    <editor-content :editor="editor" spellcheck="false" />
</template>

<style>
.correction {
    background-color: transparent;
    text-decoration: underline;
    text-decoration-color: blue;
    cursor: pointer;
}

.correction:hover {
    text-decoration-color: blueviolet;
}
</style>
