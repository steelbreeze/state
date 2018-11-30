export declare namespace func {
    type Func<TReturn, TArg1> = (arg1: TArg1) => TReturn;
    type Predicate<TArg> = Func<boolean, TArg>;
    type Producer<TReturn> = () => TReturn;
    type Consumer<TArg> = (arg: TArg) => void;
    type Constructor<TType> = new (...args: any[]) => TType;
}
