import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseCardComponent } from '../phase-card/phase-card.component';
import { OutputDisplayComponent } from '../output-display/output-display.component';
import { SimulationControlsComponent, SimulationParams } from '../simulation-controls/simulation-controls.component';

export interface PipelinePhase {
  phase: number;
  title: string;
  description: string;
  icon: string;
}

export interface SimulationOutput {
  polygenicRiskScore: string;
  evidenceLedger: string;
  fesMetadata: string;
}

type SimulationStatus = 'idle' | 'running' | 'complete';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, PhaseCardComponent, OutputDisplayComponent, SimulationControlsComponent],
  templateUrl: './pipeline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineComponent {
  phases: PipelinePhase[] = [
    {
      phase: 0,
      title: 'Initialize PQC Environment',
      description: 'Establishes foundational post-quantum cryptographic keys (Kyber & Dilithium) and a secure communication channel.',
      icon: 'key'
    },
    {
      phase: 1,
      title: 'Secure Data Ingestion',
      description: 'Manages client-side encryption of raw genomic data (VCF) and server-side decryption, validation, and quality control.',
      icon: 'upload'
    },
    {
      phase: 2,
      title: 'PQC-Secured Annotation',
      description: 'Enriches genomic data by securely querying external annotation databases over a post-quantum-protected channel.',
      icon: 'dna'
    },
    {
      phase: 3,
      title: 'Encrypted Model Processing',
      description: 'Performs PRS computation within a hardware-secured Trusted Execution Environment (TEE) to protect model and data.',
      icon: 'chip'
    },
    {
      phase: 4,
      title: 'Final Ledger Commitment',
      description: 'Commits the final proof of computation to an immutable blockchain ledger, creating a permanent, verifiable record.',
      icon: 'cube'
    }
  ];

  simulationStatus = signal<SimulationStatus>('idle');
  currentPhaseIndex = signal<number>(-1);
  outputs = signal<SimulationOutput | null>(null);
  phaseDurations = signal<(number | null)[]>([]);

  private simulationInterval: any;
  private phaseStartTimes: number[] = [];

  isIdle = computed(() => this.simulationStatus() === 'idle');
  isRunning = computed(() => this.simulationStatus() === 'running');
  isComplete = computed(() => this.simulationStatus() === 'complete');

  getPhaseStatus(index: number): 'pending' | 'running' | 'complete' {
    const currentIndex = this.currentPhaseIndex();
    if (index < currentIndex) {
      return 'complete';
    }
    if (index === currentIndex) {
      return 'running';
    }
    return 'pending';
  }

  runSimulation(params: SimulationParams): void {
    if (this.isRunning()) return;

    this.simulationStatus.set('running');
    this.currentPhaseIndex.set(0);
    this.outputs.set(null);
    this.phaseDurations.set(new Array(this.phases.length).fill(null));
    this.phaseStartTimes = [];
    this.phaseStartTimes[0] = performance.now();
    
    const interval = this.calculateInterval(params);

    this.simulationInterval = setInterval(() => {
      this.currentPhaseIndex.update(i => {
        const phaseEndTime = performance.now();
        const duration = phaseEndTime - (this.phaseStartTimes[i] || phaseEndTime);
        
        this.phaseDurations.update(durations => {
          durations[i] = duration;
          return [...durations];
        });

        if (i < this.phases.length - 1) {
          const nextIndex = i + 1;
          this.phaseStartTimes[nextIndex] = phaseEndTime;
          return nextIndex;
        } else {
          clearInterval(this.simulationInterval);
          this.completeSimulation();
          return i + 1; // Mark last phase as complete for getPhaseStatus
        }
      });
    }, interval);
  }

  private calculateInterval(params: SimulationParams): number {
    const baseInterval = 1200; // ms
    let dataSizeMultiplier = 1.0;
    let pqcComplexityMultiplier = 1.0;

    switch (params.dataSize) {
      case 'medium': dataSizeMultiplier = 1.5; break;
      case 'large': dataSizeMultiplier = 2.0; break;
    }

    switch (params.pqcComplexity) {
      case 'enhanced': pqcComplexityMultiplier = 1.3; break;
      case 'paranoid': pqcComplexityMultiplier = 1.8; break;
    }

    return baseInterval * dataSizeMultiplier * pqcComplexityMultiplier;
  }

  private completeSimulation(): void {
    this.simulationStatus.set('complete');
    this.outputs.set({
      polygenicRiskScore: 'ENCRYPTED_KEM(Kyber768)::AES256GCM::[...6.7182...]',
      evidenceLedger: 'BCHAIN_COMMIT::0x' + this.generateRandomHash(64),
      fesMetadata: 'SIGNED_DILITHIUM3::' + this.generateRandomHash(40)
    });
  }

  resetSimulation(): void {
    clearInterval(this.simulationInterval);
    this.simulationStatus.set('idle');
    this.currentPhaseIndex.set(-1);
    this.outputs.set(null);
    this.phaseDurations.set([]);
  }
  
  generateRandomHash(length: number): string {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}