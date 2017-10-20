/**
 * i18n Support
 */
'use strict';
const app = require('electron').remote.app;

const languages = {
    'en': require('../i18n/en').content,
    'cn': require('../i18n/cn').content
};

module.exports = {
    languages: languages,

    lang_list: (() => {
        let list = [];
        for (let k in languages) {
            if (languages.hasOwnProperty(k)) {
                list.push({
                    key: k,
                    name: languages[k]._lang_name
                })
            }
        }
        return list;
    })(),

    getLang: (lang) => {
        if (lang) {
            lang = lang.toLowerCase();
            if (lang === 'cn' || lang === 'zh-CN' || lang === 'zh') {
                lang = 'cn';
            } else {
                lang = 'en';
            }
            return languages[lang] || languages['en'];
        } else {
            let local = (app.getLocale() || '').split('-')[0].toLowerCase();
            if (local && local === 'zh') {
                return languages['cn'];
            } else {
                return languages['en'];
            }
        }
    },

    fill: (tpl, ...vals) => {
        vals.map((v, idx) => {
            let r = new RegExp('\\$\\{' + idx + '\\}', 'g');
            tpl = tpl.replace(r, v)
        });
        return tpl;
    }
};