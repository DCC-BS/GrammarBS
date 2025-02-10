<script setup lang="ts">
import { EditorContent, useEditor, BubbleMenu, getMarkType, type Range } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { TextCorrectionBlock } from '~/assets/models/text-correction'
import type { Node } from '@tiptap/pm/model';
import { CorrectionMark } from '~/utils/correction-mark';
import CharacterCount from '@tiptap/extension-character-count'


// input
const props = defineProps<{
    blocks: TextCorrectionBlock[]
}>()

// output
const emit = defineEmits<{
    blockClick: [block: TextCorrectionBlock]
    blockSelected: [block: TextCorrectionBlock]
    completeText: [text: string, position: number]
    rewriteText: [text: string, Range]
    correctionApplied: [block: TextCorrectionBlock, corrected: string]
}>()

defineExpose({ applyCorrection, applyText });

// model
const model = defineModel<string>('modelValue', { required: true });

// refs
const limit = ref(10_000);

// computed
const currentPosition = computed(() => editor.value?.state.selection.from ?? -1);
const currentBlock = computed(() => props.blocks.find(b => b.offset + 1 == currentPosition.value));
const characterCountPercentage = computed(() => Math.round((100 / limit.value) * editor.value?.storage.characterCount.characters()));

// composables
const toast = useToast();
const { t } = useI18n();

const editor = useEditor({
    content: model.value,
    extensions: [
        StarterKit,
        // @ts-ignore
        BubbleMenu,
        CharacterCount.configure({
            limit: limit.value,
        }),
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
    editorProps: {
        handleKeyDown: (view, event) => {
            // Check if Ctrl+C is pressed
            if (event.ctrlKey && event.key === 'c') {
                // Check if there is no text selection
                if (editor.value?.state.selection.empty) {
                    // Select all text
                    editor.value?.commands.selectAll();
                    toast.add({
                        title: 'Ctrl+C pressed',
                        description: 'Select all text',
                        color: 'blue',
                        icon: 'i-heroicons-clipboard-document-list',
                    });
                }
            }
        },

    },
    onUpdate: ({ editor }) => {
        model.value = editor.getText()
    },
});

// lifecycle
onUnmounted(() => {
    editor.value?.destroy()
});

// listeners
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

// functions
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

    applyText(corrected, { from: start, to: end });

    emit('correctionApplied', block, corrected);
}

async function applyText(text: string, range: Range) {
    if (!editor.value) return;

    editor.value.chain()
        .deleteRange(range)
        .insertContentAt(range.from, text)
        .focus(range.from)
        .run();
}
</script>

<template>
    <div v-if="editor" class="w-full h-full">
        <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }">
            <div class="bubble-menu">
                <div class="flex gap-1"
                    v-if="editor.isActive('correction') && currentBlock && currentBlock.corrected.length > 0">
                    <UButton v-for="correction in currentBlock.corrected.slice(0, 5)" :key="correction"
                        @click="applyCorrection(currentBlock, correction)">
                        {{ correction }}
                    </UButton>
                </div>
                <UButton @click="rewriteText" variant="ghost" v-else>
                    {{ t('editor.rewrite') }}
                </UButton>
            </div>
        </bubble-menu>
        <div class="ring-1 ring-gray-400 w-full h-full overflow-y-scroll">
            <editor-content :editor="editor" spellcheck="false" class="w-full h-full"></editor-content>
        </div>
        <div class="flex items-center gap-2 justify-end"
            :class="{ 'character-count--warning': editor.storage.characterCount.characters() === limit }">
            <svg height="20" width="20" viewBox="0 0 20 20">
                <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                <circle r="5" cx="10" cy="10" fill="transparent" stroke="currentColor" stroke-width="10"
                    :stroke-dasharray="`calc(${characterCountPercentage} * 31.4 / 100) 31.4`"
                    transform="rotate(-90) translate(-20)" />
                <circle r="6" cx="10" cy="10" fill="white" />
            </svg>

            {{ editor.storage.characterCount.characters() }} / {{ limit }} characters
            <br>
            {{ editor.storage.characterCount.words() }} words
        </div>
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

.character-count--warning {
    @apply text-red-500;
}
</style>
