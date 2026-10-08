import { test } from '@playwright/test';

function getOriginalClass(instance: object, methodName: string): string {
    let proto = Object.getPrototypeOf(instance);
    while (proto && !Object.prototype.hasOwnProperty.call(proto, methodName)) {
        proto = Object.getPrototypeOf(proto);
    }
    return (proto ?? Object.getPrototypeOf(instance)).constructor.name;
}

function extractFunctionParamNames(fn: (...args: any[]) => unknown): {
    paramNames: string[];
    defaultValues: Record<string, string>;
} {
    const source = fn.toString();
    const start = source.indexOf('(');
    const paramNames: string[] = [];
    const defaultValues: Record<string, string> = {};
    if (start === -1) return { paramNames, defaultValues };

    let depth = 0;
    let current = '';
    const parts: string[] = [];
    for (let i = start + 1; i < source.length; i++) {
        const char = source[i];
        if (depth === 0 && char === ')') break;
        if ('([{'.includes(char)) depth++;
        if (')]}'.includes(char)) depth--;
        if (char === ',' && depth === 0) {
            parts.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) parts.push(current);

    for (const part of parts) {
        const [rawName, ...rest] = part.split('=');
        const paramName = rawName.replace(/^\s*\.\.\./, '').trim();
        paramNames.push(paramName);
        if (rest.length) defaultValues[paramName] = rest.join('=').trim();
    }
    return { paramNames, defaultValues };
}

// Replaces `{paramName}` placeholders with argument values, falling back to default values.
function replacePlaceholders(
    template: string,
    args: unknown[],
    paramNames: string[],
    defaultValues: Record<string, string>,
): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => {
        const index = paramNames.indexOf(key);
        if (index === -1) return match;
        const value = args[index];
        if (value !== undefined) return typeof value === 'string' ? value : JSON.stringify(value);
        return defaultValues[key] ?? match;
    });
}

export function step<T>(_stepName?: string) {
    return function (target: (...args: any[]) => Promise<T>, context: ClassMethodDecoratorContext) {
        return function (this: any, ...args: any[]): Promise<T> {
            const isStatic = typeof this === 'function';
            const className = isStatic ? this.name : getOriginalClass(this, context.name.toString());
            const methodDetails = `${className}.${context.name.toString()}`;

            const { paramNames, defaultValues } = extractFunctionParamNames(target);

            const name = _stepName
                ? `${replacePlaceholders(_stepName, args, paramNames, defaultValues)} - ${methodDetails}`
                : methodDetails;

            const error = new Error('Capturing stack trace');
            const stackLines = error.stack?.split('\n') || [];
            const stack = stackLines.find(line => line.includes('.ts:') && !line.includes('step.ts'));
            const filePath = stack?.match(/tests\/(.+)/);
            const finalPath = filePath ? `.../${filePath[1]}` : null;

            const stepNameWithStack = `${name} — ${finalPath}`;

            return test.step(stepNameWithStack, async () => {
                return await target.call(this, ...args) as T;
            });
        };
    };
}