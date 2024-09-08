# 144p Video Converter

This project is a web-based video converter that allows users to convert videos to 144p resolution using client-side processing with FFmpeg.js.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- FFmpeg.js

## Development Environment

This project was developed using Cursor IDE with assistance from Claude Sonnet 3.5, an AI language model.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/144p-video-converter.git
   cd 144p-video-converter
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/page.tsx`: Main component for the video converter interface
- `app/components/ui/select.tsx`: Custom Select component
- `app/components/ui/button.tsx`: Custom Button component
- `app/globals.css`: Global styles
- `app/layout.tsx`: Root layout component

## Features

- Upload video files
- Select output resolution (144p, 240p, 360p, 480p)
- Choose output format (MP4, WebM, AVI)
- Client-side video processing using FFmpeg.js
- Progress bar for conversion status
- Download converted video

## Deployment

### GitHub

1. Create a new repository on GitHub.
2. Initialize git in your local project folder (if not already done):
   ```
   git init
   ```
3. Add your files and commit:
   ```
   git add .
   git commit -m "Initial commit"
   ```
4. Add the remote repository and push:
   ```
   git remote add origin https://github.com/your-username/144p-video-converter.git
   git push -u origin main
   ```

### Vercel

1. Sign up for a Vercel account at https://vercel.com if you haven't already.
2. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```
3. Run the following command in your project directory:
   ```
   vercel
   ```
4. Follow the prompts to link your project to Vercel.
5. Your project will be deployed, and Vercel will provide you with a URL.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
