export namespace func {
	export type Func<TReturn, TArg1> = (arg1: TArg1) => TReturn;

	export type Predicate<TArg> = Func<boolean, TArg>;

	export type Producer<TReturn> = () => TReturn;

	export type Consumer<TArg> = (arg: TArg) => void;

	export type Constructor<TType> = new(...args: any[]) => TType;
}