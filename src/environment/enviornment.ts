export const environment = {
    sui: {
        fullNode: process.env.NEXT_PUBLIC_SUI_RPC || 'http://localhost:9000'
    },
    socketHost: process.env.NEXT_PUBLIC_SOCKET_HOST || 'http://localhost:80'
}
Object.freeze(environment);