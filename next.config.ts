import type { NextConfig } from 'next'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const isUserPage = repoName.endsWith('.github.io')
const basePath =
  isGithubPages && repoName && !isUserPage ? `/${repoName}` : undefined

const nextConfig: NextConfig = isGithubPages
  ? {
      output: 'export',
      trailingSlash: true,
      images: {
        unoptimized: true,
      },
      basePath,
      assetPrefix: basePath,
    }
  : {}

export default nextConfig
