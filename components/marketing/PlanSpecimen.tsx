/**
 * HTML/CSS-only architectural specimen used to preview deliverable style.
 * Edge case: uses semantic labeling so screen readers still get context for a decorative visual.
 */
export default function PlanSpecimen() {
  const verticalGuides = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const horizontalGuides = [12, 24, 36, 48, 60, 72, 84];

  return (
    <figure className="mk-specimen" aria-label="Specimen architectural floor plan preview">
      <div className="mk-specimen__canvas">
        {verticalGuides.map((position) => (
          <span
            aria-hidden="true"
            className="mk-specimen__guide mk-specimen__guide--vertical"
            key={`v-${position}`}
            style={{ left: `${position}%` }}
          />
        ))}
        {horizontalGuides.map((position) => (
          <span
            aria-hidden="true"
            className="mk-specimen__guide mk-specimen__guide--horizontal"
            key={`h-${position}`}
            style={{ top: `${position}%` }}
          />
        ))}

        <div className="mk-specimen__room mk-specimen__room--living">Living</div>
        <div className="mk-specimen__room mk-specimen__room--kitchen">Kitchen</div>
        <div className="mk-specimen__room mk-specimen__room--entry">Entry</div>
        <div className="mk-specimen__room mk-specimen__room--study">Study</div>
        <div className="mk-specimen__room mk-specimen__room--bedroom">Primary</div>
        <div className="mk-specimen__room mk-specimen__room--bath">Bath</div>
        <span aria-hidden="true" className="mk-specimen__pin" />

        <span className="mk-specimen__note mk-specimen__note--north">N</span>
        <span className="mk-specimen__note mk-specimen__note--scale">Scale 1/4" = 1'-0"</span>
      </div>
      <figcaption className="mk-specimen__caption">Specimen layout preview</figcaption>
    </figure>
  );
}
