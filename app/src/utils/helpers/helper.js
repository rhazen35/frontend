export function debounce (fn, delay) {
    let timeoutId = null

    return function () {
        clearTimeout(timeoutId)
        const args = arguments
        const that = this
        timeoutId = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
}