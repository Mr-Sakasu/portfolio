import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// 1. サポートするロケールの配列を `as const` で定義します。
// これにより、'en'や'ja'という具体的な文字列リテラル型として扱われます。
export const locales = ['en', 'ja'] as const;

// 2. `locales`配列から、有効なロケールの型 `Locale` を生成します。
// ('en' | 'ja' という型になります)
type Locale = typeof locales[number];

// 3. これが「型ガード関数」です。
// 引数`locale`が`Locale`型であるかを判定し、結果をbooleanで返します。
// `locale is Locale` という戻り値の型定義が重要です。
function isValidLocale(locale: any): locale is Locale {
    return locales.includes(locale);
}

export default getRequestConfig(async ({ locale }) => {
    // 4. 作成した型ガード関数で、渡された`locale`を検証します。
    if (!isValidLocale(locale)) {
        // 検証に失敗した場合、404ページを表示します。
        notFound();
    }

    // 5. `if`文と`isValidLocale`のチェックを通過したため、
    // このスコープ内では`locale`の型が `Locale` ('en' | 'ja') に確定します。
    // これにより、TypeScriptの型エラーが解消されます。
    return {
        locale, // 型が保証された`locale`を返します。
        messages: (await import(`./messages/${locale}.json`)).default
    };
});