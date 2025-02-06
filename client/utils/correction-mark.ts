import { Mark, mergeAttributes } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

type CorrectionMarkOptions = {
    onClick: (event: MouseEvent, node: ProseMirrorNode) => void,
    active: boolean,
}

export const CorrectionMark = Mark.create<CorrectionMarkOptions>({
    name: 'correction',

    addOptions() {
        return {
            onClick: () => { },
            active: false,
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
        const classNames = this.options.active ? 'correction active' : 'correction';

        console.log('classNames', classNames);

        return ['span', mergeAttributes({ class: classNames }, HTMLAttributes), 0]
    },

    addAttributes() {
        return {
            'data-block-id': {
                default: null,
                parseHTML: (element) => element.getAttribute('data-block-id'),
                renderHTML: (attributes) => {
                    if (!attributes['data-block-id']) {
                        return {};
                    }
                    return { 'data-block-id': attributes['data-block-id'] };
                },
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
                            this.options.onClick(event, node);
                            this.options.active = true;
                            return true
                        }

                        this.options.active = false;

                        return false
                    },
                },
            }),
        ]
    },
})
