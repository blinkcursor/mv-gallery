# Minimum Viable Gallery

With growing adoption of srcset & sizes for responsive images we can let the browser do the work of choosing optimum image sources for both the gallery thumbnails and the full size image viewed in a modal lightbox.

Demo: [blinkcursor.github.io/mv-gallery/](http://blinkcursor.github.io/mv-gallery/)

A single definition for each `<img>` is all that we need for our thumbnails and full-sized images including fallback for if/when JavaScript fails:

```html
<a href="img/sample1-1400.jpg">
	<img src="img/sample1-400.jpg" 
		 srcset="img/sample1-400.jpg 400w, img/sample1-600.jpg 600w, img/sample1-800.jpg 800w, img/sample1-1000.jpg 1000w, img/sample1-1200.jpg 1200w, img/sample1-1400.jpg 1400w, sample1-1800.jpg 1800w, sample1-2400.jpg 2400w" 
		 sizes="(max-width: 399px) 100%, (max-width: 599px) 50%, (max-width: 799px) 33.33%, 200px" alt="sample image">
</a>
```
The `sizes` definition is for our thumbnails. When the user clicks on a thumbnail we launch a modal lightbox and populate it with a clone of the thumbnail but we dynamically update `sizes` to that required for the modal and let the browser select the most appropriate image source.

For our baseline, `sizes` for our full-width modal would be `100vw`, but we can be smarter than that.

We use `max-height: 100%` and `max-width: 100%` so that our full sized images are constrained to fit on the screen. But for any image whose aspect ratio is smaller than the screen aspect ratio the full-size image doesn't occupy the full width of the screen. Portrait images on a typical laptop landscape screen, for example, might occupy as little as 50% of the available width according to `sizes`, so even though we are using srcset and sizes to load images no bigger than necessary the browser may still choose an image source twice as large as required.

When cloning our thumbnail image we can set `sizes` accordingly based upon the source image aspect ratio.

Safari (OSX and iOS) is a problem. It has a bug whereby although the `sizes` *attribute* is present on HTML `<img>` elements, the `sizes` *property* is missing and any attempt to dynamically update `sizes` is ignored. As a workaround for Safari we parse `srcset` ourselves to find the appropriate size and set the image `src` instead.

### To use

Source code is in mvgallery.js
It depends upon a crude touch detect library to be able to swipe between images
And srcset parser library by...

In /dist these are bundled together into mvgallery-bundle.min.js

Include this just before your closing `</body>` tag, and instantiate with `mvGallery.init('*selector*')` 