export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'de',
    messages: {
        en: {
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
