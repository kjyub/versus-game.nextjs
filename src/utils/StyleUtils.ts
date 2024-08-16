export default class StyleUtils {
    static rollbackScreen() {
        window.scrollTo({
            top: 0,
            left: 0
        })
        document.body.style.overflow = 'hidden'
        document.body.style.transform = ''
        document.body.style.transformOrigin = ''

        const layout = document.getElementById("layout")
        if (layout) {
            layout.scrollTo({
                top: 0,
                left: 0
            })
        }
    }

    static initScrollEvent() {
        window.addEventListener("scroll", (e) => {
            window.scrollTo({
                top: 0,
                left: 0
            })
        })

        const layout = document.getElementById("layout")
        if (layout) {
            layout.addEventListener("scroll", (e) => {
                layout.scrollTo({
                    top: 0,
                    left: 0
                })
            })
        }
    }
}
