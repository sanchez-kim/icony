import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons-react',
      'phosphor-react',
      '@heroicons/react',
      'react-bootstrap-icons',
      '@radix-ui/react-icons',
    ],
  },
};

export default nextConfig;
