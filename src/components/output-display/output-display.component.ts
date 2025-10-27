
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SimulationOutput } from '../pipeline/pipeline.component';

@Component({
  selector: 'app-output-display',
  standalone: true,
  templateUrl: './output-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputDisplayComponent {
  outputs = input.required<SimulationOutput>();
}
