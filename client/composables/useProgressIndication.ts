export type EditoreProgress = {
    icon: string;
    title: string;
}

const activeProgresDict = ref<Record<string, EditoreProgress>>({});

export const useUseProgressIndication = () => {
    return {
        addProgress,
        removeProgress,
        activeProgress: activeProgresDict
    }
}

const addProgress = (key: string, progress: EditoreProgress) => {
    activeProgresDict.value[key] = progress;

    return () => {
        removeProgress(key);
    }
}

const removeProgress = (key: string) => {
    delete activeProgresDict.value[key];
}
