/** Compatibility page for old imports. No scan, signup, checkout or upload can start here. */
export default function SetupPage({ onComplete }: { onComplete: () => void }) {
  return <main><h1>Local memory</h1><p>Hosted setup is unavailable. Your local memory is available in the viewer.</p><button onClick={onComplete}>Open local viewer</button></main>
}
