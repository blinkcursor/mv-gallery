# Minimum Viable Gallery

With growing adoption of srcset & sizes for responsive images we can let the browser do the work of choosing optimum image sources for both the gallery thumbnails and the full size image viewed in a modal lightbox.

A single definition for each `<img>` is all that we need for our thumbnails and full-sized images including fallback for if/when JavaScript fails:

```html
<a href="img/sample1-1400.jpg">
	<img src="img/sample1-400.jpg" srcset="img/sample1-400.jpg 400w, img/sample1-600.jpg 600w, img/sample1-800.jpg 800w, img/sample1-1000.jpg 1000w, img/sample1-1200.jpg 1200w, img/sample1-1400.jpg 1400w, sample1-1800.jpg 1800w, sample1-2400.jpg 2400w" sizes="(min-width: 800px) 200px, 300px" alt="sample image">
</a>
```
