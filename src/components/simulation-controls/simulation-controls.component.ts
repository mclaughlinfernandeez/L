import { Component, ChangeDetectionStrategy, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SimulationParams {
  dataSize: 'small' | 'medium' | 'large';
  pqcComplexity: 'standard' | 'enhanced' | 'paranoid';
}

@Component({
  selector: 'app-simulation-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationControlsComponent {
  isRunning = input<boolean>(false);
  isIdle = input<boolean>(true);

  run = output<SimulationParams>();
  reset = output<void>();

  dataSize = signal<SimulationParams['dataSize']>('medium');
  pqcComplexity = signal<SimulationParams['pqcComplexity']>('standard');

  onRunSimulation(): void {
    this.run.emit({
      dataSize: this.dataSize(),
      pqcComplexity: this.pqcComplexity(),
    });
  }

  onResetSimulation(): void {
    this.reset.emit();
  }

  setDataSize(event: Event): void {
    this.dataSize.set((event.target as HTMLSelectElement).value as SimulationParams['dataSize']);
  }

  setPqcComplexity(event: Event): void {
    this.pqcComplexity.set((event.target as HTMLSelectElement).value as SimulationParams['pqcComplexity']);
  }
}
