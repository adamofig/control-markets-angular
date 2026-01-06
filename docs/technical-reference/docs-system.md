# Documentation System Technical Guide

This document explains how the documentation system is implemented in the Control Markets project. It is intended for developers and AI agents who need to extend or maintain the documentation features.

## Architecture Overview

The documentation system is a custom-built solution that renders Markdown files directly from the repository using Angular and Ionic. It consists of three main parts:
1. **Asset Configuration**: Mapping the `docs/` directory to the application's assets.
2. **Routing**: A wildcard route that captures any path under `/docs`.
3. **DocsViewer Component**: A component that fetches and renders Markdown, handling internal navigation and link resolution.

---

## 1. Asset Configuration (`angular.json`)

To make Markdown files available to the browser, the `docs/` folder at the root of the project is mapped to the `assets/docs` path in the build output.

```json
{
  "projects": {
    "control-markets-angular": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "docs",
                "output": "assets/docs"
              }
            ]
          }
        }
      }
    }
  }
}
```

This ensures that a file at `docs/tutorials/guide.md` is accessible at `http://domain.com/assets/docs/tutorials/guide.md`.

---

## 2. Routing (`app.routes.ts`)

We use a wildcard route to handle all sub-paths under `/docs`. This allows for a deeply nested documentation structure without needing to update Angular routes for every new file.

```typescript
{
  path: 'docs',
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/docs-viewer/docs-viewer.component').then(m => m.DocsViewerComponent),
    },
    {
      path: '**',
      loadComponent: () => import('./pages/docs-viewer/docs-viewer.component').then(m => m.DocsViewerComponent),
    }
  ]
}
```

---

## 3. The `DocsViewerComponent`

The [DocsViewerComponent](file:///Users/adamo/Documents/GitHub/control-markets-angular/src/app/pages/docs-viewer/docs-viewer.component.ts) handles both rendering and navigation.

### Path Resolution (`ngOnInit`)
When the component initializes, it reconstructs the file path from the URL segments.
- If the URL is `/docs/concepts/architecture`, it looks for `/assets/docs/concepts/architecture.md`.
- It defaults to `index.md` if no sub-path is provided.

### Enhanced Navigation (`handleMarkdownClick`)
Standard Markdown links often fail in Single Page Applications (SPAs). The component overrides anchor click behavior to:

1.  **Support Fragments**: Links like `[Section](#section)` use `router.navigate` with the `fragment` option to scroll without a full page reload.
2.  **Relative Path Resolution**: It uses the `URL` constructor with a dummy base to resolve relative paths like `../other-page.md`.
3.  **Directory Awareness**: It ensures paths correctly treat folders as directories (by adding a trailing slash during resolution) so relative links don't break.
4.  **Asset Remapping**: If a link explicitly points to `/assets/docs/...`, it is remapped to the cleaner `/docs/...` route.

### Back Navigation
The back button logic is dynamic:
- If you are on a documentation sub-page, it takes you to `/docs` (the main index).
- If you are at the `/docs` index, it takes you to the app root (`/`).

---

## 4. Extending the Documentation

To add new content:
1.  Create a `.md` file in the `docs/` directory or any subdirectory.
2.  Add a link to your new file in [docs/index.md](file:///Users/adamo/Documents/GitHub/control-markets-angular/docs/index.md).
3.  Use **relative paths** for links (e.g., `[My Guide](../tutorials/my-guide.md)`) to leverage the component's path resolution.

### Mermaid Diagrams
Mermaid diagrams are supported. Just use a triple-backtick block with the `mermaid` language:

    ```mermaid
    graph TD
      A[Markdown File] --> B[DocsViewerComponent]
      B --> C[ngx-markdown]
      C --> D[Rendered HTML]
    ```

---

## Technical Stack
- **ngx-markdown**: For core Markdown to HTML conversion.
- **Ionic/Angular**: For the UI and routing.
- **Mermaid.js**: For rendering diagrams.
