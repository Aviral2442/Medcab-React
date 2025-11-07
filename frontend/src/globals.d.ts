import 'jquery'

declare global {
  interface Window {
    $: JQueryStatic
    jQuery: JQueryStatic
  }
}
