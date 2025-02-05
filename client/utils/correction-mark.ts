import { Mark, mergeAttributes } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

type CorrectionMarkOptions = {
    onClick: (event: MouseEvent, node: ProseMirrorNode) => void
}

export const CorrectionMark = Mark.create<CorrectionMarkOptions>({
    name: 'correction',

    addOptions() {
        return {
            onClick: () => { },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span.correction',
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes({ class: 'correction' }, HTMLAttributes), 0]
    },

    addAttributes() {
        return {
            'data-block-id': {
                default: null,
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleClick: (view: EditorView, pos: number, event: MouseEvent) => {
                        const { state } = view;
                        const { doc, selection } = state;
                        const range = selection.$from.blockRange(selection.$to);

                        if (!range) return false;

                        const node = doc.nodeAt(pos);

                        if (node && node.marks.find((mark: Mark) => mark.type.name === 'correction')) {
                            this.options.onClick(event, node)
                            return true
                        }

                        return false
                    },
                },
            }),
        ]
    },
})
