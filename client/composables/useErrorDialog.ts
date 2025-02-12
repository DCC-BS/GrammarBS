export const useUseErrorDialog = () => {
    return { sendError }
}

function sendError(error: string) {
    const toast = useToast();

    toast.add(
        {
            title: 'Error',
            description: error,
            color: 'red',
            icon: 'i-heroicons-exclamation-circle',
        }
    )
}
