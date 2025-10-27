
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl md:text-3xl font-bold text-cyan-400">
          Secure Genomic Risk Scoring Platform
        </h1>
        <p class="text-slate-400 mt-1">A Visual Simulation of the Post-Quantum Cryptography Pipeline</p>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
