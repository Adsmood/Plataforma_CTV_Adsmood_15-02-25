import React from 'react';
import Editor from './pages/Editor';
import { ThemeProvider } from 'styled-components';
import { styledTheme } from './theme';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={styledTheme}>
            <Editor />
        </ThemeProvider>
    );
};

export default App; 