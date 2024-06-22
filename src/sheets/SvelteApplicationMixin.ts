export function SvelteApplicationMixin<TContext>(BaseApplication: any) {
    
    class SvelteApplication extends BaseApplication {
        async _renderHTML(context: TContext, options) {
            console.log(context, options);
        }

        _replaceHTML(result, content, options) {
            console.log(result, content, options);
        }
    }

    return SvelteApplication;
}