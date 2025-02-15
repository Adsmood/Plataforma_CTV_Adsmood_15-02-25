import 'styled-components';

interface Typography {
    fontFamily: string;
    fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    fontWeight: {
        regular: number;
        medium: number;
        bold: number;
    };
}

interface Colors {
    primary: string;
    primaryDark: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    backgroundLight: string;
    backgroundWhite: string;
}

interface Spacing {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

interface BorderRadius {
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

interface Shadows {
    sm: string;
    md: string;
    lg: string;
}

interface Transitions {
    default: string;
    fast: string;
    slow: string;
}

interface Breakpoints {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

interface ZIndex {
    modal: number;
    dropdown: number;
    tooltip: number;
}

declare module 'styled-components' {
    export interface DefaultTheme {
        typography: Typography;
        colors: Colors;
        spacing: Spacing;
        borderRadius: BorderRadius;
        shadows: Shadows;
        transitions: Transitions;
        breakpoints: Breakpoints;
        zIndex: ZIndex;
    }
} 