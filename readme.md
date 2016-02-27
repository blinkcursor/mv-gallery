# Minimum Viable Gallery

With growing adoption of srcset & sizes for responsive images we can let the browser do the work of choosing optimum image sources for both the gallery thumbnails and the full size images with just a single `<img>` definition. We just need a little JavaScript to update the `sizes` attribute when the layout changes for our lightbox view.

Demo: [blinkcursor.github.io/mv-gallery/](http://blinkcursor.github.io/mv-gallery/)


```html
<a href="img/nojs-fallback.jpg">
	<img src="img/unsupported-fallback.jpg" 
		 srcset="img/smallest.jpg 400w, img/smallish.jpg 600w, img/small.jpg 800w, img/medium.jpg 1000w, img/biggish.jpg 1200w, img/big.jpg 1400w, bigger.jpg 1800w, biggest.jpg 2400w" 
		 sizes="(max-width: 399px) 100%, (max-width: 599px) 50%, (max-width: 799px) 33.33%, 200px" alt="sample image">
</a>
```
The `sizes` definition is for our gallery (thumbnails) view. When the user clicks on a thumbnail we launch a modal lightbox and populate it with a *clone* of the thumbnail, but before inserting it into the DOM we dynamically update `sizes` to the value appropriate for the modal and let the browser select the best image source.

For our baseline, `sizes` for a full-width modal would be `100vw`, but we can be smarter than that.

The modal uses `max-height: 100%` and `max-width: 100%` to constrain our full-sized images to fit on the screen. 

But any image whose aspect ratio is smaller than the screen aspect ratio won't occupy the full width of the screen, and `sizes: 100vw` will overstate how much width the image will occupy.

Think portrait images on a laptop screen, which might occupy 50% or less of the available width according to `sizes`, and which results in the browser selecting a much larger image than required.

#### The problem with portraits
![Portrait image in a landscape view](https://github.com/blinkcursor/mv-gallery/blob/gh-pages/img/portraits.jpg)

When cloning our thumbnail image we know its aspect ratio which gives us a chance to compute a more relevant `sizes` value by comparing it to the screen aspect ratio.

Safari (OSX and iOS) is a problem. It has a bug whereby the `sizes` *attribute* is present on `<img>` elements, but the `sizes` *property* is missing and any attempt to dynamically update `sizes` is ignored. As a workaround for Safari we parse `srcset` ourselves to find the appropriate size and set the `src` on a new image instead.

### To use

The are no markup requirements for your gallery. Just wrap some `<img>`'s in a container and pass the query selector for your container to `mvGallery.init(selector)`.

The source code is in [src/js/mvgallery.js](src/js/mvgallery.js).

It has two dependencies.

1. [src/js/plugins/swipe-detect.js](src/js/plugins/swipe-detect.js) is a crude touch event handler written specifically for mv-gallery to add swiping between images. IRL you might want to use a dedicated touch handling library like [hammer.js](http://hammerjs.github.io) and modify mvgallery.js accordingly.
2. [parse-srcset by Alex Bell](https://github.com/albell/parse-srcset) for the Safari bug workaround.

In [/dist](/dist) these are bundled with mvgallery into `mvgallery-bundle.min.js`, while `mvgallery.min.css` has the minimal styling required for the modal lightbox. (How you style your gallery is up to you.)

Link to `mvgallery.min.css` in your document `<head>` and include `mvgallery-bundle.min.js` just before your closing `</body>` tag, then instantiate with `mvGallery.init('selector')`.

### What's missing
Nothing fancy here. In production this would benefit from some nice transitions when navigating between images, and use of the History API to allow linking directly to individual images when shared etc.

### The demo
As well as concatenating and minifying the source files, the `gulpfile` includes a task to automatically generate all of the different image sizes from source images found in the `src/img` directory. The example should be self-explanatory.