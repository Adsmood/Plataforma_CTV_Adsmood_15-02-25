import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { KeyframeTrack, TimelineElement, Position, Size, ElementType } from '../types/timeline';

export type { ElementType };

interface Background {
  url: string;
  type: 'image' | 'video';
  style: {
    scale: number;
    position: { x: number; y: number };
  };
}

export interface EditorState {
  elements: TimelineElement[];
  selectedElement: string | null;
  background: Background | null;
  timeline: {
    currentTime: number;
    isPlaying: boolean;
    duration: number;
  };
  addElement: (type: ElementType, content: any) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<TimelineElement>) => void;
  setSelectedElement: (id: string | null) => void;
  setBackground: (background: Background | null) => void;
  moveElement: (id: string, position: Position) => void;
  resizeElement: (id: string, size: Size) => void;
  setElementVisibility: (id: string, isVisible: boolean) => void;
  updateTimeline: (updates: Partial<EditorState['timeline']>) => void;
  setElements: (elements: TimelineElement[]) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElement: null,
  background: null,
  timeline: {
    currentTime: 0,
    isPlaying: false,
    duration: 30,
  },

  addElement: (type, content) => {
    try {
      const state = get();
      if (state.elements.length >= 100) {
        console.warn('Límite de elementos alcanzado');
        return;
      }

      // Crear propiedades iniciales según el tipo
      const initialProperties = {
        style: {
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#FFFFFF',
          backgroundColor: 'transparent',
        },
        ...content
      };

      const newElement: TimelineElement = {
        id: uuidv4(),
        name: `Elemento ${state.elements.length + 1}`,
        type,
        position: { x: 0, y: 0 },
        size: { width: 200, height: 100 },
        content,
        zIndex: state.elements.length,
        isVisible: true,
        startTime: 0,
        duration: Math.min(5, state.timeline.duration),
        track: state.elements.length,
        properties: initialProperties,
        keyframes: [
          {
            property: 'position',
            keyframes: [{
              time: 0,
              value: { x: 0, y: 0 },
              easing: 'easeInOut'
            }],
          },
          {
            property: 'rotation',
            keyframes: [{
              time: 0,
              value: 0,
              easing: 'easeInOut'
            }],
          },
          {
            property: 'scale',
            keyframes: [{
              time: 0,
              value: { x: 1, y: 1 },
              easing: 'easeInOut'
            }],
          },
          {
            property: 'opacity',
            keyframes: [{
              time: 0,
              value: 1,
              easing: 'easeInOut'
            }],
          },
        ],
      };

      // Ajustar propiedades específicas según el tipo
      switch (type) {
        case 'text':
          newElement.properties.text = content.text || 'Nuevo texto';
          break;
        case 'image':
        case 'video':
          if (!content.url) {
            console.warn(`URL no proporcionada para elemento tipo ${type}`);
            return;
          }
          newElement.properties.url = content.url;
          break;
      }

      set({ elements: [...state.elements, newElement] });
    } catch (error) {
      console.error('Error al añadir elemento:', error);
    }
  },

  removeElement: (id) => {
    try {
      if (!id) return;
      
      set((state) => ({
        elements: state.elements.filter((el) => el.id !== id),
        selectedElement: state.selectedElement === id ? null : state.selectedElement,
      }));
    } catch (error) {
      console.error('Error al eliminar elemento:', error);
    }
  },

  updateElement: (id, updates) => {
    try {
      if (!id) return;
      
      const state = get();
      const element = state.elements.find(el => el.id === id);
      if (!element) return;

      // Validar tiempos
      if (updates.startTime !== undefined || updates.duration !== undefined) {
        const newStartTime = updates.startTime ?? element.startTime;
        const newDuration = updates.duration ?? element.duration;
        
        if (newStartTime < 0) updates.startTime = 0;
        if (newStartTime + newDuration > state.timeline.duration) {
          updates.duration = state.timeline.duration - newStartTime;
        }
      }

      // Validar posición y tamaño
      if (updates.position) {
        updates.position = {
          x: Math.max(0, updates.position.x),
          y: Math.max(0, updates.position.y),
        };
      }

      if (updates.size) {
        updates.size = {
          width: Math.max(10, updates.size.width),
          height: Math.max(10, updates.size.height),
        };
      }

      set({
        elements: state.elements.map(el =>
          el.id === id ? { ...el, ...updates } : el
        ),
      });
    } catch (error) {
      console.error('Error al actualizar elemento:', error);
    }
  },

  setSelectedElement: (id) => {
    try {
      if (id) {
        const state = get();
        if (!state.elements.find(el => el.id === id)) {
          console.warn('Elemento seleccionado no encontrado');
          id = null;
        }
      }
      set({ selectedElement: id });
    } catch (error) {
      console.error('Error al seleccionar elemento:', error);
    }
  },

  setBackground: (background) => {
    try {
      if (background) {
        // Validar URL
        if (!background.url) {
          console.error('URL de fondo no válida');
          return;
        }
        // Validar tipo
        if (!['image', 'video'].includes(background.type)) {
          console.error('Tipo de fondo no válido');
          return;
        }
        // Validar y normalizar estilo
        background.style = {
          scale: Math.max(0.1, background.style?.scale ?? 1),
          position: {
            x: background.style?.position?.x ?? 0,
            y: background.style?.position?.y ?? 0
          }
        };
      }
      set({ background });
    } catch (error) {
      console.error('Error al establecer fondo:', error);
    }
  },

  moveElement: (id, position) => {
    try {
      if (!id || !position) return;
      
      const state = get();
      const element = state.elements.find(el => el.id === id);
      if (!element) {
        console.warn('Elemento no encontrado para mover');
        return;
      }

      // Validar y normalizar posición
      const validPosition = {
        x: Math.max(0, position.x),
        y: Math.max(0, position.y)
      };

      set({
        elements: state.elements.map(el =>
          el.id === id ? { ...el, position: validPosition } : el
        ),
      });
    } catch (error) {
      console.error('Error al mover elemento:', error);
    }
  },

  resizeElement: (id, size) => {
    try {
      if (!id || !size) return;
      
      const state = get();
      const element = state.elements.find(el => el.id === id);
      if (!element) {
        console.warn('Elemento no encontrado para redimensionar');
        return;
      }

      // Validar y normalizar tamaño
      const validSize = {
        width: Math.max(10, size.width),
        height: Math.max(10, size.height)
      };

      set({
        elements: state.elements.map(el =>
          el.id === id ? { ...el, size: validSize } : el
        ),
      });
    } catch (error) {
      console.error('Error al redimensionar elemento:', error);
    }
  },

  setElementVisibility: (id, isVisible) => {
    try {
      if (!id) return;
      
      const state = get();
      const element = state.elements.find(el => el.id === id);
      if (!element) {
        console.warn('Elemento no encontrado para cambiar visibilidad');
        return;
      }

      set({
        elements: state.elements.map(el =>
          el.id === id ? { ...el, isVisible } : el
        ),
      });
    } catch (error) {
      console.error('Error al cambiar visibilidad del elemento:', error);
    }
  },

  updateTimeline: (updates) => {
    try {
      if (!updates) return;

      const state = get();
      const newTimeline = {
        ...state.timeline,
        ...updates
      };

      // Validar valores del timeline
      if (newTimeline.currentTime < 0) newTimeline.currentTime = 0;
      if (newTimeline.duration < 1) newTimeline.duration = 1;
      if (newTimeline.currentTime > newTimeline.duration) {
        newTimeline.currentTime = newTimeline.duration;
      }

      set({ timeline: newTimeline });
    } catch (error) {
      console.error('Error al actualizar timeline:', error);
    }
  },

  setElements: (elements) => {
    try {
      if (!Array.isArray(elements)) {
        console.error('Los elementos deben ser un array');
        return;
      }

      // Validar cada elemento
      const validElements = elements.filter(element => {
        if (!element.id || !element.type) {
          console.warn('Elemento inválido encontrado y filtrado');
          return false;
        }
        return true;
      });

      set({ elements: validElements });
    } catch (error) {
      console.error('Error al establecer elementos:', error);
    }
  },
})); 