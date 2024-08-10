export default class StyleUtils {
    static rollbackScreen() {
        window.scrollTo({
            top: 0
        })
        document.body.style.overflow = 'hidden'
        document.body.style.transform = ''
        document.body.style.transformOrigin = ''
    }
}
