export declare namespace func {
    type Func<TReturn, TArg> = (arg: TArg) => TReturn;
    type Predicate<TArg> = Func<boolean, TArg>;
    type Producer<TReturn> = () => TReturn;
    type Consumer<TArg> = (arg: TArg) => void;
    type Constructor<TType> = new (...args: any[]) => TType;
}
