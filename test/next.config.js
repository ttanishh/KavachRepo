/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  serverExternalPackages: [
    'socket.io',
    'socket.io-client',
    'twilio',
    'nodemailer',
  ],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['node_modules/**'],
    },
  },
}

module.exports = nextConfig
