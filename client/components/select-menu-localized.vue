<script lang="ts" setup>

interface SelectMenuLocalizedProps {
    options: string[];
    localParent?: string;
}

const props = withDefaults(defineProps<SelectMenuLocalizedProps>(), {
    localParent: '',
});

const modelValue = defineModel<string>('modelValue', { required: true });

const { t } = useI18n();
</script>

<template>
    <USelectMenu v-model="modelValue" :options="props.options">
        <template #option="{ option }">
            {{ t(`${props.localParent}.${option}`) }}
        </template>
    </USelectMenu>
</template>
