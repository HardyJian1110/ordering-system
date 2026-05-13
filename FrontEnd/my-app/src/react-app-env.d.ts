/// <reference types="react-scripts" />
declare module "mockjs";
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
declare module "*.mp3" {
  const src: string;
  export default src;
}
