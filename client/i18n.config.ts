import { Title } from "#components";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'de',
    messages: {
        en: {
            status: {
                rewritingText: 'Rewriting text...',
                correctingText: 'Correcting text...',
                ready: 'Ready',
            },
            problems: {
                title: 'Problems',
                noProblems: 'No problems found',
            },
            editor: {
                rewrite: 'Rewrite',
            },
            rewrite: {
                formality: {
                    neutral: 'Neutral',
                    formal: 'Formal',
                    informal: 'Informal'
                },
                domain: {
                    general: 'General',
                    report: 'Report',
                    email: 'Email',
                    socialMedia: 'Social Media',
                    technical: 'Technical'
                },
                formalityLabel: 'Formality',
                domainLabel: 'Domain',
                apply: 'Apply'
            },
        },

        de: {
            status: {
                rewritingText: 'Text wird umgeschrieben...',
                correctingText: 'Text wird korrigiert...',
                ready: 'Bereit',
            },
            problems: {
                title: 'Probleme',
                noProblems: 'Keine Probleme gefunden',
            },
            editor: {
                rewrite: 'Umschreiben',
            },
            rewrite: {
                formality: {
                    neutral: 'Neutral',
                    formal: 'Formal',
                    informal: 'Informal'
                },
                domain: {
                    general: 'Allgemein',
                    report: 'Bericht',
                    email: 'E-Mail',
                    socialMedia: 'Soziale Medien',
                    technical: 'Technisch'
                },
                formalityLabel: 'Formalität',
                domainLabel: 'Domäne',
                apply: 'Anwenden'
            }
        }
    }

}))
