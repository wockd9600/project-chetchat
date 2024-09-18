<template>
    <div ref="colorPicker" class="color-picker"></div>
</template>

<script>
// https://www.npmjs.com/package/@simonwep/pickr

// One of the following themes
// import '@simonwep/pickr/dist/themes/classic.min.css'; // 'classic' theme
// import '@simonwep/pickr/dist/themes/monolith.min.css'; // 'monolith' theme
import '@simonwep/pickr/dist/themes/nano.min.css'; // 'nano' theme

// Modern or es5 bundle (pay attention to the note below!)
// import Pickr from '@simonwep/pickr';
import Pickr from '@simonwep/pickr/dist/pickr.es5.min';

export default {
    name: 'ColorPicker',
    props: {
        color: {
            type: String,
            default: '#fff',
        },
    },

    mounted() {
        const pickr = Pickr.create({
            el: '.color-picker',
            theme: 'nano', // or 'monolith', or 'nano'

            padding: 0,
            swatches: false,
            default: `${this.color}`,

            components: {
                // Main components
                preview: true,
                opacity: false,
                hue: true,

                // Input / output Options
                interaction: {
                    hex: false,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: false,
                    cancel: true,
                    save: true,
                },
            },

            // Translations, these are the default values.
            i18n: {
                // Strings visible in the UI
                'ui:dialog': 'color picker dialog',
                'btn:toggle': 'toggle color picker dialog',
                'btn:swatch': 'color swatch',
                'btn:last-color': 'use previous color',
                'btn:save': '저장',
                'btn:cancel': '취소',
                'btn:clear': 'Clear',

                // Strings used for aria-labels
                'aria:btn:save': 'save and close',
                'aria:btn:cancel': 'cancel and close',
                'aria:btn:clear': 'clear and close',
                'aria:input': 'color input field',
                'aria:palette': 'color selection area',
                'aria:hue': 'hue selection slider',
                'aria:opacity': 'selection slider',
            },
        });

        pickr .on('init', (instance) => {
                console.log('Event: "init"', instance);
            })
            // .on('hide', (instance) => {
            //     console.log('Event: "hide"', instance);
            // })
            .on('show', (color, instance) => {
                console.log('Event: "show"', color, instance);
            })
            .on('save', (color, instance) => {
                console.log('Event: "save"', color, instance);
            })
            // .on('clear', (instance) => {
            //     console.log('Event: "clear"', instance);
            // })
            .on('change', (color, source, instance) => {
                console.log('Event: "change"', color, source, instance);
            })
            // .on('changestop', (source, instance) => {
            //     console.log('Event: "changestop"', source, instance);
            // })
            .on('cancel', (instance) => {
                console.log('Event: "cancel"', instance);
            });
        // .on('swatchselect', (color, instance) => {
        //     console.log('Event: "swatchselect"', color, instance);
        // });
    },
    methods: {
    },
};
</script>

<style scoped></style>
