import "./TopBar.css";

function TopBar() {
    return (
        <div className="topbar">
            <div className="topbar-left">
                <div className="logo">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect
                            width="20"
                            height="20"
                            rx="4"
                            fill="currentColor"
                        />
                    </svg>
                    <span>Draw Agent</span>
                </div>
                <button className="menu-button">⋮</button>
            </div>
            <div className="topbar-center">
                <button className="zoom-button">100%</button>
                <button className="nav-button">›</button>
            </div>
        </div>
    );
}

export default TopBar;
