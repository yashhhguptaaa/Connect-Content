import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig();

export const API = publicRuntimeConfig.API
export const APP_NAME = publicRuntimeConfig.APP_NAME
export const PRODUCTION = publicRuntimeConfig.PRODUCTION
export const DOMAIN = publicRuntimeConfig.DOMAIN
export const FB_APP_ID = publicRuntimeConfig.API
