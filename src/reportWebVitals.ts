// Remove any "ReportHandler" or old function imports from 'web-vitals'

// Optionally define your own callback type:
type PerfEntryHandler = (metric: any) => void;

function reportWebVitals(onPerfEntry?: PerfEntryHandler) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
}

export default reportWebVitals;
