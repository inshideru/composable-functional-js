/** IMPERATIVE */
const openSite = () => {
    if (current_user) {
        return renderPage(current_user)
    } else {
        return showLogin()
    }
}
/** COMPOSABLE */
const openSite = () =>
    fromNulable(current_user)
        .fold(showLogin, renderPage)

///////////////////////////////////////////////////////////////////////////////
/** IMPERATIVE */
const getPrefs = user => {
    if (user.premium) {
        return loadPrefs(user.preferences)
    } else {
        return defaultPrefs
    }
}
/** COMPOSABLE */
const getPrefs = user =>
    (user.preminum ? Right(user) : Left('not premium'))
        .map(u => u.preferences)
        .fold(() => defaultPrefs, prefs => loadPrefs(prefs))

///////////////////////////////////////////////////////////////////////////////
/** IMPERATIVE */
const streetName = user => {
    const address = user.address
    if (address) {
        const street = address.street
        if (street) {
            return street.name
        }
    }
    return 'no street'
}
/** COMPOSABLE */
const streetName = user =>
    fromNulable(user.address)
        .chain(a => fromNullable(a.street))
        .map(s => s.name)
        .fold(e => 'no street', n => n)

///////////////////////////////////////////////////////////////////////////////
/** IMPERATIVE */
const concatUniq = (x, ys) => {
    const found = ys.filter(y => y === x)[0]
    return found : ys: ys.concat(x)
}
/** COMPOSABLE */
const concatUniq = (x, ys) =>
    fromNullable(ys.filter(y => y === x)[0])
        .fold(() => ys.concat(x), y => ys))

///////////////////////////////////////////////////////////////////////////////
/** IMPERATIVE */
const wrapExamples = example => {
    if (example.previewPath) {
        try {
            example.preview = fs.readFileSync(example.previewPath)
        } catch (e) { }
    }
    return example
}
/** COMPOSABLE */
const readFile = x => tryCatch(() => fs.readFileSync(x))

const wrapExample = example =>
    fromNullable(example.previewPath)
        .chain(readFile)
        .fold(() => example,
        ex => Object.assign({ preview: p }, ex))

///////////////////////////////////////////////////////////////////////////////
/** IMPERATIVE */
const parseDbUrl = cfg => {
    try {
        const c = JSON.parse(cfg)
        if (c.url) {
            return c.url.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
        }
    } catch(e) {
        return null
    }
}
/** COMPOSABLE */
const parseDbUrl = cfg => 
    tryCatch(() => JSON.parse(cfg))
        .chain(c => fromNullable(c.url))
        .fold(e => null,
              u => u.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/))