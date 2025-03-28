<script lang="ts" setup>
import type { Range } from '@tiptap/vue-3';
import { ApplyTextCommand, Cmds, RewriteTextCommand } from '~/assets/models/commands';
import type { RewriteApplyOptions, TextRewriteResponse } from '~/assets/models/text-rewrite';

interface RewriteViewProps {
    formality: string;
    domain: string;
}

const props = defineProps<RewriteViewProps>();

// composables
const { t } = useI18n();
const { addProgress, removeProgress } = useUseProgressIndication();
const { registerHandler, unregisterHandler, executeCommand } = useCommandBus();
const { sendError } = useUseErrorDialog();

// refs
const rewriteOptions = ref<RewriteApplyOptions>();

const lastRange = ref<Range>();
const lastText = ref<string>();

// life cycle
onMounted(() => {
    registerHandler(Cmds.RewriteTextCommand, handleCommand);
});

onUnmounted(() => {
    unregisterHandler(Cmds.RewriteTextCommand, handleCommand);
});

// listeners
watch([() => props.formality, () => props.domain], () => {
    if (!lastRange.value || !lastText.value) {
        return;
    }

    rewriteText(lastText.value, lastRange.value);
});

// functions
async function handleCommand(command: RewriteTextCommand) {
    lastRange.value = command.range;
    lastText.value = command.text;

    rewriteText(command.text, command.range);
}

async function rewriteText(text: string, range: Range) {
    const from = Math.max(0, range.from - 1);
    const to = Math.min(text.length, range.to + 1);

    const textToRewrite = text.slice(from, to);
    const context = `${text.slice(0, from)}<rewrite>${textToRewrite}</rewrite>${text.slice(to)}`;

    rewriteOptions.value = undefined;
    addProgress('rewriting', {
        icon: 'i-heroicons-pencil',
        title: t('status.rewritingText')
    });

    try {
        const body = {
            text: textToRewrite,
            context,
            formality: props.formality,
            domain: props.domain,
        };

        const response = await $fetch<TextRewriteResponse>('/api/rewrite', { body, method: 'POST' });
        rewriteOptions.value = { from, to, options: response.options };
    } catch (e: any) {
        sendError(e.message);
    } finally {
        removeProgress('rewriting');
    }
}

function applyRewrite(option: string) {
    if (!rewriteOptions.value || !lastRange.value) {
        return;
    }

    executeCommand(new ApplyTextCommand(option, lastRange.value));

    lastRange.value = undefined;
    lastText.value = undefined;
    rewriteOptions.value = undefined;
}
</script>

<template>
    <div v-if="!lastRange">
        {{ t('rewrite.noRewrite') }}
    </div>
    <div v-else>
        <div v-if="rewriteOptions && rewriteOptions.options.length > 0">
            <div v-for="option in rewriteOptions.options">
                <div v-html="option.replace(/\n/g, '<br>')"></div>
                <UButton @click="applyRewrite(option)">{{ t('rewrite.apply') }} </UButton>
            </div>
        </div>
        <div v-else>
            <USkeleton class="w-full h-[300px]" />
        </div>
    </div>
</template>
