<script setup lang="ts">
import { EditorContent, useEditor, BubbleMenu, getMarkType, type Range } from '@tiptap/vue-3'
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
    completeText: [text: string, position: number]
    rewriteText: [text: string, Range]
    correctionApplied: [block: TextCorrectionBlock, corrected: string]
}>()

const model = defineModel<string>('modelValue', { required: true })

const editor = useEditor({
    content: '',
    extensions: [
        StarterKit,
        // @ts-ignore
        BubbleMenu,
        CorrectionMark.configure({
            onClick: (event: MouseEvent, node: Node) => {
                const mark = node.marks.find(m => m.attrs['data-block-id']);
                const id = mark?.attrs['data-block-id'];
                const block = props.blocks.find(b => b.offset === id);

                if (!block) return;

                editor.value?.chain()
                    .setTextSelection({ from: block.offset + 1, to: block.offset + block.length + 1 })
                    .run();

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

    const type = getMarkType('correction', editor.value.state.schema);

    editor.value.view.dispatch(
        editor.value.state.tr.removeMark(0, editor.value.state.doc.content.size, type)
    );

    for (const block of value) {
        const start = block.offset + 1;
        const end = start + block.length;

        editor.value.view.dispatch(
            editor.value.state.tr.addMark(
                start, end, type.create({
                    'data-block-id': block.offset,
                })
            )
        );
    }
});

function rewriteText() {
    if (!editor.value) {
        return;
    }

    emit('rewriteText', editor.value.getText(), editor.value.state.selection);
}

function applyCorrection(block: TextCorrectionBlock, corrected: string) {
    if (!editor.value) return;

    const start = block.offset + 1;
    const end = start + block.length;

    editor.value.chain()
        .deleteRange({ from: start, to: end })
        .insertContentAt(start, corrected)
        .run();

    emit('correctionApplied', block, corrected);
}

function applyText(text: string, range: Range) {
    if (!editor.value) return;

    editor.value.chain()
        .deleteRange(range)
        .insertContentAt(range.from, text)
        .run();
}

onUnmounted(() => {
    editor.value?.destroy()
})

defineExpose({ applyCorrection, applyText });

const currentPosition = computed(() => editor.value?.state.selection.from ?? -1);
const currentBlock = computed(() => props.blocks.find(b => b.offset + 1 == currentPosition.value));
</script>

<template>
    <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
        <div class="bubble-menu">
            <div class="flex gap-1" v-if="editor.isActive('correction') && currentBlock">
                <UButton v-for="correction in currentBlock.corrected.slice(0, 5)" :key="correction"
                    @click="applyCorrection(currentBlock, correction)">
                    {{ correction }}
                </UButton>

            </div>
            <UButton @click="rewriteText" variant="ghost" v-else>
                Rewrite
            </UButton>
        </div>
    </bubble-menu>
    <div class="ring-1 ring-gray-400 w-full h-full overflow-y-scroll">
        <editor-content :editor="editor" spellcheck="false" class="w-full h-full"></editor-content>
    </div>
</template>


<style>
.correction {
    @apply underline decoration-wavy decoration-red-500 cursor-pointer;
}

.correction:hover {
    text-decoration-color: blueviolet;
}

.correction .active {
    @apply bg-blue-100;
}
</style>
