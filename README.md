# HPGrind Frontend

This is the frontend application for HPGrind, a platform for improving your results on the Swedish Scholastic Aptitude Test (Högskoleprovet).

## Adding Videos to the Landing Page

The landing page features autoplay, looping videos without controls. To add videos:

1. Place your MP4 video files in the `public/videos/` directory with the following names:
   - `intro.mp4` - Main introduction video for the hero section
   - `feature1.mp4` - Video showcasing the personalized training plan
   - `feature2.mp4` - Video showcasing detailed feedback
   - `feature3.mp4` - Video showcasing realistic test simulations
   - `testimonial.mp4` - User testimonial video

2. Add poster images (thumbnails) for the videos in the `public/images/` directory with the following names:
   - `intro-poster.jpg` - Poster for the main intro video
   - `feature1-poster.jpg` - Poster for feature 1 video
   - `feature2-poster.jpg` - Poster for feature 2 video
   - `feature3-poster.jpg` - Poster for feature 3 video
   - `testimonial-poster.jpg` - Poster for testimonial video

### Video Specifications

For optimal performance, use the following specifications:

- Format: MP4 (H.264 codec)
- Resolution: 1280x720 (720p) or 1920x1080 (1080p)
- Aspect ratio: 16:9
- Bitrate: 2-5 Mbps for 720p, 5-8 Mbps for 1080p
- Audio: AAC, 128-256 Kbps (note: videos are muted by default for autoplay)
- File size: Keep videos under 10MB each for optimal loading times
- Duration: Short, looping videos (15-30 seconds) work best

**Important**: All videos are set to autoplay, loop, and are muted by default to comply with browser autoplay policies. They do not have playback controls to maintain a clean, non-interactive design.

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Running the Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

### Building for Production

```bash
# Build the application
npm run build
# or
yarn build
```

The built files will be in the `dist` directory. 