/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['blog.letskuk.com.br', 'firebasestorage.googleapis.com']
  }
}

module.exports = nextConfig
