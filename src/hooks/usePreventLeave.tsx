export default () => {
    // 사용자의 페이지 이탈을 막음.
    const listener = (event: any) => {
        event.preventDefault()
        event.returnValue = ""
    }
    // 페이지 이탈 방지 활성화
    const enablePrevent = () => {
        window.addEventListener("beforeunload", listener)
    }
    // 이탈 방지 불활성화
    const disablePrevent = () => {
        window.removeEventListener("beforeunload", listener)
    }
    return { enablePrevent, disablePrevent }
}
