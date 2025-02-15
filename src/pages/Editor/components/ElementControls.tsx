import React from 'react';
import styled from 'styled-components';
import { useEditorStore } from '../../../stores/editorStore';

interface Element {
    id: string;
    type: string;
    content: any;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    zIndex: number;
    isVisible: boolean;
}

interface ElementControlsProps {
    element: Element;
}

const Container = styled.div`
    padding: 16px;
`;

const Title = styled.h3`
    margin-bottom: 16px;
    font-size: 18px;
    color: ${props => props.theme.colors.textPrimary};
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
    margin-bottom: 8px;
    font-size: 14px;
    color: ${props => props.theme.colors.textSecondary};
`;

interface InputProps {
    label: string;
    value: number | string;
    onChange: (value: number | string) => void;
    type?: 'number' | 'text';
}

const InputContainer = styled.div`
    margin-bottom: 8px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: ${props => props.theme.colors.textSecondary};
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid ${props => props.theme.colors.borderColor};
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
`;

const PropertyInput: React.FC<InputProps> = ({ label, value, onChange, type = 'text' }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
        onChange(newValue);
    };

    return (
        <InputContainer>
            <Label>{label}</Label>
            <Input
                type={type}
                value={String(value)}
                onChange={handleChange}
            />
        </InputContainer>
    );
};

const ElementControls: React.FC<ElementControlsProps> = ({ element }) => {
    const updateElement = useEditorStore(state => state.updateElement);

    const handlePropertyChange = (property: string, value: any) => {
        updateElement(element.id, {
            content: {
                ...element.content,
                [property]: value
            }
        });
    };

    const handlePositionChange = (property: keyof Element['position'], value: number) => {
        updateElement(element.id, {
            position: {
                ...element.position,
                [property]: value
            }
        });
    };

    const handleSizeChange = (property: keyof Element['size'], value: number) => {
        updateElement(element.id, {
            size: {
                ...element.size,
                [property]: value
            }
        });
    };

    const renderPropertyInput = (key: string, value: unknown) => {
        // Validar y convertir el valor a un tipo compatible
        let compatibleValue: string | number;
        let inputType: 'text' | 'number' = 'text';

        if (typeof value === 'number') {
            compatibleValue = value;
            inputType = 'number';
        } else if (typeof value === 'boolean') {
            compatibleValue = value ? '1' : '0';
            inputType = 'number';
        } else {
            compatibleValue = String(value);
        }

        return (
            <PropertyInput
                key={key}
                label={key}
                value={compatibleValue}
                onChange={(newValue) => handlePropertyChange(key, newValue)}
                type={inputType}
            />
        );
    };

    const renderControls = () => {
        return (
            <div>
                <Section>
                    <SectionTitle>Posición</SectionTitle>
                    <PropertyInput
                        label="X"
                        value={element.position.x}
                        onChange={(value) => handlePositionChange('x', value as number)}
                        type="number"
                    />
                    <PropertyInput
                        label="Y"
                        value={element.position.y}
                        onChange={(value) => handlePositionChange('y', value as number)}
                        type="number"
                    />
                </Section>
                <Section>
                    <SectionTitle>Tamaño</SectionTitle>
                    <PropertyInput
                        label="Ancho"
                        value={element.size.width}
                        onChange={(value) => handleSizeChange('width', value as number)}
                        type="number"
                    />
                    <PropertyInput
                        label="Alto"
                        value={element.size.height}
                        onChange={(value) => handleSizeChange('height', value as number)}
                        type="number"
                    />
                </Section>
                <Section>
                    <SectionTitle>Propiedades</SectionTitle>
                    {Object.entries(element.content || {}).map(([key, value]) => 
                        renderPropertyInput(key, value)
                    )}
                </Section>
            </div>
        );
    };

    return (
        <Container>
            <Title>Propiedades del Elemento</Title>
            {renderControls()}
        </Container>
    );
};

export { ElementControls }; 