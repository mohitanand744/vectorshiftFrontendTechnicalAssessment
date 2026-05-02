/**
 * Centralized Regular Expressions for the VectorShift Pipeline Editor
 */

// Matches {{variable_name}} with optional spaces inside the braces
export const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z0-9_$-]+)\s*\}\}/g;

// Matches any whitespace character
export const SPACE_PATTERN = /\s/g;
