import rewrites from './rewrites.mjs';
console.log(rewrites, 'rewrites==');
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return rewrites;
  },
};

export default nextConfig;
