import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from './Button';

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
  onCancel: () => void;
}

// This is to help identify what to center on for the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function PhotoEditor({ imageUrl, onSave, onCancel }: PhotoEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [editMode, setEditMode] = useState<'crop' | 'rotate'>('crop');
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set initial crop when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  // Apply crop and rotation to canvas
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      canvasRef.current
    ) {
      const img = imgRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      // Set canvas size to match the cropped image
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the cropped image directly first
      ctx.drawImage(
        img,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // If we have rotation, we need to create a second canvas for rotation
      if (rotation !== 0) {
        const rotationCanvas = document.createElement('canvas');
        const rotationCtx = rotationCanvas.getContext('2d');
        
        if (!rotationCtx) {
          return;
        }
        
        // Make the rotation canvas big enough for the rotated image
        const maxSize = Math.max(canvas.width, canvas.height) * 1.5;
        rotationCanvas.width = maxSize;
        rotationCanvas.height = maxSize;
        
        // Clear rotation canvas
        rotationCtx.clearRect(0, 0, rotationCanvas.width, rotationCanvas.height);
        
        // Move to center of rotation canvas
        rotationCtx.translate(rotationCanvas.width / 2, rotationCanvas.height / 2);
        
        // Rotate
        rotationCtx.rotate((rotation * Math.PI) / 180);
        
        // Draw the cropped image onto the rotation canvas
        rotationCtx.drawImage(
          canvas,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        
        // Clear the original canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the rotated image back to the original canvas
        ctx.drawImage(
          rotationCanvas,
          (rotationCanvas.width - canvas.width) / 2,
          (rotationCanvas.height - canvas.height) / 2,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    }
  }, [completedCrop, rotation, scale]);

  // Handle rotation
  const handleRotate = (direction: 'left' | 'right') => {
    setRotation((prev) => {
      const newRotation = direction === 'left' ? prev - 90 : prev + 90;
      return newRotation % 360;
    });
  };

  // Save the edited image
  const handleSave = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      onSave(dataUrl);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-level-2">
      <div className="flex justify-between mb-4">
        <h3 className="font-montserrat font-semibold text-xl text-inkwell-black">
          Edit Photo
        </h3>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              editMode === 'crop'
                ? 'bg-story-blue text-white'
                : 'bg-fog text-charcoal hover:bg-gray-200'
            }`}
            onClick={() => setEditMode('crop')}
          >
            <i className="fas fa-crop-alt mr-1"></i>
            Crop
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              editMode === 'rotate'
                ? 'bg-story-blue text-white'
                : 'bg-fog text-charcoal hover:bg-gray-200'
            }`}
            onClick={() => setEditMode('rotate')}
          >
            <i className="fas fa-sync-alt mr-1"></i>
            Rotate
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-center">
        {editMode === 'crop' ? (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            className="max-h-80"
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              style={{ maxHeight: '300px' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        ) : (
          <div className="relative">
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Rotation preview"
              style={{
                maxHeight: '300px',
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transformOrigin: 'center',
              }}
              onLoad={onImageLoad}
            />
          </div>
        )}
      </div>

      {editMode === 'rotate' && (
        <div className="flex justify-center space-x-4 mb-4">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-fog flex items-center justify-center text-charcoal hover:bg-gray-200"
            onClick={() => handleRotate('left')}
          >
            <i className="fas fa-undo"></i>
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-fog flex items-center justify-center text-charcoal hover:bg-gray-200"
            onClick={() => handleRotate('right')}
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Apply Changes
        </Button>
      </div>

      {/* Hidden canvas for processing the image */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}
