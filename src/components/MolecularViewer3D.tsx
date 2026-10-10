/**
 * PROMETHEUS Interactive 3D & 2D Molecular Viewer
 * High-performance HTML5 Canvas ball-and-stick renderer with CPK shading,
 * orbit controls, atom picking, and structural inspection.
 */

import React, { useEffect, useRef, useState } from 'react';
import { MolecularCandidate } from '../types/scientific';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, ExternalLink } from 'lucide-react';

interface Props {
  candidate: MolecularCandidate;
  highlightProperty?: string;
  className?: string;
}

// CPK Color palette
const CPK_COLORS: Record<string, { fill: string; stroke: string; radius: number }> = {
  C: { fill: '#475569', stroke: '#1e293b', radius: 14 },
  O: { fill: '#ef4444', stroke: '#991b1b', radius: 15 },
  H: { fill: '#f8fafc', stroke: '#cbd5e1', radius: 9 },
  F: { fill: '#10b981', stroke: '#065f46', radius: 13 },
  N: { fill: '#3b82f6', stroke: '#1e40af', radius: 14 },
  S: { fill: '#eab308', stroke: '#854d0e', radius: 16 },
  Cl: { fill: '#22c55e', stroke: '#15803d', radius: 15 },
};

export const MolecularViewer3D: React.FC<Props> = ({ candidate, highlightProperty, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const [zoom, setZoom] = useState(48);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredAtom, setHoveredAtom] = useState<string | null>(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      setRotation(prev => ({
        x: prev.x + dy * 0.01,
        y: prev.y + dx * 0.01,
      }));
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Hit testing for atoms
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      const projected = projectAtoms(candidate, rotation, zoom, width, height);
      let found: string | null = null;
      for (let i = projected.length - 1; i >= 0; i--) {
        const a = projected[i];
        const dist = Math.hypot(mouseX - a.projX, mouseY - a.projY);
        const radius = (CPK_COLORS[a.element]?.radius || 12) * a.scale;
        if (dist <= radius) {
          found = `${a.element} (${a.label || 'Atom #' + (a.index + 1)})`;
          break;
        }
      }
      setHoveredAtom(found);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(85, Math.max(25, prev - e.deltaY * 0.05)));
  };

  // Helper projection function
  function projectAtoms(
    cand: MolecularCandidate,
    rot: { x: number; y: number },
    zLevel: number,
    w: number,
    h: number
  ) {
    const cosX = Math.cos(rot.x);
    const sinX = Math.sin(rot.x);
    const cosY = Math.cos(rot.y);
    const sinY = Math.sin(rot.y);

    return cand.atoms.map((atom, index) => {
      // Rotate around Y
      let x1 = atom.x * cosY + atom.z * sinY;
      let y1 = atom.y;
      let z1 = -atom.x * sinY + atom.z * cosY;

      // Rotate around X
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;

      // Perspective projection
      const cameraDistance = 10;
      const depth = cameraDistance - z2;
      const scale = zLevel / Math.max(depth, 2);

      const projX = w / 2 + x2 * scale * 1.8;
      const projY = h / 2 - y2 * scale * 1.8;

      return {
        ...atom,
        index,
        projX,
        projY,
        z: z2,
        scale,
      };
    });
  }

  // Animation & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localRotation = { ...rotation };

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (autoRotate && !isDraggingRef.current) {
        localRotation.y += 0.008;
      }

      ctx.clearRect(0, 0, width, height);

      // Radial subtle glow backdrop
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5);
      bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
      bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle coordinate grid ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      const projected = projectAtoms(candidate, localRotation, zoom, width, height);

      // 1. Draw Bonds (with depth sorting)
      const bondsWithDepth = candidate.bonds.map(b => {
        const a1 = projected[b.atom1];
        const a2 = projected[b.atom2];
        const avgZ = ((a1?.z || 0) + (a2?.z || 0)) / 2;
        return { bond: b, a1, a2, avgZ };
      });

      bondsWithDepth.sort((a, b) => a.avgZ - b.avgZ);

      for (const item of bondsWithDepth) {
        const { bond, a1, a2 } = item;
        if (!a1 || !a2) continue;

        ctx.save();
        if (bond.order === 2) {
          // Double bond
          const dx = a2.projX - a1.projX;
          const dy = a2.projY - a1.projY;
          const len = Math.hypot(dx, dy) || 1;
          const offset = 3.5;
          const nx = (-dy / len) * offset;
          const ny = (dx / len) * offset;

          ctx.beginPath();
          ctx.moveTo(a1.projX + nx, a1.projY + ny);
          ctx.lineTo(a2.projX + nx, a2.projY + ny);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.lineWidth = 3.2;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(a1.projX - nx, a1.projY - ny);
          ctx.lineTo(a2.projX - nx, a2.projY - ny);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.85)';
          ctx.lineWidth = 3.2;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Single bond
          ctx.beginPath();
          ctx.moveTo(a1.projX, a1.projY);
          ctx.lineTo(a2.projX, a2.projY);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Draw Atoms (depth sorted from back to front)
      const sortedAtoms = [...projected].sort((a, b) => a.z - b.z);

      for (const atom of sortedAtoms) {
        const style = CPK_COLORS[atom.element] || CPK_COLORS['C'];
        const radius = Math.max(4, style.radius * atom.scale * 0.95);

        // 3D Sphere gradient
        ctx.save();
        const grad = ctx.createRadialGradient(
          atom.projX - radius * 0.35,
          atom.projY - radius * 0.35,
          radius * 0.1,
          atom.projX,
          atom.projY,
          radius
        );

        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, style.fill);
        grad.addColorStop(1, style.stroke);

        // Shadow under atom
        ctx.beginPath();
        ctx.arc(atom.projX, atom.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = style.stroke;
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Atom Symbol text
        if (radius > 8) {
          ctx.fillStyle = atom.element === 'H' ? '#1e293b' : '#ffffff';
          ctx.font = `600 ${Math.max(9, Math.floor(radius * 0.85))}px ui-monospace, SFMono-Regular, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 0;
          ctx.fillText(atom.element, atom.projX, atom.projY);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [candidate, zoom, autoRotate]);

  return (
    <div className={`relative flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
            3D Molecular Conformer
          </span>
          <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            {candidate.chemicalFormula}
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className={`p-1.5 rounded text-xs transition-colors ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.min(85, prev + 5))}
            title="Zoom In"
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(25, prev - 5))}
            title="Zoom Out"
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(48);
              setRotation({ x: 0.3, y: 0.5 });
              setAutoRotate(true);
            }}
            title="Reset Perspective"
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-64 bg-slate-950 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={480}
          height={260}
          className="w-full h-full block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />

        {/* Hover label overlay */}
        {hoveredAtom && (
          <div className="absolute top-2 left-2 pointer-events-none px-2.5 py-1 bg-slate-900/90 border border-cyan-500/40 rounded text-xs font-mono text-cyan-300 backdrop-blur shadow-md">
            Selected: {hoveredAtom}
          </div>
        )}

        {/* Legend pills bottom right */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-2 px-2.5 py-1 bg-slate-950/80 rounded-md border border-slate-800/80 text-[10px] font-mono backdrop-blur">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-slate-400">C</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-slate-400">O</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">F</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
            <span className="text-slate-400">H</span>
          </span>
        </div>
      </div>

      {/* Structural Card Details */}
      <div className="p-3 bg-slate-900/95 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-200">{candidate.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">{candidate.iupacName}</div>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {candidate.structuralClass}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-mono border-t border-slate-800/60">
          <div className="flex justify-between items-center text-slate-400">
            <span>SMILES:</span>
            <span className="text-cyan-300 font-semibold truncate ml-1 max-w-[130px]" title={candidate.smiles}>
              {candidate.smiles}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>PubChem CID:</span>
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${candidate.pubchemCid}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-0.5 ml-1"
            >
              #{candidate.pubchemCid}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
