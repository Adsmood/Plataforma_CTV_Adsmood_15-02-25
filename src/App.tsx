import React from 'react';
import Editor from './pages/Editor';
import { ThemeProvider } from 'styled-components';
import theme from './theme';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Editor />
        </ThemeProvider>
    );
};

export default App; 