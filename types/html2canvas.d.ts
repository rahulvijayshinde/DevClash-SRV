declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    width?: number;
    height?: number;
    backgroundColor?: string;
    x?: number;
    y?: number;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
    [key: string]: any;
  }

  interface Canvas extends HTMLCanvasElement {
    toDataURL(type?: string, quality?: any): string;
  }

  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<Canvas>;
  
  export default html2canvas;
} 