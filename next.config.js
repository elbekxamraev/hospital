/** @type {import('next').NextConfig} */
 
module.exports = { 
  publicRuntimeConfig: {
    host : process.env.HOSTNAME,
  port: process.env.PORT,
   sah: `${process.env.PROTOCOLTYPE}://${process.env.HOSTNAME}:${process.env.PORT}`
  },
  images: {
    domains: [`${process.env.HOSTNAME}`],
    writeToCacheDir: false }
  } 

