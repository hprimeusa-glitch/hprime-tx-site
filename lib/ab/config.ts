// SITE-SPECIFIC A/B config. The only file in lib/ab/ that differs between sites.
// Experiment ids must match /root/My-Digital-Brain/scripts/ab-tests/registry.yaml.
// Lifecycle: draft → running → done (winner set; everyone gets the winner until the code is
// cleaned up and the experiment removed). 'paused' → everyone gets variants[0], no tracking.

export const AB_SITE: string = 'hprime-tx';        // collector site slug (Projects/ab-collector/sites.js)
export const AB_KEY = 'k_ec42aae87bc12820';  // collector ingest key for this site
export const AB_COLLECTOR_URL = 'https://nsl-ab-collector.vercel.app/api/ingest';

export type Experiment = {
  id: string;                 // e.g. 'max-form-step1-tiles'
  slot: 'page' | 'form' | 'aa'; // at most one running experiment per slot per site
  status: 'draft' | 'running' | 'paused' | 'done';
  variants: string[];         // first = control, e.g. ['A', 'B']
  weights?: number[];         // default equal split
  salt?: string;              // change to re-randomize a relaunch
  winner?: string;            // required when status = 'done'
};

export const EXPERIMENTS: Experiment[] = [
  // A/A sanity experiment: renders nothing different; validates split + pipeline (SRM must pass).
  { id: 'hprime-tx-aa-1', slot: 'aa', status: 'running', variants: ['A', 'B'] },
  // Short first step of the TX appliance lead form (LeadForm.tsx). Exposure = form opened.
  { id: 'hprime-tx-form-short', slot: 'form', status: 'running', variants: ['A', 'B'] },
];
