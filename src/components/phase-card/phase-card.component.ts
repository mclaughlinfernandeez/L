import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelinePhase } from '../pipeline/pipeline.component';

type PhaseStatus = 'pending' | 'running' | 'complete';

@Component({
  selector: 'app-phase-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phase-card.component.html',
  styleUrls: ['./phase-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseCardComponent {
  phase = input.required<PipelinePhase>();
  status = input<PhaseStatus>('pending');
  duration = input<number | null>(null);

  cardClasses = computed(() => {
    const base = 'h-full flex flex-col p-4 border-2 rounded-lg shadow-md transition-all duration-300 relative bg-slate-800';
    switch (this.status()) {
      case 'running':
        return `${base} border-cyan-500 ring-4 ring-cyan-500/20`;
      case 'complete':
        return `${base} border-green-500`;
      default:
        return `${base} border-slate-700`;
    }
  });

  iconContainerClasses = computed(() => {
    const base = 'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300';
    switch (this.status()) {
      case 'running':
        return `${base} bg-cyan-500/20 text-cyan-400`;
      case 'complete':
        return `${base} bg-green-500/20 text-green-400`;
      default:
        return `${base} bg-slate-700 text-slate-400`;
    }
  });
}
