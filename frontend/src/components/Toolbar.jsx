import "./Toolbar.css";

function Toolbar({ tool, setTool }) {
    const tools = [
        {
            id: "select",
            title: "Select",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7 18 3-8 8-3z"/></svg>',
        },
        {
            id: "hand",
            title: "Hand",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 11V6a1 1 0 0 1 2 0v5m0 0V4a1 1 0 0 1 2 0v7m0 0V5a1 1 0 0 1 2 0v9"/></svg>',
        },
        {
            id: "pen",
            title: "Draw",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>',
        },
        {
            id: "eraser",
            title: "Eraser",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20H7L3 16l7-7 10 10zM10 9l7 7"/></svg>',
        },
        {
            id: "arrow",
            title: "Arrow",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>',
        },
        {
            id: "text",
            title: "Text",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>',
        },
        {
            id: "note",
            title: "Note",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>',
        },
        {
            id: "image",
            title: "Image",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
        },
        {
            id: "frame",
            title: "Frame",
            svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
        },
    ];

    return (
        <>
            <div className="toolbar-top">
                <button
                    className="tool-action"
                    dangerouslySetInnerHTML={{
                        __html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l6-3 6 3m-12 4l6-3 6 3m-12 4l6-3 6 3"/></svg>',
                    }}
                />
                <button
                    className="tool-action"
                    dangerouslySetInnerHTML={{
                        __html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 7l6 3-6 3m0 4l6-3 6 3"/></svg>',
                    }}
                />
                <button
                    className="tool-action"
                    dangerouslySetInnerHTML={{
                        __html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
                    }}
                />
                <button
                    className="tool-action"
                    dangerouslySetInnerHTML={{
                        __html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4v10M8 4v10"/></svg>',
                    }}
                />
                <button className="tool-action">
                    <span>⋮</span>
                </button>
            </div>

            <div className="toolbar">
                {tools.map((t) => (
                    <button
                        key={t.id}
                        className={`tool-button ${
                            tool === t.id ? "active" : ""
                        }`}
                        onClick={() => setTool(t.id)}
                        title={t.title}
                        dangerouslySetInnerHTML={{ __html: t.svg }}
                    />
                ))}
                <button className="tool-button">
                    <span>∧</span>
                </button>
            </div>
        </>
    );
}

export default Toolbar;
