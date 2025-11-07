import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

const sourceImage = join(publicDir, 'icon_rosa_original.png')

const sizes = [
  { name: 'favicon.ico', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-icon.png', size: 180 },
]

async function generateIcons() {
  console.log('🎨 Generating PWA icons from icon_rosa_original.png...\n')

  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name)

    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outputPath)

      console.log(`✅ Generated ${name} (${size}x${size})`)
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message)
    }
  }

  console.log('\n✨ All icons generated successfully!')
}

generateIcons().catch(console.error)
