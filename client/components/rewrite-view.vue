<script lang="ts" setup>
import type { Range } from '@tiptap/vue-3';
import type { Status } from '~/assets/models/status';
import type { RewriteApplyOptions, TextRewriteResponse } from '~/assets/models/text-rewrite';

// definitions
interface RewriteViewProps {
    range?: Range;
    text?: string;
}

// input
const props = defineProps<RewriteViewProps>();

// output
const emit = defineEmits<{
    rewriteApplied: [option: string]
}>();

// composables
const { t } = useI18n();
const { addProgress, removeProgress } = useUseProgressIndication();

// refs
const rewriteOptions = ref<RewriteApplyOptions>();
const error = ref<Error | null>(null);
const status = ref<Status>('idle');

const formality = ref<string>(t('rewrite.formality.neutral'));
const domain = ref<string>(t('rewrite.domain.general'));

// listeners
watch(() => props.range, () => {
    if (!props.range || !props.text) {
        return;
    }

    const from = props.range.from;
    const to = props.range.to;

    return rewriteText(props.text, from, to);
}, { immediate: true });

watch(formality, () => {
    if (!props.range || !props.text) {
        return;
    }

    rewriteText(props.text, props.range.from, props.range.to);
});

watch(domain, () => {
    if (!props.range || !props.text) {
        return;
    }

    rewriteText(props.text, props.range.from, props.range.to);
});

// functions
async function rewriteText(text: string, from: number, to: number) {

    from = Math.max(0, from - 1);

    const textToRewrite = text.slice(from, to);
    const context = `${text.slice(0, from)}<rewrite>${textToRewrite}</rewrite>${text.slice(to)}`;

    rewriteOptions.value = undefined;
    addProgress('rewriting', {
        icon: 'i-heroicons-pencil',
        title: t('status.rewritingText')
    });
    error.value = null;
    try {
        const body = {
            text: textToRewrite,
            context,
            formality: formality.value,
            domain: domain.value,
        };

        const response = await $fetch<TextRewriteResponse>('/api/rewrite', { body, method: 'POST' });
        rewriteOptions.value = { from, to, options: response.options };
    } catch (e) {
        error.value = e as Error;
    } finally {
        removeProgress('rewriting');
    }
}

function applyRewrite(option: string) {
    if (!rewriteOptions.value) {
        return;
    }

    emit('rewriteApplied', option);
    rewriteOptions.value = undefined;
}
</script>

<template>
    <UAlert v-if="error" color="red" variant="solid" title="Error" :description="error.message" />
    <UIcon v-if="status === 'pending'" name="i-heroicons-arrow-path" class="animate-spin" />

    <UCard v-if="rewriteOptions && rewriteOptions.options.length > 0">
        <div class="grid grid-cols-2">
            <span>{{ t('rewrite.formalityLabel') }}</span>
            <SelectMenuLocalized v-model="formality" :options="['neutral', 'formal', 'informal']"
                local-parent="rewrite.formality" />

            <span>{{ t('rewrite.domainLabel') }}</span>
            <SelectMenuLocalized v-model="domain" :options="['general', 'report', 'email', 'socialMedia', 'technical']"
                local-parent="rewrite.domain" />
        </div>

        <div v-for="option in rewriteOptions.options">
            <div v-html="option.replace(/\n/g, '<br>')"></div>
            <UButton @click="applyRewrite(option)">{{ t('rewrite.apply') }} </UButton>
        </div>
    </UCard>
</template>
