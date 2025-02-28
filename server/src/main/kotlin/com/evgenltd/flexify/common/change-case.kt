package com.evgenltd.flexify.common

import java.util.*

private val SPLIT_LOWER_UPPER_RE = Regex("""([\p{Ll}\d])(\p{Lu})""")
private val SPLIT_UPPER_UPPER_RE = Regex("""(\p{Lu})([\p{Lu}][\p{Ll}])""")
private val DEFAULT_STRIP_REGEXP = Regex("""[^\p{L}\d]+""") // ignore case
private const val SPLIT_REPLACE_VALUE = "$1\u0000$2"

/**
 * Convert a string to space separated lower case (`foo bar`)
 */
fun String.noCase(
    delimiter: String = " ",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        prefix + words.joinToString(delimiter) { it.lower(locale) } + suffix
    }

/**
 * Convert a string to camel case (`fooBar`)
 */
fun String.camelCase(
    delimiter: String = " ",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
    mergeAmbiguousCharacters: Boolean = false
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        words.mapIndexed { index, it ->
            if (index == 0) {
                it.lower(locale)
            } else {
                it.capitalOrPascalCaseTransform(locale, mergeAmbiguousCharacters, index)
            }
        }.joinToString(delimiter, prefix, suffix)
    }

/**
 * Convert a string to pascal case (`FooBar`)
 */
fun String.pascalCase(
    delimiter: String = "",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
    mergeAmbiguousCharacters: Boolean = false
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        words.mapIndexed { index, it -> it.capitalOrPascalCaseTransform(locale, mergeAmbiguousCharacters, index) }
            .joinToString(delimiter, prefix, suffix)
    }

/**
 * Convert a string to pascal snake case (`Foo_Bar`)
 */
fun String.pascalSnakeCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = capitalCase("_", prefixCharacters, suffixCharacters, locale)

/**
 * Convert a string to capital case (`Foo Bar`)
 */
fun String.capitalCase(
    delimiter: String = " ",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        words.joinToString(delimiter, prefix, suffix) {
            capitalCaseTransform(locale)
        }
    }

/**
 * Convert a string to constant case (`FOO_BAR`)
 */
fun String.constantCase(
    delimiter: String = "_",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        words.joinToString(delimiter, prefix, suffix) { upper(locale) }
    }

/**
 * Convert a string to dot case (`foo.bar`)
 */
fun String.dotCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = noCase(".", prefixCharacters, suffixCharacters, locale)

/**
 * Convert a string to kebab case (`foo-bar`)
 */
fun String.kebabCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = noCase("-", prefixCharacters, suffixCharacters, locale)

/**
 * Convert a string to path case (`foo/bar`)
 */
fun String.pathCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = noCase("/", prefixCharacters, suffixCharacters, locale)

/**
 * Convert a string to sentence case (`Foo bar`)
 */
fun String.sentenceCase(
    delimiter: String = "_",
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = splitPrefixSuffix(prefixCharacters, suffixCharacters)
    .let { (prefix, words, suffix) ->
        words.mapIndexed { index, it ->
            if (index == 0) {
                it.capitalCaseTransform(locale)
            } else {
                it.lower(locale)
            }
        }.joinToString(delimiter, prefix, suffix)
    }

/**
 * Convert a string to snake case (`foo_bar`)
 */
fun String.snakeCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = noCase("_", prefixCharacters, suffixCharacters, locale)

/**
 * Convert a string to header case (`Foo-Bar`)
 */
fun String.trainCase(
    prefixCharacters: String = "",
    suffixCharacters: String = "",
    locale: Locale? = null,
): String = capitalCase("-", prefixCharacters, suffixCharacters, locale)

private fun String.capitalOrPascalCaseTransform(locale: Locale?, mergeAmbiguousCharacters: Boolean, index: Int): String = if (mergeAmbiguousCharacters) {
    capitalCaseTransform(locale)
} else {
    pascalCaseTransform(locale, index)
}

private fun String.capitalCaseTransform(locale: Locale?): String =
    substring(0, 1).upper(locale) + substring(1,).lower(locale)

private fun String.pascalCaseTransform(locale: Locale?, index: Int = 0): String =
    if (index > 0 && this[0] >= '0' && this[0] <= '9') {
        "_${substring(0, 1)}"
    } else {
        substring(0, 1).upper(locale)
    } + substring(1).lower(locale)

private fun String.lower(locale: Locale?): String = if (locale != null) {
    lowercase(locale)
} else {
    lowercase()
}

private fun String.upper(locale: Locale?): String = if (locale != null) {
    uppercase(locale)
} else {
    uppercase()
}

private fun String.splitPrefixSuffix(prefixCharacters: String = "", suffixCharacters: String = ""): SplitPrefixSuffixResult {
    var prefixIndex = 0
    var suffixIndex = length

    while (prefixIndex < length) {
        val char = this[prefixIndex]
        if (char !in prefixCharacters) {
            break
        }
        prefixIndex++;
    }

    while (suffixIndex > prefixIndex) {
        val index = suffixIndex - 1;
        val char = this[index]
        if (char !in suffixCharacters) {
            break
        }
        suffixIndex = index;
    }

    return SplitPrefixSuffixResult(
        prefix = substring(0, prefixIndex),
        words = substring(prefixIndex, suffixIndex).splitAnyCase(),
        suffix = substring(suffixIndex)
    )
}

private fun String.splitAnyCase(): List<String> {
    val result = trim()
        .replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE)
        .replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE)
        .let { DEFAULT_STRIP_REGEXP.replace(it, "\u0000") }

    var start = 0
    var end = result.length

    while (start < end && result[start] == '\u0000') start++
    if (start == end) return emptyList()
    while (end > start && result[end - 1] == '\u0000') end--

    return result.substring(start, end).split("\u0000")
}

private data class SplitPrefixSuffixResult(
    val prefix: String,
    val words: List<String>,
    val suffix: String,
)