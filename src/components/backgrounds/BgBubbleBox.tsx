import "./BgBubbleBox.css"

const BgMoveLines = () => {
    return (
        <div
            viewBox="0 0 1820 1080"
            style={{
                position: "absolute",
                height: "100vh",
                aspectRatio: "1820/1080",
                zIndex: "-1",
                enableBackground: "new 0 0 1820 1080",
            }}
            className="bg-bubble-box area"
        >
            <ul className="max-lg:hidden lg:flex circles">
                {/* 1 */}
                <li></li>
                {/* 2 */}
                <li></li>
                {/* 3 */}
                <li></li>
                {/* 4 */}
                <li></li>
                {/* 5 */}
                <li></li>
                {/* 6 */}
                <li></li>
                {/* 7 */}
                <li></li>
                {/* 8 */}
                <li></li>
                {/* 9 */}
                <li></li>
                {/* 10 */}
                <li></li>
                {/* 11 */}
                <li></li>
            </ul>
        </div>
    )
}
export default BgMoveLines
