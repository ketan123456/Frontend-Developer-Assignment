import type { PatientView } from '../../types';

interface SegmentedControlProps {
  value: PatientView;
  onChange: (value: PatientView) => void;
}

export const SegmentedControl = ({ value, onChange }: SegmentedControlProps) => (
  <div className="segmented-control" role="tablist" aria-label="Patient view toggle">
    <button
      className={`segment-button ${value === 'grid' ? 'active' : ''}`}
      onClick={() => onChange('grid')}
      type="button"
    >
      Grid view
    </button>
    <button
      className={`segment-button ${value === 'list' ? 'active' : ''}`}
      onClick={() => onChange('list')}
      type="button"
    >
      List view
    </button>
  </div>
);
