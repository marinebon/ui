// image imports resolve to URLs (Vite and most bundlers)
declare module "*.png" {
  const src: string;
  export default src;
}
