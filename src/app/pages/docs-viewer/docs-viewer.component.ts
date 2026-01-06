import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, UrlSegment } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-docs-viewer',
  standalone: true,
  imports: [CommonModule, MarkdownComponent, IonicModule, RouterModule],
  templateUrl: './docs-viewer.component.html',
  styleUrls: ['./docs-viewer.component.scss']
})
export class DocsViewerComponent implements OnInit {
  markdownPath = '/assets/docs/index.md';
  backHref = '/';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.url.subscribe((url: UrlSegment[]) => {
      // Reconstruct path from URL segments
      const path = url.map(segment => segment.path).join('/');

      // Calculate backHref: 
      // If we are at the documentation root or index, back goes to app root
      // Otherwise, back goes to the documentation main page
      if (url.length === 0 || (url.length === 1 && (url[0].path === 'index' || url[0].path === 'index.md'))) {
        this.backHref = '/';
      } else {
        this.backHref = '/docs';
      }

      if (path && path !== 'index' && path !== 'index.md') {
        // Ensure we don't double the extension
        const cleanPath = path.endsWith('.md') ? path : `${path}.md`;
        this.markdownPath = `/assets/docs/${cleanPath}`;
      } else {
        this.markdownPath = '/assets/docs/index.md';
      }
      console.log('Loading markdown from:', this.markdownPath, 'Back href:', this.backHref);
    });
  }

  handleMarkdownClick(event: MouseEvent) {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');

      if (!href) return;

      // Type 1: Internal anchor links (headers within the same document)
      if (href.startsWith('#')) {
        event.preventDefault();
        // Just update the fragment in the URL
        this.router.navigate([], {
          relativeTo: this.route,
          fragment: href.substring(1),
          replaceUrl: true
        });
        return;
      }

      // Type 2: Relative documentation links
      // Only handle internal links that don't start with http, mailto, etc.
      if (!href.includes(':')) {
        event.preventDefault();

        // Use URL constructor to resolve relative paths like ../ or subfolders
        // We use a dummy base because we only care about the resulting path
        let currentPath = this.router.url.split('#')[0];
        // If current path doesn't end in .md and doesn't end in /, it's a directory route like /docs or /docs/how-to
        // We need the trailing slash so relative links resolve correctly under this path
        if (!currentPath.endsWith('.md') && !currentPath.endsWith('/')) {
          currentPath += '/';
        }

        const base = new URL(currentPath, 'http://dummy.com');
        const resolved = new URL(href, base);

        let targetPath = resolved.pathname;

        // If it points to a .md file directly relative to /assets/docs, map it to /docs
        if (targetPath.startsWith('/assets/docs/')) {
          targetPath = targetPath.replace('/assets/docs/', '/docs/');
        }

        // Navigate including potential fragment
        this.router.navigateByUrl(targetPath + resolved.hash);
      }
    }
  }
}
