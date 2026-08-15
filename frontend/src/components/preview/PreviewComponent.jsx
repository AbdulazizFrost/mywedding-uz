import TemplateRenderer from '../../templates/TemplateRenderer.jsx';

export default function PreviewComponent({ data = {}, media = [], onSubmitRsvp, slug, template_slug }) {
  // Extract effective template slug
  const activeTemplateSlug = template_slug || data?.design?.template || slug || 'royal-ivory';

  return (
    <TemplateRenderer
      templateSlug={activeTemplateSlug}
      data={data}
      media={media}
      onSubmitRsvp={onSubmitRsvp}
    />
  );
}
