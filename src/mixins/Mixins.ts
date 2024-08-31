// TODO: Make this typesafe and have it forward any mixed-in members.
export class Mixins {
  static combineMixins(Base: any, ...mixins: any[]) {
    return mixins.reduce((acc, mixin) => mixin(acc), Base);
  }
}
