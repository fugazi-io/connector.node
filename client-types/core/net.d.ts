declare module fugazi.net {
    enum HttpMethod {
        Delete = 0,
        Get = 1,
        Head = 2,
        Post = 3,
        Put = 4,
    }
    function httpMethodToString(method: HttpMethod): string;
    function stringToHttpMethod(str: string): HttpMethod;
    class QueryString extends collections.Map<string> {
        constructor(str: string);
        toString(): string;
    }
    class Url implements URLUtils {
        private url;
        constructor(url: URL);
        constructor(path: string, base?: string | Url | URL);
        readonly hash: string;
        readonly search: string;
        readonly pathname: string;
        readonly port: string;
        readonly hostname: string;
        readonly host: string;
        readonly password: string;
        readonly username: string;
        readonly protocol: string;
        readonly origin: string;
        readonly href: string;
        readonly params: QueryString;
        hasParam(name: string): boolean;
        getParam(name: string): string;
        addParam(name: string, value: any, encode?: boolean): void;
        setHash(hash: string): void;
        removeParam(name: string): string;
        clone(): Url;
        toString(): string;
        private createNewURL(params);
    }
    enum Status {
        None = 0,
        Success = 1,
        NotModified = 2,
        Timeout = 3,
        Error = 4,
    }
    interface ContentType {
    }
    interface FormContentTypeEnum {
        Multipart: ContentType;
        UrlEncoded: ContentType;
    }
    interface ContentTypeEnum {
        Text: ContentType;
        Json: ContentType;
        Form: FormContentTypeEnum;
        None: ContentType;
        fromString: (contentType: string) => ContentType;
    }
    var ContentTypes: ContentTypeEnum;
    interface RequestProperties {
        url: string | Url | URL;
        method?: HttpMethod;
        contentType?: ContentType;
        timeout?: number;
        cors?: boolean;
        headers?: collections.Map<string> | fugazi.PlainObject<string>;
    }
    interface HttpBase {
        getXHR(): XMLHttpRequest;
        getStatus(): Status;
        getStatusCode(): number;
        getHttpStatus(): number;
        getHttpStatusText(): string;
    }
    type ResponseHandler = (response: HttpResponse) => void;
    type RequestData = string | fugazi.PlainObject<any> | collections.Map<any>;
    interface HttpRequest extends HttpBase {
        getContentType(): ContentType;
        getMethod(): HttpMethod;
        getUrl(): Url;
        getUrlString(): string;
        setHeader(key: string, value: string): void;
        send(data?: RequestData): void;
        success(fn: ResponseHandler): HttpRequest;
        fail(fn: ResponseHandler): HttpRequest;
        complete(fn: ResponseHandler): HttpRequest;
    }
    interface HttpResponse extends HttpBase {
        isContentType(contentType: string): boolean;
        getContentType(): string;
        getData(): string;
        guessData(): any;
        getDataAsJson(): any;
        getDataAsJson<T>(): T;
        getDataAsMap(): collections.Map<any>;
        getDataAsMap<T>(): collections.Map<T>;
    }
    function http(properties: RequestProperties): HttpRequest;
    function get(properties: RequestProperties): HttpRequest;
    function post(properties: RequestProperties): HttpRequest;
}
