declare namespace fugazi.components.auth {
    type AuthenticationMethod = "none" | "basic" | "oauth2" | "custom";
    namespace descriptor {
        interface OAuth2Descriptor {
            clientId?: string;
            clientSecret?: string;
        }
    }
}
