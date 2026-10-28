import type { NextConfig } from 'next';
import { networkInterfaces } from 'node:os';

// Let phones on the same Wi-Fi use the dev server (live reload, fonts) at this Mac's LAN address.
// Read at startup, so it follows the address when the network changes. Dev only.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === 'IPv4' && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: lanAddresses,
};

export default nextConfig;
