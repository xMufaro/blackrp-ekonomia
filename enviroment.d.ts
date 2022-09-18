declare global {
    namespace NodeJS {
        interface ProcessENV {
            CLIENT_TOKEN: string;
            GUILD_ID: string;
            enviroment: "dev" | "prod" | "debug";
        }
    }
}

export {};