declare module '*.svg' {
    const content: string; // For default URL import
    export default content;
  
    export const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  }
  
  declare module "*.png" {
    const value: string;
    export default value;
  }