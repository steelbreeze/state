export namespace func {
	export type Func<TReturn, TArg> = (arg: TArg) => TReturn;

	export type Predicate<TArg> = Func<boolean, TArg>;

	export type Producer<TReturn> = () => TReturn;

	export type Consumer<TArg> = (arg: TArg) => void;

	export type Constructor<TType> = new(...args: any[]) => TType;
}