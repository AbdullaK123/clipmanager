export function cx(classes: Array<string | undefined | null | false>) {
    return classes.filter(Boolean).join(' ')
}

export function getStyle(path: string, styles: any): string {
    return path.split('.').reduce((obj, key) => obj?.[key], styles) || '';
}