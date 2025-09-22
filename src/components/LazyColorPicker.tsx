import React, { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

const HexColorPicker = lazy(() =>
  import('react-colorful').then(module => ({ default: module.HexColorPicker }))
);

interface LazyColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const LazyColorPicker: React.FC<LazyColorPickerProps> = ({ color, onChange }) => {
  return (
    <Suspense fallback={
      <div className="w-full h-48 flex items-center justify-center bg-white/5 rounded-lg">
        <LoadingSpinner size="sm" text="Loading color picker..." />
      </div>
    }>
      <HexColorPicker color={color} onChange={onChange} />
    </Suspense>
  );
};

export default LazyColorPicker;