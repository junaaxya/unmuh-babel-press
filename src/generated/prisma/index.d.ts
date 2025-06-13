
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model ListBuku
 * 
 */
export type ListBuku = $Result.DefaultSelection<Prisma.$ListBukuPayload>
/**
 * Model Berita
 * 
 */
export type Berita = $Result.DefaultSelection<Prisma.$BeritaPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.listBuku`: Exposes CRUD operations for the **ListBuku** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ListBukus
    * const listBukus = await prisma.listBuku.findMany()
    * ```
    */
  get listBuku(): Prisma.ListBukuDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.berita`: Exposes CRUD operations for the **Berita** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Beritas
    * const beritas = await prisma.berita.findMany()
    * ```
    */
  get berita(): Prisma.BeritaDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Admin: 'Admin',
    ListBuku: 'ListBuku',
    Berita: 'Berita'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "admin" | "listBuku" | "berita"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      ListBuku: {
        payload: Prisma.$ListBukuPayload<ExtArgs>
        fields: Prisma.ListBukuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ListBukuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ListBukuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          findFirst: {
            args: Prisma.ListBukuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ListBukuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          findMany: {
            args: Prisma.ListBukuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>[]
          }
          create: {
            args: Prisma.ListBukuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          createMany: {
            args: Prisma.ListBukuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ListBukuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          update: {
            args: Prisma.ListBukuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          deleteMany: {
            args: Prisma.ListBukuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ListBukuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ListBukuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ListBukuPayload>
          }
          aggregate: {
            args: Prisma.ListBukuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateListBuku>
          }
          groupBy: {
            args: Prisma.ListBukuGroupByArgs<ExtArgs>
            result: $Utils.Optional<ListBukuGroupByOutputType>[]
          }
          count: {
            args: Prisma.ListBukuCountArgs<ExtArgs>
            result: $Utils.Optional<ListBukuCountAggregateOutputType> | number
          }
        }
      }
      Berita: {
        payload: Prisma.$BeritaPayload<ExtArgs>
        fields: Prisma.BeritaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BeritaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BeritaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          findFirst: {
            args: Prisma.BeritaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BeritaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          findMany: {
            args: Prisma.BeritaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>[]
          }
          create: {
            args: Prisma.BeritaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          createMany: {
            args: Prisma.BeritaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BeritaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          update: {
            args: Prisma.BeritaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          deleteMany: {
            args: Prisma.BeritaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BeritaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BeritaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeritaPayload>
          }
          aggregate: {
            args: Prisma.BeritaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBerita>
          }
          groupBy: {
            args: Prisma.BeritaGroupByArgs<ExtArgs>
            result: $Utils.Optional<BeritaGroupByOutputType>[]
          }
          count: {
            args: Prisma.BeritaCountArgs<ExtArgs>
            result: $Utils.Optional<BeritaCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    admin?: AdminOmit
    listBuku?: ListBukuOmit
    berita?: BeritaOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    id: number | null
  }

  export type AdminSumAggregateOutputType = {
    id: number | null
  }

  export type AdminMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    createdAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    createdAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    email: number
    password: number
    createdAt: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    id?: true
  }

  export type AdminSumAggregateInputType = {
    id?: true
  }

  export type AdminMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    createdAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: number
    email: string
    password: string
    createdAt: Date
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["admin"]>



  export type AdminSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    createdAt?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "createdAt", ExtArgs["result"]["admin"]>

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      password: string
      createdAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'Int'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly password: FieldRef<"Admin", 'String'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
  }


  /**
   * Model ListBuku
   */

  export type AggregateListBuku = {
    _count: ListBukuCountAggregateOutputType | null
    _avg: ListBukuAvgAggregateOutputType | null
    _sum: ListBukuSumAggregateOutputType | null
    _min: ListBukuMinAggregateOutputType | null
    _max: ListBukuMaxAggregateOutputType | null
  }

  export type ListBukuAvgAggregateOutputType = {
    id: number | null
    tahunTerbit: number | null
  }

  export type ListBukuSumAggregateOutputType = {
    id: number | null
    tahunTerbit: number | null
  }

  export type ListBukuMinAggregateOutputType = {
    id: number | null
    title: string | null
    penulis: string | null
    penerbit: string | null
    tahunTerbit: number | null
    kategori: string | null
    sinopsis: string | null
    coverUrl: string | null
    createdAt: Date | null
  }

  export type ListBukuMaxAggregateOutputType = {
    id: number | null
    title: string | null
    penulis: string | null
    penerbit: string | null
    tahunTerbit: number | null
    kategori: string | null
    sinopsis: string | null
    coverUrl: string | null
    createdAt: Date | null
  }

  export type ListBukuCountAggregateOutputType = {
    id: number
    title: number
    penulis: number
    penerbit: number
    tahunTerbit: number
    kategori: number
    sinopsis: number
    coverUrl: number
    createdAt: number
    _all: number
  }


  export type ListBukuAvgAggregateInputType = {
    id?: true
    tahunTerbit?: true
  }

  export type ListBukuSumAggregateInputType = {
    id?: true
    tahunTerbit?: true
  }

  export type ListBukuMinAggregateInputType = {
    id?: true
    title?: true
    penulis?: true
    penerbit?: true
    tahunTerbit?: true
    kategori?: true
    sinopsis?: true
    coverUrl?: true
    createdAt?: true
  }

  export type ListBukuMaxAggregateInputType = {
    id?: true
    title?: true
    penulis?: true
    penerbit?: true
    tahunTerbit?: true
    kategori?: true
    sinopsis?: true
    coverUrl?: true
    createdAt?: true
  }

  export type ListBukuCountAggregateInputType = {
    id?: true
    title?: true
    penulis?: true
    penerbit?: true
    tahunTerbit?: true
    kategori?: true
    sinopsis?: true
    coverUrl?: true
    createdAt?: true
    _all?: true
  }

  export type ListBukuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListBuku to aggregate.
     */
    where?: ListBukuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListBukus to fetch.
     */
    orderBy?: ListBukuOrderByWithRelationInput | ListBukuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ListBukuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListBukus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListBukus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ListBukus
    **/
    _count?: true | ListBukuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ListBukuAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ListBukuSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ListBukuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ListBukuMaxAggregateInputType
  }

  export type GetListBukuAggregateType<T extends ListBukuAggregateArgs> = {
        [P in keyof T & keyof AggregateListBuku]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateListBuku[P]>
      : GetScalarType<T[P], AggregateListBuku[P]>
  }




  export type ListBukuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ListBukuWhereInput
    orderBy?: ListBukuOrderByWithAggregationInput | ListBukuOrderByWithAggregationInput[]
    by: ListBukuScalarFieldEnum[] | ListBukuScalarFieldEnum
    having?: ListBukuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ListBukuCountAggregateInputType | true
    _avg?: ListBukuAvgAggregateInputType
    _sum?: ListBukuSumAggregateInputType
    _min?: ListBukuMinAggregateInputType
    _max?: ListBukuMaxAggregateInputType
  }

  export type ListBukuGroupByOutputType = {
    id: number
    title: string
    penulis: string
    penerbit: string
    tahunTerbit: number
    kategori: string
    sinopsis: string
    coverUrl: string | null
    createdAt: Date
    _count: ListBukuCountAggregateOutputType | null
    _avg: ListBukuAvgAggregateOutputType | null
    _sum: ListBukuSumAggregateOutputType | null
    _min: ListBukuMinAggregateOutputType | null
    _max: ListBukuMaxAggregateOutputType | null
  }

  type GetListBukuGroupByPayload<T extends ListBukuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ListBukuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ListBukuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ListBukuGroupByOutputType[P]>
            : GetScalarType<T[P], ListBukuGroupByOutputType[P]>
        }
      >
    >


  export type ListBukuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    penulis?: boolean
    penerbit?: boolean
    tahunTerbit?: boolean
    kategori?: boolean
    sinopsis?: boolean
    coverUrl?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["listBuku"]>



  export type ListBukuSelectScalar = {
    id?: boolean
    title?: boolean
    penulis?: boolean
    penerbit?: boolean
    tahunTerbit?: boolean
    kategori?: boolean
    sinopsis?: boolean
    coverUrl?: boolean
    createdAt?: boolean
  }

  export type ListBukuOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "penulis" | "penerbit" | "tahunTerbit" | "kategori" | "sinopsis" | "coverUrl" | "createdAt", ExtArgs["result"]["listBuku"]>

  export type $ListBukuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ListBuku"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      penulis: string
      penerbit: string
      tahunTerbit: number
      kategori: string
      sinopsis: string
      coverUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["listBuku"]>
    composites: {}
  }

  type ListBukuGetPayload<S extends boolean | null | undefined | ListBukuDefaultArgs> = $Result.GetResult<Prisma.$ListBukuPayload, S>

  type ListBukuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ListBukuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ListBukuCountAggregateInputType | true
    }

  export interface ListBukuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ListBuku'], meta: { name: 'ListBuku' } }
    /**
     * Find zero or one ListBuku that matches the filter.
     * @param {ListBukuFindUniqueArgs} args - Arguments to find a ListBuku
     * @example
     * // Get one ListBuku
     * const listBuku = await prisma.listBuku.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ListBukuFindUniqueArgs>(args: SelectSubset<T, ListBukuFindUniqueArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ListBuku that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ListBukuFindUniqueOrThrowArgs} args - Arguments to find a ListBuku
     * @example
     * // Get one ListBuku
     * const listBuku = await prisma.listBuku.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ListBukuFindUniqueOrThrowArgs>(args: SelectSubset<T, ListBukuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ListBuku that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuFindFirstArgs} args - Arguments to find a ListBuku
     * @example
     * // Get one ListBuku
     * const listBuku = await prisma.listBuku.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ListBukuFindFirstArgs>(args?: SelectSubset<T, ListBukuFindFirstArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ListBuku that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuFindFirstOrThrowArgs} args - Arguments to find a ListBuku
     * @example
     * // Get one ListBuku
     * const listBuku = await prisma.listBuku.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ListBukuFindFirstOrThrowArgs>(args?: SelectSubset<T, ListBukuFindFirstOrThrowArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ListBukus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ListBukus
     * const listBukus = await prisma.listBuku.findMany()
     * 
     * // Get first 10 ListBukus
     * const listBukus = await prisma.listBuku.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const listBukuWithIdOnly = await prisma.listBuku.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ListBukuFindManyArgs>(args?: SelectSubset<T, ListBukuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ListBuku.
     * @param {ListBukuCreateArgs} args - Arguments to create a ListBuku.
     * @example
     * // Create one ListBuku
     * const ListBuku = await prisma.listBuku.create({
     *   data: {
     *     // ... data to create a ListBuku
     *   }
     * })
     * 
     */
    create<T extends ListBukuCreateArgs>(args: SelectSubset<T, ListBukuCreateArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ListBukus.
     * @param {ListBukuCreateManyArgs} args - Arguments to create many ListBukus.
     * @example
     * // Create many ListBukus
     * const listBuku = await prisma.listBuku.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ListBukuCreateManyArgs>(args?: SelectSubset<T, ListBukuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ListBuku.
     * @param {ListBukuDeleteArgs} args - Arguments to delete one ListBuku.
     * @example
     * // Delete one ListBuku
     * const ListBuku = await prisma.listBuku.delete({
     *   where: {
     *     // ... filter to delete one ListBuku
     *   }
     * })
     * 
     */
    delete<T extends ListBukuDeleteArgs>(args: SelectSubset<T, ListBukuDeleteArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ListBuku.
     * @param {ListBukuUpdateArgs} args - Arguments to update one ListBuku.
     * @example
     * // Update one ListBuku
     * const listBuku = await prisma.listBuku.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ListBukuUpdateArgs>(args: SelectSubset<T, ListBukuUpdateArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ListBukus.
     * @param {ListBukuDeleteManyArgs} args - Arguments to filter ListBukus to delete.
     * @example
     * // Delete a few ListBukus
     * const { count } = await prisma.listBuku.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ListBukuDeleteManyArgs>(args?: SelectSubset<T, ListBukuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ListBukus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ListBukus
     * const listBuku = await prisma.listBuku.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ListBukuUpdateManyArgs>(args: SelectSubset<T, ListBukuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ListBuku.
     * @param {ListBukuUpsertArgs} args - Arguments to update or create a ListBuku.
     * @example
     * // Update or create a ListBuku
     * const listBuku = await prisma.listBuku.upsert({
     *   create: {
     *     // ... data to create a ListBuku
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ListBuku we want to update
     *   }
     * })
     */
    upsert<T extends ListBukuUpsertArgs>(args: SelectSubset<T, ListBukuUpsertArgs<ExtArgs>>): Prisma__ListBukuClient<$Result.GetResult<Prisma.$ListBukuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ListBukus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuCountArgs} args - Arguments to filter ListBukus to count.
     * @example
     * // Count the number of ListBukus
     * const count = await prisma.listBuku.count({
     *   where: {
     *     // ... the filter for the ListBukus we want to count
     *   }
     * })
    **/
    count<T extends ListBukuCountArgs>(
      args?: Subset<T, ListBukuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ListBukuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ListBuku.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ListBukuAggregateArgs>(args: Subset<T, ListBukuAggregateArgs>): Prisma.PrismaPromise<GetListBukuAggregateType<T>>

    /**
     * Group by ListBuku.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ListBukuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ListBukuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ListBukuGroupByArgs['orderBy'] }
        : { orderBy?: ListBukuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ListBukuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListBukuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ListBuku model
   */
  readonly fields: ListBukuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ListBuku.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ListBukuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ListBuku model
   */
  interface ListBukuFieldRefs {
    readonly id: FieldRef<"ListBuku", 'Int'>
    readonly title: FieldRef<"ListBuku", 'String'>
    readonly penulis: FieldRef<"ListBuku", 'String'>
    readonly penerbit: FieldRef<"ListBuku", 'String'>
    readonly tahunTerbit: FieldRef<"ListBuku", 'Int'>
    readonly kategori: FieldRef<"ListBuku", 'String'>
    readonly sinopsis: FieldRef<"ListBuku", 'String'>
    readonly coverUrl: FieldRef<"ListBuku", 'String'>
    readonly createdAt: FieldRef<"ListBuku", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ListBuku findUnique
   */
  export type ListBukuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter, which ListBuku to fetch.
     */
    where: ListBukuWhereUniqueInput
  }

  /**
   * ListBuku findUniqueOrThrow
   */
  export type ListBukuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter, which ListBuku to fetch.
     */
    where: ListBukuWhereUniqueInput
  }

  /**
   * ListBuku findFirst
   */
  export type ListBukuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter, which ListBuku to fetch.
     */
    where?: ListBukuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListBukus to fetch.
     */
    orderBy?: ListBukuOrderByWithRelationInput | ListBukuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListBukus.
     */
    cursor?: ListBukuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListBukus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListBukus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListBukus.
     */
    distinct?: ListBukuScalarFieldEnum | ListBukuScalarFieldEnum[]
  }

  /**
   * ListBuku findFirstOrThrow
   */
  export type ListBukuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter, which ListBuku to fetch.
     */
    where?: ListBukuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListBukus to fetch.
     */
    orderBy?: ListBukuOrderByWithRelationInput | ListBukuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ListBukus.
     */
    cursor?: ListBukuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListBukus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListBukus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ListBukus.
     */
    distinct?: ListBukuScalarFieldEnum | ListBukuScalarFieldEnum[]
  }

  /**
   * ListBuku findMany
   */
  export type ListBukuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter, which ListBukus to fetch.
     */
    where?: ListBukuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ListBukus to fetch.
     */
    orderBy?: ListBukuOrderByWithRelationInput | ListBukuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ListBukus.
     */
    cursor?: ListBukuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ListBukus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ListBukus.
     */
    skip?: number
    distinct?: ListBukuScalarFieldEnum | ListBukuScalarFieldEnum[]
  }

  /**
   * ListBuku create
   */
  export type ListBukuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * The data needed to create a ListBuku.
     */
    data: XOR<ListBukuCreateInput, ListBukuUncheckedCreateInput>
  }

  /**
   * ListBuku createMany
   */
  export type ListBukuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ListBukus.
     */
    data: ListBukuCreateManyInput | ListBukuCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ListBuku update
   */
  export type ListBukuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * The data needed to update a ListBuku.
     */
    data: XOR<ListBukuUpdateInput, ListBukuUncheckedUpdateInput>
    /**
     * Choose, which ListBuku to update.
     */
    where: ListBukuWhereUniqueInput
  }

  /**
   * ListBuku updateMany
   */
  export type ListBukuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ListBukus.
     */
    data: XOR<ListBukuUpdateManyMutationInput, ListBukuUncheckedUpdateManyInput>
    /**
     * Filter which ListBukus to update
     */
    where?: ListBukuWhereInput
    /**
     * Limit how many ListBukus to update.
     */
    limit?: number
  }

  /**
   * ListBuku upsert
   */
  export type ListBukuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * The filter to search for the ListBuku to update in case it exists.
     */
    where: ListBukuWhereUniqueInput
    /**
     * In case the ListBuku found by the `where` argument doesn't exist, create a new ListBuku with this data.
     */
    create: XOR<ListBukuCreateInput, ListBukuUncheckedCreateInput>
    /**
     * In case the ListBuku was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ListBukuUpdateInput, ListBukuUncheckedUpdateInput>
  }

  /**
   * ListBuku delete
   */
  export type ListBukuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
    /**
     * Filter which ListBuku to delete.
     */
    where: ListBukuWhereUniqueInput
  }

  /**
   * ListBuku deleteMany
   */
  export type ListBukuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ListBukus to delete
     */
    where?: ListBukuWhereInput
    /**
     * Limit how many ListBukus to delete.
     */
    limit?: number
  }

  /**
   * ListBuku without action
   */
  export type ListBukuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ListBuku
     */
    select?: ListBukuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ListBuku
     */
    omit?: ListBukuOmit<ExtArgs> | null
  }


  /**
   * Model Berita
   */

  export type AggregateBerita = {
    _count: BeritaCountAggregateOutputType | null
    _avg: BeritaAvgAggregateOutputType | null
    _sum: BeritaSumAggregateOutputType | null
    _min: BeritaMinAggregateOutputType | null
    _max: BeritaMaxAggregateOutputType | null
  }

  export type BeritaAvgAggregateOutputType = {
    id: number | null
  }

  export type BeritaSumAggregateOutputType = {
    id: number | null
  }

  export type BeritaMinAggregateOutputType = {
    id: number | null
    judul: string | null
    isi: string | null
    thumbnailUrl: string | null
    createdAt: Date | null
  }

  export type BeritaMaxAggregateOutputType = {
    id: number | null
    judul: string | null
    isi: string | null
    thumbnailUrl: string | null
    createdAt: Date | null
  }

  export type BeritaCountAggregateOutputType = {
    id: number
    judul: number
    isi: number
    thumbnailUrl: number
    createdAt: number
    _all: number
  }


  export type BeritaAvgAggregateInputType = {
    id?: true
  }

  export type BeritaSumAggregateInputType = {
    id?: true
  }

  export type BeritaMinAggregateInputType = {
    id?: true
    judul?: true
    isi?: true
    thumbnailUrl?: true
    createdAt?: true
  }

  export type BeritaMaxAggregateInputType = {
    id?: true
    judul?: true
    isi?: true
    thumbnailUrl?: true
    createdAt?: true
  }

  export type BeritaCountAggregateInputType = {
    id?: true
    judul?: true
    isi?: true
    thumbnailUrl?: true
    createdAt?: true
    _all?: true
  }

  export type BeritaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Berita to aggregate.
     */
    where?: BeritaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beritas to fetch.
     */
    orderBy?: BeritaOrderByWithRelationInput | BeritaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BeritaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beritas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beritas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Beritas
    **/
    _count?: true | BeritaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BeritaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BeritaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BeritaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BeritaMaxAggregateInputType
  }

  export type GetBeritaAggregateType<T extends BeritaAggregateArgs> = {
        [P in keyof T & keyof AggregateBerita]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBerita[P]>
      : GetScalarType<T[P], AggregateBerita[P]>
  }




  export type BeritaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BeritaWhereInput
    orderBy?: BeritaOrderByWithAggregationInput | BeritaOrderByWithAggregationInput[]
    by: BeritaScalarFieldEnum[] | BeritaScalarFieldEnum
    having?: BeritaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BeritaCountAggregateInputType | true
    _avg?: BeritaAvgAggregateInputType
    _sum?: BeritaSumAggregateInputType
    _min?: BeritaMinAggregateInputType
    _max?: BeritaMaxAggregateInputType
  }

  export type BeritaGroupByOutputType = {
    id: number
    judul: string
    isi: string
    thumbnailUrl: string | null
    createdAt: Date
    _count: BeritaCountAggregateOutputType | null
    _avg: BeritaAvgAggregateOutputType | null
    _sum: BeritaSumAggregateOutputType | null
    _min: BeritaMinAggregateOutputType | null
    _max: BeritaMaxAggregateOutputType | null
  }

  type GetBeritaGroupByPayload<T extends BeritaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BeritaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BeritaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BeritaGroupByOutputType[P]>
            : GetScalarType<T[P], BeritaGroupByOutputType[P]>
        }
      >
    >


  export type BeritaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    judul?: boolean
    isi?: boolean
    thumbnailUrl?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["berita"]>



  export type BeritaSelectScalar = {
    id?: boolean
    judul?: boolean
    isi?: boolean
    thumbnailUrl?: boolean
    createdAt?: boolean
  }

  export type BeritaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "judul" | "isi" | "thumbnailUrl" | "createdAt", ExtArgs["result"]["berita"]>

  export type $BeritaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Berita"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      judul: string
      isi: string
      thumbnailUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["berita"]>
    composites: {}
  }

  type BeritaGetPayload<S extends boolean | null | undefined | BeritaDefaultArgs> = $Result.GetResult<Prisma.$BeritaPayload, S>

  type BeritaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BeritaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BeritaCountAggregateInputType | true
    }

  export interface BeritaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Berita'], meta: { name: 'Berita' } }
    /**
     * Find zero or one Berita that matches the filter.
     * @param {BeritaFindUniqueArgs} args - Arguments to find a Berita
     * @example
     * // Get one Berita
     * const berita = await prisma.berita.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BeritaFindUniqueArgs>(args: SelectSubset<T, BeritaFindUniqueArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Berita that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BeritaFindUniqueOrThrowArgs} args - Arguments to find a Berita
     * @example
     * // Get one Berita
     * const berita = await prisma.berita.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BeritaFindUniqueOrThrowArgs>(args: SelectSubset<T, BeritaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Berita that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaFindFirstArgs} args - Arguments to find a Berita
     * @example
     * // Get one Berita
     * const berita = await prisma.berita.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BeritaFindFirstArgs>(args?: SelectSubset<T, BeritaFindFirstArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Berita that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaFindFirstOrThrowArgs} args - Arguments to find a Berita
     * @example
     * // Get one Berita
     * const berita = await prisma.berita.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BeritaFindFirstOrThrowArgs>(args?: SelectSubset<T, BeritaFindFirstOrThrowArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Beritas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Beritas
     * const beritas = await prisma.berita.findMany()
     * 
     * // Get first 10 Beritas
     * const beritas = await prisma.berita.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const beritaWithIdOnly = await prisma.berita.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BeritaFindManyArgs>(args?: SelectSubset<T, BeritaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Berita.
     * @param {BeritaCreateArgs} args - Arguments to create a Berita.
     * @example
     * // Create one Berita
     * const Berita = await prisma.berita.create({
     *   data: {
     *     // ... data to create a Berita
     *   }
     * })
     * 
     */
    create<T extends BeritaCreateArgs>(args: SelectSubset<T, BeritaCreateArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Beritas.
     * @param {BeritaCreateManyArgs} args - Arguments to create many Beritas.
     * @example
     * // Create many Beritas
     * const berita = await prisma.berita.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BeritaCreateManyArgs>(args?: SelectSubset<T, BeritaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Berita.
     * @param {BeritaDeleteArgs} args - Arguments to delete one Berita.
     * @example
     * // Delete one Berita
     * const Berita = await prisma.berita.delete({
     *   where: {
     *     // ... filter to delete one Berita
     *   }
     * })
     * 
     */
    delete<T extends BeritaDeleteArgs>(args: SelectSubset<T, BeritaDeleteArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Berita.
     * @param {BeritaUpdateArgs} args - Arguments to update one Berita.
     * @example
     * // Update one Berita
     * const berita = await prisma.berita.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BeritaUpdateArgs>(args: SelectSubset<T, BeritaUpdateArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Beritas.
     * @param {BeritaDeleteManyArgs} args - Arguments to filter Beritas to delete.
     * @example
     * // Delete a few Beritas
     * const { count } = await prisma.berita.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BeritaDeleteManyArgs>(args?: SelectSubset<T, BeritaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Beritas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Beritas
     * const berita = await prisma.berita.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BeritaUpdateManyArgs>(args: SelectSubset<T, BeritaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Berita.
     * @param {BeritaUpsertArgs} args - Arguments to update or create a Berita.
     * @example
     * // Update or create a Berita
     * const berita = await prisma.berita.upsert({
     *   create: {
     *     // ... data to create a Berita
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Berita we want to update
     *   }
     * })
     */
    upsert<T extends BeritaUpsertArgs>(args: SelectSubset<T, BeritaUpsertArgs<ExtArgs>>): Prisma__BeritaClient<$Result.GetResult<Prisma.$BeritaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Beritas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaCountArgs} args - Arguments to filter Beritas to count.
     * @example
     * // Count the number of Beritas
     * const count = await prisma.berita.count({
     *   where: {
     *     // ... the filter for the Beritas we want to count
     *   }
     * })
    **/
    count<T extends BeritaCountArgs>(
      args?: Subset<T, BeritaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BeritaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Berita.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BeritaAggregateArgs>(args: Subset<T, BeritaAggregateArgs>): Prisma.PrismaPromise<GetBeritaAggregateType<T>>

    /**
     * Group by Berita.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeritaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BeritaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BeritaGroupByArgs['orderBy'] }
        : { orderBy?: BeritaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BeritaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBeritaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Berita model
   */
  readonly fields: BeritaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Berita.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BeritaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Berita model
   */
  interface BeritaFieldRefs {
    readonly id: FieldRef<"Berita", 'Int'>
    readonly judul: FieldRef<"Berita", 'String'>
    readonly isi: FieldRef<"Berita", 'String'>
    readonly thumbnailUrl: FieldRef<"Berita", 'String'>
    readonly createdAt: FieldRef<"Berita", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Berita findUnique
   */
  export type BeritaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter, which Berita to fetch.
     */
    where: BeritaWhereUniqueInput
  }

  /**
   * Berita findUniqueOrThrow
   */
  export type BeritaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter, which Berita to fetch.
     */
    where: BeritaWhereUniqueInput
  }

  /**
   * Berita findFirst
   */
  export type BeritaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter, which Berita to fetch.
     */
    where?: BeritaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beritas to fetch.
     */
    orderBy?: BeritaOrderByWithRelationInput | BeritaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Beritas.
     */
    cursor?: BeritaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beritas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beritas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Beritas.
     */
    distinct?: BeritaScalarFieldEnum | BeritaScalarFieldEnum[]
  }

  /**
   * Berita findFirstOrThrow
   */
  export type BeritaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter, which Berita to fetch.
     */
    where?: BeritaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beritas to fetch.
     */
    orderBy?: BeritaOrderByWithRelationInput | BeritaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Beritas.
     */
    cursor?: BeritaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beritas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beritas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Beritas.
     */
    distinct?: BeritaScalarFieldEnum | BeritaScalarFieldEnum[]
  }

  /**
   * Berita findMany
   */
  export type BeritaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter, which Beritas to fetch.
     */
    where?: BeritaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Beritas to fetch.
     */
    orderBy?: BeritaOrderByWithRelationInput | BeritaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Beritas.
     */
    cursor?: BeritaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Beritas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Beritas.
     */
    skip?: number
    distinct?: BeritaScalarFieldEnum | BeritaScalarFieldEnum[]
  }

  /**
   * Berita create
   */
  export type BeritaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * The data needed to create a Berita.
     */
    data: XOR<BeritaCreateInput, BeritaUncheckedCreateInput>
  }

  /**
   * Berita createMany
   */
  export type BeritaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Beritas.
     */
    data: BeritaCreateManyInput | BeritaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Berita update
   */
  export type BeritaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * The data needed to update a Berita.
     */
    data: XOR<BeritaUpdateInput, BeritaUncheckedUpdateInput>
    /**
     * Choose, which Berita to update.
     */
    where: BeritaWhereUniqueInput
  }

  /**
   * Berita updateMany
   */
  export type BeritaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Beritas.
     */
    data: XOR<BeritaUpdateManyMutationInput, BeritaUncheckedUpdateManyInput>
    /**
     * Filter which Beritas to update
     */
    where?: BeritaWhereInput
    /**
     * Limit how many Beritas to update.
     */
    limit?: number
  }

  /**
   * Berita upsert
   */
  export type BeritaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * The filter to search for the Berita to update in case it exists.
     */
    where: BeritaWhereUniqueInput
    /**
     * In case the Berita found by the `where` argument doesn't exist, create a new Berita with this data.
     */
    create: XOR<BeritaCreateInput, BeritaUncheckedCreateInput>
    /**
     * In case the Berita was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BeritaUpdateInput, BeritaUncheckedUpdateInput>
  }

  /**
   * Berita delete
   */
  export type BeritaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
    /**
     * Filter which Berita to delete.
     */
    where: BeritaWhereUniqueInput
  }

  /**
   * Berita deleteMany
   */
  export type BeritaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Beritas to delete
     */
    where?: BeritaWhereInput
    /**
     * Limit how many Beritas to delete.
     */
    limit?: number
  }

  /**
   * Berita without action
   */
  export type BeritaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Berita
     */
    select?: BeritaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Berita
     */
    omit?: BeritaOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AdminScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    createdAt: 'createdAt'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const ListBukuScalarFieldEnum: {
    id: 'id',
    title: 'title',
    penulis: 'penulis',
    penerbit: 'penerbit',
    tahunTerbit: 'tahunTerbit',
    kategori: 'kategori',
    sinopsis: 'sinopsis',
    coverUrl: 'coverUrl',
    createdAt: 'createdAt'
  };

  export type ListBukuScalarFieldEnum = (typeof ListBukuScalarFieldEnum)[keyof typeof ListBukuScalarFieldEnum]


  export const BeritaScalarFieldEnum: {
    id: 'id',
    judul: 'judul',
    isi: 'isi',
    thumbnailUrl: 'thumbnailUrl',
    createdAt: 'createdAt'
  };

  export type BeritaScalarFieldEnum = (typeof BeritaScalarFieldEnum)[keyof typeof BeritaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const AdminOrderByRelevanceFieldEnum: {
    email: 'email',
    password: 'password'
  };

  export type AdminOrderByRelevanceFieldEnum = (typeof AdminOrderByRelevanceFieldEnum)[keyof typeof AdminOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const ListBukuOrderByRelevanceFieldEnum: {
    title: 'title',
    penulis: 'penulis',
    penerbit: 'penerbit',
    kategori: 'kategori',
    sinopsis: 'sinopsis',
    coverUrl: 'coverUrl'
  };

  export type ListBukuOrderByRelevanceFieldEnum = (typeof ListBukuOrderByRelevanceFieldEnum)[keyof typeof ListBukuOrderByRelevanceFieldEnum]


  export const BeritaOrderByRelevanceFieldEnum: {
    judul: 'judul',
    isi: 'isi',
    thumbnailUrl: 'thumbnailUrl'
  };

  export type BeritaOrderByRelevanceFieldEnum = (typeof BeritaOrderByRelevanceFieldEnum)[keyof typeof BeritaOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: IntFilter<"Admin"> | number
    email?: StringFilter<"Admin"> | string
    password?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    _relevance?: AdminOrderByRelevanceInput
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    password?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Admin"> | number
    email?: StringWithAggregatesFilter<"Admin"> | string
    password?: StringWithAggregatesFilter<"Admin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type ListBukuWhereInput = {
    AND?: ListBukuWhereInput | ListBukuWhereInput[]
    OR?: ListBukuWhereInput[]
    NOT?: ListBukuWhereInput | ListBukuWhereInput[]
    id?: IntFilter<"ListBuku"> | number
    title?: StringFilter<"ListBuku"> | string
    penulis?: StringFilter<"ListBuku"> | string
    penerbit?: StringFilter<"ListBuku"> | string
    tahunTerbit?: IntFilter<"ListBuku"> | number
    kategori?: StringFilter<"ListBuku"> | string
    sinopsis?: StringFilter<"ListBuku"> | string
    coverUrl?: StringNullableFilter<"ListBuku"> | string | null
    createdAt?: DateTimeFilter<"ListBuku"> | Date | string
  }

  export type ListBukuOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    penulis?: SortOrder
    penerbit?: SortOrder
    tahunTerbit?: SortOrder
    kategori?: SortOrder
    sinopsis?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _relevance?: ListBukuOrderByRelevanceInput
  }

  export type ListBukuWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ListBukuWhereInput | ListBukuWhereInput[]
    OR?: ListBukuWhereInput[]
    NOT?: ListBukuWhereInput | ListBukuWhereInput[]
    title?: StringFilter<"ListBuku"> | string
    penulis?: StringFilter<"ListBuku"> | string
    penerbit?: StringFilter<"ListBuku"> | string
    tahunTerbit?: IntFilter<"ListBuku"> | number
    kategori?: StringFilter<"ListBuku"> | string
    sinopsis?: StringFilter<"ListBuku"> | string
    coverUrl?: StringNullableFilter<"ListBuku"> | string | null
    createdAt?: DateTimeFilter<"ListBuku"> | Date | string
  }, "id">

  export type ListBukuOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    penulis?: SortOrder
    penerbit?: SortOrder
    tahunTerbit?: SortOrder
    kategori?: SortOrder
    sinopsis?: SortOrder
    coverUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ListBukuCountOrderByAggregateInput
    _avg?: ListBukuAvgOrderByAggregateInput
    _max?: ListBukuMaxOrderByAggregateInput
    _min?: ListBukuMinOrderByAggregateInput
    _sum?: ListBukuSumOrderByAggregateInput
  }

  export type ListBukuScalarWhereWithAggregatesInput = {
    AND?: ListBukuScalarWhereWithAggregatesInput | ListBukuScalarWhereWithAggregatesInput[]
    OR?: ListBukuScalarWhereWithAggregatesInput[]
    NOT?: ListBukuScalarWhereWithAggregatesInput | ListBukuScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ListBuku"> | number
    title?: StringWithAggregatesFilter<"ListBuku"> | string
    penulis?: StringWithAggregatesFilter<"ListBuku"> | string
    penerbit?: StringWithAggregatesFilter<"ListBuku"> | string
    tahunTerbit?: IntWithAggregatesFilter<"ListBuku"> | number
    kategori?: StringWithAggregatesFilter<"ListBuku"> | string
    sinopsis?: StringWithAggregatesFilter<"ListBuku"> | string
    coverUrl?: StringNullableWithAggregatesFilter<"ListBuku"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ListBuku"> | Date | string
  }

  export type BeritaWhereInput = {
    AND?: BeritaWhereInput | BeritaWhereInput[]
    OR?: BeritaWhereInput[]
    NOT?: BeritaWhereInput | BeritaWhereInput[]
    id?: IntFilter<"Berita"> | number
    judul?: StringFilter<"Berita"> | string
    isi?: StringFilter<"Berita"> | string
    thumbnailUrl?: StringNullableFilter<"Berita"> | string | null
    createdAt?: DateTimeFilter<"Berita"> | Date | string
  }

  export type BeritaOrderByWithRelationInput = {
    id?: SortOrder
    judul?: SortOrder
    isi?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _relevance?: BeritaOrderByRelevanceInput
  }

  export type BeritaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BeritaWhereInput | BeritaWhereInput[]
    OR?: BeritaWhereInput[]
    NOT?: BeritaWhereInput | BeritaWhereInput[]
    judul?: StringFilter<"Berita"> | string
    isi?: StringFilter<"Berita"> | string
    thumbnailUrl?: StringNullableFilter<"Berita"> | string | null
    createdAt?: DateTimeFilter<"Berita"> | Date | string
  }, "id">

  export type BeritaOrderByWithAggregationInput = {
    id?: SortOrder
    judul?: SortOrder
    isi?: SortOrder
    thumbnailUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BeritaCountOrderByAggregateInput
    _avg?: BeritaAvgOrderByAggregateInput
    _max?: BeritaMaxOrderByAggregateInput
    _min?: BeritaMinOrderByAggregateInput
    _sum?: BeritaSumOrderByAggregateInput
  }

  export type BeritaScalarWhereWithAggregatesInput = {
    AND?: BeritaScalarWhereWithAggregatesInput | BeritaScalarWhereWithAggregatesInput[]
    OR?: BeritaScalarWhereWithAggregatesInput[]
    NOT?: BeritaScalarWhereWithAggregatesInput | BeritaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Berita"> | number
    judul?: StringWithAggregatesFilter<"Berita"> | string
    isi?: StringWithAggregatesFilter<"Berita"> | string
    thumbnailUrl?: StringNullableWithAggregatesFilter<"Berita"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Berita"> | Date | string
  }

  export type AdminCreateInput = {
    email: string
    password: string
    createdAt?: Date | string
  }

  export type AdminUncheckedCreateInput = {
    id?: number
    email: string
    password: string
    createdAt?: Date | string
  }

  export type AdminUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyInput = {
    id?: number
    email: string
    password: string
    createdAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListBukuCreateInput = {
    title: string
    penulis: string
    penerbit: string
    tahunTerbit: number
    kategori: string
    sinopsis: string
    coverUrl?: string | null
    createdAt?: Date | string
  }

  export type ListBukuUncheckedCreateInput = {
    id?: number
    title: string
    penulis: string
    penerbit: string
    tahunTerbit: number
    kategori: string
    sinopsis: string
    coverUrl?: string | null
    createdAt?: Date | string
  }

  export type ListBukuUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    penulis?: StringFieldUpdateOperationsInput | string
    penerbit?: StringFieldUpdateOperationsInput | string
    tahunTerbit?: IntFieldUpdateOperationsInput | number
    kategori?: StringFieldUpdateOperationsInput | string
    sinopsis?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListBukuUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    penulis?: StringFieldUpdateOperationsInput | string
    penerbit?: StringFieldUpdateOperationsInput | string
    tahunTerbit?: IntFieldUpdateOperationsInput | number
    kategori?: StringFieldUpdateOperationsInput | string
    sinopsis?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListBukuCreateManyInput = {
    id?: number
    title: string
    penulis: string
    penerbit: string
    tahunTerbit: number
    kategori: string
    sinopsis: string
    coverUrl?: string | null
    createdAt?: Date | string
  }

  export type ListBukuUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    penulis?: StringFieldUpdateOperationsInput | string
    penerbit?: StringFieldUpdateOperationsInput | string
    tahunTerbit?: IntFieldUpdateOperationsInput | number
    kategori?: StringFieldUpdateOperationsInput | string
    sinopsis?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ListBukuUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    penulis?: StringFieldUpdateOperationsInput | string
    penerbit?: StringFieldUpdateOperationsInput | string
    tahunTerbit?: IntFieldUpdateOperationsInput | number
    kategori?: StringFieldUpdateOperationsInput | string
    sinopsis?: StringFieldUpdateOperationsInput | string
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BeritaCreateInput = {
    judul: string
    isi: string
    thumbnailUrl?: string | null
    createdAt?: Date | string
  }

  export type BeritaUncheckedCreateInput = {
    id?: number
    judul: string
    isi: string
    thumbnailUrl?: string | null
    createdAt?: Date | string
  }

  export type BeritaUpdateInput = {
    judul?: StringFieldUpdateOperationsInput | string
    isi?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BeritaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    judul?: StringFieldUpdateOperationsInput | string
    isi?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BeritaCreateManyInput = {
    id?: number
    judul: string
    isi: string
    thumbnailUrl?: string | null
    createdAt?: Date | string
  }

  export type BeritaUpdateManyMutationInput = {
    judul?: StringFieldUpdateOperationsInput | string
    isi?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BeritaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    judul?: StringFieldUpdateOperationsInput | string
    isi?: StringFieldUpdateOperationsInput | string
    thumbnailUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AdminOrderByRelevanceInput = {
    fields: AdminOrderByRelevanceFieldEnum | AdminOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ListBukuOrderByRelevanceInput = {
    fields: ListBukuOrderByRelevanceFieldEnum | ListBukuOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ListBukuCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    penulis?: SortOrder
    penerbit?: SortOrder
    tahunTerbit?: SortOrder
    kategori?: SortOrder
    sinopsis?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ListBukuAvgOrderByAggregateInput = {
    id?: SortOrder
    tahunTerbit?: SortOrder
  }

  export type ListBukuMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    penulis?: SortOrder
    penerbit?: SortOrder
    tahunTerbit?: SortOrder
    kategori?: SortOrder
    sinopsis?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ListBukuMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    penulis?: SortOrder
    penerbit?: SortOrder
    tahunTerbit?: SortOrder
    kategori?: SortOrder
    sinopsis?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ListBukuSumOrderByAggregateInput = {
    id?: SortOrder
    tahunTerbit?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BeritaOrderByRelevanceInput = {
    fields: BeritaOrderByRelevanceFieldEnum | BeritaOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BeritaCountOrderByAggregateInput = {
    id?: SortOrder
    judul?: SortOrder
    isi?: SortOrder
    thumbnailUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type BeritaAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BeritaMaxOrderByAggregateInput = {
    id?: SortOrder
    judul?: SortOrder
    isi?: SortOrder
    thumbnailUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type BeritaMinOrderByAggregateInput = {
    id?: SortOrder
    judul?: SortOrder
    isi?: SortOrder
    thumbnailUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type BeritaSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}