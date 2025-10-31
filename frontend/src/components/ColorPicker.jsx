import './ColorPicker.css'

const colors = [
  '#1e1e1e', '#999999', '#e671f8', '#b72fed',
  '#3e88ff', '#40c4ff', '#ff9800', '#ff6e00',
  '#00c48d', '#4caf50', '#ff6b9d', '#ff3d3d'
]

function ColorPicker({ color, setColor, strokeWidth, setStrokeWidth }) {
  return (
    <div className="color-picker">
      <div className="color-grid">
        {colors.map((c) => (
          <button
            key={c}
            className={`color-button ${color === c ? 'active' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      
      <div className="stroke-slider">
        <input
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="size-buttons">
        <button className="size-btn">S</button>
        <button className="size-btn">M</button>
        <button className="size-btn">L</button>
        <button className="size-btn">XL</button>
      </div>
    </div>
  )
}

export default ColorPicker
