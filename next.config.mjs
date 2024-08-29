/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["kr.cafe24obs.com"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: false, // RootLayout 2번 실행되므로 false
}

export default nextConfig
