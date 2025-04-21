export default class StyleUtils {
  static rollbackScreen() {
    window.scrollTo({
      top: 0,
      left: 0,
    })
    document.body.style.overflow = 'hidden'
    document.body.style.transform = ''
    document.body.style.transformOrigin = ''

    const layout = document.getElementById('layout')
    if (layout) {
      layout.scrollTo({
        top: 0,
        left: 0,
      })
    }
  }

  static isVisibleVirtualKeyboard() {
    // 초기 높이
    const initialHeight = window.screen.height

    // 현재 뷰포트 높이
    const currentHeight = window.innerHeight

    // 키보드가 올라와서 뷰포트가 작아졌다면, 일반적으로 높이가 줄어듭니다.
    return currentHeight < initialHeight
  }

  static initScrollEvent() {
    const initScroll = () => {
      if (!this.isVisibleVirtualKeyboard()) {
        rollbackScreen()
      }
    }

    const event = (e) => {
      initScroll()
    }

    window.addEventListener('scroll', event)

    const layout = document.getElementById('layout')
    if (layout) {
      layout.addEventListener('scroll', event)
    }
  }
}
