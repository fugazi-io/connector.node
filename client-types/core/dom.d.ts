/// <reference path="types.d.ts" />
declare module fugazi.dom {
    var CREATE_INNER_HTML_KEY: string;
    enum InsertPosition {
        Before = 0,
        After = 1,
        Prepend = 2,
        Append = 3,
    }
    function get(query: string, context?: Element): Element;
    function getAll(query: string, context?: Element): HTMLElement[];
    function ready(callback: fugazi.Callback): void;
    function hasClass(element: HTMLElement, className: string): boolean;
    function addClass(elements: string, className: string): void;
    function addClass(elements: HTMLElement, className: string): void;
    function addClass(elements: HTMLElement[], className: string): void;
    function addClass(elements: string, className: string[]): void;
    function addClass(elements: HTMLElement, className: string[]): void;
    function addClass(elements: HTMLElement[], className: string[]): void;
    function removeClass(elements: string, className: string): void;
    function removeClass(elements: HTMLElement, className: string): void;
    function removeClass(elements: HTMLElement[], className: string): void;
    function create(tagName: string, properites?: Object, referenceElement?: any, position?: InsertPosition): Element;
    function remove(element: HTMLElement): void;
    function insert(newElement: HTMLElement, referenceElement?: any, position?: InsertPosition): HTMLElement;
    function insertBefore(newElement: any, referenceElement: any): HTMLElement;
    function insertAfter(newElement: any, referenceElement: any): HTMLElement;
    function prepend(newElement: any, parentElement: HTMLElement): HTMLElement;
    function append(newElement: any, parentElement: HTMLElement): HTMLElement;
    function children(element: HTMLElement, selector?: string): HTMLElement[];
    function firstChild(element: HTMLElement, selector?: string): HTMLElement;
    function lastChild(element: HTMLElement, selector?: string): HTMLElement;
    function parent(element: HTMLElement, selector?: string): HTMLElement;
    function style(element: HTMLElement, values: any): void;
}
