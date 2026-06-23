---
title: "Transparent PNG Stickers with Nano Banana Pro and Gemini interactions API"
site: "Philipp Schmid"
published: "2026-01-19"
source: "https://www.philschmid.de/generate-stickers"
domain: ""
language: "en"
word_count: 2087
---

# Transparent PNG Stickers with Nano Banana Pro and Gemini interactions API

Generating images is easy. Getting clean transparent backgrounds for actual use—stickers, overlays, print-on-demand—is harder than it should be.

This guide shows how to generate production-ready transparent stickers using the Gemini Interactions API. The trick: generate on chromakey green, strip it with HSV detection.

**Workflow:**

1. Generate an image with a chromakey green (#00FF00) background using Gemini Pro 3 Image Preview (Nano Banana Pro)
2. Use HSV color space detection to accurately remove all green shades
3. Apply morphological cleanup to remove edge artifacts
4. Save as a proper transparent PNG

**Prerequisites:**

- Install dependencies: `pip install google-genai pillow scipy`
- Set your `GEMINI\_API\_KEY` environment variable

Notebook available on [GitHub](https://github.com/philschmid/gemini-samples/blob/main/examples/interactions-generate-stickers.ipynb)

## Why Chromakey Instead of ML Background Removal?

- **ML Background Removal**: Uses extra model call to remove the background. Slower and more expensive. Edge Quality can be hit or miss.
- **Chromakey + HSV**: Uses a chromakey green background. Faster, cheaper, and more predictable. Excellent Edge Quality with white outline.

When you control generation, prompting for a specific background color beats running another model. Faster, cheaper, and more predictable.

## Setup

First, let's install the required dependencies and set up the Gemini client.

Python

```python
# Install dependencies (uncomment if needed)
# !pip install google-genai pillow scipy
 
import io
import base64
import colorsys
from google import genai
from PIL import Image, ImageFilter, ImageMorph
import numpy as np
 
# Initialize the Gemini client
client = genai.Client()
 
# Model for image generation
MODEL\_ID = "gemini-3-pro-image-preview"
```

## Helper Functions

We'll create helper functions using HSV color space for more robust green screen detection that catches all shades of green.

Python

```python
def decode\_image(base64\_data: str) -\> Image.Image:
    """Decode base64 image data to PIL Image."""
    image\_bytes = base64.b64decode(base64\_data)
    return Image.open(io.BytesIO(image\_bytes))
 
 
def rgb\_to\_hsv\_array(rgb\_array: np.ndarray) -\> np.ndarray:
    """Convert RGB array to HSV array efficiently."""
    # Normalize RGB to 0-1 range
    rgb\_normalized = rgb\_array.astype(np.float32) / 255.0
 
    r, g, b = rgb\_normalized[:, :, 0], rgb\_normalized[:, :, 1], rgb\_normalized[:, :, 2]
 
    max\_c = np.maximum(np.maximum(r, g), b)
    min\_c = np.minimum(np.minimum(r, g), b)
    delta = max\_c - min\_c
 
    # Hue calculation
    h = np.zeros\_like(max\_c)
 
    # When max == r
    mask\_r = (max\_c == r) & (delta != 0)
    h[mask\_r] = (60 * ((g[mask\_r] - b[mask\_r]) / delta[mask\_r]) + 360) % 360
 
    # When max == g
    mask\_g = (max\_c == g) & (delta != 0)
    h[mask\_g] = (60 * ((b[mask\_g] - r[mask\_g]) / delta[mask\_g]) + 120)
 
    # When max == b
    mask\_b = (max\_c == b) & (delta != 0)
    h[mask\_b] = (60 * ((r[mask\_b] - g[mask\_b]) / delta[mask\_b]) + 240)
 
    # Saturation calculation
    s = np.zeros\_like(max\_c)
    s[max\_c != 0] = delta[max\_c != 0] / max\_c[max\_c != 0]
 
    # Value is just max
    v = max\_c
 
    return np.stack([h, s * 100, v * 100], axis=-1)
 
 
def remove\_green\_screen\_hsv(
    image: Image.Image,
    hue\_center: float = 120,
    hue\_range: float = 25,
    min\_saturation: float = 75,
    min\_value: float = 70,
    dilation\_iterations: int = 2,
    erosion\_iterations: int = 0
) -\> Image.Image:
    """
    Remove green screen using HSV color space for better detection.
 
    HSV is much better for detecting color ranges because it separates
    hue (color) from saturation (intensity) and value (brightness).
    """
    # Convert to RGBA if not already
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
 
    # Convert to numpy array
    data = np.array(image)
    rgb = data[:, :, :3]
 
    # Convert to HSV
    hsv = rgb\_to\_hsv\_array(rgb)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
 
    # Calculate hue distance (accounting for circular nature of hue)
    hue\_diff = np.abs(h - hue\_center)
    hue\_diff = np.minimum(hue\_diff, 360 - hue\_diff)
 
    # Create mask for green pixels
    # Green if: hue is in range AND saturation is high enough AND value is high enough
    green\_mask = (
        (hue\_diff \< hue\_range) &
        (s \> min\_saturation) &
        (v \> min\_value)
    )
 
    # Apply morphological cleanup to remove edge artifacts
    if dilation\_iterations \> 0 or erosion\_iterations \> 0:
        from scipy import ndimage
 
        # Dilate the mask to catch anti-aliased edge pixels
        if dilation\_iterations \> 0:
            green\_mask = ndimage.binary\_dilation(green\_mask, iterations=dilation\_iterations)
 
        # Optionally erode back (removes isolated noise)
        if erosion\_iterations \> 0:
            green\_mask = ndimage.binary\_erosion(green\_mask, iterations=erosion\_iterations)
 
    # Make green pixels transparent
    alpha = data[:, :, 3].copy()
    alpha[green\_mask] = 0
    data[:, :, 3] = alpha
 
    return Image.fromarray(data)
 
 
def remove\_green\_screen\_aggressive(
    image: Image.Image,
    green\_threshold: float = 1.2,
    edge\_pixels: int = 0  # Set to 0 to avoid eating into white outline
) -\> Image.Image:
    """
    Aggressive green removal that detects any pixel where green dominates.
 
    This catches even darker or lighter greens, shadows with green tint, etc.
    """
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
 
    data = np.array(image)
    r, g, b = data[:, :, 0].astype(float), data[:, :, 1].astype(float), data[:, :, 2].astype(float)
 
    # A pixel is "green" if green channel significantly exceeds red and blue
    # This catches all shades of green including shadows
    rb\_max = np.maximum(r, b) + 1  # +1 to avoid division by zero
    green\_ratio = g / rb\_max
 
    # Also check that green is the dominant channel
    green\_dominant = (g \> r) & (g \> b)
 
    # Combined mask
    green\_mask = (green\_ratio \> green\_threshold) & green\_dominant
 
    # Expand mask to catch edge pixels
    if edge\_pixels \> 0:
        from scipy import ndimage
        green\_mask = ndimage.binary\_dilation(green\_mask, iterations=edge\_pixels)
 
    # Apply transparency
    alpha = data[:, :, 3].copy()
    alpha[green\_mask] = 0
    data[:, :, 3] = alpha
 
    return Image.fromarray(data)
 
 
def cleanup\_edges(image: Image.Image, threshold: int = 128) -\> Image.Image:
    """
    Clean up semi-transparent edge pixels by making them fully transparent or opaque.
 
    This removes the "halo" effect from anti-aliased edges.
    """
    if image.mode != 'RGBA':
        return image
 
    data = np.array(image)
    alpha = data[:, :, 3]
 
    # Make semi-transparent pixels either fully transparent or fully opaque
    alpha[alpha \< threshold] = 0
    alpha[alpha \>= threshold] = 255
 
    data[:, :, 3] = alpha
    return Image.fromarray(data)
 
 
def save\_transparent\_png(image: Image.Image, filename: str):
    """Save image as PNG with transparency preserved."""
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    image.save(filename, 'PNG')
    print(f"✅ Saved: {filename}")
```

## Generate a Sticker with Chromakey Green Screen

The key is to instruct Gemini to generate the image with a chromakey green background. We use specific prompts to ensure clean edges and no green spill.

Python

```python
def load\_image\_as\_content(image\_path: str) -\> dict:
    """
    Load an image from a file path and return it as a content block for the API.
    """
    import os
    import mimetypes
    
    # Determine mime type from file extension
    mime\_type, \_ = mimetypes.guess\_type(image\_path)
    if mime\_type is None:
        # Default to JPEG if unknown
        mime\_type = "image/jpeg"
    
    # Read and base64 encode the image
    with open(image\_path, "rb") as f:
        image\_data = base64.b64encode(f.read()).decode("utf-8")
    
    return {
        "type": "image",
        "data": image\_data,
        "mime\_type": mime\_type
    }
 
 
def generate\_sticker(
    prompt: str, 
    aspect\_ratio: str = "1:1",
    image\_size: str = "2K",
    input\_images: list[str] | None = None
) -\> Image.Image:
    """
    Generate a sticker-style image with chromakey green background.
    """
    # Optimized prompt for chromakey extraction
    enhanced\_prompt = f"""Create a sticker illustration of: {prompt}
 
CRITICAL CHROMAKEY REQUIREMENTS:
1. BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex color #00FF00 (RGB 0, 255, 0). 
   The entire background must be this single pure green color with NO variation, NO gradients, NO shadows, NO lighting effects.
 
2. WHITE OUTLINE: The subject MUST have a clean white outline/border (2-3 pixels wide) separating it from the green background.
   This white border prevents color bleeding between the subject and background.
 
3. NO GREEN ON SUBJECT: The subject itself should NOT contain any green colors to avoid confusion with the chromakey.
   If the subject needs green (like leaves), use a distinctly different shade like dark forest green or teal.
 
4. SHARP EDGES: The subject should have crisp, sharp, well-defined edges - no soft or blurry boundaries.
 
5. CENTERED: Subject should be centered with padding around all sides.
 
6. STYLE: Vibrant, clean, cartoon/illustration sticker style with bold colors.
 
This is for chromakey extraction - the green background will be removed programmatically."""
 
    print(f"🎨 Generating sticker: {prompt}")
    print(f"   Resolution: {image\_size}")
    
    # Build the input content
    # When input\_images are provided, create a list with image content blocks followed by text
    if input\_images:
        print(f"   Input images: {len(input\_images)} image(s)")
        input\_content = []
        for img\_path in input\_images:
            print(f"   - Loading: {img\_path}")
            input\_content.append(load\_image\_as\_content(img\_path))
        # Add the text prompt as the final content block
        input\_content.append({"type": "text", "text": enhanced\_prompt})
    else:
        # No input images, just use the text prompt directly
        input\_content = enhanced\_prompt
 
    # Call Gemini Interactions API
    interaction = client.interactions.create(
        model=MODEL\_ID,
        input=input\_content,
        generation\_config={
            "image\_config": {
                "aspect\_ratio": aspect\_ratio,
                "image\_size": image\_size  # Use higher res for better edges
            }
        }
    )
 
    # Extract the generated image
    for output in interaction.outputs:
        if output.type == "image":
            print(f"✅ Image generated (mime\_type: {output.mime\_type})")
            return decode\_image(output.data)
 
    raise ValueError("No image was generated")
```

## Create a Sticker End-to-End

Let's put it all together: generate, remove green screen with HSV detection, apply aggressive cleanup, and save.

Python

```python
def create\_sticker(
    prompt: str, 
    output\_filename: str,
    aspect\_ratio: str = "1:1",
    image\_size: str = "2K",
    save\_raw: bool = False,
    input\_images: list[str] | None = None
) -\> Image.Image:
    """
    Complete workflow to create a transparent sticker.
 
    Uses a multi-pass approach:
    1. Generate with optimized chromakey prompt
    2. HSV-based green removal (catches color range)
    3. Aggressive green removal (catches remaining green tints)
    4. Edge cleanup to remove halos
    """
    import os
 
    # Step 1: Generate image with green screen
    raw\_image = generate\_sticker(prompt, aspect\_ratio, image\_size, input\_images)
 
    # Optionally save raw image for debugging
    if save\_raw:
        raw\_filename = output\_filename.replace('.png', '\_raw.png')
        raw\_image.save(raw\_filename)
        print(f"📸 Raw image saved: {raw\_filename}")
 
    # Step 2: HSV-based green removal
    print("🔧 Pass 1: HSV-based green removal...")
    transparent\_image = remove\_green\_screen\_hsv(
        raw\_image,
        hue\_center=120,       # Pure green hue
        hue\_range=25,         # Tight range around pure green
        min\_saturation=75,    # Only highly saturated greens (preserves logo greens)
        min\_value=70,         # Only bright greens
        dilation\_iterations=2,  # Catch anti-aliased edge pixels
        erosion\_iterations=0
    )
 
    # Step 3: Skip aggressive removal (disabled - causes speckles in subject)
    # transparent\_image = remove\_green\_screen\_aggressive(...)
 
    # Step 4: Clean up any semi-transparent edge artifacts
    print("✨ Cleaning up edges...")
    transparent\_image = cleanup\_edges(transparent\_image, threshold=64)
 
    # Step 5: Save as PNG
    save\_transparent\_png(transparent\_image, output\_filename)
 
    return transparent\_image
```

## Generate Stickers

Let's generate some example stickers!

Python

```python
prompt = "a cute happy cat with big eyes"
 
sticker1 = create\_sticker(
    prompt=prompt,
    output\_filename="../assets/cat.png",
    image\_size="2K",
    save\_raw=True
)
```

| Raw (Green Screen) | Processed (Transparent) |
| --- | --- |
| ![raw](https://www.philschmid.de/static/blog/generate-stickers/cat\_raw.png) | ![processed](https://www.philschmid.de/static/blog/generate-stickers/cat.png) |

Python

```python
prompt = "Developer wearing a Google DeepMind hoodie looking like me, use the attached images of me and the new Google DeepMind logo."
input\_images = ["../assets/headshot.png", "../assets/logo.png"]
 
sticker1 = create\_sticker(
    prompt=prompt,
    input\_images=input\_images,
    output\_filename="../assets/developer.png",
    image\_size="2K",
    save\_raw=True
)
```

| Raw (Green Screen) | Processed (Transparent) |
| --- | --- |
| ![raw](https://www.philschmid.de/static/blog/generate-stickers/developer\_raw.png) | ![processed](https://www.philschmid.de/static/blog/generate-stickers/developer.png) |

### Prompt Engineering Tips

- Always specify "sticker-style" or "illustration"
- Request "clear defined edges" for easier cutout
- Specify the background color explicitly
- Ask for the subject to be "centered with padding"
- Works best with subjects that don't contain green

## Using Your Stickers

The generated PNG files have proper alpha channels and can be used in:

- Design software (Figma, Photoshop, etc.)
- Presentation tools
- Chat applications
- Print-on-demand services
- Mobile apps

---

Thanks for reading! If you have any questions or feedback, please let me know on [Twitter](https://twitter.com/\_philschmid) or [LinkedIn](https://www.linkedin.com/in/philipp-schmid-a6a2bb196/).
