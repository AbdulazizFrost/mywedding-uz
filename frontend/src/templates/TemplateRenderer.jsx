import { TEMPLATES_REGISTRY, RoyalIvoryTemplate } from './index.js';

export default function TemplateRenderer({ 
  templateSlug, 
  data = {}, 
  media = [], 
  onSubmitRsvp 
}) {
  // Determine effective slug from prop or design data
  const slug = templateSlug || data?.design?.template || 'royal-ivory';
  
  const templateConfig = TEMPLATES_REGISTRY[slug] || TEMPLATES_REGISTRY['royal-ivory'];
  const TemplateComponent = templateConfig?.component || RoyalIvoryTemplate;

  return (
    <TemplateComponent 
      data={data} 
      media={media} 
      onSubmitRsvp={onSubmitRsvp} 
    />
  );
}
