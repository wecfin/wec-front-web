window.GapTranses = window.GapTranses || {};
window.GapLocaleKey = window.GapLocaleKey || 'zh-cn';
window.GapNewTransKeys = window.GapNewTransKeys || {};

// todo
// const cacheKey = '@wec-transes';

export const submitTrans = async (core) => {
    const transKeys = Object.keys(window.GapNewTransKeys);
    if (transKeys.length == 0) {
        return;
    }

    const fd = new window.FormData();
    fd.append('group', core.getCurrentAppCode());
    transKeys.forEach(item => fd.append('transKeys[]', item));
    await core.call(
        core.getMainAppCode(),
        'submitTransKeyByGroup',
        fd
    );
    window.GapNewTransKeys = {};
};

export const loadTrans = async (core)  => {
    /*
     * todo
    const cachedTranses = JSON.parse(window.sessionStorage.getItem(cacheKey));
    if (cachedTranses) {
        window.GapTranses = cachedTranses;
        return;
    }
    */

    const localeKey = core.setting.localeKey;
    const transes = await core.post(
        core.getMainAppCode(),
        'listTransByGroup',
        {
            group: core.getCurrentAppCode(),
            localeKey: localeKey
        }
    );
    // todo
    // window.sessionStorage.setItem(cacheKey, JSON.stringify(transes));
    Object.assign(window.GapTranses, transes);
    window.GapLocaleKey = localeKey;
};

export const trans = (inStr, ...params) => {
    const keys = params.map((item, index) => `%${index + 1}$s`);
    keys.unshift(inStr);

    const str = keys.join('-');
    const res = window.GapTranses[str] || {};
    const pattern = res[window.GapLocaleKey];
    if (!pattern) {
        window.GapNewTransKeys[str] = 1;
        return `:${str}`;
    }
    return pattern.replace(
        /%([1-9]+)\$s/g,
        (match, item) => params[item - 1]
    );
};
