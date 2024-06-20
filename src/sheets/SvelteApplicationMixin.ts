export function SvelteApplicationMixin(BaseApplication: any) {
    
    class SvelteApplication extends BaseApplication {
        async _renderHTML(context, options) {
            console.log(context, options);
        }

        _replaceHTML(result, content, options) {
            console.log(result, content, options);
        }
    }

    return SvelteApplication;
}