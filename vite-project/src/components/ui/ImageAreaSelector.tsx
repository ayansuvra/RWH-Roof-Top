import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { MapPin, Square } from 'lucide-react';
import { suggestRooftopBoundaries, type SuggestRooftopBoundariesInput } from '../../lib/ai-rooftop-detection';

interface Point {
  x: number;
  y: number;
}

interface ImageAreaSelectorProps {
  onAreaCalculated: (area: number) => void;
}

type SelectionMode = 'manual' | 'ai' | 'rectangle' | 'calculator';

const ImageAreaSelector: React.FC<ImageAreaSelectorProps> = ({ onAreaCalculated }) => {
  const { t, i18n } = useTranslation();
  const [points, setPoints] = useState<Point[]>([]);
  const [area, setArea] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [mode, setMode] = useState<SelectionMode>('manual');
  const [rectangleStart, setRectangleStart] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Aerial view of modern house
  const rooftopImageUrl = "https://media.istockphoto.com/id/1181472034/photo/aerial-view-of-modern-house.jpg?s=612x612&w=0&k=20&c=qzsjTK92XSOdmwKoAtcpCpUsO_73HCLHjz8O0jhbDAc=";

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Check if clicking on existing point for dragging
    if (points.length > 0) {
      const clickedPointIndex = points.findIndex(point => 
        Math.abs(point.x - x) < 15 && Math.abs(point.y - y) < 15
      );
      if (clickedPointIndex !== -1) {
        setIsDragging(true);
        setDragIndex(clickedPointIndex);
        event.preventDefault();
        return;
      }
    }

    // Regular click handling for other modes
    handleImageClick(x, y);
  };

  const handleImageClick = (x: number, y: number) => {
    if (mode === 'rectangle') {
      handleRectangleClick({ x, y });
    } else if (mode === 'manual') {
      handleManualClick({ x, y });
    } else if (mode === 'ai') {
      handleAIDetect({ x, y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || dragIndex === -1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const newPoints = [...points];
    newPoints[dragIndex] = { x, y };
    setPoints(newPoints);
    drawCanvas(newPoints);
    
    const calculatedArea = calculatePolygonArea(newPoints);
    setArea(calculatedArea);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(-1);
  };

  const handleManualClick = (point: Point) => {
    const newPoints = [...points, point];
    setPoints(newPoints);
    drawCanvas(newPoints);
    if (newPoints.length >= 3) {
      const calculatedArea = calculatePolygonArea(newPoints);
      setArea(calculatedArea);
    }
  };

  const handleRectangleClick = (point: Point) => {
    if (!rectangleStart) {
      setRectangleStart(point);
      setPoints([point]);
      drawCanvas([point]);
    } else {
      const rectPoints = [
        rectangleStart,
        { x: point.x, y: rectangleStart.y },
        point,
        { x: rectangleStart.x, y: point.y }
      ];
      setPoints(rectPoints);
      drawCanvas(rectPoints);
      const calculatedArea = calculatePolygonArea(rectPoints);
      setArea(calculatedArea);
      setRectangleStart(null);
    }
  };

  const handleAIDetect = async (point: Point) => {
    setIsAnalyzing(true);
    
    try {
      // Convert image to data URI
      const canvas = canvasRef.current;
      const image = imageRef.current;
      if (!canvas || !image) return;
      
      // Create a temporary canvas to get image data
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = image.naturalWidth || 612;
      tempCanvas.height = image.naturalHeight || 612;
      tempCtx.drawImage(image, 0, 0);
      
      const imageDataUri = tempCanvas.toDataURL('image/jpeg', 0.8);
      
      // Call AI service
      const input: SuggestRooftopBoundariesInput = {
        satelliteImageDataUri: imageDataUri,
        clickedPoint: { x: point.x, y: point.y }
      };
      
      const result = await suggestRooftopBoundaries(input);
      
      // Convert GeoJSON coordinates to canvas points
      const coordinates = result.suggestedBoundaries.coordinates[0];
      const roofPoints: Point[] = coordinates.slice(0, -1).map(coord => ({
        x: coord[0],
        y: coord[1]
      }));
      
      setPoints(roofPoints);
      drawCanvas(roofPoints);
      const calculatedArea = calculatePolygonArea(roofPoints);
      setArea(calculatedArea);
      setMode('manual');
    } catch (error) {
      console.error('AI detection failed:', error);
      // Fallback to simple detection
      const roofPoints = [
        { x: point.x - 80, y: point.y - 60 },
        { x: point.x + 80, y: point.y - 60 },
        { x: point.x + 80, y: point.y + 60 },
        { x: point.x - 80, y: point.y + 60 }
      ];
      setPoints(roofPoints);
      drawCanvas(roofPoints);
      const calculatedArea = calculatePolygonArea(roofPoints);
      setArea(calculatedArea);
      setMode('manual');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculatePolygonArea = (polygonPoints: Point[]): number => {
    if (polygonPoints.length < 3) return 0;

    let area = 0;
    const n = polygonPoints.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += polygonPoints[i].x * polygonPoints[j].y;
      area -= polygonPoints[j].x * polygonPoints[i].y;
    }

    area = Math.abs(area) / 2;
    
    // Convert pixels to approximate square meters (assuming 1 pixel = 0.1 meter)
    const pixelToMeter = 0.1;
    return area * pixelToMeter * pixelToMeter;
  };

  const drawCanvas = (currentPoints: Point[]) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (currentPoints.length === 0) return;

    // Draw polygon
    ctx.strokeStyle = '#3B82F6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(currentPoints[0].x, currentPoints[0].y);

    for (let i = 1; i < currentPoints.length; i++) {
      ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
    }

    if (currentPoints.length > 2) {
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();

    // Draw points
    currentPoints.forEach((point, index) => {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw point number
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), point.x, point.y + 4);
    });
  };

  const completeSelection = () => {
    if (points.length >= 3) {
      setIsComplete(true);
      onAreaCalculated(area);
    }
  };

  const resetSelection = () => {
    setPoints([]);
    setArea(0);
    setIsComplete(false);
    setRectangleStart(null);
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  const openCalculator = () => {
    const manualArea = prompt("Enter roof area in square meters:");
    if (manualArea && !isNaN(Number(manualArea))) {
      setArea(Number(manualArea));
      onAreaCalculated(Number(manualArea));
    }
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Rooftop Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {mode === 'ai' ? 
                  "Click 'AI Detect' to automatically identify rooftop boundaries" :
                  "Click points around your rooftop to trace its outline"
                }
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button 
                  variant={mode === 'ai' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMode('ai')}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "🔍 Analyzing..." : "🤖 AI Detect Roof"}
                </Button>
                <Button 
                  variant={mode === 'manual' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMode('manual')}
                >
                  ✏️ Draw Mode
                </Button>
                <Button 
                  variant={mode === 'rectangle' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMode('rectangle')}
                >
                  📐 Rectangle Tool
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={openCalculator}
                >
                  📊 Area Calculator
                </Button>
              </div>
              
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={rooftopImageUrl}
                  alt="Rooftop"
                  className="hidden"
                  crossOrigin="anonymous"
                  onLoad={handleImageLoad}
                />
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className={`w-full h-auto max-w-full ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  Mode: {
                    mode === 'ai' ? 'AI Detection' : 
                    mode === 'rectangle' ? 'Rectangle' : 
                    mode === 'calculator' ? 'Calculator' : 
                    'Manual Drawing'
                  }
                  {mode === 'rectangle' && rectangleStart && " - Click second corner"}
                  {points.length > 0 && " - Drag to adjust"}
                  <br />
                  Points selected: {points.length}
                  {points.length >= 3 && (
                    <span className="ml-2 text-green-600">
                      ✓ Ready to calculate
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={resetSelection} variant="outline">
                    Reset
                  </Button>
                  <Button onClick={() => onAreaCalculated(100)} variant="secondary">
                    Skip
                  </Button>
                  {points.length >= 3 && !isComplete && (
                    <Button onClick={completeSelection}>
                      Complete Selection
                    </Button>
                  )}
                </div>
              </div>

              {area > 0 && (
                <Card className="bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Square className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold">Area Calculated</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {area.toFixed(2)} m²
                      </p>
                      <p className="text-sm text-gray-600">
                        {(area * 10.764).toFixed(2)} sq ft
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isComplete && (
                <Button onClick={() => onAreaCalculated(area)} className="w-full">
                  Use This Area
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageAreaSelector;
