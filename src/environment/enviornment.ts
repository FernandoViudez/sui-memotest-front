export const environment = {
    sui: {
        fullNode: process.env.NEXT_PUBLIC_SUI_RPC || 'http://localhost:9000'
    },
    memotest: {
        package: process.env.NEXT_PUBLIC_MEMOTEST_PACKAGE_ID || '',
        config: process.env.NEXT_PUBLIC_MEMOTEST_CONFIG_ID || '',
    },
    socketHost: process.env.NEXT_PUBLIC_SOCKET_HOST || 'http://localhost:80'
}
Object.freeze(environment);