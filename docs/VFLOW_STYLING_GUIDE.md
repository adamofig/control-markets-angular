# Styling Custom Nodes in ngx-vflow

When creating custom nodes for `ngx-vflow`, it's important to understand the rendering context to avoid cross-browser styling issues, particularly with layering content like text over images.

## The Problem: Inconsistent Stacking with `position` and `z-index`

The `ngx-vflow` library renders custom Angular components inside an SVG `<foreignObject>` element. This powerful feature allows us to use standard HTML and CSS to define our nodes. However, the CSS stacking context (controlled by `position` and `z-index`) can behave unpredictably inside `<foreignObject>`, especially in browsers like Safari.

In our case, we initially tried two common methods to overlay text on an image:

1.  **`position: absolute`:** We made the parent container `position: relative` and the child text `span` `position: absolute`. While this works in many web contexts, it caused the text to be misplaced in Safari when rendered inside the SVG node, often sending it to the corner of the node or the entire canvas.
2.  **CSS Grid Layering:** We attempted to place both the `<img>` and `<span>` in the same grid cell (`grid-area: 1 / 1`). While this can work, controlling the stacking order with `z-index` still requires a `position` context (`relative`, `absolute`, etc.), which brought back the original inconsistency.

These approaches failed because the browser's rendering engine for SVG and HTML within `<foreignObject>` handles CSS positioning differently than a standard HTML document flow.

## The Solution: Embrace Flexbox and Avoid Absolute Positioning

The most reliable and cross-browser compatible solution is to avoid `position: absolute` and `position: relative` altogether. Instead, we can leverage Flexbox for all our layout needs.

**The recommended strategy is:**

1.  **Set the image as a background:** Instead of using an `<img>` element in your HTML, set the image as the `background-image` of the main container `div`.
2.  **Control the background:** Use `background-size: cover` and `background-position: center` to ensure the image fills the container without distortion.
3.  **Structure with Flexbox:** Use `display: flex` on the main container and child elements to control the layout. For vertical layouts, use `flex-direction: column`. For horizontal layouts, use `flex-direction: row`.
4.  **Use Wrapper Divs:** Wrap elements in `div`s to group them and apply flexbox properties to the wrappers. This allows for more complex layouts, such as having a header and a footer.

This approach works because it doesn't rely on a fragile stacking context. The layout is entirely controlled by flexbox, which is a much more stable and predictable layout model.

### Example Implementation:

**HTML (`test-node.html`)**
```html
<!-- The img tag is removed -->
<div class="custom-node" [style.background-image]="'url(' + data.imageUrl + ')'">
  <div class="header">
    <button>X</button>
  </div>

  <div class="spinner-container">
    <!-- Spinner component here -->
  </div>

  <div class="footer">
    <p>Node ID: 123</p>
    <span>Status</span>
  </div>

  <handle type="source" position="right" />
  <handle type="target" position="left" />
</div>
```

**CSS (`test-node.css`)**
```css
.custom-node {
    width: 120px;
    height: 160px;
    border-radius: 10%;
    overflow: hidden;
    background-size: cover;
    background-position: center;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
  }

  .header {
    display: flex;
    justify-content: flex-end;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
```

By following this pattern for future custom nodes, you can ensure they render consistently across all browsers without unexpected positioning bugs.