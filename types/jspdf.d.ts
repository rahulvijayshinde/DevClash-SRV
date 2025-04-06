declare module 'jspdf' {
  class jsPDF {
    constructor(orientation?: 'p'|'portrait'|'l'|'landscape', unit?: string, format?: string|[number, number]);
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    };
    setFontSize(size: number): this;
    setFont(fontName: string, fontStyle?: string): this;
    text(text: string | string[], x: number, y: number, options?: any): this;
    splitTextToSize(text: string, maxLength: number): string[];
    addPage(): this;
    addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): this;
    save(filename?: string): void;
  }
  
  export default jsPDF;
} 